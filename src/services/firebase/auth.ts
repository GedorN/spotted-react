import type {
  MultiFactorError,
  MultiFactorInfo,
  MultiFactorResolver,
  User,
} from '@react-native-firebase/auth';
import {
  createUserWithEmailAndPassword,
  getAuth,
  getMultiFactorResolver,
  multiFactor,
  onAuthStateChanged,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from '@react-native-firebase/auth';
import { Platform } from 'react-native';

const auth = getAuth();

// Builds instalados diretamente no emulador não têm a validação da Play Store.
// Em desenvolvimento, usamos o fallback oficial do Firebase para reCAPTCHA.
// Builds release continuam usando Play Integrity normalmente.
if (__DEV__ && Platform.OS === 'android') {
  (
    auth.settings as typeof auth.settings & {
      forceRecaptchaFlowForTesting: boolean;
    }
  ).forceRecaptchaFlowForTesting = true;
}

type MfaFlow = 'enrollment' | 'signIn';

type PendingMfaChallenge = {
  flow: MfaFlow;
  phone: string;
  verificationId: string;
  resolver?: MultiFactorResolver;
  hint?: MultiFactorInfo;
};

export type SmsMfaChallenge = Pick<PendingMfaChallenge, 'flow' | 'phone'>;

// O ID do SMS é efêmero. Não o persistimos para que um código expirado não
// seja reutilizado depois que o app é fechado ou a sessão é reiniciada.
let pendingMfaChallenge: PendingMfaChallenge | undefined;

function authError(code: string, message: string) {
  return Object.assign(new Error(message), { code });
}

function errorCode(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
}

function errorMessage(error: unknown) {
  return typeof error === 'object' && error !== null && 'message' in error
    ? String(error.message)
    : '';
}

async function requestSmsVerification(
  options: Parameters<PhoneAuthProvider['verifyPhoneNumber']>[0],
) {
  try {
    return await new PhoneAuthProvider(auth).verifyPhoneNumber(options);
  } catch (error) {
    const message = errorMessage(error);
    if (
      errorCode(error) === 'auth/operation-not-allowed' &&
      /region enabled|sms region/i.test(message)
    ) {
      throw authError(
        'auth/sms-region-disabled',
        'O envio de SMS para este país não está liberado no Firebase.',
      );
    }
    throw error;
  }
}

function normalizePhoneNumber(phone: string) {
  const normalized = phone.replace(/[\s()-]/g, '');
  if (!/^\+[1-9]\d{7,14}$/.test(normalized)) {
    throw authError(
      'auth/invalid-phone-number',
      'Informe o celular no formato internacional, como +5541999999999.',
    );
  }
  return normalized;
}

function requireCurrentUser() {
  const user = auth.currentUser;
  if (!user) {
    throw authError('auth/no-current-user', 'Entre novamente para continuar.');
  }
  return user;
}

export function observeAuthState(onChange: (user: User | null) => void) {
  return onAuthStateChanged(auth, onChange);
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function createAccount(
  name: string,
  email: string,
  password: string,
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  await updateProfile(credential.user, { displayName: name.trim() });
  await sendEmailVerification(credential.user);
  return credential;
}

export async function requestPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email.trim());
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export async function startSmsMfaEnrollment(phone: string): Promise<SmsMfaChallenge> {
  const currentUser = requireCurrentUser();
  await reload(currentUser);

  const user = requireCurrentUser();
  if (!user.emailVerified) {
    throw authError(
      'auth/email-not-verified',
      'Confirme o link enviado para seu e-mail antes de cadastrar o celular.',
    );
  }

  const normalizedPhone = normalizePhoneNumber(phone);
  const session = await multiFactor(user).getSession();
  const verificationId = await requestSmsVerification({
    phoneNumber: normalizedPhone,
    session,
  });

  pendingMfaChallenge = {
    flow: 'enrollment',
    phone: normalizedPhone,
    verificationId,
  };
  return { flow: 'enrollment', phone: normalizedPhone };
}

export function isMfaRequiredError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'auth/multi-factor-auth-required'
  );
}

async function sendMfaSignInCode(
  resolver: MultiFactorResolver,
  hint: MultiFactorInfo,
): Promise<SmsMfaChallenge> {
  const phone = (hint as MultiFactorInfo & { phoneNumber?: string }).phoneNumber;
  if (!phone) {
    throw authError(
      'auth/unsupported-second-factor',
      'Esta conta não possui um segundo fator por SMS disponível.',
    );
  }

  const verificationId = await requestSmsVerification({
    multiFactorHint: hint,
    session: resolver.session,
  });

  pendingMfaChallenge = {
    flow: 'signIn',
    phone,
    verificationId,
    resolver,
    hint,
  };
  return { flow: 'signIn', phone };
}

export async function startSmsMfaSignIn(error: unknown): Promise<SmsMfaChallenge> {
  if (!isMfaRequiredError(error)) {
    throw error;
  }

  const resolver = getMultiFactorResolver(auth, error as MultiFactorError);
  const hint = resolver.hints.find(
    factor => factor.factorId === PhoneMultiFactorGenerator.FACTOR_ID,
  );

  if (!hint) {
    throw authError(
      'auth/unsupported-second-factor',
      'Esta conta não possui um segundo fator por SMS disponível.',
    );
  }

  return sendMfaSignInCode(resolver, hint);
}

export async function resendSmsMfaCode(): Promise<SmsMfaChallenge> {
  if (!pendingMfaChallenge) {
    throw authError(
      'auth/mfa-session-expired',
      'A sessão de confirmação expirou. Recomece o login.',
    );
  }

  if (pendingMfaChallenge.flow === 'enrollment') {
    return startSmsMfaEnrollment(pendingMfaChallenge.phone);
  }

  if (!pendingMfaChallenge.resolver || !pendingMfaChallenge.hint) {
    throw authError(
      'auth/mfa-session-expired',
      'A sessão de confirmação expirou. Recomece o login.',
    );
  }

  return sendMfaSignInCode(pendingMfaChallenge.resolver, pendingMfaChallenge.hint);
}

export async function confirmSmsMfaCode(code: string) {
  if (!pendingMfaChallenge) {
    throw authError(
      'auth/mfa-session-expired',
      'A sessão de confirmação expirou. Recomece o login.',
    );
  }

  const verificationCode = code.trim();
  if (!/^\d{6}$/.test(verificationCode)) {
    throw authError('auth/invalid-verification-code', 'Digite o código de 6 dígitos.');
  }

  const challenge = pendingMfaChallenge;
  const credential = PhoneAuthProvider.credential(
    challenge.verificationId,
    verificationCode,
  );
  const assertion = PhoneMultiFactorGenerator.assertion(credential);

  if (challenge.flow === 'enrollment') {
    await multiFactor(requireCurrentUser()).enroll(assertion, 'Celular');
  } else if (challenge.resolver) {
    await challenge.resolver.resolveSignIn(assertion);
  } else {
    throw authError(
      'auth/mfa-session-expired',
      'A sessão de confirmação expirou. Recomece o login.',
    );
  }

  pendingMfaChallenge = undefined;
}

export function authErrorMessage(error: unknown) {
  const code = errorCode(error);
  const message = errorMessage(error);

  if (/BILLING_NOT_ENABLED/i.test(message)) {
    return 'O envio de SMS real exige que o projeto Firebase esteja no plano Blaze com faturamento ativo.';
  }

  switch (code) {
    case 'auth/invalid-email':
      return 'Digite um email válido.';
    case 'auth/email-already-in-use':
      return 'Já existe uma conta cadastrada com este email.';
    case 'auth/weak-password':
      return 'Use uma senha com pelo menos 6 caracteres.';
    case 'auth/invalid-phone-number':
      return 'Informe o celular no formato internacional, como +5541999999999.';
    case 'auth/email-not-verified':
      return 'Confirme o link enviado para seu e-mail antes de cadastrar o celular.';
    case 'auth/invalid-verification-code':
    case 'auth/invalid-verification-id':
      return 'O código de confirmação é inválido. Tente novamente.';
    case 'auth/code-expired':
    case 'auth/session-expired':
    case 'auth/mfa-session-expired':
      return 'O código expirou. Solicite um novo código.';
    case 'auth/quota-exceeded':
      return 'Limite de SMS atingido. Tente novamente mais tarde.';
    case 'auth/sms-region-disabled':
      return 'O SMS para este país está bloqueado. Libere a região no Firebase Console e tente novamente.';
    case 'auth/operation-not-allowed':
      return 'O envio por SMS ainda não está habilitado corretamente no Firebase.';
    case 'auth/app-not-authorized':
      return 'Este build Android não foi autorizado pelo Firebase. Confirme o package e os hashes SHA no projeto.';
    case 'auth/requires-recent-login':
      return 'Entre novamente antes de alterar a autenticação da sua conta.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email ou senha incorretos.';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
    case 'auth/network-request-failed':
      return 'Não foi possível acessar a internet. Tente novamente.';
    default:
      return 'Não foi possível concluir a operação. Tente novamente.';
  }
}

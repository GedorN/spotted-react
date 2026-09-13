import type { User } from '@react-native-firebase/auth';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from '@react-native-firebase/auth';

const auth = getAuth();

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
  return credential;
}

export async function requestPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email.trim());
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function authErrorMessage(error: unknown) {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Digite um email válido.';
    case 'auth/email-already-in-use':
      return 'Já existe uma conta cadastrada com este email.';
    case 'auth/weak-password':
      return 'Use uma senha com pelo menos 6 caracteres.';
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

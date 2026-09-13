import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  SignUpStep1: undefined;
  SignUpStep2: { name: string; email: string };
  // Mantido para reativarmos a confirmação por SMS na próxima etapa.
  SignUpStep3: { phone: string };
  PasswordRestore: undefined;
  Welcome: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

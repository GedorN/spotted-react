import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  SignUpStep1: undefined;
  SignUpStep2: { name: string; email: string };
  SignUpStep3: { phone: string; flow: 'enrollment' | 'signIn' };
  PasswordRestore: undefined;
  Welcome: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

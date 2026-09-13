import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  SignUpStep1: undefined;
  SignUpStep2: undefined;
  SignUpStep3: { phone: string };
  PasswordRestore: undefined;
  Welcome: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

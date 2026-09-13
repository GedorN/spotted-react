import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Field from '../../components/Field';
import Logo from '../../components/Logo';
import PasswordToggle from '../../components/PasswordToggle';
import type { RootScreenProps } from '../../navigation/types';
import { colors, fonts, radius } from '../../theme';
import { authErrorMessage, signIn } from '../../services/firebase/auth';

export default function LoginScreen({ navigation }: RootScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Preencha email e senha para entrar.');
      return;
    }

    setError(undefined);
    setChecking(true);
    try {
      await signIn(email, password);
    } catch (requestError) {
      setError(authErrorMessage(requestError));
    } finally {
      setChecking(false);
    }
  };

  return (
    <AuthLayout
      header={
        <View style={styles.header}>
          <View style={styles.headerBlob} />
          <Logo />
        </View>
      }
    >
      <Text style={styles.title}>Bem-vinda de volta</Text>

      <View style={styles.fields}>
        <Field
          label="EMAIL"
          placeholder="seu.nome@alunos.utfpr.edu.br"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <Field
          label="SENHA"
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={value => {
            setPassword(value);
            setError(undefined);
          }}
          right={
            <PasswordToggle
              visible={showPassword}
              onToggle={() => setShowPassword(v => !v)}
            />
          }
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={styles.forgot}
        onPress={() => navigation.navigate('PasswordRestore')}
      >
        <Text style={styles.link}>Esqueci minha senha</Text>
      </Pressable>

      <View style={styles.footer}>
        <Button title="Entrar" onPress={handleLogin} />
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Não tem conta? </Text>
          <Pressable onPress={() => navigation.navigate('SignUpStep1')}>
            <Text style={styles.signupLink}>Registrar-se</Text>
          </Pressable>
        </View>
      </View>

      <Modal visible={checking} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <ActivityIndicator size="large" color={colors.brand} />
            <Text style={styles.modalText}>
              Entrando na sua conta...
            </Text>
          </View>
        </View>
      </Modal>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBlob: {
    position: 'absolute',
    right: -70,
    top: -40,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.brandTint,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.4,
    marginBottom: 26,
  },
  fields: {
    gap: 18,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: 14,
  },
  link: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    gap: 12,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.error,
    marginTop: 16,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
  signupLink: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: 290,
    backgroundColor: colors.sheet,
    borderRadius: radius.modal,
    paddingVertical: 34,
    paddingHorizontal: 30,
    alignItems: 'center',
    gap: 14,
  },
  modalText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.ink,
    textAlign: 'center',
  },
});

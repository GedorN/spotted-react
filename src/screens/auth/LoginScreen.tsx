import React, { useEffect, useState } from 'react';
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

const FAKE_CHECK_MS = 1200;

export default function LoginScreen({ navigation }: RootScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(false);

  // Sem verificacao real: mostra o modal "perguntando ao servidor" e segue para a tela de boas-vindas.
  useEffect(() => {
    if (!checking) {
      return;
    }
    const timer = setTimeout(() => {
      setChecking(false);
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    }, FAKE_CHECK_MS);
    return () => clearTimeout(timer);
  }, [checking, navigation]);

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
        />
        <Field
          label="SENHA"
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          right={
            <PasswordToggle
              visible={showPassword}
              onToggle={() => setShowPassword(v => !v)}
            />
          }
        />
      </View>

      <Pressable
        style={styles.forgot}
        onPress={() => navigation.navigate('PasswordRestore')}
      >
        <Text style={styles.link}>Esqueci minha senha</Text>
      </Pressable>

      <View style={styles.footer}>
        <Button title="Entrar" onPress={() => setChecking(true)} />
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
              Perguntando ao nosso servidor se você pode entrar...
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

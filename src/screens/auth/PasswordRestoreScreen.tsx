import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Field from '../../components/Field';
import type { RootScreenProps } from '../../navigation/types';
import { colors, fonts, spacing } from '../../theme';
import { authErrorMessage, requestPasswordReset } from '../../services/firebase/auth';

export default function PasswordRestoreScreen({
  navigation,
}: RootScreenProps<'PasswordRestore'>) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setError('Digite seu email institucional.');
      return;
    }

    setError(undefined);
    try {
      await requestPasswordReset(email);
      Alert.alert('Email enviado', 'Enviamos as instruções para redefinir sua senha.');
      navigation.goBack();
    } catch (requestError) {
      setError(authErrorMessage(requestError));
    }
  };

  return (
    <AuthLayout
      headerHeight={210}
      header={
        <View style={styles.header}>
          {/* Marca em marca d'agua no canto inferior esquerdo */}
          <View style={styles.watermark}>
            <View style={[styles.drop, styles.dropA]} />
            <View style={[styles.drop, styles.dropB]} />
          </View>
          <Pressable onPress={navigation.goBack} hitSlop={12} style={styles.back}>
            <Image
              source={require('../../assets/images/chevron-circle-left-solid.png')}
              style={styles.backIcon}
            />
          </Pressable>
          <Text style={styles.title}>Esqueceu sua senha?</Text>
        </View>
      }
    >
      <Text style={styles.intro}>
        Sem problema. Diga o seu email institucional e a nossa equipe te ajuda a
        voltar.
      </Text>

      <Field
        label="EMAIL"
        placeholder="seu.nome@alunos.utfpr.edu.br"
        keyboardType="email-address"
        value={email}
        onChangeText={value => {
          setEmail(value);
          setError(undefined);
        }}
        error={error}
      />

      <View style={styles.footer}>
        <Button title="Recuperar" onPress={handlePasswordReset} />
        <Button title="Cancelar" variant="secondary" onPress={navigation.goBack} />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    paddingHorizontal: spacing.headerX,
    paddingVertical: 22,
    justifyContent: 'space-between',
  },
  watermark: {
    position: 'absolute',
    left: -40,
    bottom: -80,
    width: 210,
    height: 186,
    opacity: 0.14,
  },
  drop: {
    position: 'absolute',
    backgroundColor: colors.ink,
  },
  dropA: {
    left: 0,
    top: 26,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderBottomLeftRadius: 18,
    transform: [{ rotate: '35deg' }],
  },
  dropB: {
    left: 70,
    top: 4,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderBottomLeftRadius: 19,
    transform: [{ rotate: '55deg' }],
  },
  back: {
    alignSelf: 'flex-start',
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: colors.ink,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.8,
  },
  intro: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: 28,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    gap: 12,
  },
});

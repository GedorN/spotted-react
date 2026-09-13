import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Field from '../../components/Field';
import StepHeader from '../../components/StepHeader';
import StepProgress from '../../components/StepProgress';
import type { RootScreenProps } from '../../navigation/types';
import { colors, fonts } from '../../theme';

const RESEND_SECONDS = 30;

export default function SignUpStep3Screen({
  navigation,
  route,
}: RootScreenProps<'SignUpStep3'>) {
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <AuthLayout
      headerHeight={132}
      header={
        <StepHeader
          title="Confirmar número"
          step="3 / 3"
          onBack={navigation.goBack}
        />
      }
    >
      <Text style={styles.intro}>
        Enviamos um código de verificação para{' '}
        <Text style={styles.introStrong}>{route.params.phone}</Text>. Insira ele
        abaixo.
      </Text>

      <Field
        label="CÓDIGO"
        placeholder="• • • • • •"
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        inputStyle={styles.codeInput}
      />

      <Text style={styles.resend}>
        {seconds > 0
          ? `Tempo para reenviar código: ${seconds}s`
          : 'Reenviar código'}
      </Text>

      <View style={styles.footer}>
        <StepProgress current={3} />
        <Button
          title="Confirmar"
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] })
          }
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: 26,
  },
  introStrong: {
    color: colors.ink,
    fontWeight: '700',
  },
  codeInput: {
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 8,
    minHeight: 52,
  },
  resend: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.muted,
    marginTop: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    gap: 14,
  },
});

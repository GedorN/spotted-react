import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Field from '../../components/Field';
import StepHeader from '../../components/StepHeader';
import StepProgress from '../../components/StepProgress';
import type { RootScreenProps } from '../../navigation/types';
import {
  authErrorMessage,
  confirmSmsMfaCode,
  resendSmsMfaCode,
  startSmsMfaEnrollment,
} from '../../services/firebase/auth';
import { colors, fonts } from '../../theme';

const RESEND_SECONDS = 30;

export default function SignUpStep3Screen({
  navigation,
  route,
}: RootScreenProps<'SignUpStep3'>) {
  const isEnrollment = route.params.flow === 'enrollment';
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(isEnrollment ? 0 : RESEND_SECONDS);
  const [codeSent, setCodeSent] = useState(!isEnrollment);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [notice, setNotice] = useState(
    isEnrollment
      ? 'Confirme o link enviado para seu e-mail. Depois, volte aqui para solicitar o SMS.'
      : undefined,
  );

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }
    const timer = setTimeout(() => setSeconds(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const requestCode = async (resend = false) => {
    setError(undefined);
    setSending(true);
    try {
      if (isEnrollment && !resend) {
        await startSmsMfaEnrollment(route.params.phone);
      } else {
        await resendSmsMfaCode();
      }
      setCode('');
      setCodeSent(true);
      setSeconds(RESEND_SECONDS);
      setNotice(resend ? 'Enviamos um novo código para seu celular.' : undefined);
    } catch (requestError) {
      setError(authErrorMessage(requestError));
    } finally {
      setSending(false);
    }
  };

  const confirmCode = async () => {
    if (code.replace(/\s/g, '').length !== 6) {
      setError('Digite o código de 6 dígitos.');
      return;
    }

    setError(undefined);
    setConfirming(true);
    try {
      await confirmSmsMfaCode(code);
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (requestError) {
      setError(authErrorMessage(requestError));
    } finally {
      setConfirming(false);
    }
  };

  return (
    <AuthLayout
      headerHeight={132}
      header={
        <StepHeader
          title={isEnrollment ? 'Proteger sua conta' : 'Confirmar acesso'}
          step="3 / 3"
          onBack={navigation.goBack}
        />
      }
    >
      <Text style={styles.intro}>
        {isEnrollment
          ? 'Use seu celular como segundo fator de autenticação.'
          : 'Enviamos um código de verificação para '}
        {!isEnrollment ? (
          <Text style={styles.introStrong}>{route.params.phone}</Text>
        ) : null}
      </Text>

      {notice ? <Text style={styles.notice}>{notice}</Text> : null}

      {!codeSent ? (
        <View style={styles.actionBlock}>
          <Button
            title={sending ? 'Verificando e-mail...' : 'Já confirmei meu e-mail'}
            onPress={sending ? undefined : () => requestCode()}
          />
        </View>
      ) : (
        <>
          <Field
            label="CÓDIGO"
            placeholder="• • • • • •"
            keyboardType="number-pad"
            autoComplete="sms-otp"
            maxLength={6}
            value={code}
            onChangeText={value => {
              setCode(value.replace(/\D/g, ''));
              setError(undefined);
            }}
            inputStyle={styles.codeInput}
            error={error}
          />

          <View style={styles.resendRow}>
            <Text style={styles.resend}>
              {seconds > 0
                ? `Você poderá reenviar em ${seconds}s`
                : 'Não recebeu o código?'}
            </Text>
            {seconds <= 0 ? (
              <Pressable
                disabled={sending}
                onPress={() => requestCode(true)}
                hitSlop={8}
              >
                <Text style={styles.resendLink}>
                  {sending ? 'Enviando...' : 'Reenviar'}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </>
      )}

      {error && !codeSent ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.footer}>
        <StepProgress current={3} />
        {codeSent ? (
          <Button
            title={confirming ? 'Confirmando...' : 'Confirmar'}
            onPress={confirming ? undefined : confirmCode}
          />
        ) : null}
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
    marginBottom: 18,
  },
  introStrong: {
    color: colors.ink,
    fontWeight: '700',
  },
  notice: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
    marginBottom: 20,
  },
  actionBlock: {
    marginTop: 8,
  },
  codeInput: {
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 8,
    minHeight: 52,
  },
  resendRow: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
    marginTop: 12,
  },
  resend: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.muted,
  },
  resendLink: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 19,
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.error,
    marginTop: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    gap: 14,
  },
});

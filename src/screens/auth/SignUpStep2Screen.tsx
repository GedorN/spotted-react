import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Field from '../../components/Field';
import PasswordToggle from '../../components/PasswordToggle';
import StepHeader from '../../components/StepHeader';
import StepProgress from '../../components/StepProgress';
import type { RootScreenProps } from '../../navigation/types';
import { authErrorMessage, createAccount } from '../../services/firebase/auth';

export default function SignUpStep2Screen({
  navigation,
  route,
}: RootScreenProps<'SignUpStep2'>) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [creating, setCreating] = useState(false);

  const handleCreateAccount = async () => {
    if (!/^\+[1-9]\d{7,14}$/.test(phone.replace(/[\s()-]/g, ''))) {
      setError('Informe o celular no formato internacional, como +5541999999999.');
      return;
    }

    if (password.length < 6) {
      setError('Use uma senha com pelo menos 6 caracteres.');
      return;
    }

    setError(undefined);
    setCreating(true);
    try {
      await createAccount(route.params.name, route.params.email, password);
      navigation.navigate('SignUpStep3', {
        phone: phone.replace(/[\s()-]/g, ''),
        flow: 'enrollment',
      });
    } catch (requestError) {
      setError(authErrorMessage(requestError));
    } finally {
      setCreating(false);
    }
  };

  return (
    <AuthLayout
      headerHeight={132}
      header={
        <StepHeader title="Criar conta" step="2 / 2" onBack={navigation.goBack} />
      }
    >
      <View style={styles.fields}>
        <Field
          label="CELULAR"
          placeholder="+55 41 99804-6357"
          keyboardType="phone-pad"
          autoComplete="tel"
          value={phone}
          onChangeText={value => {
            setPhone(value);
            setError(undefined);
          }}
        />
        <Field
          label="SENHA"
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          helper="Mínimo de 6 caracteres."
          value={password}
          onChangeText={value => {
            setPassword(value);
            setError(undefined);
          }}
          error={error}
          right={
            <PasswordToggle
              visible={showPassword}
              onToggle={() => setShowPassword(v => !v)}
            />
          }
        />
      </View>

      <View style={styles.footer}>
        <StepProgress current={2} total={2} />
        <Button
          title={creating ? 'Criando conta...' : 'Criar conta'}
          onPress={handleCreateAccount}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 18,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    gap: 14,
  },
});

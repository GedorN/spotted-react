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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [creating, setCreating] = useState(false);

  const handleCreateAccount = async () => {
    if (password.length < 6) {
      setError('Use uma senha com pelo menos 6 caracteres.');
      return;
    }

    setError(undefined);
    setCreating(true);
    try {
      await createAccount(route.params.name, route.params.email, password);
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
        {/* Autenticação por telefone/SMS será reativada na próxima etapa.
        <Field
          label="CELULAR"
          placeholder="(41) 99804-6357"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        /> */}
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

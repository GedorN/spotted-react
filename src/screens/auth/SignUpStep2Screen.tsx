import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Field from '../../components/Field';
import PasswordToggle from '../../components/PasswordToggle';
import StepHeader from '../../components/StepHeader';
import StepProgress from '../../components/StepProgress';
import type { RootScreenProps } from '../../navigation/types';

export default function SignUpStep2Screen({
  navigation,
}: RootScreenProps<'SignUpStep2'>) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout
      headerHeight={132}
      header={
        <StepHeader title="Criar conta" step="2 / 3" onBack={navigation.goBack} />
      }
    >
      <View style={styles.fields}>
        <Field
          label="CELULAR"
          placeholder="(41) 99804-6357"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <Field
          label="SENHA"
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          helper="Mínimo de 6 caracteres."
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

      <View style={styles.footer}>
        <StepProgress current={2} />
        <Button
          title="Avançar"
          onPress={() =>
            navigation.navigate('SignUpStep3', {
              phone: phone || '(41) 99804-6357',
            })
          }
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

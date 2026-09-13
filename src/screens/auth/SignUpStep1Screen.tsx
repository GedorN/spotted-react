import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import Field from '../../components/Field';
import StepHeader from '../../components/StepHeader';
import StepProgress from '../../components/StepProgress';
import type { RootScreenProps } from '../../navigation/types';
import { colors, fonts } from '../../theme';

export default function SignUpStep1Screen({
  navigation,
}: RootScreenProps<'SignUpStep1'>) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <AuthLayout
      headerHeight={132}
      header={
        <StepHeader title="Criar conta" step="1 / 3" onBack={navigation.goBack} />
      }
    >
      <Pressable style={styles.photoRow}>
        <View style={styles.photo}>
          <Image
            source={require('../../assets/images/camera-icon.png')}
            style={styles.photoIcon}
          />
        </View>
        <View>
          <Text style={styles.photoTitle}>Sua foto</Text>
          <Text style={styles.photoHint}>Assim seus colegas te reconhecem</Text>
        </View>
      </Pressable>

      <View style={styles.fields}>
        <Field
          label="NOME"
          placeholder="Maria Alves"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
        <Field
          label="EMAIL INSTITUCIONAL"
          placeholder="maria.alves@alunos.utfpr.edu.br"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.footer}>
        <StepProgress current={1} />
        <Button
          title="Avançar"
          onPress={() => navigation.navigate('SignUpStep2')}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 26,
  },
  photo: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoIcon: {
    width: 28,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.ink,
    opacity: 0.45,
  },
  photoTitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: colors.ink,
  },
  photoHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },
  fields: {
    gap: 18,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    gap: 14,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Logo from '../components/Logo';
import type { RootScreenProps } from '../navigation/types';
import { colors, fonts } from '../theme';

// Tela generica pos-login. O feed real entra aqui numa proxima etapa.
export default function WelcomeScreen({ navigation }: RootScreenProps<'Welcome'>) {
  return (
    <AuthLayout
      headerHeight={300}
      header={
        <View style={styles.header}>
          <View style={styles.headerBlob} />
          <Logo />
        </View>
      }
    >
      <Text style={styles.title}>Boas-vindas ao Spotted!</Text>
      <Text style={styles.body}>
        Você está dentro. Em breve, os spotteds, avisos e novidades da UTFPR
        vão aparecer aqui.
      </Text>

      <View style={styles.footer}>
        <Button
          title="Sair"
          variant="secondary"
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
          }
        />
      </View>
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
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: colors.muted,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
  },
});

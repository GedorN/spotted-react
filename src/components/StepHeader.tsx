import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '../theme';

type Props = {
  title: string;
  step?: string;
  onBack?: () => void;
};

// Cabecalho amarelo das telas de cadastro: chevron de voltar, titulo e contador de passo.
export default function StepHeader({ title, step, onBack }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
        <Image
          source={require('../assets/images/chevron-circle-left-solid.png')}
          style={styles.backIcon}
        />
      </Pressable>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        {step ? <Text style={styles.step}>{step}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: spacing.headerX,
    paddingVertical: 22,
    justifyContent: 'space-between',
  },
  back: {
    alignSelf: 'flex-start',
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: colors.ink,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.6,
  },
  step: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(17,17,17,0.6)',
    marginBottom: 4,
  },
});

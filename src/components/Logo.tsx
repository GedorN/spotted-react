import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  size?: number;
  showWordmark?: boolean;
};

// Marca do Spotted: duas "gotas" sobrepostas (preta e creme) com a palavra "spotted".
export default function Logo({ size = 1, showWordmark = true }: Props) {
  const s = (n: number) => n * size;
  return (
    <View style={styles.wrap}>
      <View style={{ width: s(104), height: s(92) }}>
        <View
          style={[
            styles.drop,
            styles.dropLeft,
            {
              top: s(12),
              width: s(64),
              height: s(64),
              backgroundColor: colors.ink,
              borderBottomLeftRadius: s(9),
              borderRadius: s(32),
              transform: [{ rotate: '35deg' }],
            },
          ]}
        >
          <View
            style={{
              width: s(23),
              height: s(23),
              borderRadius: s(12),
              backgroundColor: colors.brand,
            }}
          />
        </View>
        <View
          style={[
            styles.drop,
            {
              left: s(34),
              top: s(3),
              width: s(68),
              height: s(68),
              backgroundColor: colors.sheet,
              borderBottomLeftRadius: s(9),
              borderRadius: s(34),
              transform: [{ rotate: '55deg' }],
            },
          ]}
        >
          <View
            style={{
              width: s(24),
              height: s(24),
              borderRadius: s(12),
              backgroundColor: colors.ink,
            }}
          />
        </View>
      </View>
      {showWordmark && (
        <Text style={[styles.wordmark, { fontSize: s(34) }]}>spotted</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 14,
  },
  drop: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropLeft: {
    left: 0,
  },
  wordmark: {
    fontFamily: fonts.heading,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -1.4,
  },
});

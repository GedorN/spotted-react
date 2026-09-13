import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  current: number;
  total?: number;
};

export default function StepProgress({ current, total = 3 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.bar, i < current ? styles.done : styles.todo]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  done: {
    backgroundColor: colors.ink,
  },
  todo: {
    backgroundColor: colors.borderSoft,
  },
});

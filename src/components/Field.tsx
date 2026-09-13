import React, { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, fonts } from '../theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  helper?: string;
  right?: ReactNode;
  inputStyle?: TextInputProps['style'];
};

// Campo com rotulo em caixa alta e linha inferior (borda escurece quando ha valor).
export default function Field({
  label,
  error,
  helper,
  right,
  value,
  inputStyle,
  style,
  ...inputProps
}: Props) {
  const lineColor = error
    ? colors.error
    : value
    ? colors.ink
    : colors.border;

  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.line, { borderBottomColor: lineColor }]}>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={colors.placeholder}
          value={value}
          autoCapitalize="none"
          {...inputProps}
        />
        {right}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '500',
    color: colors.muted,
    letterSpacing: 0.9,
    marginBottom: 7,
  },
  line: {
    minHeight: 42,
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 0,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.error,
    marginTop: 7,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
    marginTop: 7,
  },
});

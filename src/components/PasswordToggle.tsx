import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme';

type Props = {
  visible: boolean;
  onToggle: () => void;
};

export default function PasswordToggle({ visible, onToggle }: Props) {
  return (
    <Pressable onPress={onToggle} hitSlop={10}>
      <Image
        source={require('../assets/images/eye-solid.png')}
        style={[styles.icon, visible && styles.iconOff]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 19,
    resizeMode: 'contain',
    tintColor: colors.ink,
  },
  iconOff: {
    opacity: 0.35,
  },
});

import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme';

type Props = {
  header: ReactNode;
  headerHeight?: number;
  children: ReactNode;
};

// Topo amarelo com a marca/titulo e folha creme com o conteudo (modelo "1a - Encontro").
export default function AuthLayout({ header, headerHeight = 250, children }: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { height: headerHeight }]}>{header}</View>
        <View style={styles.sheet}>
          <SafeAreaView style={styles.flex} edges={['bottom']}>
            <ScrollView
              contentContainerStyle={styles.sheetContent}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              {children}
            </ScrollView>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.brand,
  },
  flex: {
    flex: 1,
  },
  header: {
    overflow: 'hidden',
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.sheet,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
  sheetContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.sheetX,
    paddingTop: 34,
    paddingBottom: 28,
  },
});

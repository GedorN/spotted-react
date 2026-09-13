import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { User } from '@react-native-firebase/auth';
import { observeAuthState } from '../services/firebase/auth';
import { colors } from '../theme';

type Props = {
  children: (user: User | null) => React.ReactNode;
};

export default function AuthGate({ children }: Props) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => observeAuthState(setUser), []);

  if (user === undefined) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.sheet} />
      </View>
    );
  }

  return <>{children(user)}</>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
});

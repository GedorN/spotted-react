import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpStep1Screen from '../screens/auth/SignUpStep1Screen';
import SignUpStep2Screen from '../screens/auth/SignUpStep2Screen';
import SignUpStep3Screen from '../screens/auth/SignUpStep3Screen';
import PasswordRestoreScreen from '../screens/auth/PasswordRestoreScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import AuthGate from '../components/AuthGate';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <AuthGate>
      {user => (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={user ? 'Welcome' : 'Login'}
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.brand },
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUpStep1" component={SignUpStep1Screen} />
            <Stack.Screen name="SignUpStep2" component={SignUpStep2Screen} />
            <Stack.Screen name="SignUpStep3" component={SignUpStep3Screen} />
            <Stack.Screen name="PasswordRestore" component={PasswordRestoreScreen} />
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ animation: 'fade' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </AuthGate>
  );
}

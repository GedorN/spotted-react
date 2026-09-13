/**
 * @format
 */

import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import {
  onAuthStateChanged,
  signOut as nativeSignOut,
} from '@react-native-firebase/auth';
import type { User } from '@react-native-firebase/auth';
import AuthGate from '../src/components/AuthGate';
import { signOut } from '../src/services/firebase/auth';

const onAuthStateChangedMock = jest.mocked(onAuthStateChanged);
const nativeSignOutMock = jest.mocked(nativeSignOut);

function textContent(renderer: ReactTestRenderer.ReactTestRenderer) {
  return renderer.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .flat(Infinity)
    .join(' ');
}

test('returns to login after signing out', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <AuthGate>
        {user => <Text>{user ? 'authenticated' : 'anonymous'}</Text>}
      </AuthGate>,
    );
  });

  expect(textContent(renderer)).toContain('anonymous');

  const authStateListener = onAuthStateChangedMock.mock.calls.at(-1)?.[1];
  if (typeof authStateListener !== 'function') {
    throw new Error('Auth state listener was not registered');
  }

  await ReactTestRenderer.act(() => {
    authStateListener({ uid: 'test-user' } as User);
  });

  expect(textContent(renderer)).toContain('authenticated');

  await ReactTestRenderer.act(async () => {
    await signOut();
    authStateListener(null);
  });

  expect(nativeSignOutMock).toHaveBeenCalledTimes(1);
  expect(textContent(renderer)).toContain('anonymous');
});

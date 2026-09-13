module.exports = {
  preset: '@react-native/jest-preset',
  // @react-navigation e react-native-screens são publicados como ESM.
  transformIgnorePatterns: [
    'node_modules/(?!(?:@react-native|react-native|@react-navigation|react-native-screens|react-native-safe-area-context)/)',
  ],
};

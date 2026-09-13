const auth = { currentUser: null };
let authStateListener;

const signOut = jest.fn(async () => {
  auth.currentUser = null;
  authStateListener?.(null);
});

module.exports = {
  getAuth: jest.fn(() => auth),
  onAuthStateChanged: jest.fn((_auth, callback) => {
    authStateListener = callback;
    callback(auth.currentUser);
    return jest.fn(() => {
      authStateListener = undefined;
    });
  }),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signOut,
  __emitAuthState(user) {
    auth.currentUser = user;
    authStateListener?.(user);
  },
};

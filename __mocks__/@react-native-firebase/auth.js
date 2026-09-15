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
  sendEmailVerification: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  reload: jest.fn(),
  multiFactor: jest.fn(() => ({
    getSession: jest.fn(),
    enroll: jest.fn(),
  })),
  getMultiFactorResolver: jest.fn(),
  PhoneAuthProvider: class {
    static credential = jest.fn();
    verifyPhoneNumber = jest.fn();
  },
  PhoneMultiFactorGenerator: {
    FACTOR_ID: 'phone',
    assertion: jest.fn(),
  },
  signOut,
  __emitAuthState(user) {
    auth.currentUser = user;
    authStateListener?.(user);
  },
};

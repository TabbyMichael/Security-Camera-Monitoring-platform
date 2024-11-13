import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  sendEmailVerification,
  User,
  sendPasswordResetEmail
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB0eEDOLNoBqTlaRwU5LVj5aIn6z6XFpjs",
  authDomain: "scm-platform-86fcb.firebaseapp.com",
  projectId: "scm-platform-86fcb",
  storageBucket: "scm-platform-86fcb.firebasestorage.app",
  messagingSenderId: "342948696699",
  appId: "1:342948696699:web:7938bdf1b6c0032c32c8de",
  measurementId: "G-MLWGFQH9CY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const firebaseAuth = {
  // Email/Password authentication
  async signUpWithEmail(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Send verification email
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
    }
    return userCredential;
  },

  async signInWithEmail(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
    }
    return userCredential;
  },

  // Google authentication
  async signInWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  },

  // Phone authentication
  async setupRecaptcha(buttonId: string) {
    const recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
      size: 'invisible',
    });
    return recaptchaVerifier;
  },

  async signInWithPhone(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) {
    return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  },

  async verifyPhoneCode(confirmationResult: ConfirmationResult, code: string) {
    return confirmationResult.confirm(code);
  },

  // Sign out
  async signOut() {
    return auth.signOut();
  },

  async resendVerificationEmail(user: User) {
    return sendEmailVerification(user);
  },

  async sendPasswordReset(email: string) {
    return sendPasswordResetEmail(auth, email);
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }
}; 
import React from 'react';
import { X, ArrowLeft, Phone, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PhoneAuthForm } from './PhoneAuthForm';
import { VerificationForm } from './VerificationForm';
import { firebaseAuth } from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const navigate = useNavigate();
  const [authStep, setAuthStep] = React.useState<'initial' | 'phone' | 'verification'>('initial');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [verificationSent, setVerificationSent] = React.useState(false);

  if (!isOpen) return null;

  if (authStep === 'phone') {
    return (
      <PhoneAuthForm 
        onBack={() => setAuthStep('initial')}
        onSubmit={(phone) => {
          setPhoneNumber(phone);
          setAuthStep('verification');
        }}
        onClose={onClose}
      />
    );
  }

  if (authStep === 'verification') {
    return (
      <VerificationForm 
        phoneNumber={phoneNumber}
        onBack={() => setAuthStep('phone')}
        onSuccess={() => {
          // Handle successful verification
          onClose();
          // TODO: Set user authentication state
        }}
        onClose={onClose}
      />
    );
  }

  const handleForgotPassword = () => {
    onClose();
    navigate('/forgot-password');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setVerificationSent(false);

    try {
      if (isSignUp) {
        // Validate password
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
          throw new Error('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
          throw new Error('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
          throw new Error('Password must contain at least one number');
        }
        if (!/[!@#$%^&*]/.test(password)) {
          throw new Error('Password must contain at least one special character (!@#$%^&*)');
        }
        
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Sign up and send verification email
        await firebaseAuth.signUpWithEmail(email, password);
        setVerificationSent(true);
      } else {
        // Sign in
        await firebaseAuth.signInWithEmail(email, password);
        onClose();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await firebaseAuth.signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-8 relative">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back to home
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-3">
          {isSignUp ? 'Create account' : 'Welcome back'}
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          {isSignUp ? 'Sign up for GuardianEye' : 'Sign in to GuardianEye'}
        </p>

        <div className="space-y-6 max-w-xl mx-auto">
          <button 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white font-bold border border-black rounded-lg hover:bg-gray-800 transition-colors text-lg"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
            Sign {isSignUp ? 'up' : 'in'} with Google
          </button>

          <button 
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white font-bold border border-black rounded-lg hover:bg-gray-800 transition-colors text-lg"
            onClick={() => setAuthStep('phone')}
          >
            <Phone className="w-6 h-6" />
            Sign {isSignUp ? 'up' : 'in'} with Phone
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-base">
              <span className="px-4 bg-white text-gray-500">OR CONTINUE WITH</span>
            </div>
          </div>

          {verificationSent ? (
            <div className="text-center p-6">
              <div className="mb-4 text-green-600">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Verify your email</h3>
              <p className="text-gray-600 mb-4">
                We've sent a verification link to {email}.<br />
                Please check your inbox and verify your email before signing in.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {isSignUp && (
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                      <li className={password.length >= 8 ? 'text-green-600' : ''}>
                        • At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                        • One uppercase letter
                      </li>
                      <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                        • One lowercase letter
                      </li>
                      <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                        • One number
                      </li>
                      <li className={/[!@#$%^&*]/.test(password) ? 'text-green-600' : ''}>
                        • One special character (!@#$%^&*)
                      </li>
                    </ul>
                  )}
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-6 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Please wait...' : `Sign ${isSignUp ? 'up' : 'in'}`}
                </button>
              </form>

              {!isSignUp && (
                <button 
                  onClick={handleForgotPassword}
                  className="w-full text-center text-blue-600 hover:text-blue-800 text-lg"
                >
                  Forgot your password?
                </button>
              )}

              <div className="text-center text-gray-600 text-lg">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
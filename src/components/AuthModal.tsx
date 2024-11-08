import React from 'react';
import { X, ArrowLeft, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleForgotPassword = () => {
    onClose();
    navigate('/forgot-password');
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
          <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white font-bold border border-black rounded-lg hover:bg-gray-800 transition-colors text-lg">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
            Sign {isSignUp ? 'up' : 'in'} with Google
          </button>

          <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white font-bold border border-black rounded-lg hover:bg-gray-800 transition-colors text-lg">
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

          <div className="space-y-5">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button className="w-full py-3 px-6 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors text-lg">
              Sign {isSignUp ? 'up' : 'in'}
            </button>
          </div>

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
        </div>
      </div>
    </div>
  );
} 
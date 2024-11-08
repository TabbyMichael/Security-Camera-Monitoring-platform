import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await api.requestPasswordReset(email);
      setStatus('success');
      setMessage(response.message || 'Password reset instructions have been sent to your email.');
    } catch (error: unknown) {
      setStatus('error');
      setMessage(
        error instanceof Error 
          ? error.message 
          : 'Failed to send reset instructions. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl p-8 shadow-sm">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back to home
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-3">Reset Password</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <div className="space-y-6 max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="block w-full px-4 py-3 pl-10 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 px-6 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>

          <div className="text-center text-gray-600 text-lg">
            Remember your password?{' '}
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
import React from 'react';
import { X, ArrowLeft, Phone } from 'lucide-react';
import { CountryPicker } from './CountryPicker';
import { countries } from '../utils/countries';
import { Country } from '../utils/countries';
import { firebaseAuth } from '../services/firebase';

interface PhoneAuthFormProps {
  onBack: () => void;
  onSubmit: (phone: string) => void;
  onClose: () => void;
}

export function PhoneAuthForm({ onBack, onSubmit, onClose }: PhoneAuthFormProps) {
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const recaptchaContainerId = 'recaptcha-container';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Basic validation
      if (phoneNumber.length < 8) {
        throw new Error('Please enter a valid phone number');
      }

      // Format phone number with country code
      const formattedPhone = `${selectedCountry.dialCode}${phoneNumber.replace(/\D/g, '')}`;
      
      // Setup recaptcha
      const recaptchaVerifier = await firebaseAuth.setupRecaptcha(recaptchaContainerId);
      
      // Start phone verification
      const confirmationResult = await firebaseAuth.signInWithPhone(formattedPhone, recaptchaVerifier);
      
      // Pass confirmation result to verification step
      onSubmit(formattedPhone);
      sessionStorage.setItem('confirmationResult', JSON.stringify(confirmationResult));
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-xl p-8 relative">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Phone className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enter your phone number</h2>
            <p className="text-gray-600">We'll send you a verification code</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <CountryPicker
                selectedCountry={selectedCountry}
                onSelect={setSelectedCountry}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  {selectedCountry.dialCode}
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div id={recaptchaContainerId}></div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending code...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
} 
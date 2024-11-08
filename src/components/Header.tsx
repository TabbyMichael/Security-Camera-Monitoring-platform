import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, User } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { AuthModal } from './AuthModal';

export function Header() {
  const navigate = useNavigate();
  const [notifications] = React.useState(3);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  return (
    <>
      <header className="bg-white shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 w-64">
            <Shield className="w-8 h-8 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Guardian</span>
              <span className="text-sm text-blue-500">Eye</span>
            </div>
          </div>
          
          <SearchBar />

          <div className="flex items-center gap-4 w-64 justify-end">
            <button 
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Bell className="w-6 h-6" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
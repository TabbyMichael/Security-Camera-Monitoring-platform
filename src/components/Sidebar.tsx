import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  History,
  Bell,
  Settings,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', notifications: 0 },
  { icon: Camera, label: 'Live View', path: '/live', notifications: 0 },
  { icon: History, label: 'Recordings', path: '/recordings', notifications: 2 },
  { icon: Bell, label: 'Alerts', path: '/alerts', notifications: 3 },
  { icon: Settings, label: 'Settings', path: '/settings', notifications: 0 },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, setIsOpen } = useSidebar();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <div className={`fixed inset-y-0 left-0 bg-gray-900 transition-all duration-300 flex flex-col ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
        <button 
          onClick={toggleSidebar}
          className="flex items-center gap-3 text-white"
        >
          <Shield className="w-8 h-8 text-blue-500" />
          {isOpen && (
            <div className="flex flex-col">
              <span className="text-xl font-bold">Guardian</span>
              <span className="text-sm text-blue-500">Eye</span>
            </div>
          )}
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {isOpen && <span>{item.label}</span>}
            </div>
            {isOpen && item.notifications > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {item.notifications}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Profile Section - Now at the bottom */}
      <div className="mt-auto border-t border-gray-800">
        <div className="p-4">
          <button
            onClick={toggleProfile}
            className={`w-full flex items-center gap-3 p-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors ${
              !isOpen ? 'justify-center' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80"
                alt="User"
                className={`rounded-full ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 transition-all duration-300 object-cover ${
                  isOpen ? 'w-10 h-10' : 'w-12 h-12'
                }`}
                style={{ aspectRatio: '1/1' }}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            
            {isOpen && (
              <>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">Security Admin</p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
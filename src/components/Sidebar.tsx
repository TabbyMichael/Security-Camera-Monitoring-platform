import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  History,
  Bell,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';

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
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-30 lg:hidden bg-gray-900 text-white p-2 rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col h-screen`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 text-white">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">SecureView</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
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
                <span>{item.label}</span>
              </div>
              {item.notifications > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {item.notifications}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs">Security Admin</p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
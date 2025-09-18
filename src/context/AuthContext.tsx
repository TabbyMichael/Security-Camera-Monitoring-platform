import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      if (response.token) {
        setToken(response.token);
        setUser({ _id: response._id, name: response.name, email: response.email });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({ _id: response._id, name: response.name, email: response.email }));
        toast.success('Logged in successfully!');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register(name, email, password);
      if (response.token) {
        setToken(response.token);
        setUser({ _id: response._id, name: response.name, email: response.email });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({ _id: response._id, name: response.name, email: response.email }));
        toast.success('Registered and logged in successfully!');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

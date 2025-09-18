import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You can add a loading spinner here if you want
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to a login page or show the auth modal.
    // For simplicity, we'll redirect to the home page, where the login button is.
    // In a real app, you might have a dedicated /login route.
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './screens/Dashboard';
import { LiveView } from './screens/LiveView';
import { Recordings } from './screens/Recordings';
import { Alerts } from './screens/Alerts';
import { Settings } from './screens/Settings';
import { NotificationCenter } from './screens/NotificationCenter';
import { ForgotPassword } from './screens/ForgotPassword';
import { ResetPassword } from './screens/ResetPassword';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ManageCameras } from './screens/ManageCameras';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/live" element={<LiveView />} />
        <Route path="/recordings" element={<Recordings />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/cameras" element={<ManageCameras />} />
        <Route path="/notifications" element={<NotificationCenter />} />
      </Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}
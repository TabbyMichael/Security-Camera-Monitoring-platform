import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './screens/Dashboard';
import { LiveView } from './screens/LiveView';
import { Recordings } from './screens/Recordings';
import { Alerts } from './screens/Alerts';
import { Settings } from './screens/Settings';
import { NotificationCenter } from './screens/NotificationCenter';
import { ForgotPassword } from './screens/ForgotPassword';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/live" element={<LiveView />} />
      <Route path="/recordings" element={<Recordings />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/notifications" element={<NotificationCenter />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/common/appLayout';
import DashboardOverview from '../components/dashboard/dashboardOverview';
import Expenses from '../pages/Expenses';
import Budget from '../pages/Budget';
import Reports from '../pages/Reports';
import Profile from '../pages/Profile';
import SettingsPage from '../pages/settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import RestaurantDetailPage from '../pages/RestaurantDetailPage';
import MyOrdersPage from '../pages/MyOrdersPage';
import OwnerDashboardPage from '../pages/OwnerDashboardPage';
import PlatformAnalyticsPage from '../pages/PlatformAnalyticsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />

      <Route
        path="/orders/my"
        element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute role="owner">
            <OwnerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics/platform"
        element={
          <ProtectedRoute>
            <PlatformAnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

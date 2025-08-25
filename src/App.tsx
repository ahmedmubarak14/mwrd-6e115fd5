
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RouteAwareThemeProvider } from './contexts/RouteAwareThemeContext';
import { SecurityProvider } from './contexts/SecurityContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import Profile from './pages/Profile';
import { Analytics } from './pages/Analytics';
import { Landing } from './pages/Landing';
import { WhyStartWithMWRD } from './pages/WhyStartWithMWRD';
import { WhatMakesUsUnique } from './pages/WhatMakesUsUnique';
import { WhyMoveToMWRD } from './pages/WhyMoveToMWRD';
import Pricing from './pages/Pricing';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRequests from './pages/admin/AdminRequests';
import AdminOffers from './pages/admin/AdminOffers';
import AdminProjects from './pages/admin/AdminProjects';
import AdminFinancialTransactions from './pages/admin/FinancialTransactions';
import { AdminSupport } from './pages/admin/AdminSupport';
import { ExpertConsultations } from './pages/admin/ExpertConsultations';
import CategoryManagement from './pages/admin/CategoryManagement';
import AdminVerificationQueue from './pages/admin/AdminVerificationQueue';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import NotFound from './pages/NotFound';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminOrders from './pages/admin/AdminOrders';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('client' | 'vendor' | 'admin')[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking authentication
  }

  if (!userProfile) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userProfile.role as 'client' | 'vendor' | 'admin')) {
    // Redirect to unauthorized page if role is not allowed
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Component to handle root route redirect logic
const RootRedirect: React.FC = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is authenticated, redirect to dashboard
  if (user && userProfile) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, redirect to landing page
  return <Navigate to="/landing" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/why-start-with-mwrd" element={<WhyStartWithMWRD />} />
      <Route path="/what-makes-us-unique" element={<WhatMakesUsUnique />} />
      <Route path="/why-move-to-mwrd" element={<WhyMoveToMWRD />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/auth" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Enhanced auth redirects - redirect to standard auth pages */}
      <Route path="/enhanced-login" element={<Navigate to="/login" replace />} />
      <Route path="/enhanced-register" element={<Navigate to="/register" replace />} />
      
      {/* Client Routes */}
      <Route path="/client/*" element={
        <RoleProtectedRoute allowedRoles={['client']}>
          <DashboardLayout>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              {/* Add more client routes here */}
            </Routes>
          </DashboardLayout>
        </RoleProtectedRoute>
      } />

      {/* Vendor Routes */}
      <Route path="/vendor/*" element={
        <RoleProtectedRoute allowedRoles={['vendor']}>
          <DashboardLayout>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              {/* Add more vendor routes here */}
            </Routes>
          </DashboardLayout>
        </RoleProtectedRoute>
      } />

      {/* Vendor Dashboard Route */}
      <Route path="/vendor-dashboard" element={
        <RoleProtectedRoute allowedRoles={['vendor']}>
          <VendorDashboard />
        </RoleProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <RoleProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </RoleProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboardOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="financial-transactions" element={<AdminFinancialTransactions />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="content/consultations" element={<ExpertConsultations />} />
        <Route path="category-management" element={<CategoryManagement />} />
        <Route path="verification" element={<AdminVerificationQueue />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      {/* Public Route for Dashboard (accessible to all authenticated users) */}
      <Route path="/dashboard" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <Dashboard />
        </RoleProtectedRoute>
      } />

      {/* Analytics route for authenticated users */}
      <Route path="/analytics" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <Analytics />
        </RoleProtectedRoute>
      } />

      {/* Root route with smart redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <AuthProvider>
          <SecurityProvider>
            <RouteAwareThemeProvider>
              <AppRoutes />
            </RouteAwareThemeProvider>
          </SecurityProvider>
        </AuthProvider>
      </Router>
    </LanguageProvider>
  );
};

export default App;

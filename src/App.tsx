
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { MinimalAuthProvider, useAuth } from './contexts/MinimalAuthContext';
import { RouteAwareThemeProvider } from './contexts/RouteAwareThemeContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { GlobalErrorHandler } from '@/components/ui/GlobalErrorHandler';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import Profile from './pages/Profile';
import { Landing } from './pages/Landing';
import NotFound from './pages/NotFound';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRequests from './pages/admin/AdminRequests';
import AdminOffers from './pages/admin/AdminOffers';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSupport } from './pages/admin/AdminSupport';

const RoleProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: ('client' | 'vendor' | 'admin')[];
}> = ({ children, allowedRoles }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userProfile.role as 'client' | 'vendor' | 'admin')) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  console.log('App: Starting with minimal auth provider');
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <MinimalAuthProvider>
            <RouteAwareThemeProvider>
              <GlobalErrorHandler />
              <Toaster />
              
              <Routes>
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={
                  <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
                    <Dashboard />
                  </RoleProtectedRoute>
                } />
                <Route path="/profile" element={
                  <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
                    <Profile />
                  </RoleProtectedRoute>
                } />
                <Route path="/vendor-dashboard" element={
                  <RoleProtectedRoute allowedRoles={['vendor']}>
                    <VendorDashboard />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/requests" element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <AdminRequests />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/offers" element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <AdminOffers />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <AdminAnalytics />
                  </RoleProtectedRoute>
                } />
                <Route path="/admin/support" element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <AdminSupport />
                  </RoleProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/landing" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
            </RouteAwareThemeProvider>
          </MinimalAuthProvider>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RouteAwareThemeProvider } from './contexts/RouteAwareThemeContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { GlobalErrorHandler } from '@/components/ui/GlobalErrorHandler';
import { MobileAppShell } from './components/mobile/MobileAppShell';
import { ClientLayout } from './components/layout/ClientLayout';
import { AdminLayout } from './components/admin/AdminLayout';
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
import Requests from './pages/Requests';
import CreateSimpleRequest from './pages/CreateSimpleRequest';
import { SearchPage } from './components/search/SearchPage';

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

function App() {
  return (
    <ErrorBoundary>
      <GlobalErrorHandler />
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <RouteAwareThemeProvider>
              <MobileAppShell>
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    
                    {/* Multi-role dashboard route (will redirect based on role) */}
                    <Route path="/dashboard" element={
                      <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
                        <Dashboard />
                      </RoleProtectedRoute>
                    } />
                    
                    {/* Client routes with layout */}
                    <Route path="/client" element={
                      <RoleProtectedRoute allowedRoles={['client']}>
                        <ClientLayout />
                      </RoleProtectedRoute>
                    }>
                      <Route path="requests" element={<Requests />} />
                      <Route path="requests/create" element={<CreateSimpleRequest />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="search" element={<SearchPage />} />
                    </Route>
                    
                    {/* Legacy client routes (redirect to new structure) */}
                    <Route path="/requests" element={<Navigate to="/client/requests" replace />} />
                    <Route path="/requests/create" element={<Navigate to="/client/requests/create" replace />} />
                    <Route path="/profile" element={<Navigate to="/client/profile" replace />} />
                    <Route path="/search" element={<Navigate to="/client/search" replace />} />
                    
                    {/* Vendor routes */}
                    <Route path="/vendor-dashboard" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorDashboard />
                      </RoleProtectedRoute>
                    } />
                    
                    {/* Admin routes with layout */}
                    <Route path="/admin" element={
                      <RoleProtectedRoute allowedRoles={['admin']}>
                        <AdminLayout />
                      </RoleProtectedRoute>
                    }>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="requests" element={<AdminRequests />} />
                      <Route path="offers" element={<AdminOffers />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                    </Route>
                    
                    {/* Default and 404 routes */}
                    <Route path="/" element={<Navigate to="/landing" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </MobileAppShell>
              <Toaster />
            </RouteAwareThemeProvider>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RouteAwareThemeProvider } from './contexts/RouteAwareThemeContext';
import { SecurityProvider } from './contexts/SecurityContext';
import { ErrorBoundary } from './components/ErrorBoundary';
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
import Projects from './pages/Projects';
import Requests from './pages/Requests';
import Vendors from './pages/Vendors';
import Messages from './pages/Messages';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import { AdminSettings } from './pages/AdminSettings';
import { ManageSubscription } from './pages/ManageSubscription';
import { Support } from './pages/Support';
import BrowseRequests from './pages/BrowseRequests';
import { MyOffers } from './pages/MyOffers';
import { AdminDashboard } from './pages/admin/AdminDashboard';
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
import AdminCommunications from './pages/admin/AdminCommunications';
import AdminProfile from './pages/AdminProfile';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('client' | 'vendor' | 'admin')[];
}

// Component definitions that need auth context - will be defined inside AuthWrapper
let RoleProtectedRoute: React.FC<RoleProtectedRouteProps>;
let RootRedirect: React.FC;

// Wrapper component that provides auth context to route components
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Define components that need auth context here
  RoleProtectedRoute = ({ children, allowedRoles }) => {
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

  RootRedirect = () => {
    const { user, userProfile, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (user && userProfile) {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/landing" replace />;
  };

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <AuthWrapper>
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

      {/* Vendor-specific Routes */}
      <Route path="/browse-requests" element={
        <RoleProtectedRoute allowedRoles={['vendor', 'admin']}>
          <BrowseRequests />
        </RoleProtectedRoute>
      } />

      <Route path="/my-offers" element={
        <RoleProtectedRoute allowedRoles={['vendor', 'admin']}>
          <MyOffers />
        </RoleProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <RoleProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </RoleProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
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
        <Route path="communications" element={<AdminCommunications />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Main Navigation Routes - Accessible to all authenticated users */}
      <Route path="/dashboard" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <Dashboard />
        </RoleProtectedRoute>
      } />

      {/* Profile Route - Accessible to all authenticated users */}
      <Route path="/profile" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <Profile />
        </RoleProtectedRoute>
      } />

      <Route path="/projects" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <Projects />
        </RoleProtectedRoute>
      } />

      <Route path="/requests" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <Requests />
        </RoleProtectedRoute>
      } />

      <Route path="/vendors" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <Vendors />
        </RoleProtectedRoute>
      } />

      <Route path="/messages" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <Messages />
        </RoleProtectedRoute>
      } />

      <Route path="/orders" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <Orders />
        </RoleProtectedRoute>
      } />

      <Route path="/settings" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <Settings />
        </RoleProtectedRoute>
      } />

      <Route path="/manage-subscription" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <ManageSubscription />
        </RoleProtectedRoute>
      } />

      <Route path="/support" element={
        <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
          <Support />
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
    </AuthWrapper>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;

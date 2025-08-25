
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
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminOrders from './pages/admin/AdminOrders';
import Projects from './pages/Projects';
import Requests from './pages/Requests';
import Vendors from './pages/Vendors';
import Messages from './pages/Messages';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import { Support } from './pages/Support';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Component to handle root route redirect logic
const RootRedirect: React.FC = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is authenticated, redirect based on role
  if (user && userProfile) {
    switch (userProfile.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'vendor':
        return <Navigate to="/vendor/dashboard" replace />;
      case 'client':
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  // If not authenticated, redirect to landing page
  return <Navigate to="/landing" replace />;
};

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('client' | 'vendor' | 'admin')[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userProfile.role as 'client' | 'vendor' | 'admin')) {
    // Redirect to appropriate dashboard based on role
    switch (userProfile.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'vendor':
        return <Navigate to="/vendor/dashboard" replace />;
      case 'client':
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
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
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Client Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['client']}>
            <Dashboard />
          </RoleProtectedRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/projects" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          </RoleProtectedRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/requests" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
            <DashboardLayout>
              <Requests />
            </DashboardLayout>
          </RoleProtectedRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/suppliers" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['client', 'admin']}>
            <DashboardLayout>
              <Vendors />
            </DashboardLayout>
          </RoleProtectedRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/messages" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
            <DashboardLayout>
              <Messages />
            </DashboardLayout>
          </RoleProtectedRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          </RoleProtectedRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
            <DashboardLayout>
              <Orders />
            </DashboardLayout>
          </RoleProtectedRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </RoleProtectedRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </RoleProtectedRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/support" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
            <DashboardLayout>
              <Support />
            </DashboardLayout>
          </RoleProtectedRoute>
        </ProtectedRoute>
      } />

      {/* Vendor Routes */}
      <Route path="/vendor/dashboard" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['vendor']}>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </RoleProtectedRoute>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </RoleProtectedRoute>
        </ProtectedRoute>
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

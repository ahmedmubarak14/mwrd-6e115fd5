
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRequests from './pages/admin/AdminRequests';
import AdminOffers from './pages/admin/AdminOffers';
import AdminProjects from './pages/admin/AdminProjects';
import AdminFinancialTransactions from './pages/admin/FinancialTransactions';
import { AdminSupport } from './pages/admin/AdminSupport';
import { ExpertConsultations } from './pages/admin/ExpertConsultations';
import CategoryManagement from './pages/admin/CategoryManagement';
import AdminVerificationQueue from './pages/admin/AdminVerificationQueue';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import { AdminLayout } from './components/admin/AdminLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
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
    return <Navigate to="/auth" />;
  }

  if (!allowedRoles.includes(userProfile.role as 'client' | 'vendor' | 'admin')) {
    // Redirect to unauthorized page if role is not allowed
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
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

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/requests" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminRequests />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/offers" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminOffers />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminProjects />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/financial-transactions" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminFinancialTransactions />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/support" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminSupport />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/content/consultations" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <ExpertConsultations />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/category-management" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <CategoryManagement />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/verification" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminVerificationQueue />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminAnalytics />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/subscriptions" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminSubscriptions />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </RoleProtectedRoute>
            } />

            {/* Public Route for Dashboard (accessible to all authenticated users) */}
            <Route path="/dashboard" element={
              <RoleProtectedRoute allowedRoles={['client', 'vendor', 'admin']}>
                <Dashboard />
              </RoleProtectedRoute>
            } />

            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;

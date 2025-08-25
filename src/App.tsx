import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRequests from './pages/admin/AdminRequests';
import AdminOffers from './pages/admin/AdminOffers';
import AdminProjects from './pages/admin/AdminProjects';
import AdminFinancialTransactions from './pages/admin/FinancialTransactions';
import AdminSupport from './pages/admin/AdminSupport';
import ExpertConsultations from './pages/admin/ExpertConsultations';
import CategoryManagement from './pages/admin/CategoryManagement';
import VerificationQueue from './pages/admin/VerificationQueue';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import AdminLayout from './components/layout/AdminLayout';
import ClientLayout from './components/layout/ClientLayout';
import VendorLayout from './components/layout/VendorLayout';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { Role } from './types';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminOrders from './pages/admin/AdminOrders';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { userProfile, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while checking authentication
  }

  if (!userProfile) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userProfile.role as Role)) {
    // Redirect to unauthorized page if role is not allowed
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Client Routes */}
            <Route path="/client/*" element={
              <RoleProtectedRoute allowedRoles={['client']}>
                <ClientLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile" element={<ProfilePage />} />
                    {/* Add more client routes here */}
                  </Routes>
                </ClientLayout>
              </RoleProtectedRoute>
            } />

            {/* Vendor Routes */}
            <Route path="/vendor/*" element={
              <RoleProtectedRoute allowedRoles={['vendor']}>
                <VendorLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile" element={<ProfilePage />} />
                    {/* Add more vendor routes here */}
                  </Routes>
                </VendorLayout>
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
                  <VerificationQueue />
                </AdminLayout>
              </RoleProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AnalyticsDashboard />
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

            {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;

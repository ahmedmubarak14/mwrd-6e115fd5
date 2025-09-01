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
import { VendorLayout } from './components/vendor/VendorNestedLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import { CRManagementPage } from './pages/vendor/CRManagement';
import { ProjectsManagementPage } from './pages/vendor/ProjectsManagement';
import { PortfolioManagementPage } from './pages/vendor/PortfolioManagement';
import Profile from './pages/Profile';
import { Landing } from './pages/Landing';
import NotFound from './pages/NotFound';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRequests from './pages/admin/AdminRequests';
import AdminOffers from './pages/admin/AdminOffers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

import AdminPerformanceMonitor from './pages/admin/AdminPerformanceMonitor';
import AdminProjects from './pages/admin/AdminProjects';
import AdminOrders from './pages/admin/AdminOrders';
import AdminVerificationQueue from './pages/admin/AdminVerificationQueue';
import WorkflowAutomation from './pages/admin/WorkflowAutomation';
import AdminFinancialTransactions from './pages/admin/AdminFinancialTransactions';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminSupport from './pages/admin/AdminSupport';
import AdminCommunications from './pages/admin/AdminCommunications';
import AdminCategoryManagement from './pages/admin/CategoryManagement';
import { ExpertConsultations } from './pages/admin/ExpertConsultations';
import AdminSettings from './pages/AdminSettings';
import AdminProfile from './pages/AdminProfile';
import Requests from './pages/Requests';
import CreateSimpleRequest from './pages/CreateSimpleRequest';
import { SearchPage } from './components/search/SearchPage';
import { Analytics } from './pages/Analytics';
import BrowseRequests from './pages/BrowseRequests';
import CreateRFQ from './pages/CreateRFQ';
import CreateRequest from './pages/CreateRequest';
import CreateProject from './pages/CreateProject';
import { ManageSubscription } from './pages/ManageSubscription';
import Messages from './pages/Messages';
import MyOffers from './pages/MyOffers';
import Offers from './pages/Offers';
import Orders from './pages/Orders';
import Projects from './pages/Projects';
import RFQManagement from './pages/RFQManagement';
import Settings from './pages/Settings';
import Support from './pages/Support';
import VendorRFQs from './pages/VendorRFQs';
import Vendors from './pages/Vendors';

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
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="browse-requests" element={<BrowseRequests />} />
                      <Route path="create-rfq" element={<CreateRFQ />} />
                      <Route path="create-request" element={<CreateRequest />} />
                      <Route path="manage-subscription" element={<ManageSubscription />} />
                      <Route path="messages" element={<Messages />} />
                      <Route path="my-offers" element={<MyOffers />} />
                      <Route path="offers" element={<Offers />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="projects" element={<Projects />} />
                      <Route path="rfq-management" element={<RFQManagement />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="support" element={<Support />} />
                      <Route path="vendor-rfqs" element={<VendorRFQs />} />
                      <Route path="vendors" element={<Vendors />} />
                    </Route>
                    
                    {/* Legacy client routes (redirect to new structure) */}
                    <Route path="/requests" element={<Navigate to="/client/requests" replace />} />
                    <Route path="/requests/create" element={<Navigate to="/client/requests/create" replace />} />
                    <Route path="/profile" element={<Navigate to="/client/profile" replace />} />
                    <Route path="/search" element={<Navigate to="/client/search" replace />} />
                    <Route path="/analytics" element={<Navigate to="/client/analytics" replace />} />
                    <Route path="/browse-requests" element={<Navigate to="/client/browse-requests" replace />} />
                    <Route path="/create-rfq" element={<Navigate to="/client/create-rfq" replace />} />
                    <Route path="/create-request" element={<Navigate to="/client/create-request" replace />} />
                    <Route path="/manage-subscription" element={<Navigate to="/client/manage-subscription" replace />} />
                    <Route path="/messages" element={<Navigate to="/client/messages" replace />} />
                    <Route path="/my-offers" element={<Navigate to="/client/my-offers" replace />} />
                    <Route path="/offers" element={<Navigate to="/client/offers" replace />} />
                    <Route path="/orders" element={<Navigate to="/client/orders" replace />} />
                    <Route path="/projects" element={<Navigate to="/client/projects" replace />} />
                    <Route path="/rfq-management" element={<Navigate to="/client/rfq-management" replace />} />
                    <Route path="/settings" element={<Navigate to="/client/settings" replace />} />
                    <Route path="/support" element={<Navigate to="/client/support" replace />} />
                    <Route path="/vendor-rfqs" element={<Navigate to="/client/vendor-rfqs" replace />} />
                    <Route path="/vendors" element={<Navigate to="/client/vendors" replace />} />
                    
                    {/* Vendor routes with layout */}
                    <Route path="/vendor" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorLayout />
                      </RoleProtectedRoute>
                    }>
                      <Route index element={<Navigate to="/vendor/dashboard" replace />} />
                      <Route path="dashboard" element={<VendorDashboard />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="browse-requests" element={<BrowseRequests />} />
                      <Route path="offers" element={<Offers />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="projects" element={<Projects />} />
                      <Route path="projects/new" element={<CreateProject />} />
                      <Route path="portfolio" element={<PortfolioManagementPage />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="messages" element={<Messages />} />
                      <Route path="support" element={<Support />} />
                      <Route path="cr-management" element={<CRManagementPage />} />
                      <Route path="projects-management" element={<ProjectsManagementPage />} />
                      <Route path="portfolio-management" element={<PortfolioManagementPage />} />
                    </Route>
                    
                    {/* Legacy vendor dashboard route (redirect to new structure) */}
                    <Route path="/vendor-dashboard" element={<Navigate to="/vendor/dashboard" replace />} />
                    
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
                      <Route path="performance-monitor" element={<AdminPerformanceMonitor />} />
                      <Route path="projects" element={<AdminProjects />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="verification" element={<AdminVerificationQueue />} />
                      <Route path="automation" element={<WorkflowAutomation />} />
                      <Route path="financial-transactions" element={<AdminFinancialTransactions />} />
                      <Route path="subscriptions" element={<AdminSubscriptions />} />
                      <Route path="support" element={<AdminSupport />} />
                      <Route path="communications" element={<AdminCommunications />} />
                      <Route path="category-management" element={<AdminCategoryManagement />} />
                      <Route path="expert-consultations" element={<ExpertConsultations />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="profile" element={<AdminProfile />} />
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
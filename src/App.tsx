import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RouteAwareThemeProvider } from './contexts/RouteAwareThemeContext';
import { ProductionMonitoringProvider } from './components/ui/ProductionMonitoringProvider';
import { ProductionErrorBoundary } from './components/common/ProductionErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { GlobalErrorHandler } from '@/components/ui/GlobalErrorHandler';
import { MobileAppShell } from './components/mobile/MobileAppShell';
import { ClientLayout } from './components/layout/ClientLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import { VendorDashboard } from './pages/VendorDashboard';
import { VendorProducts } from './pages/vendor/VendorProducts';
import { CRManagementPage } from './pages/vendor/CRManagement';
import { ProjectsManagementPage } from './pages/vendor/ProjectsManagement';
import { PortfolioManagementPage } from './pages/vendor/PortfolioManagement';
import { VendorSubscription } from './pages/vendor/VendorSubscription';
import { VendorTransactions } from './pages/vendor/VendorTransactions';
import { VendorRFQs } from './pages/vendor/VendorRFQs';
import { VendorNotifications } from './pages/vendor/VendorNotifications';
import { VendorClients } from './pages/vendor/VendorClients';
import { VendorDocuments } from './pages/vendor/VendorDocuments';
import { VendorBusinessIntelligence } from './pages/vendor/VendorBusinessIntelligence';
import { VendorUnifiedProjects } from './pages/vendor/VendorUnifiedProjects';
import { VendorBrowseRequests } from './pages/vendor/VendorBrowseRequests';
import { VendorOffers } from './pages/vendor/VendorOffers';
import { VendorOrders } from './pages/vendor/VendorOrders';
import { VendorProfile } from './pages/vendor/VendorProfile';
import { VendorInvoices } from './pages/vendor/VendorInvoices';
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
import MainInfo from './pages/kyc/MainInfo';
import KYCForm from './pages/kyc/KYCForm';
import AdminKYCReviewPage from './pages/admin/AdminKYCReview';
import KYCStatus from './pages/client/KYCStatus';
import Requests from './pages/Requests';
import CreateSimpleRequest from './pages/CreateSimpleRequest';
import { SearchPage } from './components/search/SearchPage';
import { Analytics } from './pages/Analytics';
import BrowseRequests from './pages/BrowseRequests';
import CreateRFQ from './pages/CreateRFQ';
import CreateRequest from './pages/CreateRequest';
import CreateProject from './pages/CreateProject';
import { ManageSubscription } from './pages/ManageSubscription';
import { VendorMessages } from './pages/vendor/VendorMessages';
import { VendorSettings } from './pages/vendor/VendorSettings';
import { VendorProjects } from './pages/vendor/VendorProjects';
import { VendorSupport } from './pages/vendor/VendorSupport';
import Messages from './pages/Messages';
import MyOffers from './pages/MyOffers';
import Offers from './pages/Offers';
import Orders from './pages/Orders';
import Projects from './pages/Projects';
import RFQManagement from './pages/RFQManagement';
import RFQDetail from './pages/RFQDetail';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Vendors from './pages/Vendors';
import { ClientInvoices } from './pages/client/ClientInvoices';

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
    <ProductionErrorBoundary showDetails={process.env.NODE_ENV === 'development'} showHomeButton={true}>
      <GlobalErrorHandler />
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <RouteAwareThemeProvider>
              <ProductionMonitoringProvider>
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
                    <Route path="/auth" element={<AuthCallback />} />
                    
                    {/* KYC routes */}
                    <Route path="/kyc/main-info" element={
                      <RoleProtectedRoute allowedRoles={['client', 'vendor']}>
                        <MainInfo />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/kyc/form" element={
                      <RoleProtectedRoute allowedRoles={['client', 'vendor']}>
                        <KYCForm />
                      </RoleProtectedRoute>
                    } />
                    
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
                      <Route path="kyc-status" element={<KYCStatus />} />
                      <Route path="rfq-management" element={<RFQManagement />} />
                      <Route path="rfqs/:id" element={<RFQDetail />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="support" element={<Support />} />
                      <Route path="vendor-rfqs" element={<VendorRFQs />} />
                      <Route path="vendors" element={<Vendors />} />
                      <Route path="invoices" element={<ClientInvoices />} />
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
                    <Route path="/rfqs/:id" element={<Navigate to="/client/rfqs/:id" replace />} />
                    <Route path="/settings" element={<Navigate to="/client/settings" replace />} />
                    <Route path="/support" element={<Navigate to="/client/support" replace />} />
                    <Route path="/vendor-rfqs" element={<Navigate to="/client/vendor-rfqs" replace />} />
                    <Route path="/vendors" element={<Navigate to="/client/vendors" replace />} />
                    
                    {/* Vendor routes */}
                    <Route path="/vendor/dashboard" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorDashboard />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/business-intelligence" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorBusinessIntelligence />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/unified-projects" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorUnifiedProjects />
                      </RoleProtectedRoute>
                    } />
                    
                    {/* Legacy routes - redirect to new unified pages */}
                    <Route path="/vendor/analytics" element={<Navigate to="/vendor/business-intelligence" replace />} />
                    <Route path="/vendor/reports" element={<Navigate to="/vendor/business-intelligence" replace />} />
                    <Route path="/vendor/projects-management" element={<Navigate to="/vendor/unified-projects" replace />} />
                    <Route path="/vendor/portfolio-management" element={<Navigate to="/vendor/unified-projects" replace />} />
                    <Route path="/vendor/browse-requests" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorBrowseRequests />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/offers" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorOffers />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/orders" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorOrders />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/products" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorProducts />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/portfolio" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <PortfolioManagementPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/profile" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorProfile />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/settings" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorSettings />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/messages" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorMessages />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/support" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorSupport />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/cr-management" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <CRManagementPage />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/subscription" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorSubscription />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/transactions" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorTransactions />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/rfqs" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorRFQs />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/notifications" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorNotifications />
                      </RoleProtectedRoute>
                    } />
                    <Route path="/vendor/invoices" element={
                      <RoleProtectedRoute allowedRoles={['vendor']}>
                        <VendorInvoices />
                      </RoleProtectedRoute>
                    } />
                    
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
                      <Route path="kyc-review" element={<AdminKYCReviewPage />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="profile" element={<AdminProfile />} />
                    </Route>
                    
                    {/* Vendor index redirect */}
                    <Route path="/vendor" element={<Navigate to="/vendor/dashboard" replace />} />
                    
                    {/* Default and 404 routes */}
                    <Route path="/" element={<Navigate to="/landing" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                </MobileAppShell>
                <Toaster />
              </ProductionMonitoringProvider>
            </RouteAwareThemeProvider>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </ProductionErrorBoundary>
  );
}

export default App;
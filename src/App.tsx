
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { RouteAwareThemeProvider } from '@/contexts/RouteAwareThemeContext';
import { CallNotificationProvider } from '@/components/conversations/CallNotificationProvider';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { RoleProtectedRoute } from '@/components/routing/RoleProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Page imports using named imports
import { Landing } from '@/pages/Landing';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import { Analytics } from '@/pages/Analytics';
import { Support } from '@/pages/Support';
import Settings from '@/pages/Settings';
import { ManageSubscription } from '@/pages/ManageSubscription';
import Pricing from '@/pages/Pricing';
import { WhyStartWithMWRD } from '@/pages/WhyStartWithMWRD';
import { WhatMakesUsUnique } from '@/pages/WhatMakesUsUnique';
import { WhyMoveToMWRD } from '@/pages/WhyMoveToMWRD';
import { TermsAndConditions } from '@/pages/TermsAndConditions';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { ExpertConsultation } from '@/pages/ExpertConsultation';
import Requests from '@/pages/Requests';
import CreateRequest from '@/pages/CreateRequest';
import BrowseRequests from '@/pages/BrowseRequests';
import MyOffers from '@/pages/MyOffers';
import Offers from '@/pages/Offers';
import Orders from '@/pages/Orders';
import Projects from '@/pages/Projects';
import CreateProject from '@/pages/CreateProject';
import ProjectDetails from '@/pages/ProjectDetails';
import EditProject from '@/pages/EditProject';
import { RequestsApproval } from '@/pages/admin/RequestsApproval';
import { OffersManagement } from '@/pages/admin/OffersManagement';
import Vendors from '@/pages/Vendors';
import { ExpertConsultations } from '@/pages/admin/ExpertConsultations';
import EnhancedMessages from '@/pages/EnhancedMessages';
import NotFound from '@/pages/NotFound';
import PaymentSuccess from '@/pages/PaymentSuccess';

// Admin imports
import { AdminDashboard } from '@/pages/AdminDashboard';
import AdminDashboardPage from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminRequests from '@/pages/admin/AdminRequests';
import AdminOffers from '@/pages/admin/AdminOffers';
import AdminProjects from '@/pages/admin/AdminProjects';
import CategoryManagement from '@/pages/admin/CategoryManagement';
import FinancialTransactions from '@/pages/admin/FinancialTransactions';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const RootLayout = () => {
  return (
    <RouteAwareThemeProvider>
      <CallNotificationProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/index" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/why-start-with-mwrd" element={<WhyStartWithMWRD />} />
          <Route path="/what-makes-us-unique" element={<WhatMakesUsUnique />} />
          <Route path="/why-move-to-mwrd" element={<WhyMoveToMWRD />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/support" element={<Support />} />

          {/* Auth routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/manage-subscription" element={<ProtectedRoute><ManageSubscription /></ProtectedRoute>} />
          <Route path="/expert-consultation" element={<ProtectedRoute><ExpertConsultation /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="/create-request" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
          <Route path="/browse-requests" element={<ProtectedRoute><BrowseRequests /></ProtectedRoute>} />
          <Route path="/my-offers" element={<ProtectedRoute><MyOffers /></ProtectedRoute>} />
          <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
          <Route path="/edit-project/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
          <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
          <Route path="/enhanced-messages" element={<ProtectedRoute><EnhancedMessages /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<RoleProtectedRoute allowed={['admin']}><AdminDashboard /></RoleProtectedRoute>} />
          <Route path="/admin/dashboard" element={<RoleProtectedRoute allowed={['admin']}><AdminDashboardPage /></RoleProtectedRoute>} />
          <Route path="/admin/users" element={<RoleProtectedRoute allowed={['admin']}><AdminUsers /></RoleProtectedRoute>} />
          <Route path="/admin/requests" element={<RoleProtectedRoute allowed={['admin']}><AdminRequests /></RoleProtectedRoute>} />
          <Route path="/admin/offers" element={<RoleProtectedRoute allowed={['admin']}><AdminOffers /></RoleProtectedRoute>} />
          <Route path="/admin/projects" element={<RoleProtectedRoute allowed={['admin']}><AdminProjects /></RoleProtectedRoute>} />
          <Route path="/admin/categories" element={<RoleProtectedRoute allowed={['admin']}><CategoryManagement /></RoleProtectedRoute>} />
          <Route path="/admin/requests-approval" element={<RoleProtectedRoute allowed={['admin']}><RequestsApproval /></RoleProtectedRoute>} />
          <Route path="/admin/offers-management" element={<RoleProtectedRoute allowed={['admin']}><OffersManagement /></RoleProtectedRoute>} />
          <Route path="/admin/expert-consultations" element={<RoleProtectedRoute allowed={['admin']}><ExpertConsultations /></RoleProtectedRoute>} />
          <Route path="/admin/financial-transactions" element={<RoleProtectedRoute allowed={['admin']}><FinancialTransactions /></RoleProtectedRoute>} />

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CallNotificationProvider>
    </RouteAwareThemeProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <RootLayout />
              <Toaster />
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { RouteAwareThemeProvider } from '@/components/RouteAwareThemeProvider';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Requests from '@/pages/Requests';
import CreateRequest from '@/pages/CreateRequest';
import BrowseRequests from '@/pages/BrowseRequests';
import Offers from '@/pages/Offers';
import MyOffers from '@/pages/MyOffers';
import EnhancedMessages from '@/pages/EnhancedMessages';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import { Landing } from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Vendors from '@/pages/Vendors';
import Projects from '@/pages/Projects';
import CreateProject from '@/pages/CreateProject';
import EditProject from '@/pages/EditProject';
import ProjectDetails from '@/pages/ProjectDetails';
import NotFound from '@/pages/NotFound';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { Analytics } from '@/pages/Analytics';
import Orders from '@/pages/Orders';
import { Support } from '@/pages/Support';
import ActivityFeed from '@/pages/ActivityFeed';
import PaymentSuccess from '@/pages/PaymentSuccess';
import { ManageSubscription } from '@/pages/ManageSubscription';
import Pricing from '@/pages/Pricing';
import { WhyStartWithMWRD } from '@/pages/WhyStartWithMWRD';
import { WhatMakesUsUnique } from '@/pages/WhatMakesUsUnique';
import { WhyMoveToMWRD } from '@/pages/WhyMoveToMWRD';
import { TermsAndConditions } from '@/pages/TermsAndConditions';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { ExpertConsultation } from '@/pages/ExpertConsultation';
import ProcurementRequests from '@/pages/ProcurementRequests';
import CreateProcurementRequest from '@/pages/CreateProcurementRequest';

// Admin pages
import AdminDashboardOverview from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminRequests from '@/pages/admin/AdminRequests';
import AdminOffers from '@/pages/admin/AdminOffers';
import AdminProjects from '@/pages/admin/AdminProjects';
import { RequestsApproval } from '@/pages/admin/RequestsApproval';
import { OffersManagement } from '@/pages/admin/OffersManagement';
import CategoryManagement from '@/pages/admin/CategoryManagement';
import { ExpertConsultations } from '@/pages/admin/ExpertConsultations';
import FinancialTransactions from '@/pages/admin/FinancialTransactions';

// Components
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { RoleProtectedRoute } from '@/components/routing/RoleProtectedRoute';
import { AuthRedirect } from '@/components/routing/AuthRedirect';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Create a wrapper component that includes the RouteAwareThemeProvider
const AppContent = () => {
  return (
    <RouteAwareThemeProvider>
      <TooltipProvider>
        <div className="App">
          <AuthRedirect />
          <RouterProvider router={router} />
          <Toaster />
        </div>
      </TooltipProvider>
    </RouteAwareThemeProvider>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/landing',
    element: <Landing />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/requests',
    element: (
      <ProtectedRoute>
        <Requests />
      </ProtectedRoute>
    ),
  },
  {
    path: '/requests/create',
    element: (
      <ProtectedRoute>
        <CreateRequest />
      </ProtectedRoute>
    ),
  },
  {
    path: '/browse-requests',
    element: <BrowseRequests />,
  },
  {
    path: '/offers',
    element: (
      <ProtectedRoute>
        <Offers />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-offers',
    element: (
      <ProtectedRoute>
        <MyOffers />
      </ProtectedRoute>
    ),
  },
  {
    path: '/enhanced-messages',
    element: (
      <ProtectedRoute>
        <EnhancedMessages />
      </ProtectedRoute>
    ),
  },
  {
    path: '/messages',
    element: (
      <ProtectedRoute>
        <EnhancedMessages />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendors',
    element: <Vendors />,
  },
  {
    path: '/projects',
    element: (
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/create',
    element: (
      <ProtectedRoute>
        <CreateProject />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/:id/edit',
    element: (
      <ProtectedRoute>
        <EditProject />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/:id',
    element: (
      <ProtectedRoute>
        <ProjectDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders',
    element: (
      <ProtectedRoute>
        <Orders />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/support',
    element: (
      <ProtectedRoute>
        <Support />
      </ProtectedRoute>
    ),
  },
  {
    path: '/activity-feed',
    element: (
      <ProtectedRoute>
        <ActivityFeed />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment-success',
    element: (
      <ProtectedRoute>
        <PaymentSuccess />
      </ProtectedRoute>
    ),
  },
  {
    path: '/manage-subscription',
    element: (
      <ProtectedRoute>
        <ManageSubscription />
      </ProtectedRoute>
    ),
  },
  {
    path: '/procurement-requests',
    element: (
      <ProtectedRoute>
        <ProcurementRequests />
      </ProtectedRoute>
    ),
  },
  {
    path: '/procurement-requests/create',
    element: (
      <ProtectedRoute>
        <CreateProcurementRequest />
      </ProtectedRoute>
    ),
  },
  {
    path: '/expert-consultation',
    element: (
      <ProtectedRoute>
        <ExpertConsultation />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/why-start-with-mwrd',
    element: <WhyStartWithMWRD />,
  },
  {
    path: '/what-makes-us-unique',
    element: <WhatMakesUsUnique />,
  },
  {
    path: '/why-move-to-mwrd',
    element: <WhyMoveToMWRD />,
  },
  {
    path: '/terms-and-conditions',
    element: <TermsAndConditions />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  // Admin routes
  {
    path: '/admin',
    element: (
      <RoleProtectedRoute allowed={['admin']}>
        <AdminDashboardOverview />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <RoleProtectedRoute allowed={['admin']}>
        <AdminUsers />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/admin/requests',
    element: (
      <RoleProtectedRoute allowed={['admin']}>
        <AdminRequests />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/admin/offers',
    element: (
      <RoleProtectedRoute allowed={['admin']}>
        <AdminOffers />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/admin/projects',
    element: (
      <RoleProtectedRoute allowed={['admin']}>
        <AdminProjects />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/admin/analytics',
    element: (
      <RoleProtectedRoute allowed={['admin']}>
        <Analytics />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/admin/requests-approval',
    element: (
      <RoleProtectedRoute allowed={['admin']}>
        <RequestsApproval />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/admin/offers-management',
    element: (
      <RoleProtectedRoute allowed={['admin']}>
        <OffersManagement />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/admin/category-management',
    element: (
      <RoleProtectedRoute allowed={['admin']}>
        <CategoryManagement />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/admin/expert-consultations',
    element: (
      <RoleProtectedRoute allowed={['admin']}>
        <ExpertConsultations />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '/admin/financial-transactions',
    element: (
      <RoleProtectedRoute allowed={['admin']}>
        <FinancialTransactions />
      </RoleProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RouteAwareThemeProvider } from "@/contexts/RouteAwareThemeContext";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import Index from "@/pages/Index";
import { Landing } from "@/pages/Landing";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import { SupplierDashboard } from "@/pages/SupplierDashboard";
import { BrowseRequests } from "@/pages/BrowseRequests";
import { MyOffers } from "@/pages/MyOffers";
import Requests from "@/pages/Requests";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import Suppliers from "@/pages/Suppliers";
import Vendors from "@/pages/Vendors";
import Projects from "@/pages/Projects";
import { Orders } from "@/pages/Orders";
import { Analytics } from "@/pages/Analytics";
import { Support } from "@/pages/Support";
import EnhancedMessages from "@/pages/EnhancedMessages";
import ProcurementRequests from "@/pages/ProcurementRequests";
import { ProcurementSupplierDashboard } from "@/pages/ProcurementSupplierDashboard";
import { ExpertConsultation } from "@/pages/ExpertConsultation";
import { Pricing } from "@/pages/Pricing";
import PaymentSuccess from "@/pages/PaymentSuccess";
import { ManageSubscription } from "@/pages/ManageSubscription";
import { WhyStartWithMWRD } from "@/pages/WhyStartWithMWRD";
import { WhyMoveToMWRD } from "@/pages/WhyMoveToMWRD";
import { WhatMakesUsUnique } from "@/pages/WhatMakesUsUnique";
import { TermsAndConditions } from "@/pages/TermsAndConditions";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/routing/RoleProtectedRoute";
import { AuthRedirect } from "@/components/routing/AuthRedirect";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import CategoryManagement from "@/pages/admin/CategoryManagement";
import { RequestsApproval } from "@/pages/admin/RequestsApproval";
import { OffersManagement } from "@/pages/admin/OffersManagement";
import FinancialTransactions from "@/pages/admin/FinancialTransactions";
import { ExpertConsultations } from "@/pages/admin/ExpertConsultations";
import { AdminDashboardOverview } from "@/pages/admin/AdminDashboardOverview";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RouteAwareThemeProvider>
            <AuthProvider>
              <LanguageProvider>
                <TooltipProvider>
                  <SmoothScroll />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/landing" element={<Landing />} />
                    
                    <Route path="/auth" element={
                      <AuthRedirect>
                        <Auth />
                      </AuthRedirect>
                    } />
                    
                    <Route path="/reset-password" element={<ResetPassword />} />
                    
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/supplier-dashboard" element={
                      <ProtectedRoute>
                        <RoleProtectedRoute allowed={['vendor']}>
                          <SupplierDashboard />
                        </RoleProtectedRoute>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/browse-requests" element={
                      <ProtectedRoute>
                        <BrowseRequests />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/my-offers" element={
                      <ProtectedRoute>
                        <MyOffers />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/requests" element={
                      <ProtectedRoute>
                        <Requests />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/suppliers" element={
                      <ProtectedRoute>
                        <Suppliers />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/vendors" element={
                      <ProtectedRoute>
                        <Vendors />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/projects" element={
                      <ProtectedRoute>
                        <Projects />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/analytics" element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/support" element={
                      <ProtectedRoute>
                        <Support />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/messages" element={
                      <ProtectedRoute>
                        <EnhancedMessages />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/procurement-requests" element={
                      <ProtectedRoute>
                        <ProcurementRequests />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/procurement-supplier-dashboard" element={
                      <ProtectedRoute>
                        <RoleProtectedRoute allowed={['vendor']}>
                          <ProcurementSupplierDashboard />
                        </RoleProtectedRoute>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/expert-consultation" element={
                      <ProtectedRoute>
                        <ExpertConsultation />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/payment-success" element={
                      <ProtectedRoute>
                        <PaymentSuccess />
                      </ProtectedRoute>
                    } />
                    <Route path="/manage-subscription" element={
                      <ProtectedRoute>
                        <ManageSubscription />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/why-start-with-mwrd" element={<WhyStartWithMWRD />} />
                    <Route path="/why-move-to-mwrd" element={<WhyMoveToMWRD />} />
                    <Route path="/what-makes-us-unique" element={<WhatMakesUsUnique />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <RoleProtectedRoute allowed={['admin']}>
                          <AdminDashboard />
                        </RoleProtectedRoute>
                      </ProtectedRoute>
                    }>
                      <Route index element={<AdminDashboardOverview />} />
                      <Route path="overview" element={<AdminDashboardOverview />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="categories" element={<CategoryManagement />} />
                      <Route path="content/requests" element={<RequestsApproval />} />
                      <Route path="content/offers" element={<OffersManagement />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="finance" element={<FinancialTransactions />} />
                      <Route path="expert-consultations" element={<ExpertConsultations />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </LanguageProvider>
            </AuthProvider>
          </RouteAwareThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RouteAwareThemeProvider } from "@/contexts/RouteAwareThemeContext";
import { Landing } from "./pages/Landing";
import Projects from "./pages/Projects";

import { Dashboard } from "./pages/Dashboard";
import { WhyStartWithMWRD } from "./pages/WhyStartWithMWRD";
import { WhatMakesUsUnique } from "./pages/WhatMakesUsUnique";
import { WhyMoveToMWRD } from "./pages/WhyMoveToMWRD";
import { Requests } from "./pages/Requests";
import { Suppliers } from "./pages/Suppliers";
import { Pricing } from "./pages/Pricing";
import { Profile } from "./pages/Profile";
import { ExpertConsultation } from "./pages/ExpertConsultation";
import { ManageSubscription } from "./pages/ManageSubscription";
import { BrowseRequests } from "./pages/BrowseRequests";
import { MyOffers } from "./pages/MyOffers";
import { Settings } from "./pages/Settings";
import { Analytics } from "./pages/Analytics";
import { Orders } from "./pages/Orders";
import { Support } from "./pages/Support";
import PaymentSuccess from "./pages/PaymentSuccess";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { SupplierDashboard } from "./pages/SupplierDashboard";
import EnhancedMessages from "./pages/EnhancedMessages";

// Admin Layout and Pages
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboardOverview } from "@/pages/admin/AdminDashboardOverview";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdvancedUserManagement } from "@/components/admin/AdvancedUserManagement";
import { FinancialDashboard } from "@/components/admin/FinancialDashboard";
import { SubscriptionManagement } from "@/components/admin/SubscriptionManagement";
import { PlatformAnalytics } from "@/components/admin/PlatformAnalytics";
import { RequestsApproval } from "@/pages/admin/RequestsApproval";
import { OffersManagement } from "@/pages/admin/OffersManagement";
import { ExpertConsultations } from "@/pages/admin/ExpertConsultations";
import FinancialTransactions from "@/pages/admin/FinancialTransactions";
import { MobileBottomTabs } from "@/components/navigation/MobileBottomTabs";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/routing/RoleProtectedRoute";
import { AuthRedirect } from "@/components/routing/AuthRedirect";
import { CallNotificationProvider } from "@/components/conversations/CallNotificationProvider";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <CallNotificationProvider>
          <TooltipProvider>
            <BrowserRouter>
              <RouteAwareThemeProvider>
            <Routes>
              <Route path="/" element={
                <>
                  <AuthRedirect />
                  <Landing />
                </>
              } />
              <Route path="/landing" element={<Landing />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/why-start-with-mwrd" element={<WhyStartWithMWRD />} />
          <Route path="/what-makes-us-unique" element={<WhatMakesUsUnique />} />
          <Route path="/why-move-to-mwrd" element={<WhyMoveToMWRD />} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/manage-subscription" element={<ProtectedRoute><ManageSubscription /></ProtectedRoute>} />
              <Route path="/expert-consultation" element={<ExpertConsultation />} />
              <Route path="/browse-requests" element={<BrowseRequests />} />
              <Route path="/my-offers" element={<ProtectedRoute><MyOffers /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><EnhancedMessages /></ProtectedRoute>} />
              <Route path="/support" element={<Support />} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/client-dashboard" element={<RoleProtectedRoute allowed={['client']}><Index /></RoleProtectedRoute>} />
              <Route path="/supplier-dashboard" element={<RoleProtectedRoute allowed={['supplier']}><SupplierDashboard /></RoleProtectedRoute>} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* Admin Routes with dedicated layout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/advanced" element={<AdvancedUserManagement />} />
                <Route path="financial" element={<FinancialDashboard />} />
                <Route path="financial/transactions" element={<FinancialTransactions />} />
                <Route path="financial/subscriptions" element={<SubscriptionManagement />} />
                <Route path="analytics" element={<PlatformAnalytics />} />
                <Route path="content/requests" element={<RequestsApproval />} />
                <Route path="content/offers" element={<OffersManagement />} />
                <Route path="content/consultations" element={<ExpertConsultations />} />
                <Route path="settings" element={<div>Admin Settings Page</div>} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
                </Routes>
                <MobileBottomTabs />
                <Toaster />
                <Sonner />
              </RouteAwareThemeProvider>
            </BrowserRouter>
          </TooltipProvider>
        </CallNotificationProvider>
      </AuthProvider>
     </LanguageProvider>
  </QueryClientProvider>
);

export default App;

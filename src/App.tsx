
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteAwareThemeProvider } from "./components/RouteAwareThemeProvider";
// Fix the import statements - use default imports instead of named imports
import Profile from "./pages/Profile";
import Index from "./pages/Index";
import { Landing } from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
// Fix the import statement for AdminUsers
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AdminDashboardOverview } from "./pages/admin/AdminDashboardOverview";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminOffers from "./pages/admin/AdminOffers";
import AdminProjects from "./pages/admin/AdminProjects";
import CategoryManagement from "./pages/admin/CategoryManagement";
import { OffersManagement } from "./pages/admin/OffersManagement";
import { RequestsApproval } from "./pages/admin/RequestsApproval";
import FinancialTransactions from "./pages/admin/FinancialTransactions";
import { ExpertConsultations } from "./pages/admin/ExpertConsultations";
import { Settings } from "./pages/Settings";
import Requests from "./pages/Requests";
import CreateRequest from "./pages/CreateRequest";
import CreateProcurementRequest from "./pages/CreateProcurementRequest";
import { BrowseRequests } from "./pages/BrowseRequests";
import ProcurementRequests from "./pages/ProcurementRequests";
import Offers from "./pages/Offers";
import { MyOffers } from "./pages/MyOffers";
import Messages from "./pages/Messages";
import EnhancedMessages from "./pages/EnhancedMessages";
import { Orders } from "./pages/Orders";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import ProjectDetails from "./pages/ProjectDetails";
import Suppliers from "./pages/Suppliers";
import Vendors from "./pages/Vendors";
import { SupplierDashboard } from "./pages/SupplierDashboard";
import { ProcurementSupplierDashboard } from "./pages/ProcurementSupplierDashboard";
import { Analytics } from "./pages/Analytics";
import ActivityFeed from "./pages/ActivityFeed";
import { ExpertConsultation } from "./pages/ExpertConsultation";
import { Support } from "./pages/Support";
import { Pricing } from "./pages/Pricing";
import { ManageSubscription } from "./pages/ManageSubscription";
import PaymentSuccess from "./pages/PaymentSuccess";
import { WhyStartWithMWRD } from "./pages/WhyStartWithMWRD";
import { WhatMakesUsUnique } from "./pages/WhatMakesUsUnique";
import { WhyMoveToMWRD } from "./pages/WhyMoveToMWRD";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <RouteAwareThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <PublicRoute>
                        <Index />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/landing"
                    element={
                      <PublicRoute>
                        <Landing />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/auth"
                    element={
                      <PublicRoute>
                        <Auth />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/why-start-with-mwrd"
                    element={
                      <PublicRoute>
                        <WhyStartWithMWRD />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/what-makes-us-unique"
                    element={
                      <PublicRoute>
                        <WhatMakesUsUnique />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/why-move-to-mwrd"
                    element={
                      <PublicRoute>
                        <WhyMoveToMWRD />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <PublicRoute>
                        <TermsAndConditions />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/privacy"
                    element={
                      <PublicRoute>
                        <PrivacyPolicy />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/pricing"
                    element={
                      <PublicRoute>
                        <Pricing />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/requests"
                    element={
                      <ProtectedRoute>
                        <Requests />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/requests/create"
                    element={
                      <ProtectedRoute>
                        <CreateRequest />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/procurement-requests/create"
                    element={
                      <ProtectedRoute>
                        <CreateProcurementRequest />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/procurement-requests"
                    element={
                      <ProtectedRoute>
                        <ProcurementRequests />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/browse-requests"
                    element={
                      <ProtectedRoute>
                        <BrowseRequests />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/offers"
                    element={
                      <ProtectedRoute>
                        <Offers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-offers"
                    element={
                      <ProtectedRoute>
                        <MyOffers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/enhanced-messages"
                    element={
                      <ProtectedRoute>
                        <EnhancedMessages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <ProtectedRoute>
                        <Projects />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/projects/create"
                    element={
                      <ProtectedRoute>
                        <CreateProject />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/projects/:id/edit"
                    element={
                      <ProtectedRoute>
                        <EditProject />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/projects/:id"
                    element={
                      <ProtectedRoute>
                        <ProjectDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/suppliers"
                    element={
                      <ProtectedRoute>
                        <Suppliers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/vendors"
                    element={
                      <ProtectedRoute>
                        <Vendors />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/supplier-dashboard"
                    element={
                      <ProtectedRoute>
                        <SupplierDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/procurement-supplier-dashboard"
                    element={
                      <ProtectedRoute>
                        <ProcurementSupplierDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/activity-feed"
                    element={
                      <ProtectedRoute>
                        <ActivityFeed />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/expert-consultation"
                    element={
                      <ProtectedRoute>
                        <ExpertConsultation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/support"
                    element={
                      <ProtectedRoute>
                        <Support />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/manage-subscription"
                    element={
                      <ProtectedRoute>
                        <ManageSubscription />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/payment-success"
                    element={
                      <ProtectedRoute>
                        <PaymentSuccess />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboardOverview />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/requests"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminRequests />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/offers"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminOffers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/projects"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminProjects />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <CategoryManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/offers-management"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <OffersManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/requests-approval"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <RequestsApproval />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/financial-transactions"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <FinancialTransactions />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/expert-consultations"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <ExpertConsultations />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </RouteAwareThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

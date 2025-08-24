import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RouteAwareThemeProvider } from "@/contexts/RouteAwareThemeContext";
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import RoleProtectedRoute from "@/components/routing/RoleProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import { Dashboard } from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Pricing from "@/pages/Pricing";
import ManageSubscription from "@/pages/ManageSubscription";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Vendors from "@/pages/Vendors";
import SupplierDashboard from "@/pages/SupplierDashboard";
import ProcurementRequests from "@/pages/ProcurementRequests";
import BrowseRequests from "@/pages/BrowseRequests";
import MyOffers from "@/pages/MyOffers";
import Orders from "@/pages/Orders";
import EnhancedMessages from "@/pages/EnhancedMessages";
import Analytics from "@/pages/Analytics";
import Projects from "@/pages/Projects";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import { RequestsApproval } from "@/pages/admin/RequestsApproval";
import { OffersManagement } from "@/pages/admin/OffersManagement";
import FinancialTransactions from "@/pages/admin/FinancialTransactions";
import { ExpertConsultations } from "@/pages/admin/ExpertConsultations";
import ExpertConsultation from "@/pages/ExpertConsultation";
import Support from "@/pages/Support";
import TermsAndConditions from "@/pages/TermsAndConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import WhatMakesUsUnique from "@/pages/WhatMakesUsUnique";
import WhyStartWithMWRD from "@/pages/WhyStartWithMWRD";
import WhyMoveToMWRD from "@/pages/WhyMoveToMWRD";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import AdminCategoryManagement from "@/pages/admin/CategoryManagement";

const queryClient = new QueryClient();

function QueryClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <BrowserRouter>
        <RouteAwareThemeProvider>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <QueryClientWrapper>
                  <TooltipProvider>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/manage-subscription" element={<ProtectedRoute><ManageSubscription /></ProtectedRoute>} />
                      <Route path="/payment-success" element={<PaymentSuccess />} />
                      
                      {/* Vendor routes (new terminology) */}
                      <Route path="/vendors" element={<Vendors />} />
                      <Route path="/vendor-dashboard" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['vendor']}><SupplierDashboard /></RoleProtectedRoute></ProtectedRoute>} />
                      
                      {/* Legacy supplier routes - redirect to vendor routes */}
                      <Route path="/suppliers" element={<Navigate to="/vendors" replace />} />
                      <Route path="/supplier-dashboard" element={<Navigate to="/vendor-dashboard" replace />} />
                      
                      {/* Procurement routes (updated terminology) */}
                      <Route path="/procurement-requests" element={<ProtectedRoute><ProcurementRequests /></ProtectedRoute>} />
                      <Route path="/requests" element={<Navigate to="/procurement-requests" replace />} />
                      
                      <Route path="/browse-requests" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['vendor']}><BrowseRequests /></RoleProtectedRoute></ProtectedRoute>} />
                      <Route path="/my-offers" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['vendor']}><MyOffers /></RoleProtectedRoute></ProtectedRoute>} />
                      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                      <Route path="/messages" element={<ProtectedRoute><EnhancedMessages /></ProtectedRoute>} />
                      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                      
                      {/* Admin routes */}
                      <Route path="/admin" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['admin']}><AdminDashboard /></RoleProtectedRoute></ProtectedRoute>} />
                      <Route path="/admin/users" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['admin']}><AdminUsers /></RoleProtectedRoute></ProtectedRoute>} />
                      <Route path="/admin/requests-approval" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['admin']}><RequestsApproval /></RoleProtectedRoute></ProtectedRoute>} />
                      <Route path="/admin/offers-management" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['admin']}><OffersManagement /></RoleProtectedRoute></ProtectedRoute>} />
                      <Route path="/admin/financial-transactions" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['admin']}><FinancialTransactions /></RoleProtectedRoute></ProtectedRoute>} />
                      <Route path="/admin/expert-consultations" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['admin']}><ExpertConsultations /></RoleProtectedRoute></ProtectedRoute>} />
                      <Route path="/admin/categories" element={<ProtectedRoute><RoleProtectedRoute allowedRoles={['admin']}><AdminCategoryManagement /></RoleProtectedRoute></ProtectedRoute>} />
                      
                      {/* Other routes */}
                      <Route path="/expert-consultation" element={<ExpertConsultation />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/terms" element={<TermsAndConditions />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/what-makes-us-unique" element={<WhatMakesUsUnique />} />
                      <Route path="/why-start-with-mwrd" element={<WhyStartWithMWRD />} />
                      <Route path="/why-move-to-mwrd" element={<WhyMoveToMWRD />} />
                      <Route path="/landing" element={<Landing />} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                    <Sonner />
                  </TooltipProvider>
                </QueryClientWrapper>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </RouteAwareThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

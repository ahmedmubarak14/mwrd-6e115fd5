
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RouteAwareThemeProvider } from "@/contexts/RouteAwareThemeContext";
import { CallNotificationProvider } from "@/components/conversations/CallNotificationProvider";
import { PushNotificationManager } from "@/components/notifications/PushNotificationManager";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/routing/RoleProtectedRoute";
import { AuthRedirect } from "@/components/routing/AuthRedirect";
import Index from "./pages/Index";
import { Landing } from "./pages/Landing";
import Auth from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ProcurementSupplierDashboard } from "./pages/ProcurementSupplierDashboard";
import { Requests } from "./pages/Requests";
import { Suppliers } from "./pages/Suppliers";
import { MyOffers } from "./pages/MyOffers";
import { BrowseRequests } from "./pages/BrowseRequests";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Analytics } from "./pages/Analytics";
import Projects from "./pages/Projects";
import { ExpertConsultation } from "./pages/ExpertConsultation";
import ProcurementRequests from "./pages/ProcurementRequests";
import { Orders } from "./pages/Orders";
import Vendors from "./pages/Vendors";
import EnhancedMessages from "./pages/EnhancedMessages";
import { Pricing } from "./pages/Pricing";
import { ManageSubscription } from "./pages/ManageSubscription";
import PaymentSuccess from "./pages/PaymentSuccess";
import Support from "./pages/Support";
import { WhatMakesUsUnique } from "./pages/WhatMakesUsUnique";
import { WhyMoveToMWRD } from "./pages/WhyMoveToMWRD";
import { WhyStartWithMWRD } from "./pages/WhyStartWithMWRD";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <RouteAwareThemeProvider>
            <AuthProvider>
              <CallNotificationProvider>
                <TooltipProvider>
                  <Toaster />
                  <PushNotificationManager />
                  <BrowserRouter>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/landing" element={<Landing />} />
                      <Route path="/auth" element={<AuthRedirect><Auth /></AuthRedirect>} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/what-makes-us-unique" element={<WhatMakesUsUnique />} />
                      <Route path="/why-move-to-mwrd" element={<WhyMoveToMWRD />} />
                      <Route path="/why-start-with-mwrd" element={<WhyStartWithMWRD />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      
                      {/* Client Routes */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
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
                        path="/procurement-requests"
                        element={
                          <ProtectedRoute>
                            <ProcurementRequests />
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
                        path="/offers"
                        element={
                          <ProtectedRoute>
                            <MyOffers />
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
                        path="/messages"
                        element={
                          <ProtectedRoute>
                            <EnhancedMessages />
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
                        path="/consultation"
                        element={
                          <ProtectedRoute>
                            <ExpertConsultation />
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

                      {/* Supplier Dashboard */}
                      <Route
                        path="/supplier-dashboard"
                        element={
                          <RoleProtectedRoute allowed={['vendor']}>
                            <ProcurementSupplierDashboard />
                          </RoleProtectedRoute>
                        }
                      />

                      {/* Admin Routes */}
                      <Route
                        path="/admin"
                        element={
                          <RoleProtectedRoute allowed={['admin']}>
                            <AdminDashboard />
                          </RoleProtectedRoute>
                        }
                      />

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </CallNotificationProvider>
            </AuthProvider>
          </RouteAwareThemeProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

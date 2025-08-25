import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RouteAwareThemeProvider } from "./contexts/RouteAwareThemeContext";
import { SecurityProvider } from "./contexts/SecurityContext";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { RoleProtectedRoute } from "./components/routing/RoleProtectedRoute";
import { AuthRedirect } from "./components/routing/AuthRedirect";
import { PublicRoute } from "./components/PublicRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingFallback } from "./components/LoadingFallback";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VendorDashboard = lazy(() => import("./pages/VendorDashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const BrowseRequests = lazy(() => import("./pages/BrowseRequests"));
const CreateRequest = lazy(() => import("./pages/CreateRequest"));
const MyRequests = lazy(() => import("./pages/MyRequests"));
const MyOffers = lazy(() => import("./pages/MyOffers"));
const Messages = lazy(() => import("./pages/Messages"));
const Settings = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SecurityProvider>
          <BrowserRouter>
            <RouteAwareThemeProvider>
              <LanguageProvider>
                <AuthProvider>
                  <TooltipProvider>
                    <div className="min-h-screen bg-background font-sans antialiased">
                      <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<Index />} />
                          <Route path="/landing" element={<Landing />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/privacy" element={<Privacy />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/help" element={<Help />} />
                          
                          {/* Auth Routes */}
                          <Route path="/auth" element={
                            <PublicRoute>
                              <Auth />
                            </PublicRoute>
                          } />
                          
                          {/* Protected Routes */}
                          <Route path="/dashboard" element={
                            <ProtectedRoute>
                              <RoleProtectedRoute allowed={['client']}>
                                <Dashboard />
                              </RoleProtectedRoute>
                            </ProtectedRoute>
                          } />
                          
                          <Route path="/vendor/dashboard" element={
                            <ProtectedRoute>
                              <RoleProtectedRoute allowed={['vendor']}>
                                <VendorDashboard />
                              </RoleProtectedRoute>
                            </ProtectedRoute>
                          } />
                          
                          {/* Admin Routes */}
                          <Route path="/admin/dashboard" element={
                            <ProtectedRoute>
                              <RoleProtectedRoute allowed={['admin']}>
                                <AdminDashboard />
                              </RoleProtectedRoute>
                            </ProtectedRoute>
                          } />

                          {/* User Routes */}
                          <Route path="/profile" element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          } />
                          
                          <Route path="/browse-requests" element={
                            <ProtectedRoute>
                              <RoleProtectedRoute allowed={['vendor']}>
                                <BrowseRequests />
                              </RoleProtectedRoute>
                            </ProtectedRoute>
                          } />
                          
                          <Route path="/create-request" element={
                            <ProtectedRoute>
                              <RoleProtectedRoute allowed={['client']}>
                                <CreateRequest />
                              </RoleProtectedRoute>
                            </ProtectedRoute>
                          } />
                          
                          <Route path="/my-requests" element={
                            <ProtectedRoute>
                              <RoleProtectedRoute allowed={['client']}>
                                <MyRequests />
                              </RoleProtectedRoute>
                            </ProtectedRoute>
                          } />
                          
                          <Route path="/my-offers" element={
                            <ProtectedRoute>
                              <RoleProtectedRoute allowed={['vendor']}>
                                <MyOffers />
                              </RoleProtectedRoute>
                            </ProtectedRoute>
                          } />
                          
                          <Route path="/messages" element={
                            <ProtectedRoute>
                              <Messages />
                            </ProtectedRoute>
                          } />
                          
                          <Route path="/settings" element={
                            <ProtectedRoute>
                              <Settings />
                            </ProtectedRoute>
                          } />

                          {/* Auth Redirect */}
                          <Route path="/auth-redirect" element={<AuthRedirect />} />
                          
                          {/* 404 Route */}
                          <Route path="/404" element={<NotFound />} />
                          
                          {/* Catch all redirect */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </Suspense>
                    </div>
                    <Toaster />
                    <Sonner />
                  </TooltipProvider>
                </AuthProvider>
              </LanguageProvider>
            </RouteAwareThemeProvider>
          </BrowserRouter>
        </SecurityProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

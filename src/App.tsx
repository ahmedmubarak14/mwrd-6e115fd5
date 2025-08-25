

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
import PublicRoute from "./components/PublicRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingFallback } from "./components/LoadingFallback";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VendorDashboard = lazy(() => import("./pages/VendorDashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const BrowseRequests = lazy(() => import("./pages/BrowseRequests"));
const CreateRequest = lazy(() => import("./pages/CreateRequest"));
const MyOffers = lazy(() => import("./pages/MyOffers"));
const Messages = lazy(() => import("./pages/Messages"));
const Settings = lazy(() => import("./pages/Settings"));
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
                          
                          {/* Auth Routes */}
                          <Route path="/auth" element={
                            <PublicRoute>
                              <Auth />
                            </PublicRoute>
                          } />
                          
                          {/* Client Dashboard */}
                          <Route path="/dashboard" element={
                            <ProtectedRoute>
                              <RoleProtectedRoute allowed={['client']}>
                                <Dashboard />
                              </RoleProtectedRoute>
                            </ProtectedRoute>
                          } />
                          
                          {/* Vendor Dashboard */}
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

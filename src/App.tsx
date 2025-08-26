

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RouteAwareThemeProvider } from "@/components/RouteAwareThemeProvider";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import { VendorDashboard } from "./pages/VendorDashboard";
import { ProcurementVendorDashboard } from "./pages/ProcurementVendorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVerificationQueue from "./pages/admin/AdminVerificationQueue";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import NotFound from "./pages/NotFound";

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
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <RouteAwareThemeProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/procurement-vendor-dashboard" element={<ProcurementVendorDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin/*" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="verification-queue" element={<AdminVerificationQueue />} />
                  <Route path="subscriptions" element={<AdminSubscriptions />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </RouteAwareThemeProvider>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;

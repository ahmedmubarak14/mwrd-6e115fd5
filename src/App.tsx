import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Landing } from "./pages/Landing";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { WhyStartWithSupplify } from "./pages/WhyStartWithSupplify";
import { WhyMoveToSupplify } from "./pages/WhyMoveToSupplify";
import { Requests } from "./pages/Requests";
import { Suppliers } from "./pages/Suppliers";
import { Pricing } from "./pages/Pricing";
import { Profile } from "./pages/Profile";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ExpertConsultation } from "./pages/ExpertConsultation";
import { ManageSubscription } from "./pages/ManageSubscription";
import { BrowseRequests } from "./pages/BrowseRequests";
import { MyOffers } from "./pages/MyOffers";
import { Settings } from "./pages/Settings";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/why-start-with-supplify" element={<WhyStartWithSupplify />} />
              <Route path="/why-move-to-supplify" element={<WhyMoveToSupplify />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/manage-subscription" element={<ManageSubscription />} />
              <Route path="/expert-consultation" element={<ExpertConsultation />} />
              <Route path="/browse-requests" element={<BrowseRequests />} />
              <Route path="/my-offers" element={<MyOffers />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/client-dashboard" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

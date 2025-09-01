import { useState } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorHeader } from "./VendorHeader";
import { VendorMobileSidebar } from "./VendorMobileSidebar";
import { VerificationBanner } from "../verification/VerificationBanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

interface VendorLayoutProps {
  children: React.ReactNode;
}

export const VendorLayout = ({ children }: VendorLayoutProps) => {
  const { userProfile, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('vendorSidebarOpen');
    return saved ? JSON.parse(saved) : true;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (userProfile?.role !== 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">
            {t('common.accessDenied') || 'Access Denied'}
          </h1>
          <p className="text-muted-foreground">
            {t('vendor.dashboard.accessRequired') || 'You need vendor access to view this page.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Always show desktop layout with sidebar for vendor */}
      <div className="min-h-screen flex w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        <VendorSidebar 
          collapsed={!sidebarOpen}
          onToggle={() => {
            const newState = !sidebarOpen;
            setSidebarOpen(newState);
            localStorage.setItem('vendorSidebarOpen', JSON.stringify(newState));
          }}
        />
        <div className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          isRTL 
            ? (sidebarOpen ? "mr-64" : "mr-16")
            : (sidebarOpen ? "ml-64" : "ml-16")
        )}>
          <VendorHeader 
            onSidebarToggle={() => {
              const newState = !sidebarOpen;
              setSidebarOpen(newState);
              localStorage.setItem('vendorSidebarOpen', JSON.stringify(newState));
            }}
            sidebarOpen={sidebarOpen}
            onMobileMenuOpen={() => setMobileMenuOpen(true)}
          />
          {userProfile.verification_status && 
           userProfile.verification_status !== 'approved' && (
            <VerificationBanner />
          )}
          <main className="flex-1 overflow-auto bg-muted/20 p-6 min-h-[calc(100vh-4rem)]">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile sidebar overlay for small screens */}
      {isMobile && (
        <VendorMobileSidebar 
          isOpen={mobileMenuOpen} 
          onOpenChange={setMobileMenuOpen} 
        />
      )}
    </div>
  );
};
import { useState } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorHeader } from "./VendorHeader";
import { VendorMobileSidebar } from "./VendorMobileSidebar";
import { VerificationBanner } from "../verification/VerificationBanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t, isRTL } = useLanguage();

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
      {isMobile ? (
        // Mobile Layout  
        <div className="min-h-screen flex flex-col">
          <VendorHeader onMobileMenuOpen={() => setMobileMenuOpen(true)} />
          <VendorMobileSidebar 
            isOpen={mobileMenuOpen} 
            onOpenChange={setMobileMenuOpen}
            collapsed={!sidebarOpen}
            onToggle={() => {
              const newState = !sidebarOpen;
              setSidebarOpen(newState);
              localStorage.setItem('vendorSidebarOpen', JSON.stringify(newState));
            }}
          />
          {userProfile.verification_status && 
           userProfile.verification_status !== 'approved' && (
            <VerificationBanner />
          )}
          <main className="flex-1 overflow-auto bg-muted/20 p-4 sm:p-6 min-h-[calc(100vh-8rem)] pb-20 safe-area-inset-bottom">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      ) : (
        // Desktop Layout
        <div className="min-h-screen w-full" dir={isRTL ? 'rtl' : 'ltr'}>
          <VendorSidebar 
            collapsed={!sidebarOpen}
            onToggle={() => {
              const newState = !sidebarOpen;
              setSidebarOpen(newState);
              localStorage.setItem('vendorSidebarOpen', JSON.stringify(newState));
            }}
          />
          <div 
            className={cn(
              "flex flex-col min-w-0 transition-all duration-300",
              isRTL 
                ? (sidebarOpen ? "mr-64" : "mr-16")
                : (sidebarOpen ? "ml-64" : "ml-16")
            )}
          >
            <VendorHeader 
              onSidebarToggle={() => {
                const newState = !sidebarOpen;
                setSidebarOpen(newState);
                localStorage.setItem('vendorSidebarOpen', JSON.stringify(newState));
              }}
              sidebarOpen={sidebarOpen}
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
      )}
    </div>
  );
};
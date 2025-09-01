import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorSidebar } from "./VendorSidebar";
import { VendorHeader } from "./VendorHeader";
import { VendorMobileSidebar } from "./VendorMobileSidebar";
import { VerificationBanner } from "@/components/verification/VerificationBanner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface VendorLayoutProps {
  children: React.ReactNode;
}

export const VendorLayout = ({ children }: VendorLayoutProps) => {
  const { userProfile, loading } = useAuth();
  const languageContext = useOptionalLanguage();
  const { isRTL } = languageContext || { isRTL: false };
  const t = languageContext?.t || ((key: string) => key);
  const isMobile = useIsMobile();
  
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('vendorSidebarOpen');
    return saved ? JSON.parse(saved) : true;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userProfile || userProfile.role !== 'vendor') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          {t('common.accessDenied')}
        </h2>
        <p className="text-muted-foreground text-center">
          {t('vendor.dashboard.accessRequired')}
        </p>
      </div>
    );
  }

  return (
    <SidebarProvider 
      defaultOpen={sidebarOpen}
      onOpenChange={(open) => {
        setSidebarOpen(open);
        localStorage.setItem('vendorSidebarOpen', JSON.stringify(open));
      }}
    >
      <div className="min-h-screen flex w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        {!isMobile && <VendorSidebar />}
        
        <VendorMobileSidebar
          isOpen={isMobileSidebarOpen}
          onOpenChange={setIsMobileSidebarOpen}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <VendorHeader 
            onMobileMenuOpen={() => setIsMobileSidebarOpen(true)}
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
          
          <div className="flex-1 overflow-auto bg-muted/20 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
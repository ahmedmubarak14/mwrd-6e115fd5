import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
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
    <div className={cn("min-h-screen flex w-full", isRTL && "rtl")}>
      {!isMobile && (
        <VendorSidebar 
          collapsed={!sidebarOpen}
          onItemClick={() => setIsMobileSidebarOpen(false)} 
        />
      )}
      
      <VendorMobileSidebar
        isOpen={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
      />

      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          !isMobile && !isRTL && (sidebarOpen ? "ml-64" : "ml-16")
        )}
        style={!isMobile && isRTL ? {
          width: sidebarOpen ? 'calc(100% - 256px)' : 'calc(100% - 64px)',
          marginRight: 0,
          position: 'relative',
          left: 0,
          right: sidebarOpen ? '256px' : '64px'
        } : undefined}
      >
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
        
        <main 
          className={cn(
            "flex-1 overflow-auto bg-muted/20 p-6 min-h-[calc(100vh-4rem)]",
            isRTL && "text-right"
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div 
            className={cn(
              "max-w-7xl mx-auto",
              isRTL && "text-right"
            )}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
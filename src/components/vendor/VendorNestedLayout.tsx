import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { VendorSidebar } from "./VendorSidebar";
import { VendorHeader } from "./VendorHeader";
import { VendorMobileSidebar } from "./VendorMobileSidebar";
import { VerificationBanner } from "@/components/verification/VerificationBanner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const VendorLayout = () => {
  const { userProfile, loading } = useAuth();
  const languageContext = useOptionalLanguage();
  const { isRTL } = languageContext || { isRTL: false };
  const t = languageContext?.t || ((key: string) => key);
  
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
    <SidebarProvider>
      <div className={cn("min-h-screen flex w-full", isRTL && "rtl")}>
        <VendorSidebar 
          userRole="vendor"
          userProfile={userProfile} 
          onItemClick={() => setIsMobileSidebarOpen(false)} 
        />
        
        <VendorMobileSidebar
          isOpen={isMobileSidebarOpen}
          onOpenChange={setIsMobileSidebarOpen}
          userProfile={userProfile}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <VendorHeader 
            userProfile={userProfile}
            onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
          />
          
          {userProfile.verification_status && 
           userProfile.verification_status !== 'approved' && (
            <VerificationBanner />
          )}
          
          <main className="flex-1 overflow-auto bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
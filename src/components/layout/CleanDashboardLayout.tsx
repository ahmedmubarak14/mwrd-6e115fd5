
import { useState } from "react";
import { CleanHeader } from "@/components/ui/layout/CleanHeader";
import { CleanSidebar } from "@/components/vendor/CleanSidebar";
import { MobileContainer } from "@/components/ui/MobileContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface CleanDashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const CleanDashboardLayout = ({ children, className }: CleanDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const isRTL = languageContext?.isRTL || false;
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileContainer 
        pageType="dashboard"
        className="bg-white"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="min-h-screen flex flex-col bg-white">
          <CleanHeader onMobileMenuOpen={() => setSidebarOpen(true)} />
          
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent 
              side={isRTL ? "right" : "left"} 
              className="p-0 bg-white border-r border-gray-200 w-64"
            >
              <CleanSidebar 
                userRole={userProfile?.role as 'client' | 'vendor' | 'admin'}
                userProfile={userProfile}
                onItemClick={() => setSidebarOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <main className="flex-1 bg-white">
            {children}
          </main>
        </div>
      </MobileContainer>
    );
  }

  return (
    <div className={`min-h-screen w-full bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <MobileContainer 
        pageType="dashboard"
        className="bg-white"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className={`min-h-screen flex w-full bg-white ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <CleanSidebar 
            userRole={userProfile?.role as 'client' | 'vendor' | 'admin'}
            userProfile={userProfile}
          />
          
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <CleanHeader onMobileMenuOpen={() => setSidebarOpen(true)} />
            
            <main className="flex-1 bg-white">
              {children}
            </main>
          </div>
        </div>
      </MobileContainer>
    </div>
  );
};

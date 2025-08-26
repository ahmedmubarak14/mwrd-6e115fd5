
import { useState } from "react";
import { CleanHeader } from "@/components/ui/layout/CleanHeader";
import { ModernVendorSidebar } from "@/components/vendor/ModernVendorSidebar";
import { MobileContainer } from "@/components/ui/MobileContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface CleanDashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const CleanDashboardLayout = ({ children, className }: CleanDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userProfile } = useAuth();
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileContainer 
        pageType="dashboard"
        className="bg-background"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="min-h-screen flex flex-col bg-background">
          <CleanHeader onMobileMenuOpen={() => setSidebarOpen(true)} />
          
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent 
              side={isRTL ? "right" : "left"} 
              className="p-0 bg-sidebar border-r border-sidebar-border w-64"
            >
              <SidebarProvider>
                <ModernVendorSidebar />
              </SidebarProvider>
            </SheetContent>
          </Sheet>

          <main className="flex-1 bg-background">
            {children}
          </main>
        </div>
      </MobileContainer>
    );
  }

  return (
    <div className={`min-h-screen w-full bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <MobileContainer 
        pageType="dashboard"
        className="bg-background"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <SidebarProvider>
          <div className={`min-h-screen flex w-full bg-background ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <ModernVendorSidebar />
            
            <SidebarInset className="flex-1 flex flex-col min-w-0 bg-background">
              <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b border-border">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1">
                  <CleanHeader onMobileMenuOpen={() => setSidebarOpen(true)} />
                </div>
              </header>
              
              <main className="flex-1 bg-background p-4">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </MobileContainer>
    </div>
  );
};

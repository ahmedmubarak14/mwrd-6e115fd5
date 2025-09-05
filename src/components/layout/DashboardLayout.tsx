

import { useState } from "react";
import { Header } from "@/components/ui/layout/Header";
import { Footer } from "@/components/ui/layout/Footer";
import { VendorSidebar } from "@/components/vendor/VendorSidebar";
import { MobileContainer } from "@/components/ui/MobileContainer";
import { MobileBottomNav, MobileBottomNavSpacer } from "@/components/navigation/MobileBottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userProfile } = useAuth();
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile Layout - Keep existing mobile functionality
    return (
      <MobileContainer 
        pageType="dashboard"
        className={className}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="min-h-screen flex flex-col">
          <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent 
              side={isRTL ? "right" : "left"}
              className={cn(
                "w-[75vw] max-w-xs p-0 bg-background overflow-hidden",
                "safe-area-inset-y"
              )}
            >
              <VendorSidebar onItemClick={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <main className="flex-1 overflow-auto bg-background p-4 pb-20">
            {children}
          </main>

          <MobileBottomNavSpacer />
          <MobileBottomNav />
        </div>
      </MobileContainer>
    );
  }

  // Desktop Layout - Enhanced RTL support with proper sidebar positioning
  return (
    <div className={`min-h-screen w-full ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <MobileContainer 
        pageType="dashboard"
        className={className}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <SidebarProvider defaultOpen={true}>
          <div className={`min-h-screen flex w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <VendorSidebar />
            
            <div className="flex-1 flex flex-col min-w-0">
              <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
              
              <main className="flex-1 overflow-auto bg-background p-6">
                {children}
              </main>
              
              <Footer />
            </div>
          </div>
        </SidebarProvider>
      </MobileContainer>
    </div>
  );
};

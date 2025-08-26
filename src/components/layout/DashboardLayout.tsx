import { useState } from "react";
import { Header } from "@/components/ui/layout/Header";
import { Footer } from "@/components/ui/layout/Footer";
import { MobileSidebar } from "./MobileSidebar";
import { MobileContainer } from "@/components/ui/MobileContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/vendor/VendorSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const isRTL = language === 'ar';

  if (isMobile) {
    // Mobile Layout - Keep existing mobile functionality
    return (
      <MobileContainer 
        pageType="dashboard"
        className={className}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
        
        <div className="flex flex-1 min-h-0">
          {/* Mobile Sidebar */}
          <MobileSidebar 
            isOpen={mobileMenuOpen} 
            onOpenChange={setMobileMenuOpen} 
          />

          {/* Main Content */}
          <main className="flex-1 overflow-auto min-w-0">
            {children}
          </main>
        </div>

        <Footer />
      </MobileContainer>
    );
  }

  // Desktop Layout - Use SidebarProvider pattern
  return (
    <MobileContainer 
      pageType="dashboard"
      className={className}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full">
          <VendorSidebar 
            userRole={userProfile?.role as 'client' | 'vendor' | 'admin'}
            userProfile={userProfile}
          />
          
          <SidebarInset className="flex flex-col">
            <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
            
            <main className="flex-1 overflow-auto bg-background">
              {children}
            </main>
            
            <Footer />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </MobileContainer>
  );
};

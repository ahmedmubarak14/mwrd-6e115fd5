
import { useState } from "react";
import { Header } from "@/components/ui/layout/Header";
import { Footer } from "@/components/ui/layout/Footer";
import { MobileSidebar } from "./MobileSidebar";
import { MobileContainer } from "@/components/ui/MobileContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/vendor/VendorSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

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
          
          <MobileSidebar 
            isOpen={mobileMenuOpen} 
            onOpenChange={setMobileMenuOpen} 
          />

          <main className="flex-1 overflow-auto bg-background p-4">
            {children}
          </main>

          <Footer />
        </div>
      </MobileContainer>
    );
  }

  // Desktop Layout - Custom RTL-aware layout structure
  return (
    <div 
      className={`min-h-screen w-full ${isRTL ? 'rtl' : 'ltr'}`} 
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        display: 'grid',
        gridTemplateColumns: isRTL ? '1fr auto' : 'auto 1fr',
        gridTemplateRows: 'auto 1fr auto',
        gridTemplateAreas: isRTL 
          ? '"content sidebar" "content sidebar" "footer footer"'
          : '"sidebar content" "sidebar content" "footer footer"'
      }}
    >
      <MobileContainer 
        pageType="dashboard"
        className={className}
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ gridArea: 'content', display: 'flex', flexDirection: 'column' }}
      >
        <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
        
        <div style={{ gridArea: 'footer' }}>
          <Footer />
        </div>
      </MobileContainer>

      {/* Custom RTL-aware sidebar positioning */}
      <div 
        style={{ 
          gridArea: 'sidebar',
          position: 'relative',
          zIndex: 10
        }}
        className={`border-l border-r-0 ${isRTL ? 'border-r border-l-0' : ''}`}
      >
        <SidebarProvider defaultOpen={true}>
          <VendorSidebar 
            userRole={userProfile?.role as 'client' | 'vendor' | 'admin'}
            userProfile={userProfile}
          />
        </SidebarProvider>
      </div>
    </div>
  );
};

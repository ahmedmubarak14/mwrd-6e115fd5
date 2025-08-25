
import { useState } from "react";
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Footer } from "@/components/ui/layout/Footer";
import { MobileSidebar } from "./MobileSidebar";
import { MobileContainer } from "@/components/ui/MobileContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

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

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar 
            userRole={userProfile?.role as 'client' | 'vendor' | 'admin'}
            userProfile={userProfile}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto min-w-0">
          {children}
        </main>
      </div>

      <Footer />
    </MobileContainer>
  );
};

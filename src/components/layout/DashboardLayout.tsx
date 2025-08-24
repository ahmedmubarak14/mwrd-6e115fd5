
import { useState } from "react";
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Footer } from "@/components/ui/layout/Footer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
      className={`min-h-screen bg-unified-page ${className || ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      <div className="flex flex-1">
        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent 
            side={isRTL ? "right" : "left"} 
            className="p-0 w-80 bg-unified-page"
          >
            <Sidebar 
              userRole={userProfile?.role as 'client' | 'vendor' | 'admin'}
              userProfile={userProfile}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar 
            userRole={userProfile?.role as 'client' | 'vendor' | 'admin'}
            userProfile={userProfile}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>

      <Footer />
    </MobileContainer>
  );
};

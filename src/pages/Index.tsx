
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { ProcurementClientDashboard } from "@/components/Dashboard/ProcurementClientDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Footer } from "@/components/ui/layout/Footer";
import { MobileContainer } from "@/components/ui/MobileContainer";

const Index = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isRTL = language === 'ar';

  return (
    <MobileContainer 
      pageType="landing"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="h-screen"
    >
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent 
          side={isRTL ? "right" : "left"} 
          className="p-0 w-80 bg-unified-page"
        >
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 min-h-0 h-full">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block">
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 overflow-auto min-w-0 h-full">
          <ProcurementClientDashboard />
        </main>
      </div>
      
      <Footer />
    </MobileContainer>
  );
};

export default Index;

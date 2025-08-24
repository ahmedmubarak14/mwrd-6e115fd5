
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { ProcurementClientDashboard } from "@/components/Dashboard/ProcurementClientDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { MobileSheet } from "@/components/ui/MobileSheet";
import { Footer } from "@/components/ui/layout/Footer";

const Index = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <MobileSheet>
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </MobileSheet>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <ProcurementClientDashboard />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;

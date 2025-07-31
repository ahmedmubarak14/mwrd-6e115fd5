import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { ClientDashboard } from "@/components/Dashboard/ClientDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export const Dashboard = () => {
  const { user, userProfile, loading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isRTL = language === 'ar';

  useEffect(() => {
    if (!user && !loading) {
      navigate('/home', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleAuthSuccess = (userData: { id: string; email: string; role: 'client' | 'supplier' }) => {
    // Already handled by useEffect
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile.role} />
        </SheetContent>
      </Sheet>

      <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Desktop Sidebar - position based on language */}
        <div className={`hidden lg:block ${isRTL ? 'order-2' : 'order-1'}`}>
          <Sidebar userRole={userProfile.role} />
        </div>
        
        <main className={`flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden ${isRTL ? 'order-1' : 'order-2'}`}>
          <ClientDashboard />
        </main>
      </div>
    </div>
  );
};
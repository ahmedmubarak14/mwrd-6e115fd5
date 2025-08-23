import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { ClientDashboard } from "@/components/Dashboard/ClientDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Footer } from "@/components/ui/layout/Footer";

export const Dashboard = () => {
  const { user, userProfile, loading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useLocalStorage("onboarding-completed", false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  
  const isRTL = language === 'ar';

  useEffect(() => {
    if (!user && !loading) {
      navigate('/home');
    } else if (userProfile?.role === 'admin' && !loading) {
      navigate('/admin');
    }
  }, [user, userProfile, loading, navigate]);

  const handleAuthSuccess = (userData: { id: string; email: string; role: 'client' | 'supplier' | 'admin' }) => {
    // Already handled by useEffect
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(true);
    setOnboardingComplete(true);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(true);
    setOnboardingComplete(true);
  };

  // Show onboarding for new users
  const shouldShowOnboarding = userProfile && !showOnboarding && userProfile.role !== 'admin';

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
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile.role} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile.role} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <ClientDashboard />
        </main>
      </div>

      {/* Onboarding Flow */}
      {shouldShowOnboarding && !onboardingComplete && (
        <OnboardingFlow 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      <Footer />
    </div>
  );
};
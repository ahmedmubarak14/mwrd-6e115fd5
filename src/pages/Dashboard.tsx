
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { ProcurementClientDashboard } from "@/components/Dashboard/ProcurementClientDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { MobileSheet } from "@/components/ui/MobileSheet";
import { MobileContainer } from "@/components/ui/MobileContainer";
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
      navigate('/');
    } else if (userProfile?.role === 'admin' && !loading) {
      navigate('/admin');
    } else if (userProfile?.role === 'vendor' && !loading) {
      // Redirect suppliers to their dedicated dashboard
      navigate('/supplier-dashboard');
    }
  }, [user, userProfile, loading, navigate]);

  const handleAuthSuccess = (userData: { id: string; email: string; role: 'client' | 'vendor' | 'admin' }) => {
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
    <MobileContainer>
      <div className={isRTL ? 'rtl' : 'ltr'}>
        <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
        
        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <MobileSheet>
            <Sidebar userRole={userProfile.role} userProfile={userProfile} />
          </MobileSheet>
        </Sheet>

        <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar userRole={userProfile.role} userProfile={userProfile} />
          </div>
          
          <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden">
            <ProcurementClientDashboard />
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
    </MobileContainer>
  );
};

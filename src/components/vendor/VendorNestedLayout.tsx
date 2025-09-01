import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { VendorSidebar } from "./VendorSidebar";
import { VendorHeader } from "./VendorHeader";
import { VendorMobileSidebar } from "./VendorMobileSidebar";
import { MobileContainer } from "@/components/ui/MobileContainer";
import { MobileBottomNav, MobileBottomNavSpacer } from "@/components/navigation/MobileBottomNav";
import { SmartBreadcrumbs } from "@/components/navigation/SmartBreadcrumbs";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigate } from "react-router-dom";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

interface VendorLayoutProps {
  children?: React.ReactNode;
}

export const VendorLayout = ({ children }: VendorLayoutProps) => {
  const { user, userProfile, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('vendorSidebarOpen');
    return saved ? JSON.parse(saved) : true;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userProfile || userProfile.role !== 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-destructive">
              {t('common.accessDenied')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('vendor.dashboard.accessRequired')}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <MobileContainer pageType="dashboard" className="min-h-screen">
        {isMobile ? (
          // Mobile Layout
          <div className="min-h-screen flex flex-col">
            <VendorHeader onMobileMenuOpen={() => setMobileMenuOpen(true)} />
            <VendorMobileSidebar 
              isOpen={mobileMenuOpen} 
              onOpenChange={setMobileMenuOpen}
            />
            <main className="flex-1 overflow-auto bg-muted/20 p-4 sm:p-6 min-h-[calc(100vh-8rem)] pb-20 safe-area-inset-bottom">
              <SmartBreadcrumbs />
              <ErrorBoundary>
                {children || <Outlet />}
              </ErrorBoundary>
            </main>
            <MobileBottomNavSpacer />
            <MobileBottomNav />
          </div>
        ) : (
          // Desktop Layout
          <div className="min-h-screen flex w-full" dir={isRTL ? 'rtl' : 'ltr'}>
            <VendorSidebar 
              collapsed={!sidebarOpen}
            />
            <div 
              className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-300",
                !isRTL && (sidebarOpen ? "ml-64" : "ml-16")
              )}
            >
              <VendorHeader 
                onSidebarToggle={() => {
                  const newState = !sidebarOpen;
                  setSidebarOpen(newState);
                  localStorage.setItem('vendorSidebarOpen', JSON.stringify(newState));
                }}
                sidebarOpen={sidebarOpen}
              />
              <main className="flex-1 overflow-auto bg-muted/20 p-6 min-h-[calc(100vh-4rem)]">
                <SmartBreadcrumbs />
                <ErrorBoundary>
                  {children || <Outlet />}
                </ErrorBoundary>
              </main>
            </div>
          </div>
        )}
      </MobileContainer>
    </ErrorBoundary>
  );
};
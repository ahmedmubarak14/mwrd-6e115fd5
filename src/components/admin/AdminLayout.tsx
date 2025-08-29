
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminMobileSidebar } from "./AdminMobileSidebar";
import { MobileContainer } from "@/components/ui/MobileContainer";
import { MobileBottomNav, MobileBottomNavSpacer } from "@/components/navigation/MobileBottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { AdminCommandPalette } from "./AdminCommandPalette";
import { AdminErrorBoundary } from "./AdminErrorBoundary";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const AdminLayout = () => {
  const { user, userProfile, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('adminSidebarOpen');
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
      navigate('/auth');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-destructive">
              {t('admin.accessDenied')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('admin.accessDeniedDescription')}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <AdminErrorBoundary>
      <MobileContainer pageType="dashboard" className="min-h-screen">
        {isMobile ? (
          // Mobile Layout
          <div className="min-h-screen flex flex-col">
            <AdminHeader onMobileMenuOpen={() => setMobileMenuOpen(true)} />
            <AdminMobileSidebar 
              isOpen={mobileMenuOpen} 
              onOpenChange={setMobileMenuOpen} 
            />
            <main className="flex-1 overflow-auto bg-muted/20 p-4 sm:p-6 min-h-[calc(100vh-8rem)] pb-20 safe-area-inset-bottom">
              <AdminErrorBoundary>
                <Outlet />
              </AdminErrorBoundary>
            </main>
            <MobileBottomNavSpacer />
            <MobileBottomNav />
            <AdminCommandPalette />
          </div>
        ) : (
          // Desktop Layout - Always show sidebar on admin dashboard
          <div className="min-h-screen flex w-full" dir={isRTL ? 'rtl' : 'ltr'}>
            <AdminSidebar 
              collapsed={!sidebarOpen}
              className="block"
            />
            <div 
              className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-300",
                sidebarOpen ? "ml-64" : "ml-16"
              )}
            >
              <AdminHeader 
                onSidebarToggle={() => {
                  const newState = !sidebarOpen;
                  setSidebarOpen(newState);
                  localStorage.setItem('adminSidebarOpen', JSON.stringify(newState));
                }}
                sidebarOpen={sidebarOpen}
              />
              <main className="flex-1 overflow-auto bg-muted/20 p-6 min-h-[calc(100vh-4rem)]">
                <AdminErrorBoundary>
                  <Outlet />
                </AdminErrorBoundary>
              </main>
            </div>
            <AdminCommandPalette />
          </div>
        )}
      </MobileContainer>
    </AdminErrorBoundary>
  );
};

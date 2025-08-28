
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EnhancedAdminSidebar } from "./EnhancedAdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminMobileSidebar } from "./AdminMobileSidebar";
import { MobileContainer } from "@/components/ui/MobileContainer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { AdminCommandPalette } from "./AdminCommandPalette";
import { AdminErrorBoundary } from "./AdminErrorBoundary";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useIsMobile } from "@/hooks/use-mobile";

export const AdminLayout = () => {
  const { user, userProfile, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
            <main className="flex-1 overflow-auto bg-muted/20">
              <AdminErrorBoundary>
                <Outlet />
              </AdminErrorBoundary>
            </main>
            <AdminCommandPalette />
          </div>
        ) : (
          // Desktop Layout
          <SidebarProvider defaultOpen={sidebarOpen} onOpenChange={setSidebarOpen}>
            <div className="min-h-screen flex w-full" dir={isRTL ? 'rtl' : 'ltr'}>
              <EnhancedAdminSidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader />
                <main className="flex-1 overflow-auto bg-muted/20">
                  <AdminErrorBoundary>
                    <Outlet />
                  </AdminErrorBoundary>
                </main>
              </div>
              <AdminCommandPalette />
            </div>
          </SidebarProvider>
        )}
      </MobileContainer>
    </AdminErrorBoundary>
  );
};

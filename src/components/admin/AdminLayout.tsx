
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { AdminCommandPalette } from "./AdminCommandPalette";

export const AdminLayout = () => {
  const { user, userProfile, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

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
              Access Denied
            </CardTitle>
            <CardDescription className="text-center">
              You need admin privileges to access this area.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div 
        className="min-h-screen flex w-full h-screen" 
        dir={localStorage.getItem('language') === 'ar' ? 'rtl' : 'ltr'} 
        style={{ background: 'var(--gradient-subtle)' }}
      >
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <AdminHeader />
          <main className="flex-1 overflow-auto bg-gradient-subtle">
            <Outlet />
          </main>
        </div>
        <AdminCommandPalette />
      </div>
    </SidebarProvider>
  );
};

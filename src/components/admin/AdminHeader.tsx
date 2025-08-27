
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { DashboardThemeToggle } from "@/components/ui/DashboardThemeToggle";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { EnhancedAdminHeaderSearch } from "./EnhancedAdminHeaderSearch";
import { AdminHeaderUserMenu } from "./AdminHeaderUserMenu";
import { AdminHeaderLanguageToggle } from "./AdminHeaderLanguageToggle";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminHeaderProps {
  onMobileMenuOpen?: () => void;
}

export const AdminHeader = ({ onMobileMenuOpen }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const isMobile = useIsMobile();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      {/* Main Header Bar */}
      <div className="h-16 sm:h-18">
        <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo and Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 mr-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileMenuOpen}
                className="h-10 w-10 hover:bg-accent/50 transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] min-w-0"
            >
              <img 
                src="/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png" 
                alt="MWRD Logo"
                className="h-9 w-auto shrink-0"
              />
              <div className="hidden sm:flex flex-col items-start min-w-0">
                <span className="admin-subtitle leading-tight truncate">
                  {t('admin.dashboard')}
                </span>
                <span className="admin-caption leading-tight">
                  {t('admin.managementPortal') || 'Management Portal'}
                </span>
              </div>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <EnhancedAdminHeaderSearch />
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toast.info(t('admin.notificationsDemo'))}
              className="relative h-10 w-10 hover:bg-accent/50 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground admin-caption rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                3
              </span>
            </Button>
            
            <DashboardThemeToggle />
            
            {!isMobile && <AdminHeaderLanguageToggle />}
            
            <AdminHeaderUserMenu userProfile={userProfile} />
          </div>
        </div>
      </div>
      
      {/* Breadcrumbs Section */}
      <div className="border-t bg-muted/50 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-full mx-auto">
          <AdminBreadcrumbs />
        </div>
      </div>
    </header>
  );
};

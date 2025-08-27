
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { DashboardThemeToggle } from "@/components/ui/DashboardThemeToggle";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { AdminHeaderSearch } from "./AdminHeaderSearch";
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
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      {/* Main Header Bar */}
      <div className="h-14 sm:h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo and Menu Trigger */}
          <div className="flex items-center gap-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileMenuOpen}
                className="h-8 w-8"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png" 
                alt="MWRD Logo"
                className="h-8 w-auto"
              />
              <span className="hidden sm:inline-block font-semibold text-lg">
                {t('admin.dashboard')}
              </span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <AdminHeaderSearch />
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toast.info(t('admin.notificationsDemo'))}
              className="relative h-8 w-8"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                3
              </span>
            </Button>
            
            <DashboardThemeToggle />
            
            <AdminHeaderLanguageToggle />
            
            <AdminHeaderUserMenu userProfile={userProfile} />
          </div>
        </div>
      </div>
      
      {/* Breadcrumbs Section */}
      <div className="border-t bg-muted/50 px-4 py-2">
        <AdminBreadcrumbs />
      </div>
    </header>
  );
};

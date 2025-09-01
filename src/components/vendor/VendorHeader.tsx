import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, Menu, User } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/realtime/NotificationBell';
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { DashboardThemeToggle } from "@/components/ui/DashboardThemeToggle";
import { VendorBreadcrumbs } from "./VendorBreadcrumbs";
import { VendorHeaderSearch } from "./VendorHeaderSearch";
import { VendorHeaderUserMenu } from "./VendorHeaderUserMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface VendorHeaderProps {
  onMobileMenuOpen?: () => void;
}

export const VendorHeader = ({ onMobileMenuOpen }: VendorHeaderProps) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const isMobile = useIsMobile();

  

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      {/* Main Header Bar */}
      <div className="h-16 min-h-16">
        <div className="max-w-full mx-auto px-3 sm:px-4 h-full flex items-center justify-between gap-2">
          {/* Logo, Menu Trigger, and Sidebar Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2 sm:mr-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileMenuOpen}
                className="h-9 w-9 hover:bg-accent/50 transition-all duration-200 shrink-0"
                aria-label="Open mobile menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}

            {!isMobile && (
              <SidebarTrigger className="h-9 w-9 hover:bg-accent/50 transition-all duration-200 shrink-0" />
            )}
            
            <button
              onClick={() => navigate('/vendor/dashboard')}
              className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 min-w-0"
              aria-label="Go to vendor dashboard"
            >
              <img 
                src="/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png" 
                alt="MWRD Logo"
                className="h-8 w-auto shrink-0"
              />
              <div className="hidden sm:flex flex-col items-start min-w-0">
                <span className="text-sm sm:text-base font-semibold leading-tight truncate text-foreground">
                  MWRD Dashboard
                </span>
                <span className="text-xs leading-tight text-muted-foreground hidden md:block capitalize">
                  {userProfile?.role || 'User'} Portal
                </span>
              </div>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <VendorHeaderSearch />
            
            <NotificationBell />
            
            <LanguageSwitcher />
            
            <DashboardThemeToggle />
            
            <VendorHeaderUserMenu userProfile={userProfile} />
          </div>
        </div>
      </div>
      
      {/* Breadcrumbs Section */}
      <div className="border-t border-border/50 bg-muted/30 px-4 py-2">
        <div className="max-w-full mx-auto">
          <VendorBreadcrumbs />
        </div>
      </div>
    </header>
  );
};
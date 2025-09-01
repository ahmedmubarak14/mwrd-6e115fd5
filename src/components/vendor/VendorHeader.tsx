import { Button } from "@/components/ui/button";
import { PanelLeft, Menu, PanelLeftClose } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/realtime/NotificationBell';
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { VendorBreadcrumbs } from "./VendorBreadcrumbs";
import { VendorHeaderSearch } from "./VendorHeaderSearch";
import { VendorHeaderUserMenu } from "./VendorHeaderUserMenu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface VendorHeaderProps {
  onMobileMenuToggle: () => void;
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
  userProfile?: any;
}

export const VendorHeader = ({ 
  onMobileMenuToggle, 
  onSidebarToggle, 
  sidebarOpen, 
  userProfile 
}: VendorHeaderProps) => {
  const { userProfile: authUserProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const isMobile = useIsMobile();

  const currentUserProfile = userProfile || authUserProfile;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop sidebar toggle button */}
        {onSidebarToggle && !isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="hidden lg:flex"
          >
            {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          </Button>
        )}

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            MWRD
          </div>
          <div className="text-sm text-muted-foreground">
            | Vendor Portal
          </div>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 flex justify-center max-w-md">
          <VendorHeaderSearch />
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
          <VendorHeaderUserMenu userProfile={currentUserProfile} />
        </div>
      </div>

      {/* Breadcrumbs section */}
      <div className="border-t px-4 lg:px-6 py-3 bg-muted/20">
        <VendorBreadcrumbs />
      </div>
    </header>
  );
};
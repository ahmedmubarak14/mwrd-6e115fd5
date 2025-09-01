import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { VendorHeaderUserMenu } from "./VendorHeaderUserMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DashboardThemeToggle } from "@/components/ui/DashboardThemeToggle";
import { VendorBreadcrumbs } from "./VendorBreadcrumbs";
import { cn } from "@/lib/utils";
import { 
  Menu, 
  Bell, 
  Search,
  PanelLeftOpen,
  PanelLeftClose
} from "lucide-react";
import { Link } from "react-router-dom";

interface ProductionVendorHeaderProps {
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  onMobileMenuToggle?: () => void;
  isCollapsed?: boolean;
}

export const ProductionVendorHeader = ({
  sidebarOpen = true,
  onSidebarToggle,
  onMobileMenuToggle,
  isCollapsed = false
}: ProductionVendorHeaderProps) => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const isMobile = useIsMobile();

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "safe-area-inset-top",
      isRTL && "rtl"
    )}>
      {/* Main Header Bar */}
      <div className="flex h-16 items-center px-4 lg:px-6 gap-2">
        {/* Mobile menu button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="touch-target lg:hidden"
            onClick={onMobileMenuToggle}
            aria-label={t('vendor.navigation.openMenu')}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo - Always visible */}
        <div className={cn(
          "flex items-center min-w-0",
          isMobile ? "flex-1" : "mr-4"
        )}>
          <Link 
            to="/vendor/dashboard" 
            className="flex items-center gap-2 min-w-0"
          >
            <div className="font-bold text-xl truncate text-primary">MWRD</div>
          </Link>
        </div>

        {/* Desktop sidebar toggle */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="touch-target mr-4"
            onClick={onSidebarToggle}
            aria-label={t('vendor.navigation.toggleSidebar')}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Search - Hidden on mobile, visible on tablet+ */}
        {!isMobile && (
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className={cn(
                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                isRTL ? "right-3" : "left-3"
              )} />
              <Input
                type="search"
                placeholder={t('vendor.navigation.searchPlaceholder')}
                className={cn(
                  "w-full",
                  isRTL ? "pr-9" : "pl-9"
                )}
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className={cn(
          "flex items-center gap-2",
          isRTL ? "mr-auto" : "ml-auto"
        )}>
          {/* Notification button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="touch-target relative"
            aria-label={t('vendor.navigation.notifications')}
          >
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
            >
              3
            </Badge>
          </Button>

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Theme toggle */}
          <DashboardThemeToggle />

          {/* User menu */}
          <VendorHeaderUserMenu />
        </div>
      </div>

      {/* Breadcrumbs section */}
      <div className={cn(
        "border-t border-border bg-muted/40 px-4 lg:px-6 py-2",
        "safe-area-inset-x",
        isRTL && "rtl"
      )}>
        <VendorBreadcrumbs />
      </div>
    </header>
  );
};
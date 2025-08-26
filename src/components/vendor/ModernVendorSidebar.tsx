
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  Package,
  MessageSquare,
  ShoppingCart,
  HelpCircle,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

export const ModernVendorSidebar = () => {
  const { t, isRTL } = useLanguage();
  const { userProfile } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();

  const navigationItems = [
    {
      label: t('nav.dashboard') || 'Dashboard',
      href: '/vendor-dashboard',
      icon: LayoutDashboard,
    },
    {
      label: t('nav.browseRequests') || 'Browse Requests',
      href: '/browse-requests',
      icon: Search,
    },
    {
      label: t('nav.myOffers') || 'My Offers',
      href: '/my-offers',
      icon: Package,
    },
    {
      label: t('nav.messages') || 'Messages',
      href: '/messages',
      icon: MessageSquare,
    },
    {
      label: t('nav.orders') || 'Orders',
      href: '/orders',
      icon: ShoppingCart,
    },
    {
      label: t('nav.support') || 'Support',
      href: '/support',
      icon: HelpCircle,
    }
  ];

  const isActive = (path: string) => {
    if (path === '/vendor-dashboard' && location.pathname === '/vendor-dashboard') {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <Sidebar 
      collapsible="icon"
      className={cn(
        "border-r border-border bg-sidebar",
        isRTL ? "border-l border-r-0" : "border-r border-l-0"
      )}
      side={isRTL ? "right" : "left"}
    >
      <SidebarContent className="bg-sidebar px-2 py-2">
        {/* Main Navigation */}
        <SidebarMenu className="space-y-0.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild
                  isActive={active}
                  tooltip={state === "collapsed" ? item.label : undefined}
                  className={cn(
                    "h-8 px-2 py-1.5 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                    isRTL && "flex-row-reverse text-right"
                  )}
                >
                  <Link 
                    to={item.href} 
                    className={cn(
                      "flex items-center gap-2 w-full",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate text-sm">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        
        {/* Spacer to push settings to bottom */}
        <div className="flex-1" />
        
        {/* Settings at bottom */}
        <div className="mt-auto">
          <SidebarSeparator className="bg-sidebar-border mb-2" />
          
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                isActive={isActive('/settings')}
                tooltip={state === "collapsed" ? (t('nav.settings') || 'Settings') : undefined}
                className={cn(
                  "h-8 px-2 py-1.5 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive('/settings') && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                  isRTL && "flex-row-reverse text-right"
                )}
              >
                <Link 
                  to="/settings" 
                  className={cn(
                    "flex items-center gap-2 w-full",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <span className="truncate text-sm">{t('nav.settings') || 'Settings'}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};


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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "px-2 py-2 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide",
            isRTL && "text-right font-arabic"
          )}>
            {t('nav.menu') || 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
                        "w-full transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                        isRTL && "flex-row-reverse text-right"
                      )}
                    >
                      <Link 
                        to={item.href} 
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="bg-sidebar-border" />
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive('/settings')}
                  tooltip={state === "collapsed" ? (t('nav.settings') || 'Settings') : undefined}
                  className={cn(
                    "w-full transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive('/settings') && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                    isRTL && "flex-row-reverse text-right"
                  )}
                >
                  <Link 
                    to="/settings" 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    <Settings className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t('nav.settings') || 'Settings'}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

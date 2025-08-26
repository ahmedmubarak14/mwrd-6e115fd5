
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  ShoppingCart,
  CreditCard,
  HelpCircle,
  Settings,
  Package,
  Search,
  PlusCircle
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

interface VendorSidebarProps {
  userRole?: 'client' | 'vendor' | 'admin';
  userProfile?: any;
}

export const VendorSidebar = ({ userRole }: VendorSidebarProps) => {
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const { state } = useSidebar();

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      {
        label: t('nav.dashboard') || 'Dashboard',
        href: userRole === 'vendor' ? '/vendor-dashboard' : '/dashboard',
        icon: LayoutDashboard,
      }
    ];

    if (userRole === 'vendor') {
      return [
        ...baseItems,
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
    }

    // Default client navigation
    return [
      ...baseItems,
      {
        label: t('nav.projects') || 'Projects',
        href: '/projects',
        icon: FolderOpen,
      },
      {
        label: t('nav.createRequest') || 'Create Request',
        href: '/requests',
        icon: PlusCircle,
      },
      {
        label: t('nav.suppliers') || 'Browse Vendors',
        href: '/vendors',
        icon: Users,
      },
      {
        label: t('nav.messages') || 'Messages',
        href: '/messages',
        icon: MessageSquare,
      },
      {
        label: t('nav.analytics') || 'Analytics',
        href: '/analytics',
        icon: BarChart3,
      },
      {
        label: t('nav.orders') || 'Orders',
        href: '/orders',
        icon: ShoppingCart,
      },
      {
        label: t('nav.manageSubscription') || 'Subscription',
        href: '/manage-subscription',
        icon: CreditCard,
      },
      {
        label: t('nav.support') || 'Support',
        href: '/support',
        icon: HelpCircle,
      }
    ];
  };

  const navigationItems = getNavigationItems();

  const isActive = (path: string) => {
    // Handle vendor dashboard special case
    if (path === '/vendor-dashboard' && location.pathname === '/vendor-dashboard') {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-50 w-64 bg-sidebar border-r transition-transform duration-300",
        isRTL ? "right-0 border-l border-r-0" : "left-0",
      )}
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      <Sidebar 
        collapsible="icon" 
        className={cn(
          "w-full h-full",
          isRTL ? "border-l border-r-0" : "border-r border-l-0"
        )}
        side={isRTL ? "right" : "left"}
      >
        <SidebarContent className={cn(
          "h-full",
          isRTL && "text-right"
        )}>
          <SidebarGroup>
            <SidebarGroupLabel className={cn(
              "px-2 py-2 text-sm font-medium",
              isRTL && "text-right flex-row-reverse"
            )}>
              {t('nav.menu') || 'Menu'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild
                        isActive={isActive(item.href)}
                        tooltip={state === "collapsed" ? item.label : undefined}
                        className={cn(
                          "w-full transition-colors",
                          isRTL && "flex-row-reverse text-right"
                        )}
                      >
                        <Link to={item.href} className={cn(
                          "flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent",
                          isRTL && "flex-row-reverse text-right"
                        )}>
                          <Icon className={cn(
                            "h-4 w-4 shrink-0",
                            isRTL ? "ml-2 mr-0" : "mr-2 ml-0"
                          )} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarSeparator />
          
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive('/settings')}
                    tooltip={state === "collapsed" ? (t('nav.settings') || 'Settings') : undefined}
                    className={cn(
                      "w-full transition-colors",
                      isRTL && "flex-row-reverse text-right"
                    )}
                  >
                    <Link to="/settings" className={cn(
                      "flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent",
                      isRTL && "flex-row-reverse text-right"
                    )}>
                      <Settings className={cn(
                        "h-4 w-4 shrink-0",
                        isRTL ? "ml-2 mr-0" : "mr-2 ml-0"
                      )} />
                      <span className="truncate">{t('nav.settings') || 'Settings'}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
};


import { Link, useLocation } from "react-router-dom";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
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
  onItemClick?: () => void;
}

export const VendorSidebar = ({ userRole }: VendorSidebarProps) => {
  const languageContext = useOptionalLanguage();
  const t = languageContext?.t || ((key: string) => key.split('.').pop() || key);
  const isRTL = languageContext?.isRTL || false;
  const location = useLocation();
  const { state } = useSidebar();

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      {
        label: t('nav.dashboard'),
        href: userRole === 'vendor' ? '/vendor-dashboard' : '/dashboard',
        icon: LayoutDashboard,
      }
    ];

    if (userRole === 'vendor') {
      return [
        ...baseItems,
        {
          label: t('nav.browseRequests'),
          href: '/browse-requests',
          icon: Search,
        },
        {
          label: t('nav.myOffers'),
          href: '/my-offers',
          icon: Package,
        },
        {
          label: t('nav.messages'),
          href: '/messages',
          icon: MessageSquare,
        },
        {
          label: t('nav.orders'),
          href: '/orders',
          icon: ShoppingCart,
        },
        {
          label: t('nav.support'),
          href: '/support',
          icon: HelpCircle,
        }
      ];
    }

    // Default client navigation
    return [
      ...baseItems,
      {
        label: t('nav.projects'),
        href: '/projects',
        icon: FolderOpen,
      },
      {
        label: t('nav.createRequest'),
        href: '/requests',
        icon: PlusCircle,
      },
      {
        label: t('nav.suppliers'),
        href: '/vendors',
        icon: Users,
      },
      {
        label: t('nav.messages'),
        href: '/messages',
        icon: MessageSquare,
      },
      {
        label: t('nav.analytics'),
        href: '/analytics',
        icon: BarChart3,
      },
      {
        label: t('nav.orders'),
        href: '/orders',
        icon: ShoppingCart,
      },
      {
        label: t('nav.manageSubscription'),
        href: '/manage-subscription',
        icon: CreditCard,
      },
      {
        label: t('nav.support'),
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
    <Sidebar 
      collapsible="icon" 
      className={cn(
        "w-64 data-[state=collapsed]:w-16 transition-all duration-300",
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
            isRTL && "text-right"
          )}>
            {t('nav.menu')}
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
                        isRTL && "flex-row-reverse"
                      )}>
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
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive('/settings')}
                  tooltip={state === "collapsed" ? t('nav.settings') : undefined}
                  className={cn(
                    "w-full transition-colors",
                    isRTL && "flex-row-reverse text-right"
                  )}
                >
                  <Link to="/settings" className={cn(
                    "flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent",
                    isRTL && "flex-row-reverse"
                  )}>
                    <Settings className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t('nav.settings')}</span>
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

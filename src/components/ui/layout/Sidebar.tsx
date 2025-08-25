
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

interface SidebarProps {
  userRole?: 'client' | 'vendor' | 'admin';
  userProfile?: any;
}

export const Sidebar = ({ userRole }: SidebarProps) => {
  const { t, isRTL } = useLanguage();
  const location = useLocation();

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      {
        label: t('nav.dashboard') || 'Dashboard',
        href: userRole === 'vendor' ? '/vendor-dashboard' : '/dashboard',
        icon: LayoutDashboard,
      }
    ];

    if (userRole === 'admin') {
      return [
        {
          label: t('admin.dashboard') || 'Admin Dashboard',
          href: '/admin',
          icon: LayoutDashboard,
        },
        {
          label: t('admin.users') || 'Users',
          href: '/admin/users',
          icon: Users,
        },
        {
          label: t('admin.requests') || 'Requests Approval',
          href: '/admin/requests',
          icon: FileText,
        },
        {
          label: t('admin.analytics') || 'Analytics',
          href: '/admin/analytics',
          icon: BarChart3,
        },
        {
          label: t('nav.support') || 'Support',
          href: '/admin/support',
          icon: HelpCircle,
        }
      ];
    }

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
    <div className={cn(
      "w-64 bg-card border-r border-border h-full flex flex-col",
      isRTL && "border-l border-r-0"
    )}>
      <div className="p-6">
        <h2 className={cn(
          "text-lg font-semibold",
          isRTL && "text-right"
        )}>
          {t('nav.menu') || 'Menu'}
        </h2>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isRTL && "justify-end flex-row-reverse"
                )}
              >
                <Link to={item.href}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-1">
          <Button
            asChild
            variant={isActive('/settings') ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-10",
              isRTL && "justify-end flex-row-reverse"
            )}
          >
            <Link to="/settings">
              <Settings className="h-4 w-4" />
              <span>{t('nav.settings') || 'Settings'}</span>
            </Link>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};

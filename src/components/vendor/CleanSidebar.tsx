
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  Package,
  MessageSquare,
  ShoppingCart,
  HelpCircle,
  Settings,
  User,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CleanSidebarProps {
  userRole?: 'client' | 'vendor' | 'admin';
  userProfile?: any;
  onItemClick?: () => void;
}

export const CleanSidebar = ({ userRole, userProfile, onItemClick }: CleanSidebarProps) => {
  const { t, isRTL } = useLanguage();
  const location = useLocation();

  const getMainNavigationItems = () => {
    if (userRole === 'vendor') {
      return [
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
        }
      ];
    }

    return [];
  };

  const getBottomNavigationItems = () => {
    return [
      {
        label: t('nav.support') || 'Support',
        href: '/support',
        icon: HelpCircle,
      },
      {
        label: t('nav.profile') || 'Profile',
        href: '/profile',
        icon: User,
      },
      {
        label: t('nav.settings') || 'Settings',
        href: '/settings',
        icon: Settings,
      }
    ];
  };

  const mainNavigationItems = getMainNavigationItems();
  const bottomNavigationItems = getBottomNavigationItems();

  const isActive = (path: string) => {
    if (path === '/vendor-dashboard' && location.pathname === '/vendor-dashboard') {
      return true;
    }
    return location.pathname === path;
  };

  const getUserDisplayName = () => {
    return userProfile?.full_name || userProfile?.company_name || 'Ahmed';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={cn(
      "w-64 bg-white border-r border-gray-200 h-full flex flex-col",
      isRTL ? "border-l border-r-0" : "border-r border-l-0"
    )}>
      {/* User Profile Section */}
      <div className="p-4">
        <div className={cn(
          "flex items-center gap-3",
          isRTL && "flex-row-reverse"
        )}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile?.avatar_url} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
            <div className="font-medium text-gray-900 truncate">
              {getUserDisplayName()}
            </div>
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {userRole || 'vendor'}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {mainNavigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isRTL && "flex-row-reverse text-right",
                    active 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Bottom Navigation */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <ul className="space-y-1">
          {bottomNavigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isRTL && "flex-row-reverse text-right",
                    active 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

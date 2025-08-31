
import { Link, useLocation } from "react-router-dom";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
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

interface CleanSidebarProps {
  userRole?: 'client' | 'vendor' | 'admin';
  userProfile?: any;
  onItemClick?: () => void;
}

export const CleanSidebar = ({ userRole, onItemClick }: CleanSidebarProps) => {
  const languageContext = useOptionalLanguage();
  const t = languageContext?.t || ((key: string) => key.split('.').pop() || key);
  const isRTL = languageContext?.isRTL || false;
  const location = useLocation();

  const getNavigationItems = () => {
    if (userRole === 'vendor') {
      return [
        {
          label: t('nav.dashboard'),
          href: '/vendor-dashboard',
          icon: LayoutDashboard,
        },
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

    return [];
  };

  const navigationItems = getNavigationItems();

  const isActive = (path: string) => {
    if (path === '/vendor-dashboard' && location.pathname === '/vendor-dashboard') {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div className={cn(
      "w-64 bg-white border-r border-gray-200 h-full flex flex-col",
      isRTL ? "border-l border-r-0" : "border-r border-l-0"
    )}>
      <div className="p-6 border-b border-gray-200">
        <h2 className={cn(
          "text-sm font-medium text-gray-600 uppercase tracking-wide",
          isRTL && "text-right"
        )}>
          {t('nav.menu')}
        </h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
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
      
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/settings"
          onClick={onItemClick}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50",
            isRTL && "flex-row-reverse text-right",
            isActive('/settings') && "bg-blue-50 text-blue-700 border border-blue-200"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span>{t('nav.settings')}</span>
        </Link>
      </div>
    </div>
  );
};

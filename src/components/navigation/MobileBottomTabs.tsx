
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Home, 
  Search, 
  MessageSquare, 
  Bell, 
  User, 
  PlusCircle,
  Package,
  Settings,
  TrendingUp
} from "lucide-react";

interface Tab {
  icon: typeof Home;
  label: string;
  path: string;
  count?: number;
  requiresAuth?: boolean;
}

export const MobileBottomTabs = () => {
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const { t } = useLanguage();
  
  // Don't show on landing pages or auth pages
  const hiddenPaths = ['/landing', '/auth', '/reset-password', '/why-start-with-mwrd', '/what-makes-us-unique', '/why-move-to-mwrd', '/pricing', '/terms-and-conditions', '/privacy-policy'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path)) || location.pathname === '/';
  
  if (shouldHide || !user) return null;
  
  // Mock unread counts - replace with real data
  const unreadMessages = 0;
  const unreadNotifications = 0;

  const getTabsForRole = (): Tab[] => {
    const userRole = userProfile?.role || 'client';
    
    if (userRole === 'admin') {
      return [
        { icon: Home, label: t('nav.dashboard'), path: '/admin', requiresAuth: true },
        { icon: Search, label: t('nav.users'), path: '/admin/users', requiresAuth: true },
        { icon: TrendingUp, label: t('nav.analytics'), path: '/admin/analytics', requiresAuth: true },
        { icon: Settings, label: t('nav.settings'), path: '/settings', requiresAuth: true },
        { icon: User, label: t('nav.profile'), path: '/profile', requiresAuth: true },
      ];
    }

    const baseTabs: Tab[] = [
      { icon: Home, label: t('nav.home'), path: '/dashboard', requiresAuth: true },
      { icon: Search, label: t('nav.browse'), path: '/browse-requests' },
    ];

    if (userRole === 'vendor') {
      return [
        ...baseTabs,
        { icon: Package, label: t('nav.myOffers'), path: '/my-offers', requiresAuth: true },
        { icon: MessageSquare, label: t('nav.messages'), path: '/messages', count: unreadMessages, requiresAuth: true },
        { icon: User, label: t('nav.profile'), path: '/profile', requiresAuth: true },
      ];
    }

    // Default client tabs
    return [
      ...baseTabs,
      { icon: PlusCircle, label: t('nav.create'), path: '/requests', requiresAuth: true },
      { icon: MessageSquare, label: t('nav.messages'), path: '/messages', count: unreadMessages, requiresAuth: true },
      { icon: User, label: t('nav.profile'), path: '/profile', requiresAuth: true },
    ];
  };

  const tabs = getTabsForRole();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50 md:hidden">
      <div className="safe-area-pb">
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path || 
              (tab.path === '/dashboard' && location.pathname === '/supplier-dashboard');
            const IconComponent = tab.icon;
            
            // Skip auth-required tabs if user is not logged in
            if (tab.requiresAuth && !user) return null;
            
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-3 px-2 relative min-h-[60px]",
                  "transition-all duration-200 active:scale-95",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className="relative">
                  <IconComponent className={cn(
                    "transition-all duration-200",
                    isActive ? "h-6 w-6" : "h-5 w-5"
                  )} />
                  {tab.count && tab.count > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-4 w-4 text-xs flex items-center justify-center p-0 min-w-4 animate-pulse"
                      variant="destructive"
                    >
                      {tab.count > 9 ? '9+' : tab.count}
                    </Badge>
                  )}
                </div>
                <span className={cn(
                  "mt-1 line-clamp-1 transition-all duration-200",
                  isActive ? "text-xs font-medium" : "text-xs"
                )}>{tab.label}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary rounded-b animate-fade-in" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

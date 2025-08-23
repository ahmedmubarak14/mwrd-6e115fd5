import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Search, 
  MessageSquare, 
  Bell, 
  User, 
  PlusCircle,
  Package
} from "lucide-react";

interface MobileBottomTabsProps {
  userRole?: 'client' | 'vendor' | 'admin';
}

interface Tab {
  icon: typeof Home;
  label: string;
  path: string;
  count?: number;
}

export const MobileBottomTabs = ({ userRole = 'client' }: MobileBottomTabsProps) => {
  const location = useLocation();
  
  // Mock unread counts - replace with real data
  const unreadMessages = 0;
  const unreadNotifications = 0;

  const getTabsForRole = (): Tab[] => {
    const baseTabs: Tab[] = [
      { icon: Home, label: 'Home', path: '/' },
      { icon: Search, label: 'Browse', path: '/browse-requests' },
    ];

    if (userRole === 'client') {
      return [
        ...baseTabs,
        { icon: PlusCircle, label: 'Create', path: '/requests' },
        { icon: MessageSquare, label: 'Messages', path: '/messages', count: unreadMessages },
        { icon: User, label: 'Profile', path: '/profile' },
      ];
    }

    if (userRole === 'vendor') {
      return [
        ...baseTabs,
        { icon: Package, label: 'My Offers', path: '/my-offers' },
        { icon: MessageSquare, label: 'Messages', path: '/messages', count: unreadMessages },
        { icon: User, label: 'Profile', path: '/profile' },
      ];
    }

    if (userRole === 'admin') {
      return [
        { icon: Home, label: 'Dashboard', path: '/admin' },
        { icon: Search, label: 'Users', path: '/admin/users' },
        { icon: Package, label: 'Requests', path: '/admin/requests' },
        { icon: Bell, label: 'Notifications', path: '/admin/notifications', count: unreadNotifications },
        { icon: User, label: 'Profile', path: '/profile' },
      ];
    }

    return baseTabs;
  };

  const tabs = getTabsForRole();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const IconComponent = tab.icon;
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 px-1 relative",
                "transition-colors duration-200",
                isActive 
                  ? "text-primary bg-primary/5" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <IconComponent className="h-5 w-5" />
                {tab.count && tab.count > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-4 w-4 text-xs flex items-center justify-center p-0 min-w-4"
                    variant="destructive"
                  >
                    {tab.count > 9 ? '9+' : tab.count}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1 line-clamp-1">{tab.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
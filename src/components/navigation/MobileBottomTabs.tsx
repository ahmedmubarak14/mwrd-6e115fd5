import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Search, 
  MessageCircle, 
  FileText, 
  User,
  Bell,
  Settings,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useRealTimeChat } from "@/hooks/useRealTimeChat";

const bottomTabs = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/",
    roles: ["client", "supplier", "admin"]
  },
  {
    id: "search",
    label: "Search",
    icon: Search,
    path: "/suppliers",
    roles: ["client"]
  },
  {
    id: "requests",
    label: "Requests",
    icon: FileText,
    path: "/requests",
    roles: ["client", "supplier"]
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageCircle,
    path: "/messages",
    roles: ["client", "supplier"]
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: TrendingUp,
    path: "/admin",
    roles: ["admin"]
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    path: "/profile",
    roles: ["client", "supplier", "admin"]
  }
];

export const MobileBottomTabs = () => {
  const { userProfile } = useAuth();
  const { unreadCount } = useNotifications();
  const { conversations } = useRealTimeChat();
  const location = useLocation();
  const navigate = useNavigate();

  if (!userProfile) return null;

  // Calculate total unread messages
  const totalUnreadMessages = conversations.reduce((total, conv) => {
    // This would need to be implemented in useRealTimeChat
    return total; // placeholder
  }, 0);

  // Filter tabs based on user role
  const visibleTabs = bottomTabs.filter(tab => 
    tab.roles.includes(userProfile.role)
  );

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          // Show badges for messages and notifications
          const showBadge = 
            (tab.id === "messages" && totalUnreadMessages > 0) ||
            (tab.id === "profile" && unreadCount > 0);
          
          const badgeCount = 
            tab.id === "messages" ? totalUnreadMessages :
            tab.id === "profile" ? unreadCount : 0;

          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 relative",
                active && "text-primary bg-primary/10"
              )}
              onClick={() => handleTabClick(tab.path)}
            >
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5",
                  active && "text-primary"
                )} />
                {showBadge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full"
                  >
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium",
                active && "text-primary"
              )}>
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
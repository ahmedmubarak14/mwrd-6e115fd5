import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  User,
  ShoppingCart,
  Briefcase,
  FolderOpen,
  HelpCircle,
  BarChart3,
  Menu,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserProfile } from "@/types/database";
import { cn } from "@/lib/utils";

interface CleanSidebarProps {
  userRole?: 'client' | 'vendor' | 'admin';
  userProfile?: UserProfile | null;
  onItemClick?: () => void;
}

export const CleanSidebar = ({ userRole, userProfile, onItemClick }: CleanSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  const getMenuItems = () => {
    const baseItems = [
      {
        icon: LayoutDashboard,
        label: t('navigation.dashboard') || 'Dashboard',
        path: userRole === 'admin' ? '/admin/dashboard' : '/dashboard',
        badge: null
      },
      {
        icon: MessageSquare,
        label: t('navigation.messages') || 'Messages',
        path: '/messages',
        badge: null
      }
    ];

    if (userRole === 'admin') {
      return [
        ...baseItems,
        {
          icon: Users,
          label: t('navigation.users') || 'Users',
          path: '/admin/users',
          badge: null
        },
        {
          icon: FileText,
          label: t('navigation.requests') || 'Requests',
          path: '/admin/requests',
          badge: null
        },
        {
          icon: ShoppingCart,
          label: t('navigation.offers') || 'Offers',
          path: '/admin/offers',
          badge: null
        },
        {
          icon: BarChart3,
          label: t('navigation.analytics') || 'Analytics',
          path: '/admin/analytics',
          badge: null
        }
      ];
    }

    if (userRole === 'vendor') {
      return [
        ...baseItems,
        {
          icon: FileText,
          label: t('navigation.browseRequests') || 'Browse Requests',
          path: '/browse-requests',
          badge: null
        },
        {
          icon: ShoppingCart,
          label: t('navigation.myOffers') || 'My Offers',
          path: '/my-offers',
          badge: null
        },
        {
          icon: Briefcase,
          label: t('navigation.orders') || 'Orders',
          path: '/orders',
          badge: null
        },
        {
          icon: FolderOpen,
          label: t('navigation.projects') || 'Projects',
          path: '/projects',
          badge: null
        }
      ];
    }

    // Client items
    return [
      ...baseItems,
      {
        icon: FileText,
        label: t('navigation.requests') || 'My Requests',
        path: '/requests',
        badge: null
      },
      {
        icon: ShoppingCart,
        label: t('navigation.offers') || 'Offers',
        path: '/offers',
        badge: null
      },
      {
        icon: Briefcase,
        label: t('navigation.orders') || 'Orders',
        path: '/orders',
        badge: null
      },
      {
        icon: Users,
        label: t('navigation.vendors') || 'Vendors',
        path: '/vendors',
        badge: null
      },
      {
        icon: FolderOpen,
        label: t('navigation.projects') || 'Projects',
        path: '/projects',
        badge: null
      }
    ];
  };

  const menuItems = getMenuItems();

  const bottomItems = [
    {
      icon: HelpCircle,
      label: t('navigation.support') || 'Support',
      path: '/support',
      badge: null
    },
    {
      icon: User,
      label: t('navigation.profile') || 'Profile',
      path: '/profile',
      badge: null
    },
    {
      icon: Settings,
      label: t('navigation.settings') || 'Settings',
      path: '/settings',
      badge: null
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getUserDisplayName = () => {
    return userProfile?.full_name || userProfile?.company_name || userProfile?.email || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'vendor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'client': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <aside className={cn(
      "flex flex-col bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      "h-screen"
    )}>
      {/* Header with User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3 min-w-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userProfile?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="font-medium text-card-foreground truncate">
                  {getUserDisplayName()}
                </h3>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs mt-1", getRoleBadgeColor(userRole))}
                >
                  {userRole || 'User'}
                </Badge>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-card-foreground"
          >
            {collapsed ? (
              isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                active 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom Navigation */}
      <nav className="p-2 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                active 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

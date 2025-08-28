import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MessageSquare, 
  Plus, 
  FileText, 
  User,
  Package,
  Settings,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
  roles?: string[];
}

export const MobileBottomNav = () => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const { unreadCount } = useNotifications();
  const { conversations } = useRealTimeChat();
  
  const unreadMessages = conversations.reduce((total, conv) => total + 1, 0); // Simplified for now

  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        id: 'home',
        label: 'Home',
        icon: Home,
        href: '/dashboard'
      },
      {
        id: 'messages',
        label: 'Messages',
        icon: MessageSquare,
        href: '/messages',
        badge: unreadMessages
      },
      {
        id: 'create',
        label: 'Create',
        icon: Plus,
        href: userProfile?.role === 'vendor' ? '/offers' : '/create-request'
      }
    ];

    // Role-specific items
    if (userProfile?.role === 'admin') {
      baseItems.push(
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          href: '/admin/dashboard'
        },
        {
          id: 'profile',
          label: 'Profile',
          icon: User,
          href: '/admin/profile',
          badge: unreadCount
        }
      );
    } else if (userProfile?.role === 'vendor') {
      baseItems.push(
        {
          id: 'offers',
          label: 'Offers',
          icon: Package,
          href: '/my-offers'
        },
        {
          id: 'profile',
          label: 'Profile',
          icon: User,
          href: '/profile',
          badge: unreadCount
        }
      );
    } else {
      baseItems.push(
        {
          id: 'requests',
          label: 'Requests',
          icon: FileText,
          href: '/requests'
        },
        {
          id: 'profile',
          label: 'Profile',
          icon: User,
          href: '/profile',
          badge: unreadCount
        }
      );
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border z-50 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-4 max-w-screen-xl mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors min-w-0 flex-1 relative",
              isActive(item.href)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge && item.badge > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  {item.badge > 9 ? '9+' : item.badge}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium truncate max-w-full">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

// Spacer component to account for bottom navigation
export const MobileBottomNavSpacer = () => {
  return <div className="h-20 w-full shrink-0" />;
};
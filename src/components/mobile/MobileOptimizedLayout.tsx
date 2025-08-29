import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  MessageCircle, 
  User, 
  Plus,
  Menu,
  ArrowLeft,
  MoreHorizontal,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { usePWA } from '@/hooks/usePWA';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';

interface MobileOptimizedLayoutProps {
  children?: React.ReactNode;
}

export const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { conversations, getUnreadCount } = useRealTimeChat();
  const { isOnline, isInstalled } = usePWA();
  const [showStatusBar, setShowStatusBar] = useState(true);

  // Calculate unread messages
  const unreadCount = conversations.reduce((acc, conv) => {
    const count = getUnreadCount ? getUnreadCount(conv.id) : 0;
    return acc + count;
  }, 0);

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { 
        path: '/dashboard', 
        icon: Home, 
        label: 'Home',
        badge: null
      },
      { 
        path: '/search', 
        icon: Search, 
        label: 'Search',
        badge: null
      },
      { 
        path: '/realtime-messages', 
        icon: MessageCircle, 
        label: 'Messages',
        badge: unreadCount > 0 ? unreadCount : null
      },
      { 
        path: '/profile', 
        icon: User, 
        label: 'Profile',
        badge: null
      }
    ];

    // Add role-specific items
    if (userProfile?.role === 'client') {
      baseItems.splice(2, 0, {
        path: '/create-request',
        icon: Plus,
        label: 'Create',
        badge: null
      });
    } else if (userProfile?.role === 'vendor') {
      baseItems.splice(2, 0, {
        path: '/requests',
        icon: Plus,
        label: 'Browse',
        badge: null
      });
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();
  const currentPath = location.pathname;

  // Page titles for header
  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/search': 'Search',
      '/realtime-messages': 'Messages',
      '/profile': 'Profile',
      '/create-request': 'Create Request',
      '/requests': 'Browse Requests',
      '/offers': 'My Offers',
      '/orders': 'Orders'
    };

    return titles[currentPath] || 'MWRD';
  };

  // Check if we should show back button
  const shouldShowBackButton = () => {
    const mainPages = ['/dashboard', '/search', '/realtime-messages', '/profile'];
    return !mainPages.includes(currentPath);
  };

  // Handle back navigation
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  // Auto-hide status bar after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOnline && isInstalled) {
        setShowStatusBar(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOnline, isInstalled]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Status Bar */}
      {showStatusBar && (
        <div className={cn(
          "h-8 flex items-center justify-between px-4 text-xs transition-all duration-300",
          isOnline ? "bg-green-500 text-white" : "bg-orange-500 text-white"
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isOnline ? "bg-white animate-pulse" : "bg-white/70"
            )} />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {isInstalled && (
              <Badge variant="secondary" className="text-xs h-5">
                <Zap className="w-3 h-3 mr-1" />
                PWA
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStatusBar(false)}
              className="h-5 w-5 p-0 text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <header className="h-14 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          {shouldShowBackButton() ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <div>
            <h1 className="font-semibold text-lg leading-none">{getPageTitle()}</h1>
            {userProfile && (
              <p className="text-xs text-muted-foreground capitalize">
                {userProfile.role} Portal
              </p>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-16">
        {children || <Outlet />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-50">
        <div className="h-full flex items-center justify-around px-2">
          {navigationItems.map((item, index) => {
            const isActive = currentPath === item.path || 
              (item.path === '/dashboard' && currentPath === '/');
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex-1 h-12 flex-col gap-1 relative transition-all duration-200",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )} />
                  
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 min-w-4 text-xs p-0 flex items-center justify-center"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </Badge>
                  )}
                </div>
                
                <span className="text-xs font-medium leading-none">
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Floating Chat - only show on non-message pages */}
      {!currentPath.includes('message') && <FloatingChatButton />}
    </div>
  );
};
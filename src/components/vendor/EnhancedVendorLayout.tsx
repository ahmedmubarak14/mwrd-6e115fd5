import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Award, MessageSquare, Settings, 
  User, FileText, BarChart3, Plus, Search, Bell, Menu, X,
  Home, Briefcase, Star, CreditCard, Calendar, HelpCircle,
  ChevronRight, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { cn } from '@/lib/utils';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  isActive?: boolean;
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

interface EnhancedVendorLayoutProps {
  children: React.ReactNode;
}

export const EnhancedVendorLayout: React.FC<EnhancedVendorLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, isRTL, t } = useOptionalLanguage() || { language: 'en', isRTL: false, t: (key: string) => key };
  const location = useLocation();

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      title: t('vendor.navigation.dashboard'),
      href: '/vendor/dashboard',
      icon: LayoutDashboard,
      isActive: location.pathname === '/vendor/dashboard'
    },
    {
      title: t('vendor.navigation.crManagement'),
      href: '/vendor/cr-management',
      icon: FileText,
      isActive: location.pathname === '/vendor/cr-management'
    },
    {
      title: t('vendor.navigation.projectsManagement'),
      href: '/vendor/projects',
      icon: Briefcase,
      badge: 3,
      isActive: location.pathname.startsWith('/vendor/projects')
    },
    {
      title: 'RFQs',
      href: '/vendor/rfqs',
      icon: Package,
      badge: 5,
      isActive: location.pathname === '/vendor/rfqs'
    },
    {
      title: 'Offers',
      href: '/vendor/offers',
      icon: Award,
      isActive: location.pathname === '/vendor/offers'
    },
    {
      title: 'Messages',
      href: '/vendor/messages',
      icon: MessageSquare,
      badge: 2,
      isActive: location.pathname === '/vendor/messages'
    },
    {
      title: 'Analytics',
      href: '/vendor/analytics',
      icon: BarChart3,
      isActive: location.pathname === '/vendor/analytics'
    },
    {
      title: t('vendor.navigation.profile'),
      href: '/vendor/profile',
      icon: User,
      isActive: location.pathname === '/vendor/profile'
    },
    {
      title: t('vendor.navigation.settings'),
      href: '/vendor/settings',
      icon: Settings,
      isActive: location.pathname === '/vendor/settings'
    }
  ];

  // Quick actions
  const quickActions: QuickAction[] = [
    {
      title: 'Submit New Offer',
      description: 'Create and submit a new project offer',
      href: '/vendor/offers/create',
      icon: Plus,
      variant: 'primary'
    },
    {
      title: 'Browse RFQs',
      description: 'Find new project opportunities',
      href: '/vendor/rfqs',
      icon: Search,
      variant: 'default'
    },
    {
      title: 'Update Profile',
      description: 'Complete your vendor profile',
      href: '/vendor/profile',
      icon: User,
      variant: 'warning'
    },
    {
      title: 'View Reports',
      description: 'Check your performance analytics',
      href: '/vendor/analytics',
      icon: BarChart3,
      variant: 'success'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={cn("min-h-screen bg-background", isRTL && "rtl")}>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <Link to="/vendor/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">MWRD</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className={cn(isRTL && "rotate-180")}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-muted/30 border-r">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b">
              <Link to="/vendor/dashboard" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                  <Home className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">MWRD</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    item.isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <div className={cn("flex items-center", isRTL && "flex-row-reverse space-x-reverse space-x-2")}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {t('vendor.dashboard.quickActions')}
              </h3>
              <div className="space-y-2">
                {quickActions.slice(0, 2).map((action) => (
                  <Link
                    key={action.href}
                    to={action.href}
                    className="flex items-center p-2 rounded-md text-xs hover:bg-accent transition-colors"
                  >
                    <action.icon className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="truncate">{action.title}</span>
                    <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={toggleMobileMenu}>
            <aside className={cn(
              "absolute inset-y-0 w-64 bg-background border-r transform transition-transform",
              isRTL ? "right-0" : "left-0"
            )}>
              <div className="flex flex-col h-full">
                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-16">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        item.isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      <div className={cn("flex items-center", isRTL && "flex-row-reverse space-x-reverse space-x-2")}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 min-h-screen",
          "lg:ml-64", // Desktop sidebar offset
          "w-full"
        )}>
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (for key actions) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t px-4 py-2">
        <div className="flex items-center justify-around">
          {quickActions.slice(0, 4).map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className="flex flex-col items-center p-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <action.icon className="h-5 w-5 mb-1" />
              <span className="text-[10px] truncate max-w-16">{action.title.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
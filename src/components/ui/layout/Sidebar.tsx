
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, 
  FolderOpen, 
  FileText, 
  Users, 
  MessageCircle, 
  BarChart3, 
  ShoppingCart,
  CreditCard,
  HelpCircle,
  Settings,
  LogOut,
  Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  userRole?: 'client' | 'vendor' | 'admin';
  userProfile?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole = 'client', userProfile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/landing');
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['client', 'vendor', 'admin']
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: FolderOpen,
      roles: ['client', 'vendor', 'admin']
    },
    {
      title: 'Requests',
      href: '/requests',
      icon: FileText,
      roles: ['client', 'vendor', 'admin']
    },
    {
      title: 'Suppliers',
      href: '/suppliers',
      icon: Building2,
      roles: ['client', 'admin']
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageCircle,
      roles: ['client', 'vendor', 'admin']
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      roles: ['client', 'vendor', 'admin']
    },
    {
      title: 'Orders',
      href: '/orders',
      icon: ShoppingCart,
      roles: ['client', 'vendor', 'admin']
    },
    {
      title: 'Subscription',
      href: '/subscription',
      icon: CreditCard,
      roles: ['client', 'vendor']
    },
    {
      title: 'Support',
      href: '/support',
      icon: HelpCircle,
      roles: ['client', 'vendor', 'admin']
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['client', 'vendor', 'admin']
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center border-b px-6">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">MWRD</span>
        </Link>
      </div>

      {/* User Profile Section */}
      {userProfile && (
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">
                {userProfile.full_name?.charAt(0) || userProfile.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userProfile.full_name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userProfile.email}
              </p>
              <Badge variant="outline" className="text-xs mt-1">
                {userRole}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Sign Out Button */}
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DashboardThemeToggle } from "@/components/ui/DashboardThemeToggle";
import { Link, useLocation } from "react-router-dom";
import { ConversationsDropdown } from "@/components/conversations/ConversationsDropdown";
import { 
  Home, 
  FileText, 
  Package, 
  Users, 
  Settings,
  BarChart3,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  HelpCircle,
  MessageCircle,
  MessageSquare,
  Lock
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserProfile } from '@/types/database';

interface SidebarProps {
  userRole?: 'client' | 'vendor' | 'admin';
  userProfile?: UserProfile;
}

export const Sidebar = ({ userRole = 'client', userProfile }: SidebarProps) => {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const collapsed = false; // For now, sidebar is always expanded

  const clientMenu = [
    { icon: Home, label: t('nav.dashboard'), href: '/dashboard' },
    { icon: FileText, label: 'Projects', href: '/projects' },
    { icon: FileText, label: t('nav.requests'), href: '/requests' },
    { icon: Users, label: t('nav.suppliers'), href: '/suppliers' },
    { icon: MessageCircle, label: t('nav.messages'), href: '/messages', isMessagesDropdown: true },
    { icon: TrendingUp, label: t('nav.analytics'), href: '/analytics' },
    { icon: ShoppingCart, label: t('nav.orders'), href: '/orders' },
    { icon: CreditCard, label: t('nav.manageSubscription'), href: '/manage-subscription' },
    { icon: HelpCircle, label: t('nav.support'), href: '/support' },
    { icon: Settings, label: t('common.settings'), href: '/settings' },
  ];

  const supplierMenu = [
    { icon: Home, label: t('nav.dashboard'), href: '/dashboard' },
    { icon: FileText, label: t('nav.browseRequests'), href: '/browse-requests' },
    { icon: Package, label: t('nav.offers'), href: '/my-offers' },
    { icon: MessageCircle, label: t('nav.messages'), href: '/messages', isMessagesDropdown: true },
    { icon: TrendingUp, label: t('nav.analytics'), href: '/analytics' },
    { icon: ShoppingCart, label: t('nav.orders'), href: '/orders' },
    { icon: CreditCard, label: t('nav.manageSubscription'), href: '/manage-subscription' },
    { icon: HelpCircle, label: t('nav.support'), href: '/support' },
    { icon: Settings, label: t('common.settings'), href: '/settings' },
  ];

  const adminMenu = [
    { icon: Home, label: t('nav.dashboard'), href: '/dashboard' },
    { icon: BarChart3, label: t('nav.admin'), href: '/admin' },
    { icon: Users, label: t('nav.suppliers'), href: '/suppliers' },
    { icon: FileText, label: t('nav.requests'), href: '/requests' },
    { icon: MessageCircle, label: t('nav.messages'), href: '/messages', isMessagesDropdown: true },
    { icon: TrendingUp, label: t('nav.analytics'), href: '/analytics' },
    { icon: ShoppingCart, label: t('nav.orders'), href: '/orders' },
    { icon: HelpCircle, label: t('nav.support'), href: '/support' },
    { icon: Settings, label: t('common.settings'), href: '/settings' },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'vendor': return supplierMenu;
      case 'admin': return adminMenu;
      default: return clientMenu;
    }
  };

  const isActive = (href: string) => location.pathname === href;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'vendor': return 'secondary';
      default: return 'default';
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      en: { admin: 'Admin', vendor: 'Vendor', client: 'Client' },
      ar: { admin: 'مدير', vendor: 'مورد', client: 'عميل' }
    };
    return roleNames[language as keyof typeof roleNames]?.[role as keyof typeof roleNames.en] || role;
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="w-full lg:w-64 h-full bg-card flex flex-col sidebar-border">
      {/* User Profile Section */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="rtl-flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={userProfile?.avatar_url} 
              alt={userProfile?.full_name || userProfile?.email || 'User'} 
            />
            <AvatarFallback>
              {getInitials(userProfile?.full_name || userProfile?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="rtl-flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">
                {userProfile?.company_name || userProfile?.full_name || 'User'}
              </h3>
              <Badge variant={getRoleBadgeColor(userProfile?.role || 'client')} className="text-xs">
                {getRoleDisplayName(userProfile?.role || 'client')}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              ID: {userProfile?.id?.slice(0, 8) || 'N/A'}
            </p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-3 sm:px-4 py-4 space-y-1 sm:space-y-2">
        {getMenuItems().map((item, index) => {
          if (item.isMessagesDropdown) {
            return (
              <ConversationsDropdown key={index}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start gap-3 ${isActive(item.href) ? "bg-primary text-primary-foreground" : ""}`}
                >
                  <MessageSquare className="h-4 w-4" />
                  {!collapsed && <span>Messages</span>}
                </Button>
              </ConversationsDropdown>
            );
          }
          
          return (
            <Link key={index} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3 h-10 sm:h-12 text-sm sm:text-base rtl-justify-start rtl-flex",
                  isActive(item.href) && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Controls - Always visible with proper RTL support */}
      <div className="mt-auto p-3 sm:p-4 border-t bg-primary/5 space-y-3">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Theme / المظهر
          </p>
          <DashboardThemeToggle />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Language / اللغة
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="w-full text-xs sm:text-sm rtl-flex"
          >
            🌐 {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>
      </div>
    </div>
  );
};
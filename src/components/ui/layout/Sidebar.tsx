import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DashboardThemeToggle } from "@/components/ui/DashboardThemeToggle";
import { Link, useLocation } from "react-router-dom";
import { ConversationsDropdown } from "@/components/conversations/ConversationsDropdown";
import { MobileFriendlyCard } from "@/components/ui/MobileFriendlyCard";
import { MobileOptimizedButton } from "@/components/ui/MobileOptimizedButton";
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
    <div className="w-full lg:w-64 h-full flex flex-col border-r border-white/10 backdrop-blur-sm safe-area-pt safe-area-pb animate-fade-in" style={{ background: 'var(--gradient-unified-page)' }}>
      {/* Enhanced User Profile Section */}
      <MobileFriendlyCard className="m-3 sm:m-4 p-4 sm:p-5 border border-white/20 bg-white/10 backdrop-blur-md">
        <div className="rtl-flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-white/30">
              <AvatarImage 
                src={userProfile?.avatar_url} 
                alt={userProfile?.full_name || userProfile?.email || 'User'} 
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                {getInitials(userProfile?.full_name || userProfile?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange rounded-full border-2 border-white animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="rtl-flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base truncate text-white">
                {userProfile?.company_name || userProfile?.full_name || 'User'}
              </h3>
              <Badge 
                variant={getRoleBadgeColor(userProfile?.role || 'client')} 
                className="text-xs sm:text-sm animate-fade-in bg-white/20 text-white border-white/30"
              >
                {getRoleDisplayName(userProfile?.role || 'client')}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-white/80 truncate font-medium">
              {userProfile?.email}
            </p>
            <p className="text-xs text-white/60 truncate">
              ID: {userProfile?.id?.slice(0, 8) || 'N/A'}
            </p>
          </div>
        </div>
      </MobileFriendlyCard>
      
      {/* Enhanced Navigation */}
      <nav className="flex-1 px-3 sm:px-4 py-2 space-y-1 overflow-y-auto">
        {getMenuItems().map((item, index) => {
          if (item.isMessagesDropdown) {
            return (
              <ConversationsDropdown key={index}>
                <MobileOptimizedButton
                  variant="ghost"
                  touchOptimized
                  className={cn(
                    "w-full gap-3 h-11 sm:h-12 text-sm sm:text-base rtl-justify-start rtl-flex group text-white",
                    "transition-all duration-300 hover:bg-white/10 hover:shadow-md",
                    isActive(item.href) && "bg-white/20 text-white hover:bg-white/25 shadow-lg"
                  )}
                >
                  <div className="relative">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange rounded-full animate-pulse" />
                  </div>
                  <span className="truncate font-medium">Messages</span>
                </MobileOptimizedButton>
              </ConversationsDropdown>
            );
          }
          
          return (
            <Link key={index} to={item.href} className="block">
              <MobileOptimizedButton
                variant="ghost"
                touchOptimized
                className={cn(
                  "w-full gap-3 h-11 sm:h-12 text-sm sm:text-base rtl-justify-start rtl-flex group text-white",
                  "transition-all duration-300 hover:bg-white/10 hover:shadow-md hover:scale-[1.02]",
                  isActive(item.href) && "bg-white/20 text-white hover:bg-white/25 shadow-lg scale-[1.02]"
                )}
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate font-medium">{item.label}</span>
                {isActive(item.href) && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r animate-fade-in" />
                )}
              </MobileOptimizedButton>
            </Link>
          );
        })}
      </nav>

      {/* Enhanced Controls */}
      <div className="mt-auto p-3 sm:p-4">
        <MobileFriendlyCard className="bg-white/10 border border-white/20 p-4 backdrop-blur-md">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center gap-2">
                🎨 {language === 'ar' ? 'المظهر' : 'Theme'}
              </p>
              <DashboardThemeToggle />
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center gap-2">
                🌐 {language === 'ar' ? 'اللغة' : 'Language'}
              </p>
              <MobileOptimizedButton
                variant="outline"
                size="sm"
                touchOptimized
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="w-full text-xs sm:text-sm rtl-flex hover:bg-white/10 hover:border-white/30 text-white border-white/30"
              >
                {language === 'en' ? '🇸🇦 العربية' : '🇺🇸 English'}
              </MobileOptimizedButton>
            </div>
          </div>
        </MobileFriendlyCard>
      </div>
    </div>
  );
};
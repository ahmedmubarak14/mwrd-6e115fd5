import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { User, LogOut, Settings, Bell, Search, Menu } from "lucide-react";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { SearchModal } from "@/components/modals/SearchModal";
import { NotificationsModal } from "@/components/modals/NotificationsModal";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import StatusIndicator from "@/components/StatusIndicator";
import { DashboardThemeToggle } from "@/components/ui/DashboardThemeToggle";

interface HeaderProps {
  onMobileMenuOpen?: () => void;
}

export const Header = ({ onMobileMenuOpen }: HeaderProps) => {
  const { t, language } = useLanguage();
  const { user, userProfile, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const { toast } = useToast();
  const isRTL = language === 'ar';

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSettingsClick = () => {
    toast({
      title: isRTL ? "الإعدادات" : "Settings",
      description: isRTL ? "صفحة الإعدادات ستكون متاحة قريباً" : "Settings page will be available soon",
    });
  };

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="h-20 sm:h-24 lg:h-28 border-b bg-[#66023C] backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center justify-between">
        
        {/* Logo - positioned based on language */}
        <div className="rtl-order-1 flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 sm:h-10 sm:w-10 text-white hover:bg-white/10"
            onClick={onMobileMenuOpen}
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <Link 
            to="/landing" 
            className="flex items-center"
          >
            <img 
              src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
              alt="MWRD Logo"
              className="h-12 sm:h-20 lg:h-24 w-auto hover:scale-105 transition-transform"
            />
          </Link>
        </div>
        
        {/* Actions - positioned based on language */}
        <div className="rtl-order-3 rtl-flex items-center gap-1 sm:gap-2 lg:gap-4">
          <SearchModal>
            <div className="relative hidden xl:block cursor-pointer">
              <Search className="absolute rtl-left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
              <input
                type="text"
                placeholder={t('dashboard.search')}
                className="rtl-pl-4 rtl-pr-4 py-2 border border-white/20 rounded-lg w-80 bg-white/10 text-white placeholder:text-white/60 focus:bg-white/20 transition-colors rtl-text-left cursor-pointer"
                readOnly
              />
            </div>
          </SearchModal>
          
          <SearchModal>
            <Button variant="ghost" size="icon" className="hidden sm:flex xl:hidden h-8 w-8 sm:h-10 sm:w-10 text-white hover:bg-white/10">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </SearchModal>
          
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          
          <DashboardThemeToggle />
          
          <div className="hidden lg:block">
            <StatusIndicator />
          </div>
          
          <NotificationsModal>
            <Button variant="ghost" size="icon" className="relative hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 text-white hover:bg-white/10">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 rtl--right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </NotificationsModal>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rtl-flex items-center gap-1 sm:gap-2 px-1 sm:px-2 lg:px-3 rounded-lg h-8 sm:h-10 text-white hover:bg-white/10">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarFallback className="text-xs sm:text-sm bg-white/20 text-white">
                    {getUserInitials(userProfile?.full_name, userProfile?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="rtl-text-left hidden lg:block">
                  <p className="text-sm font-medium text-white">{userProfile?.full_name || userProfile?.email?.split('@')[0] || t('dashboard.welcome').replace('Welcome to MWRD', 'Welcome').replace('مرحباً بك في مورد', 'مرحباً')}</p>
                  <p className="text-xs text-white/70 capitalize">{userProfile?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="z-50 bg-popover w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="rtl-flex items-center">
                  <User className="rtl-mr-2 h-4 w-4" />
                  <span>{t('common.profile')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rtl-flex" onClick={handleSettingsClick}>
                <Settings className="rtl-mr-2 h-4 w-4" />
                <span>{t('common.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="rtl-flex">
                <LogOut className="rtl-mr-2 h-4 w-4" />
                <span>{t('common.signOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
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

interface HeaderProps {
  onMobileMenuOpen?: () => void;
}

export const Header = ({ onMobileMenuOpen }: HeaderProps) => {
  const { t, language } = useLanguage();
  const { userProfile, signOut } = useAuth();
  const isRTL = language === 'ar';

  const handleSignOut = async () => {
    await signOut();
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
    <header className="h-20 sm:h-24 lg:h-28 border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
      <div className={`container mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 sm:h-10 sm:w-10"
            onClick={onMobileMenuOpen}
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/842b99cc-446d-41b5-8de7-b9c12faa1ed9.png" 
              alt="Supplify Logo"
              className="h-12 sm:h-20 lg:h-24 w-auto hover:scale-105 transition-transform"
            />
          </Link>
        </div>
        
        <div className={`flex items-center gap-1 sm:gap-2 lg:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="relative hidden xl:block">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`} />
            <input
              type="text"
              placeholder={t('dashboard.search')}
              className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg w-80 bg-background/50 text-foreground placeholder:text-muted-foreground focus:bg-background transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex xl:hidden h-8 w-8 sm:h-10 sm:w-10">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          
          <Button variant="ghost" size="icon" className="relative hidden sm:flex h-8 w-8 sm:h-10 sm:w-10">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs`}>
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`flex items-center gap-1 sm:gap-2 px-1 sm:px-2 lg:px-3 rounded-lg h-8 sm:h-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarFallback className="text-xs sm:text-sm bg-primary/10 text-primary">
                    {getUserInitials(userProfile?.full_name, userProfile?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className={`${isRTL ? 'text-right' : 'text-left'} hidden lg:block`}>
                  <p className="text-sm font-medium">{userProfile?.full_name || userProfile?.email?.split('@')[0] || t('dashboard.welcome').replace('Welcome to Supplify', 'Welcome').replace('مرحباً بك في سبلايفي', 'مرحباً')}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userProfile?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <User className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  <span>{t('common.profile')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className={isRTL ? 'flex-row-reverse' : ''}>
                <Settings className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                <span>{t('common.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className={isRTL ? 'flex-row-reverse' : ''}>
                <LogOut className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                <span>{t('common.signOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
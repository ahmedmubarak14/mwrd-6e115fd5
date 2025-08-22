import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Globe,
  RefreshCw,
} from "lucide-react";
import mwrdLogo from "@/assets/mwrd-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouteAwareTheme } from "@/contexts/RouteAwareThemeContext";
import { DashboardThemeToggle } from "@/components/ui/DashboardThemeToggle";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useRouteAwareTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRTL = language === 'ar';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global admin search
      toast.info(`${t('searching')}: ${searchQuery}`);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Trigger page refresh or data reload
    window.location.reload();
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-user':
        navigate('/admin/users?action=create');
        break;
      case 'approve-requests':
        navigate('/admin/content/requests');
        break;
      case 'view-analytics':
        navigate('/admin/analytics');
        break;
      default:
        break;
    }
  };

  return (
    <header className="h-20 sm:h-24 lg:h-28 border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center justify-between">
        {/* Logo - positioned based on language */}
        <div className={cn("flex items-center gap-2 sm:gap-4", isRTL ? "order-3" : "order-1")}>
          <SidebarTrigger className="lg:hidden h-8 w-8 sm:h-10 sm:w-10" />
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <img 
              src={mwrdLogo} 
              alt="MWRD Logo"
              className="h-12 sm:h-20 lg:h-24 w-auto"
            />
          </button>
        </div>

        {/* Actions - positioned based on language */}
        <div className={cn("flex items-center gap-1 sm:gap-2 lg:gap-4", isRTL ? "order-1 flex-row-reverse" : "order-3")}>
          <div className="relative hidden xl:block cursor-pointer">
            <Search className={cn("absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4", isRTL ? "right-3" : "left-3")} />
            <input
              type="text"
              placeholder={t('admin.searchPlaceholder')}
              className={cn(
                "py-2 border rounded-lg w-80 bg-background/50 text-foreground placeholder:text-muted-foreground focus:bg-background transition-colors cursor-pointer",
                isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
              )}
              readOnly
              onClick={(e) => e.preventDefault()}
            />
          </div>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex xl:hidden h-8 w-8 sm:h-10 sm:w-10">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <DashboardThemeToggle />
          
          <Button variant="ghost" size="icon" className="relative hidden sm:flex h-8 w-8 sm:h-10 sm:w-10">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className={cn("absolute -top-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs", isRTL ? "-left-1" : "-right-1")}>
              3
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="hidden sm:flex"
          >
            🌐 {language === 'en' ? 'العربية' : 'English'}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("flex items-center gap-1 sm:gap-2 px-1 sm:px-2 lg:px-3 rounded-lg h-8 sm:h-10", isRTL && "flex-row-reverse")}>
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs sm:text-sm">
                  {userProfile?.full_name?.[0] || userProfile?.email?.[0] || 'A'}
                </div>
                <div className={cn("hidden lg:block", isRTL && "text-right")}>
                  <p className="text-sm font-medium">{userProfile?.full_name || userProfile?.email?.split('@')[0] || t('admin.adminUser')}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userProfile?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="z-50 bg-popover w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')} className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                <User className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                <span>{t('common.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/settings')} className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                <Settings className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                <span>{t('common.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                <span>{t('common.signOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
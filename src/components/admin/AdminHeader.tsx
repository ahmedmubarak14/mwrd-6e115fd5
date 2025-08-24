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
    <header 
      className="h-20 sm:h-24 lg:h-28 border-b backdrop-blur-sm sticky top-0 z-50" 
      style={{ background: 'var(--gradient-header)' }}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center justify-between">
        {/* Logo - positioned based on language */}
        <div className="rtl-order-1 flex items-center gap-2 sm:gap-4">
          <SidebarTrigger className="lg:hidden h-8 w-8 sm:h-10 sm:w-10 text-white hover:bg-white/10" />
          
          <button
            onClick={() => navigate('/landing')}
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <img 
              src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
              alt="MWRD Logo"
              className="h-12 sm:h-20 lg:h-24 w-auto"
            />
          </button>
        </div>

        {/* Actions - positioned based on language */}
        <div className="rtl-order-3 rtl-flex items-center gap-1 sm:gap-2 lg:gap-4">
          <form onSubmit={handleSearch}>
            <div className="relative hidden xl:block">
              <Search className="absolute rtl-left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('admin.searchPlaceholder')}
                className="rtl-pl-4 rtl-pr-4 py-2 border border-white/20 rounded-lg w-80 bg-white/10 text-white placeholder:text-white/60 focus:bg-white/20 transition-colors rtl-text-left"
              />
            </div>
          </form>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchQuery('')}
            className="hidden sm:flex xl:hidden h-8 w-8 sm:h-10 sm:w-10 text-white hover:bg-white/10"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <DashboardThemeToggle />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => toast.info(t('admin.notificationsDemo'))}
            className="relative hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 text-white hover:bg-white/10"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute -top-1 rtl--right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
              3
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="hidden sm:flex bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            🌐 {language === 'en' ? 'العربية' : 'English'}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rtl-flex items-center gap-1 sm:gap-2 px-1 sm:px-2 lg:px-3 rounded-lg h-8 sm:h-10 text-white hover:bg-white/10">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white/20 text-white flex items-center justify-center text-xs sm:text-sm">
                  {userProfile?.full_name?.[0] || userProfile?.email?.[0] || 'A'}
                </div>
                <div className="rtl-text-left hidden lg:block">
                  <p className="text-sm font-medium text-white">{userProfile?.full_name || userProfile?.email?.split('@')[0] || t('admin.adminUser')}</p>
                  <p className="text-xs text-white/70 capitalize">{userProfile?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="z-50 bg-popover w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')} className="rtl-flex items-center">
                <User className="rtl-mr-2 h-4 w-4" />
                <span>{t('common.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="rtl-flex items-center">
                <Settings className="rtl-mr-2 h-4 w-4" />
                <span>{t('common.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="rtl-flex items-center">
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

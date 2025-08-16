import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  Globe,
  RefreshCw,
  Plus,
  Filter,
  Home,
  ArrowLeft
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
import { DashboardThemeToggle } from "@/components/ui/DashboardThemeToggle";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { toast } from "sonner";

export const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
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
        <div className="rtl-order-1 flex items-center gap-2 sm:gap-4">
          <SidebarTrigger className="lg:hidden h-8 w-8 sm:h-10 sm:w-10" />
          
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/842b99cc-446d-41b5-8de7-b9c12faa1ed9.png" 
              alt="Supplify Logo"
              className="h-12 sm:h-20 lg:h-24 w-auto hover:scale-105 transition-transform"
            />
          </div>
          
          {/* Navigation to main site */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className={`text-muted-foreground hover:text-foreground hidden lg:flex ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span className={`${isRTL ? 'mr-2' : 'ml-2'}`}>
              {t('admin.backToSite')}
            </span>
          </Button>
        </div>

        {/* Actions - positioned based on language */}
        <div className="rtl-order-3 rtl-flex items-center gap-1 sm:gap-2 lg:gap-4">
          <div className="relative hidden xl:block cursor-pointer">
            <Search className="absolute rtl-left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder={t('admin.searchPlaceholder')}
              className="rtl-pl-4 rtl-pr-4 py-2 border rounded-lg w-80 bg-background/50 text-foreground placeholder:text-muted-foreground focus:bg-background transition-colors rtl-text-left cursor-pointer"
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
            <span className="absolute -top-1 rtl--right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
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
              <Button variant="ghost" className="rtl-flex items-center gap-1 sm:gap-2 px-1 sm:px-2 lg:px-3 rounded-lg h-8 sm:h-10">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs sm:text-sm">
                  {userProfile?.full_name?.[0] || userProfile?.email?.[0] || 'A'}
                </div>
                <div className="rtl-text-left hidden lg:block">
                  <p className="text-sm font-medium">{userProfile?.full_name || userProfile?.email?.split('@')[0] || t('admin.adminUser')}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userProfile?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="z-50 bg-popover w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')} className="rtl-flex items-center">
                <User className="rtl-mr-2 h-4 w-4" />
                <span>{t('common.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/settings')} className="rtl-flex">
                <Settings className="rtl-mr-2 h-4 w-4" />
                <span>{t('common.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="rtl-flex">
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
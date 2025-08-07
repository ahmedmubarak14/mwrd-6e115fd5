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
import { useTheme } from "next-themes";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { toast } from "sonner";

export const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
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
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Sidebar trigger, logo and breadcrumbs */}
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <SidebarTrigger className="h-8 w-8" />
          
          {/* Logo and site navigation */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img 
              src="/lovable-uploads/91db8182-e5ce-4596-90c8-bfa524cd0464.png" 
              alt="Supplify Logo" 
              className="h-8 w-8 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">
                {t('adminPanel')}
              </h1>
            </div>
          </div>
          
          {/* Navigation to main site */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className={`text-muted-foreground hover:text-foreground ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Home className="h-4 w-4" />
            <span className={`hidden sm:inline ${isRTL ? 'mr-2' : 'ml-2'}`}>
              {t('backToSite')}
            </span>
          </Button>
          
          <AdminBreadcrumbs />
        </div>

        {/* Center - Search */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </form>
        </div>

        {/* Right side - Actions and user menu */}
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Quick actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={`hidden lg:flex ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Plus className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {t('quickActions')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
              <DropdownMenuLabel>{t('quickActions')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleQuickAction('new-user')} className={isRTL ? 'flex-row-reverse' : ''}>
                <User className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('addNewUser')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickAction('approve-requests')} className={isRTL ? 'flex-row-reverse' : ''}>
                <Filter className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('reviewRequests')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickAction('view-analytics')} className={isRTL ? 'flex-row-reverse' : ''}>
                <Bell className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('viewAnalytics')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hidden sm:flex"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>

          {/* Notifications */}
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
              3
            </Badge>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {/* Language toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
          >
            <Globe className="h-4 w-4" />
            <span className="ml-1 text-xs">{language.toUpperCase()}</span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{userProfile?.full_name || userProfile?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
              <DropdownMenuLabel>
                <div className={`flex flex-col space-y-1 ${isRTL ? 'text-right' : ''}`}>
                  <p className="text-sm font-medium leading-none">
                    {userProfile?.full_name || t('adminUser')}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userProfile?.email}
                  </p>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {t(userProfile?.role || 'admin')}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/admin/settings')} className={isRTL ? 'flex-row-reverse' : ''}>
                <Settings className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('adminSettings')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')} className={isRTL ? 'flex-row-reverse' : ''}>
                <User className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('nav.profile')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className={`text-destructive ${isRTL ? 'flex-row-reverse' : ''}`}>
                <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('auth.signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
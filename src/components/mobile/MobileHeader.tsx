import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/realtime/NotificationBell";
import { SearchModal } from "@/components/modals/SearchModal";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { useCapacitor } from "@/hooks/useCapacitor";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  Search, 
  Menu,
  Bell,
  User,
  MessageCircle,
  Plus
} from "lucide-react";

export const MobileHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { triggerHaptic } = useCapacitor();
  const { isMobile, orientation } = useMobileDetection();
  const languageContext = useOptionalLanguage();
  const { isRTL } = languageContext || { isRTL: false };

  const [showMenu, setShowMenu] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin')) return isRTL ? 'لوحة الإدارة' : 'Admin Panel';
    if (path.includes('/vendor')) return isRTL ? 'لوحة المورد' : 'Vendor Dashboard';
    if (path.includes('/requests')) return isRTL ? 'الطلبات' : 'Requests';
    if (path.includes('/offers')) return isRTL ? 'العروض' : 'Offers';
    if (path.includes('/orders')) return isRTL ? 'الطلبات' : 'Orders';
    if (path.includes('/messages')) return isRTL ? 'الرسائل' : 'Messages';
    if (path.includes('/search')) return isRTL ? 'البحث' : 'Search';
    if (path.includes('/profile')) return isRTL ? 'الملف الشخصي' : 'Profile';
    if (path === '/dashboard') return isRTL ? 'لوحة التحكم' : 'Dashboard';
    return 'MWRD';
  };

  const showBackButton = () => {
    const backPaths = ['/profile', '/search', '/requests/create'];
    return backPaths.some(path => location.pathname.includes(path));
  };

  const handleBack = async () => {
    await triggerHaptic();
    navigate(-1);
  };

  const handleMenuToggle = async () => {
    await triggerHaptic();
    setShowMenu(!showMenu);
  };

  const handleActionClick = async (action: () => void) => {
    await triggerHaptic();
    action();
  };

  return (
    <>
      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "mobile-header safe-area-padding-top"
      )}>
        <div className="container flex h-14 items-center px-4">
          {/* Left Side */}
          <div className={cn("flex items-center gap-2", isRTL && "order-3")}>
            {showBackButton() ? (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleBack}
                className="h-9 w-9"
              >
                <ArrowLeft className={cn("h-4 w-4", isRTL && "rotate-180")} />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleMenuToggle}
                className="h-9 w-9"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Center - Title */}
          <div className={cn(
            "flex-1 text-center",
            isRTL ? "order-2" : ""
          )}>
            <h1 className="text-lg font-semibold truncate">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right Side */}
          <div className={cn(
            "flex items-center gap-2",
            isRTL ? "order-1" : ""
          )}>
            {/* Search */}
            <SearchModal>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9"
              >
                <Search className="h-4 w-4" />
              </Button>
            </SearchModal>

            {/* Notifications */}
            {user && (
              <div className="relative">
                <NotificationBell />
              </div>
            )}

            {/* Profile Avatar */}
            {user && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleActionClick(() => navigate('/profile'))}
                className="h-9 w-9 p-0"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={userProfile?.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {userProfile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            )}
          </div>
        </div>

        {/* Role Badge */}
        {userProfile?.role && (
          <div className="px-4 pb-2">
            <Badge variant="secondary" className="text-xs">
              {userProfile.role === 'admin' ? (isRTL ? 'مدير' : 'Admin') :
               userProfile.role === 'vendor' ? (isRTL ? 'مورد' : 'Vendor') :
               (isRTL ? 'عميل' : 'Client')}
            </Badge>
          </div>
        )}
      </header>

      {/* Quick Actions Bar */}
      {location.pathname === '/dashboard' && (
        <div className="border-b bg-muted/50 p-2">
          <div className="flex gap-2 overflow-x-auto">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleActionClick(() => navigate('/requests/create'))}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-3 w-3" />
              {isRTL ? 'طلب جديد' : 'New Request'}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleActionClick(() => navigate('/search'))}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Search className="h-3 w-3" />
              {isRTL ? 'البحث' : 'Search'}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleActionClick(() => navigate('/messages'))}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="h-3 w-3" />
              {isRTL ? 'الرسائل' : 'Messages'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
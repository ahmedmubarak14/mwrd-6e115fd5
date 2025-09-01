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
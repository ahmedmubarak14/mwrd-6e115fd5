import { NavLink, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { useCapacitor } from "@/hooks/useCapacitor";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Search, 
  FileText, 
  Package, 
  MessageCircle, 
  User,
  Plus,
  ShoppingCart
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
  roles?: string[];
}

export const MobileBottomNav = () => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const { triggerHaptic } = useCapacitor();
  const { isMobile } = useMobileDetection();
  const languageContext = useOptionalLanguage();
  const { isRTL } = languageContext || { isRTL: false };

  const handleNavClick = async () => {
    await triggerHaptic();
  };

  if (!isMobile) return null;

  const getNavItems = () => {
    const baseItems = [
      {
        path: '/dashboard',
        label: isRTL ? 'الرئيسية' : 'Home',
        icon: Home,
      },
      {
        path: '/search',
        label: isRTL ? 'البحث' : 'Search',
        icon: Search,
      }
    ];

    if (userProfile?.role === 'admin') {
      baseItems.push(
        {
          path: '/admin/dashboard',
          label: isRTL ? 'الإدارة' : 'Admin',
          icon: Package,
        },
        {
          path: '/admin/users',
          label: isRTL ? 'المستخدمون' : 'Users',
          icon: User,
        }
      );
    } else if (userProfile?.role === 'vendor') {
      baseItems.push(
        {
          path: '/vendor-dashboard',
          label: isRTL ? 'المورد' : 'Vendor',
          icon: Package,
        },
        {
          path: '/profile',
          label: isRTL ? 'الملف الشخصي' : 'Profile',
          icon: User,
        }
      );
    } else {
      baseItems.push(
        {
          path: '/requests',
          label: isRTL ? 'الطلبات' : 'Requests',
          icon: FileText,
        },
        {
          path: '/profile',
          label: isRTL ? 'الملف الشخصي' : 'Profile',
          icon: User,
        }
      );
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "mobile-bottom-nav safe-area-padding-bottom"
    )}>
      <div className="flex items-center justify-around py-2 px-4 max-w-screen-xl mx-auto">
        {navItems.map((item) => (
          <div key={item.path} className="flex-1 max-w-20">
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-colors",
                "hover:bg-accent/50 rounded-lg haptic-button",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </NavLink>
          </div>
        ))}
      </div>
    </nav>
  );
};

// Spacer component to account for bottom navigation
export const MobileBottomNavSpacer = () => {
  return <div className="h-20 w-full shrink-0" />;
};
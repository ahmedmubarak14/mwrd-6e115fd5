import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  FileText, 
  Package, 
  Users, 
  Settings,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  userRole?: 'client' | 'supplier' | 'admin';
}

export const Sidebar = ({ userRole = 'client' }: SidebarProps) => {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();

  const clientMenu = [
    { icon: Home, label: t('nav.dashboard'), href: '/dashboard' },
    { icon: FileText, label: t('nav.requests'), href: '/requests' },
    { icon: Users, label: t('nav.suppliers'), href: '/suppliers' },
    { icon: Settings, label: t('nav.profile'), href: '/profile' },
  ];

  const supplierMenu = [
    { icon: Home, label: t('nav.dashboard'), href: '/dashboard' },
    { icon: FileText, label: t('nav.requests'), href: '/browse-requests' },
    { icon: Package, label: t('nav.offers'), href: '/my-offers' },
    { icon: Settings, label: t('nav.profile'), href: '/profile' },
  ];

  const adminMenu = [
    { icon: Home, label: t('nav.dashboard'), href: '/dashboard' },
    { icon: BarChart3, label: 'Admin Panel', href: '/admin' },
    { icon: Users, label: t('nav.suppliers'), href: '/suppliers' },
    { icon: FileText, label: t('nav.requests'), href: '/requests' },
    { icon: Settings, label: t('nav.profile'), href: '/profile' },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'supplier': return supplierMenu;
      case 'admin': return adminMenu;
      default: return clientMenu;
    }
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="w-full h-full bg-card border-r flex flex-col">
      <div className="p-4 sm:p-6 border-b">
        <h2 className="text-base sm:text-lg font-semibold text-primary">{t('app.name')}</h2>
      </div>
      
      <nav className="flex-1 px-3 sm:px-4 py-4 space-y-1 sm:space-y-2">
        {getMenuItems().map((item, index) => (
          <Link key={index} to={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-10 sm:h-12 text-left text-sm sm:text-base",
                isActive(item.href) && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>

      {/* Language Switcher for Mobile - ALWAYS VISIBLE */}
      <div className="mt-auto p-3 sm:p-4 border-t bg-primary/5">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Language / اللغة</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="w-full text-xs sm:text-sm"
          >
            🌐 {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>
      </div>
    </div>
  );
};
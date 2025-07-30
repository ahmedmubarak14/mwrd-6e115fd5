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
    <div className={`w-full lg:w-64 h-full bg-card border-r flex flex-col ${language === 'ar' ? 'border-l border-r-0' : ''}`}>
      <div className={`p-4 sm:p-6 border-b flex items-center ${language === 'ar' ? 'justify-start' : 'justify-center'}`}>
        <img 
          src="/lovable-uploads/842b99cc-446d-41b5-8de7-b9c12faa1ed9.png" 
          alt="Supplify Logo"
          className="h-12 sm:h-16 w-auto"
        />
      </div>
      
      <nav className="flex-1 px-3 sm:px-4 py-4 space-y-1 sm:space-y-2">
        {getMenuItems().map((item, index) => (
          <Link key={index} to={item.href}>
            <Button
              variant="ghost"
              className={cn(
                `w-full gap-3 h-10 sm:h-12 text-left text-sm sm:text-base ${language === 'ar' ? 'justify-end flex-row-reverse text-right' : 'justify-start'}`,
                isActive(item.href) && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>

      {/* Language Switcher - Always visible with proper RTL support */}
      <div className={`mt-auto p-3 sm:p-4 border-t bg-primary/5 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className="space-y-2">
          <p className={`text-xs font-medium text-muted-foreground uppercase tracking-wide ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            Language / اللغة
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className={`w-full text-xs sm:text-sm ${language === 'ar' ? 'flex-row-reverse' : ''}`}
          >
            🌐 {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>
      </div>
    </div>
  );
};
import { useState } from "react";
import { Menu, X, Zap, TrendingUp, Building2, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const navigationItems = [
    {
      href: "/landing#platform",
      icon: Zap,
      label: t('nav.platform')
    },
    {
      href: "/why-start-with-mwrd",
      icon: TrendingUp,
      label: t('nav.whyStartWithUs')
    },
    {
      href: "/why-move-to-mwrd",
      icon: Building2,
      label: t('nav.whyMoveToUs')
    },
    {
      href: "/landing#services",
      icon: Sparkles,
      label: t('nav.services')
    },
    {
      href: "/pricing",
      icon: Star,
      label: t('nav.pricing')
    }
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side={isRTL ? "left" : "right"} className="w-80 p-0">
          <SheetHeader className={`p-6 border-b ${isRTL ? 'text-right' : 'text-left'}`}>
            <SheetTitle className={`flex items-center gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <Link to="/landing" onClick={handleLinkClick}>
                <img 
                  src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                  alt="MWRD Logo"
                  className="h-14 w-auto"
                />
              </Link>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu
            </SheetDescription>
            
            {/* Language Switcher below logo */}
            <div className={`flex pt-4 ${isRTL ? 'justify-end' : 'justify-center'}`}>
              <LanguageSwitcher />
            </div>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            <nav className="flex-1 px-6 py-4">
              <ul className="space-y-4">
                {navigationItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Login and Start Free buttons after navigation */}
              <div className={`flex gap-3 mt-6 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link to="/home" onClick={handleLinkClick} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">
                    {t('auth.login')}
                  </Button>
                </Link>
                <Link to="/home" onClick={handleLinkClick} className="flex-1">
                  <Button size="sm" className="w-full bg-gradient-to-r from-primary to-accent">
                    {t('auth.startFree')}
                  </Button>
                </Link>
              </div>
            </nav>
            
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
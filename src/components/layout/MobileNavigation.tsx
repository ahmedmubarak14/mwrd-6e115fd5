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
  const { t } = useLanguage();

  const navigationItems = [
    {
      href: "/#platform",
      icon: Zap,
      label: t('language') === 'ar' ? 'المنصة' : 'Platform'
    },
    {
      href: "/#benefits", 
      icon: TrendingUp,
      label: t('language') === 'ar' ? 'المزايا' : 'Benefits'
    },
    {
      href: "/#services",
      icon: Building2,
      label: t('language') === 'ar' ? 'خدماتنا' : 'Our Services'
    },
    {
      href: "/#uvp",
      icon: Sparkles,
      label: t('language') === 'ar' ? 'ما يميزنا' : 'What Makes Us Unique'
    },
    {
      href: "/pricing",
      icon: Star,
      label: t('language') === 'ar' ? 'الأسعار' : 'Pricing'
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
        <SheetContent side="right" className="w-80 p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="flex items-center gap-3">
              <Link to="/" onClick={handleLinkClick}>
                <img 
                  src="/lovable-uploads/15bb5f5e-0a37-4ca9-81a8-ff8ec8a25b9d.png" 
                  alt="Supplify Logo" 
                  className="h-14 w-auto"
                />
              </Link>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            <nav className="flex-1 px-6 py-4">
              <ul className="space-y-4">
                {navigationItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
              <div className="space-y-3">
                <Link to="/home" onClick={handleLinkClick}>
                  <Button variant="ghost" size="sm" className="w-full">
                    {t('language') === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </Link>
                <Link to="/home" onClick={handleLinkClick}>
                  <Button size="sm" className="w-full bg-gradient-to-r from-primary to-accent">
                    {t('language') === 'ar' ? 'ابدأ مجاناً' : 'Start Free'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
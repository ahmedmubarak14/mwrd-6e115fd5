
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
      label: language === 'ar' ? 'المنصة' : 'Platform'
    },
    {
      href: "/why-start-with-mwrd",
      icon: TrendingUp,
      label: language === 'ar' ? 'لماذا تبدأ معنا' : 'Why Start With Us'
    },
    {
      href: "/what-makes-us-unique",
      icon: Star,
      label: language === 'ar' ? 'ما يميزنا' : 'What Makes Us Unique'
    },
    {
      href: "/why-move-to-mwrd",
      icon: Building2,
      label: language === 'ar' ? 'لماذا تنتقل إلينا' : 'Why Move To Us'
    },
    {
      href: "/landing#services",
      icon: Sparkles,
      label: language === 'ar' ? 'الخدمات' : 'Services'
    },
    {
      href: "/pricing",
      icon: Star,
      label: language === 'ar' ? 'الأسعار' : 'Pricing'
    }
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={`md:hidden ${isRTL ? 'order-first' : 'order-last'}`}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2 touch-manipulation">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side={isRTL ? "right" : "left"} 
          className="w-[90vw] max-w-sm p-0 safe-area-pt safe-area-pb animate-slide-in-right bg-background/95 backdrop-blur-md"
        >
          <SheetHeader className={`p-6 border-b ${isRTL ? 'text-right' : 'text-left'} bg-gradient-to-br from-primary/5 to-accent/5`}>
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
            
            {/* Language Switcher */}
            <div className={`flex pt-4 ${isRTL ? 'justify-end' : 'justify-center'}`}>
              <LanguageSwitcher />
            </div>

            {/* Authentication buttons moved to header - directly below language switcher */}
            <div className={`flex gap-3 pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link to="/login" onClick={handleLinkClick} className="flex-1">
                <Button variant="outline" size="default" className="w-full h-10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 touch-manipulation font-semibold text-sm">
                  {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Button>
              </Link>
              <Link to="/register" onClick={handleLinkClick} className="flex-1">
                <Button size="default" className="w-full h-10 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 touch-manipulation font-semibold text-sm">
                  {language === 'ar' ? 'إنشاء حساب' : 'Register'}
                </Button>
              </Link>
            </div>
          </SheetHeader>
          
          <div className="flex flex-col h-full bg-gradient-to-b from-background to-primary/5">
            <nav className="flex-1 px-6 py-6">
              <ul className="space-y-3">
                {navigationItems.map((item, index) => (
                  <li key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-4 p-4 rounded-xl bg-white/10 border border-white/30 backdrop-blur-20 hover:shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 touch-manipulation ${isRTL ? 'flex-row-reverse text-right' : ''} group`}
                    >
                      <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <item.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-semibold text-base group-hover:text-primary transition-colors">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

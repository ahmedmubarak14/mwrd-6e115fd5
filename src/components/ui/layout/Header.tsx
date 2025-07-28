import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";

export const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="h-16 border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center gap-4">
          <Link to="/home" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/b443f385-9fd2-4ecc-8763-b6ed9bd406f8.png" 
              alt="Supplify Logo" 
              className="h-12 w-auto"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hover-scale">
              <User className="h-4 w-4 mr-2" />
              {t('nav.profile')}
            </Button>
            <Button variant="ghost" size="sm" className="hover-scale">
              <LogOut className="h-4 w-4 mr-2" />
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";

export const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Link to="/home" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/dbfa227c-ea00-42f4-9f7e-544c2b0bde60.png" 
            alt="Supplify Logo" 
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold text-primary">Supplify</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4 mr-2" />
            {t('nav.profile')}
          </Button>
          <Button variant="ghost" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            {t('auth.logout')}
          </Button>
        </div>
      </div>
    </header>
  );
};
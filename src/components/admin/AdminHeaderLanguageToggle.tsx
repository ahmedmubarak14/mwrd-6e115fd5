import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const AdminHeaderLanguageToggle = () => {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return null; // Language toggle is handled in user menu on mobile
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuItem 
          onClick={() => setLanguage('en')} 
          className={cn("flex items-center", isRTL && "flex-row-reverse", language === 'en' && "bg-accent")}
        >
          {t('admin.languageEnglish')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('ar')} 
          className={cn("flex items-center", isRTL && "flex-row-reverse", language === 'ar' && "bg-accent")}
        >
          {t('admin.languageArabic')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
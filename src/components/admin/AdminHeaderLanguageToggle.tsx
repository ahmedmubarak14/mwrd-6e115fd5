import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const AdminHeaderLanguageToggle = () => {
  const languageContext = useOptionalLanguage();
  const { language, setLanguage, isRTL } = languageContext || { 
    language: 'en' as const, 
    setLanguage: () => {},
    isRTL: false 
  };
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
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('ar')} 
          className={cn("flex items-center", isRTL && "flex-row-reverse", language === 'ar' && "bg-accent")}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSwitcher = () => {
  const languageContext = useLanguage();
  
  // Return null if no context available (component not wrapped in LanguageProvider)
  if (!languageContext) {
    return null;
  }
  
  const { language, setLanguage } = languageContext;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="px-3 py-1 h-8 min-w-[50px] border-muted-foreground/20 text-muted-foreground hover:text-foreground hover:border-foreground/30 rtl-transition font-medium"
    >
      {language.toUpperCase()}
    </Button>
  );
};
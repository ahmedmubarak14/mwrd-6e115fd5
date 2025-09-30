import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  // Show the target language (what user will switch TO)
  const label = language === 'ar' ? 'EN' : 'AR';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="px-3 py-1 h-8 min-w-[50px] border-muted-foreground/20 text-muted-foreground hover:text-foreground hover:border-foreground/30 rtl-transition font-medium hover:bg-accent"
    >
      {label}
    </Button>
  );
};
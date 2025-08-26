
import { Button } from "@/components/ui/button";
import { Menu, Bell, MessageSquare } from "lucide-react";
import { DashboardThemeToggle } from "@/components/ui/DashboardThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { ConversationsDropdown } from "@/components/conversations/ConversationsDropdown";

interface CleanHeaderProps {
  onMobileMenuOpen?: () => void;
}

export const CleanHeader = ({ onMobileMenuOpen }: CleanHeaderProps) => {
  const { isRTL } = useLanguage();

  return (
    <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onMobileMenuOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuOpen}
            className="md:hidden text-card-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/supplify-logo-white-bg.png" 
            alt="Supplify" 
            className="h-8 w-auto"
          />
          <span className="font-bold text-lg text-card-foreground hidden sm:inline">
            Supplify
          </span>
        </div>
      </div>

      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <ConversationsDropdown>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-card-foreground">
            <MessageSquare className="h-5 w-5" />
          </Button>
        </ConversationsDropdown>
        
        <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-card-foreground">
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            3
          </Badge>
        </Button>
        
        <LanguageSwitcher />
        <DashboardThemeToggle />
      </div>
    </header>
  );
};

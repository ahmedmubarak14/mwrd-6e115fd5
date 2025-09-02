import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const AdminHeaderSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t, isRTL } = useOptionalLanguage();
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`${t('common.search')}: ${searchQuery}`);
    }
  };

  if (isMobile) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => toast.info(t('admin.searchPlaceholder'))}
        className="h-8 w-8"
      >
        <Search className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <form onSubmit={handleSearch} className="hidden sm:block">
      <div className="relative">
        <Search className={cn("absolute top-1/2 transform -translate-y-1/2 text-foreground opacity-75 h-4 w-4", isRTL ? "right-3" : "left-3")} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('admin.searchPlaceholder')}
          className={cn(
            "py-2 border border-input rounded-md w-64 bg-background text-foreground placeholder:text-input-placeholder focus:outline-none focus:ring-2 focus:ring-ring text-sm",
            isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>
    </form>
  );
};
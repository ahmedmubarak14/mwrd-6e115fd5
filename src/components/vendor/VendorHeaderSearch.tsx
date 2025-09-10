import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const VendorHeaderSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const languageContext = useLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      // Search functionality will be implemented
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-accent/50 transition-all duration-200"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-80 p-3",
          isRTL && "text-right"
        )} 
        align={isRTL ? "end" : "start"}
      >
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <Input
              placeholder={t('common.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pr-10",
                isRTL && "text-right"
              )}
              autoFocus
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 h-6 w-6",
                  isRTL ? "left-2" : "right-2"
                )}
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              size="sm" 
              className="flex-1"
              disabled={!searchQuery.trim()}
            >
              <Search className="h-3 w-3 mr-1" />
              {t('common.search')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};
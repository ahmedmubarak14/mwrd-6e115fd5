import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileSearchBarProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  showFilter?: boolean;
  className?: string;
}

export const MobileSearchBar = ({
  placeholder = "Search...",
  value = "",
  onValueChange,
  onSearch,
  onFilterClick,
  showFilter = false,
  className
}: MobileSearchBarProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleValueChange = (newValue: string) => {
    setLocalValue(newValue);
    onValueChange?.(newValue);
  };

  const handleSearch = () => {
    onSearch?.(localValue);
  };

  const handleClear = () => {
    setLocalValue("");
    onValueChange?.("");
  };

  return (
    <div className={cn("flex items-center gap-2 w-full", className)}>
      <div 
        className={cn(
          "flex items-center flex-1 bg-muted rounded-xl transition-all duration-200",
          "border-2 border-transparent",
          isFocused && "border-primary/20 bg-background shadow-sm"
        )}
      >
        <div className="pl-3">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <Input
          value={localValue}
          onChange={(e) => handleValueChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder}
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-base placeholder:text-muted-foreground/60"
        />
        
        {localValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 w-8 p-0 mr-1"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {showFilter && (
        <Button
          variant="outline"
          size="icon"
          onClick={onFilterClick}
          className="h-12 w-12 rounded-xl"
        >
          <Filter className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
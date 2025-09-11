import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchWithSuggestions } from "@/components/search/SearchWithSuggestions";
import { useOptimizedSearch } from "@/hooks/useOptimizedSearch";
import type { EnhancedSearchFilters } from "@/hooks/useOptimizedSearch";

export const ClientHeaderSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { search } = useOptimizedSearch();

  const handleSearch = (filters: EnhancedSearchFilters) => {
    // Use enhanced search functionality
    search(filters);
    const query = filters.query || '';
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
    setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
  };

  return (
    <div className="relative flex items-center">
      {/* Compact Search Button */}
      {!isExpanded && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExpand}
          className="h-9 w-9 hover:bg-accent/50 transition-all duration-200"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      )}

      {/* Expanded Search Input */}
      {isExpanded && (
        <div className="flex items-center gap-1">
          <SearchWithSuggestions
            placeholder="Search RFQs, vendors, orders..."
            onSearch={handleSearch}
            className="w-48 sm:w-64"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCollapse}
            className="h-9 w-9 hover:bg-accent/50 shrink-0"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
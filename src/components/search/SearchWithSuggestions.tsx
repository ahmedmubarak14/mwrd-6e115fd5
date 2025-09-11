import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search, Clock, MapPin, Tag, TrendingUp, X } from 'lucide-react';
import { useOptimizedSearch, SearchSuggestion, EnhancedSearchFilters } from '@/hooks/useOptimizedSearch';

interface SearchWithSuggestionsProps {
  onSearch: (filters: EnhancedSearchFilters) => void;
  initialQuery?: string;
  placeholder?: string;
  className?: string;
}

export const SearchWithSuggestions = ({ 
  onSearch, 
  initialQuery = '', 
  placeholder = 'Search requests, offers, and vendors...',
  className = ''
}: SearchWithSuggestionsProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const { suggestions, getSuggestions, searchHistory } = useOptimizedSearch();
  const [localSuggestions, setLocalSuggestions] = useState<SearchSuggestion[]>([]);

  // Handle query changes and generate suggestions
  useEffect(() => {
    const updateSuggestions = async () => {
      if (query.length >= 2) {
        try {
          const newSuggestions = await getSuggestions(query);
          setLocalSuggestions(newSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to get suggestions:', error);
          setLocalSuggestions([]);
        }
      } else {
        setShowSuggestions(false);
        setLocalSuggestions([]);
      }
    };
    
    updateSuggestions();
    setActiveSuggestionIndex(-1);
  }, [query, getSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || localSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < localSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : localSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          handleSuggestionSelect(localSuggestions[activeSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    
    // Trigger search immediately
    onSearch({
      query: suggestion.text,
      category: '',
      location: '',
      budgetRange: [0, 10000],
      rating: 0,
      availability: false,
      urgency: '',
      tags: [],
      entityType: 'all'
    });
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch({
        query: query.trim(),
        category: '',
        location: '',
        budgetRange: [0, 10000],
        rating: 0,
        availability: false,
        urgency: '',
        tags: [],
        entityType: 'all'
      });
      setShowSuggestions(false);
    }
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'category':
        return <Tag className="h-3 w-3" />;
      case 'location':
        return <MapPin className="h-3 w-3" />;
      case 'recent':
        return <Clock className="h-3 w-3" />;
      case 'trending':
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <Search className="h-3 w-3" />;
    }
  };

  const getSuggestionTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'category':
        return 'Category';
      case 'location':
        return 'Location';
      case 'recent':
        return 'Recent';
      case 'trending':
        return 'Trending';
      default:
        return '';
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length >= 2 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="pr-10"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSearch}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
        >
          <Search className="h-4 w-4" />
        </Button>
        
        {query && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setQuery('');
              setShowSuggestions(false);
              inputRef.current?.focus();
            }}
            className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (localSuggestions.length > 0 || searchHistory.length > 0) && (
        <Card 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto"
        >
          <div className="p-2">
            {/* Current suggestions */}
            {localSuggestions.length > 0 && (
              <>
                <div className="px-2 py-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    Suggestions
                  </span>
                </div>
                {localSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.text}-${index}`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-muted transition-colors ${
                      index === activeSuggestionIndex ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="text-muted-foreground">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm">{suggestion.text}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getSuggestionTypeLabel(suggestion.type)}
                    </Badge>
                    {suggestion.count && (
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.count}
                      </Badge>
                    )}
                  </button>
                ))}
              </>
            )}

            {/* Recent searches */}
            {searchHistory.length > 0 && query.length < 2 && (
              <>
                {localSuggestions.length > 0 && <Separator className="my-2" />}
                <div className="px-2 py-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    Recent Searches
                  </span>
                </div>
                {searchHistory.slice(0, 5).map((term, index) => (
                  <button
                    key={`recent-${term}-${index}`}
                    onClick={() => handleSuggestionSelect({ text: term, type: 'recent' })}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-muted transition-colors"
                  >
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm flex-1">{term}</span>
                  </button>
                ))}
              </>
            )}

            {/* Quick search tips */}
            {query.length === 0 && (
              <>
                <Separator className="my-2" />
                <div className="px-2 py-1">
                  <span className="text-xs text-muted-foreground">
                    💡 Try searching for categories, locations, or specific terms
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
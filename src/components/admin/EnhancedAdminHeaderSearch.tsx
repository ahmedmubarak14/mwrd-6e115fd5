import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  X, 
  User, 
  FileText, 
  Package, 
  ShoppingCart, 
  Command,
  Clock,
  Filter
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  type: 'user' | 'request' | 'offer' | 'order';
  title: string;
  subtitle?: string;
  status?: string;
  url: string;
}

export const EnhancedAdminHeaderSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const isMobile = useIsMobile();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('admin-recent-searches', JSON.stringify(updated));
  };

  // Perform search
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search users
      const { data: users } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, company_name, role')
        .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,company_name.ilike.%${searchQuery}%`)
        .limit(5);

      users?.forEach(user => {
        searchResults.push({
          id: user.id,
          type: 'user',
          title: user.full_name || user.email,
          subtitle: user.company_name || user.role,
          url: `/admin/users?search=${user.id}`
        });
      });

      // Search requests
      const { data: requests } = await supabase
        .from('requests')
        .select('id, title, description, status, admin_approval_status')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);

      requests?.forEach(request => {
        searchResults.push({
          id: request.id,
          type: 'request',
          title: request.title,
          subtitle: request.description?.slice(0, 50) + '...',
          status: request.admin_approval_status,
          url: `/admin/requests?search=${request.id}`
        });
      });

      // Search offers
      const { data: offers } = await supabase
        .from('offers')
        .select('id, title, description, admin_approval_status')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);

      offers?.forEach(offer => {
        searchResults.push({
          id: offer.id,
          type: 'offer',
          title: offer.title || 'Untitled Offer',
          subtitle: offer.description?.slice(0, 50) + '...',
          status: offer.admin_approval_status,
          url: `/admin/offers?search=${offer.id}`
        });
      });

      // Search orders by ID
      const { data: orders } = await supabase
        .from('orders')
        .select('id, status, amount')
        .or(`id.ilike.%${searchQuery}%`)
        .limit(5);

      orders?.forEach(order => {
        searchResults.push({
          id: order.id,
          type: 'order',
          title: `Order #${order.id.slice(0, 8)}`,
          subtitle: `Amount: $${order.amount}`,
          status: order.status,
          url: `/admin/orders?search=${order.id}`
        });
      });

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      } else if (query.trim()) {
        saveRecentSearch(query);
        toast.info(`Searching for: ${query}`);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    navigate(result.url);
    setIsOpen(false);
    setQuery("");
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user': return User;
      case 'request': return FileText;
      case 'offer': return Package;
      case 'order': return ShoppingCart;
      default: return Search;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const variant = status === 'approved' ? 'success' : 
                   status === 'rejected' ? 'destructive' : 
                   status === 'pending' ? 'warning' : 'secondary';
    
    return <Badge variant={variant} size="sm">{status}</Badge>;
  };

  // Mobile search button
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 hover:bg-accent/50 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Search className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="admin-subtitle">{t('admin.search')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('admin.searchPlaceholder')}
                className="pl-10 admin-body"
                autoFocus
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            {/* Search results for mobile */}
            {results.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-1">
                {results.map((result, index) => {
                  const Icon = getResultIcon(result.type);
                  return (
                    <button
                      key={result.id}
                      className={cn(
                        "w-full text-left p-3 rounded-md hover:bg-accent/50 transition-colors",
                        selectedIndex === index && "bg-accent/50"
                      )}
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="admin-body truncate">{result.title}</p>
                          {result.subtitle && (
                            <p className="admin-caption truncate">{result.subtitle}</p>
                          )}
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop search
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className={cn(
            "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10",
            isRTL ? "right-3" : "left-3"
          )} />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={t('admin.searchAdvancedPlaceholder') || 'Search users, requests, offers...'}
            className={cn(
              "w-72 admin-body transition-all duration-200 hover:shadow-md focus:shadow-lg",
              isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
            )}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 h-6 w-6 z-10",
                isRTL ? "left-2" : "right-2"
              )}
              onClick={() => setQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0 bg-popover border border-border shadow-xl z-[100] backdrop-blur-sm" 
        align={isRTL ? "end" : "start"}
      >
        <div className="p-4">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-1">
              <p className="admin-caption mb-2">{t('admin.searchResults')}</p>
              {results.map((result, index) => {
                const Icon = getResultIcon(result.type);
                return (
                  <button
                    key={result.id}
                    className={cn(
                      "w-full text-left p-3 rounded-md hover:bg-accent/50 transition-colors",
                      selectedIndex === index && "bg-accent/50"
                    )}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="admin-body truncate">{result.title}</p>
                        {result.subtitle && (
                          <p className="admin-caption truncate">{result.subtitle}</p>
                        )}
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-6">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="admin-body">{t('admin.noSearchResults')}</p>
              <p className="admin-caption">{t('admin.tryDifferentSearch')}</p>
            </div>
          )}

          {!query && recentSearches.length > 0 && (
            <div className="space-y-2">
              <p className="admin-caption flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {t('admin.recentSearches')}
              </p>
              {recentSearches.map((recent, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 rounded hover:bg-accent/50 transition-colors admin-body"
                  onClick={() => setQuery(recent)}
                >
                  {recent}
                </button>
              ))}
            </div>
          )}

          <Separator className="my-3" />
          <div className="flex items-center justify-between">
            <p className="admin-caption flex items-center gap-1">
              <Command className="h-3 w-3" />
              {t('admin.searchTips') || 'Use ↑↓ to navigate, Enter to select'}
            </p>
            <Button variant="ghost" size="sm" className="admin-caption">
              <Filter className="h-3 w-3 mr-1" />
              {t('admin.advancedFilters')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
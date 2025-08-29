import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useSearch, SearchFilters } from "@/hooks/useSearch";
import { SearchResults } from "@/components/search/SearchResults";
import { Search, Filter, X } from "lucide-react";

interface SearchModalProps {
  children: React.ReactNode;
}

export const SearchModal = ({ children }: SearchModalProps) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    location: "",
    budgetRange: [0, 10000],
    rating: 0,
    availability: false,
    urgency: "",
    tags: [],
    entityType: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  const { results, loading, search, clearResults } = useSearch();

  // Auto-search when query changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (filters.query.trim()) {
        search(filters);
      } else {
        clearResults();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters.query, search, clearResults]);

  const handleSearch = () => {
    search(filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      query: "",
      category: "",
      location: "",
      budgetRange: [0, 10000],
      rating: 0,
      availability: false,
      urgency: "",
      tags: [],
      entityType: 'all'
    });
    clearResults();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right" : "text-left"}>
            {isRTL ? "البحث في مورد" : "Search MWRD"}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : "text-left"}>
            {isRTL ? "ابحث عن الطلبات والموردين والعروض" : "Search for requests, suppliers, and offers"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-3">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`} />
              <Input
                placeholder={isRTL ? "ابحث عن الطلبات والعروض والموردين..." : "Search for requests, offers, vendors..."}
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className={`${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'}`}
                autoFocus
              />
            </div>

            {/* Filter Controls */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Select value={filters.entityType} onValueChange={(value) => handleFilterChange('entityType', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="requests">{isRTL ? "الطلبات" : "Requests"}</SelectItem>
                  <SelectItem value="offers">{isRTL ? "العروض" : "Offers"}</SelectItem>
                  <SelectItem value="vendors">{isRTL ? "الموردين" : "Vendors"}</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Filter className="h-3 w-3" />
                {isRTL ? "المرشحات" : "Filters"}
              </Button>

              {(filters.category || filters.location) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <X className="h-3 w-3" />
                  {isRTL ? "مسح الكل" : "Clear"}
                </Button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                <div className="grid grid-cols-2 gap-3">
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "التصنيف" : "Category"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{isRTL ? "جميع التصنيفات" : "All Categories"}</SelectItem>
                      <SelectItem value="Manufacturing">{isRTL ? "التصنيع" : "Manufacturing"}</SelectItem>
                      <SelectItem value="Technology">{isRTL ? "التكنولوجيا" : "Technology"}</SelectItem>
                      <SelectItem value="Logistics">{isRTL ? "اللوجستيات" : "Logistics"}</SelectItem>
                      <SelectItem value="Marketing">{isRTL ? "التسويق" : "Marketing"}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder={isRTL ? "الموقع" : "Location"}
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            <SearchResults 
              results={results}
              loading={loading}
              onResultClick={(result) => {
                console.log('Result clicked:', result);
                setOpen(false);
              }}
              showActions={false}
            />
          </div>

          {/* Quick Actions */}
          {filters.query.length > 0 && results.length > 0 && (
            <div className={`flex gap-2 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button variant="outline" size="sm" onClick={handleSearch}>
                {isRTL ? "تطبيق المرشحات" : "Apply Filters"}
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                {isRTL ? "عرض الكل" : "View All"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
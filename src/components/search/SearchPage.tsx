import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearch, SearchFilters } from "@/hooks/useSearch";
import { AdvancedSearch } from "./AdvancedSearch";
import { SearchResults } from "./SearchResults";
import { Search, Filter, Download, Share } from "lucide-react";

interface SearchPageProps {
  initialQuery?: string;
  initialFilters?: Partial<SearchFilters>;
}

export const SearchPage = ({ initialQuery = "", initialFilters = {} }: SearchPageProps) => {
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') || initialQuery;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    query: queryFromUrl,
    category: "",
    location: "",
    budgetRange: [0, 10000],
    rating: 0,
    availability: false,
    urgency: "",
    tags: [],
    entityType: 'all',
    ...initialFilters
  });

  const { t, isRTL } = useLanguage();

  const { results, loading, totalCount, search, clearResults } = useSearch();
  const resultsPerPage = 10;
  const totalPages = Math.ceil(totalCount / resultsPerPage);

  // Auto-search when URL query changes or on mount
  useEffect(() => {
    if (queryFromUrl) {
      const newFilters = { ...filters, query: queryFromUrl };
      setFilters(newFilters);
      search(newFilters, 1, resultsPerPage);
    }
  }, [queryFromUrl]);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    search(newFilters, 1, resultsPerPage);
  };

  const handleClear = () => {
    const clearedFilters = {
      query: "",
      category: "",
      location: "",
      budgetRange: [0, 10000] as [number, number],
      rating: 0,
      availability: false,
      urgency: "",
      tags: [],
      entityType: 'all' as const
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    clearResults();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    search(filters, page, resultsPerPage);
  };

  const handleResultClick = (result: any) => {
    // Handle result click - navigate to detailed view
    console.log('Result clicked:', result);
    // You can implement navigation logic here based on result type
  };

  const exportResults = () => {
    // Export search results to CSV
    const csvData = results.map(result => ({
      Type: result.type,
      Title: result.title,
      Description: result.description,
      Location: result.location,
      Price: result.price,
      Status: result.status,
      'Created At': result.created_at,
      Relevance: `${result.relevance}%`
    }));

    const csvHeaders = Object.keys(csvData[0] || {});
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => csvHeaders.map(header => `"${row[header as keyof typeof row] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const hasActiveFilters = 
    filters.query || 
    filters.category || 
    filters.location || 
    filters.budgetRange[0] > 0 || 
    filters.budgetRange[1] < 10000 ||
    filters.rating > 0 ||
    filters.availability ||
    filters.urgency ||
    filters.tags.length > 0 ||
    filters.entityType !== 'all';

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Search className="h-5 w-5" />
              {isRTL ? "البحث المتقدم" : "Advanced Search"}
            </CardTitle>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant="outline">
                {totalCount} {isRTL ? "نتيجة" : "results"}
              </Badge>
              {results.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={exportResults}>
                    <Download className="h-4 w-4 mr-2" />
                    {isRTL ? "تصدير" : "Export"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    {isRTL ? "مشاركة" : "Share"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search Form */}
      <AdvancedSearch onSearch={handleSearch} onClear={handleClear} />

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardContent className="p-4">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Filter className="h-4 w-4" />
              <span className="font-medium">
                {isRTL ? "المرشحات النشطة:" : "Active Filters:"}
              </span>
            </div>
            <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {filters.query && (
                <Badge variant="secondary">
                  {isRTL ? "البحث:" : "Query:"} {filters.query}
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary">
                  {isRTL ? "التصنيف:" : "Category:"} {filters.category}
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary">
                  {isRTL ? "الموقع:" : "Location:"} {filters.location}
                </Badge>
              )}
              {filters.entityType !== 'all' && (
                <Badge variant="secondary">
                  {isRTL ? "النوع:" : "Type:"} {filters.entityType}
                </Badge>
              )}
              {(filters.budgetRange[0] > 0 || filters.budgetRange[1] < 10000) && (
                <Badge variant="secondary">
                  {isRTL ? "الميزانية:" : "Budget:"} ${filters.budgetRange[0]} - ${filters.budgetRange[1]}
                </Badge>
              )}
              {filters.rating > 0 && (
                <Badge variant="secondary">
                  {isRTL ? "التقييم:" : "Rating:"} {filters.rating}+ ⭐
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-6">
        {/* Results Header */}
        {(hasActiveFilters || results.length > 0) && (
          <Card>
            <CardContent className="p-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h2 className="text-lg font-semibold">
                    {isRTL ? "نتائج البحث" : "Search Results"}
                  </h2>
                  <p className="text-muted-foreground">
                    {totalCount > 0 
                      ? `${isRTL ? "عرض" : "Showing"} ${(currentPage - 1) * resultsPerPage + 1}-${Math.min(currentPage * resultsPerPage, totalCount)} ${isRTL ? "من" : "of"} ${totalCount}`
                      : isRTL ? "لا توجد نتائج" : "No results found"
                    }
                  </p>
                </div>
                
                {currentPage > 1 && totalPages > 1 && (
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? "الصفحة" : "Page"} {currentPage} {isRTL ? "من" : "of"} {totalPages}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        <SearchResults 
          results={results}
          loading={loading}
          onResultClick={handleResultClick}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        onClick={() => handlePageChange(pageNum)}
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};
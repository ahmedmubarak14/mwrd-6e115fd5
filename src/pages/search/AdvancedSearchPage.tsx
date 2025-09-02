import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedSearchFilters } from "@/components/search/AdvancedSearchFilters";
import { AdvancedSearchResults } from "@/components/search/AdvancedSearchResults";
import { useAdvancedSearch, SearchFilters } from "@/hooks/useAdvancedSearch";
import { Search, Building, Users } from "lucide-react";

export const AdvancedSearchPage = () => {
  const [searchType, setSearchType] = useState<'rfqs' | 'vendors'>('rfqs');
  const [currentPage, setCurrentPage] = useState(1);
  const { 
    results, 
    vendorResults, 
    loading, 
    totalCount, 
    searchRFQs, 
    searchVendors 
  } = useAdvancedSearch();

  const handleSearch = async (filters: SearchFilters) => {
    setCurrentPage(1);
    if (searchType === 'rfqs') {
      await searchRFQs(filters, 1);
    } else {
      await searchVendors(filters);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    if (searchType === 'rfqs') {
      // This would append results, but for simplicity we'll just reload
      await searchRFQs({}, nextPage);
    }
  };

  const hasMore = (currentPage * 20) < totalCount;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Search</h1>
          <p className="text-muted-foreground">
            Find RFQs and vendors with advanced filtering options
          </p>
        </div>
      </div>

      <Tabs 
        value={searchType} 
        onValueChange={(value) => setSearchType(value as 'rfqs' | 'vendors')}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="rfqs" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Search RFQs
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Search Vendors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rfqs" className="space-y-6">
          <AdvancedSearchFilters onSearch={handleSearch} searchType="rfqs" />
          <AdvancedSearchResults
            results={results}
            vendorResults={[]}
            loading={loading}
            totalCount={totalCount}
            searchType="rfqs"
            onLoadMore={hasMore ? handleLoadMore : undefined}
            hasMore={hasMore}
          />
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <AdvancedSearchFilters onSearch={handleSearch} searchType="vendors" />
          <AdvancedSearchResults
            results={[]}
            vendorResults={vendorResults}
            loading={loading}
            totalCount={vendorResults.length}
            searchType="vendors"
            onLoadMore={undefined}
            hasMore={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
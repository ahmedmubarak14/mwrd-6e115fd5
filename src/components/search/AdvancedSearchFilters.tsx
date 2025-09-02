import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Save, BookOpen } from "lucide-react";
import { SearchFilters, useAdvancedSearch } from "@/hooks/useAdvancedSearch";

interface AdvancedSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  searchType: 'rfqs' | 'vendors';
}

export const AdvancedSearchFilters = ({ onSearch, searchType }: AdvancedSearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { categories } = useAdvancedSearch();

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({});
    onSearch({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length;
  };

  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (filters.query) {
      activeFilters.push(
        <Badge key="query" variant="secondary" className="flex items-center gap-1">
          Search: {filters.query}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleFilterChange('query', '')}
          />
        </Badge>
      );
    }
    
    if (filters.category_id) {
      const category = categories.find(c => c.id === filters.category_id);
      activeFilters.push(
        <Badge key="category" variant="secondary" className="flex items-center gap-1">
          Category: {category?.name || 'Unknown'}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleFilterChange('category_id', '')}
          />
        </Badge>
      );
    }

    if (filters.priority) {
      activeFilters.push(
        <Badge key="priority" variant="secondary" className="flex items-center gap-1">
          Priority: {filters.priority}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleFilterChange('priority', '')}
          />
        </Badge>
      );
    }

    if (filters.location) {
      activeFilters.push(
        <Badge key="location" variant="secondary" className="flex items-center gap-1">
          Location: {filters.location}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => handleFilterChange('location', '')}
          />
        </Badge>
      );
    }

    return activeFilters;
  };

  return (
    <Card className="p-6">
      {/* Basic Search */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder={searchType === 'rfqs' ? 'Search RFQs...' : 'Search vendors...'}
              value={filters.query || ''}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={handleSearch} className="px-6">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </div>

        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {renderActiveFilters()}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <>
          <Separator className="my-4" />
          <div className="space-y-4">
            <h3 className="font-medium">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={filters.category_id || ''}
                  onValueChange={(value) => handleFilterChange('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              {searchType === 'rfqs' && (
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={filters.priority || ''}
                    onValueChange={(value) => handleFilterChange('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="Enter location"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>

            {/* Budget Range */}
            {searchType === 'rfqs' && (
              <div className="space-y-2">
                <Label>Budget Range</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="number"
                      placeholder="Min budget"
                      value={filters.budget_min || ''}
                      onChange={(e) => handleFilterChange('budget_min', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Max budget"
                      value={filters.budget_max || ''}
                      onChange={(e) => handleFilterChange('budget_max', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Deadline Range */}
            {searchType === 'rfqs' && (
              <div className="space-y-2">
                <Label>Deadline Range</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="date"
                      placeholder="From date"
                      value={filters.deadline_from || ''}
                      onChange={(e) => handleFilterChange('deadline_from', e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      placeholder="To date"
                      value={filters.deadline_to || ''}
                      onChange={(e) => handleFilterChange('deadline_to', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sort Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={filters.sort_by || 'created_at'}
                  onValueChange={(value) => handleFilterChange('sort_by', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date Created</SelectItem>
                    {searchType === 'rfqs' && (
                      <>
                        <SelectItem value="budget_max">Budget</SelectItem>
                        <SelectItem value="submission_deadline">Deadline</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Select
                  value={filters.sort_order || 'desc'}
                  onValueChange={(value) => handleFilterChange('sort_order', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSearch} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Search
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, Filter, X, MapPin, DollarSign, Calendar, Star } from "lucide-react";

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  budgetRange: [number, number];
  rating: number;
  availability: boolean;
  urgency: string;
  tags: string[];
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

const categories = [
  "All Categories",
  "Manufacturing",
  "Technology",
  "Logistics",
  "Marketing",
  "Consulting",
  "Design",
  "Legal",
];

const urgencyLevels = [
  "Any Urgency",
  "Low",
  "Medium",
  "High",
  "Urgent",
];

export const AdvancedSearch = ({ onSearch, onClear }: AdvancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    location: "",
    budgetRange: [0, 10000],
    rating: 0,
    availability: false,
    urgency: "",
    tags: [],
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      query: "",
      category: "",
      location: "",
      budgetRange: [0, 10000],
      rating: 0,
      availability: false,
      urgency: "",
      tags: [],
    });
    onClear();
  };

  const addTag = () => {
    if (tagInput.trim() && !filters.tags.includes(tagInput.trim())) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
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
    filters.tags.length > 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showAdvanced ? "Simple" : "Advanced"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Search suppliers, services, or keywords..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="flex-1"
          />
          <Button onClick={handleSearch} className="rtl-button-gap">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-6 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Category
                </Label>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  placeholder="City, Country"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget Range: ${filters.budgetRange[0]} - ${filters.budgetRange[1]}
              </Label>
              <Slider
                value={filters.budgetRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, budgetRange: value as [number, number] }))}
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rating */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Minimum Rating
                </Label>
                <Select 
                  value={filters.rating.toString()} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, rating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="5">5 Stars Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Urgency
                </Label>
                <Select 
                  value={filters.urgency} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, urgency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="availability"
                checked={filters.availability}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, availability: checked }))}
              />
              <Label htmlFor="availability">Available Now Only</Label>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={!hasActiveFilters}
          >
            Clear All
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSearch}>
              Search
            </Button>
            <Button onClick={handleSearch}>
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {filters.query && (
                <Badge variant="outline">Query: {filters.query}</Badge>
              )}
              {filters.category && (
                <Badge variant="outline">Category: {filters.category}</Badge>
              )}
              {filters.location && (
                <Badge variant="outline">Location: {filters.location}</Badge>
              )}
              {(filters.budgetRange[0] > 0 || filters.budgetRange[1] < 10000) && (
                <Badge variant="outline">
                  Budget: ${filters.budgetRange[0]} - ${filters.budgetRange[1]}
                </Badge>
              )}
              {filters.rating > 0 && (
                <Badge variant="outline">Rating: {filters.rating}+ Stars</Badge>
              )}
              {filters.availability && (
                <Badge variant="outline">Available Now</Badge>
              )}
              {filters.urgency && (
                <Badge variant="outline">Urgency: {filters.urgency}</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
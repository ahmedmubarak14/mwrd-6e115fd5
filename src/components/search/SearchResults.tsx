import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, DollarSign, Star, Building } from "lucide-react";
import { SearchResult } from "@/hooks/useSearch";

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  onResultClick: (result: SearchResult) => void;
  showActions?: boolean;
}

const ResultCard = ({ result, onClick, showActions = true }: { result: SearchResult; onClick: () => void; showActions?: boolean }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'request':
        return 'bg-blue-100 text-blue-800';
      case 'offer':
        return 'bg-green-100 text-green-800';
      case 'vendor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getTypeColor(result.type)}>
              {result.type.toUpperCase()}
            </Badge>
            <Badge variant={getStatusVariant(result.status)}>
              {result.status}
            </Badge>
          </div>
          <h3 className="font-medium text-lg">{result.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
            {result.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {result.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{result.location}</span>
            </div>
          )}
          
          {result.price && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>{result.currency || 'SAR'} {result.price.toLocaleString()}</span>
            </div>
          )}

          {result.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-yellow-500" />
              <span>{result.rating}/5</span>
            </div>
          )}
        </div>

        {showActions && (
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onClick(); }}>
            View Details
          </Button>
        )}
      </div>
    </Card>
  );
};

export const SearchResults = ({ results, loading, onResultClick, showActions = true }: SearchResultsProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-5 bg-muted rounded w-16"></div>
                <div className="h-5 bg-muted rounded w-20"></div>
              </div>
              <div className="h-6 bg-muted rounded w-2/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Building className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or browse all available items.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {results.length} Result{results.length !== 1 ? 's' : ''} Found
        </h2>
      </div>
      
      {results.map((result) => (
        <ResultCard
          key={result.id}
          result={result}
          onClick={() => onResultClick(result)}
          showActions={showActions}
        />
      ))}
    </div>
  );
};
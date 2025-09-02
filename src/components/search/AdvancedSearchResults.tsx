import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, DollarSign, Clock, User, Building } from "lucide-react";
import { AdvancedSearchResult, VendorSearchResult } from "@/hooks/useAdvancedSearch";
import { format } from "date-fns";

interface AdvancedSearchResultsProps {
  results: AdvancedSearchResult[];
  vendorResults: VendorSearchResult[];
  loading: boolean;
  totalCount: number;
  searchType: 'rfqs' | 'vendors';
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const RFQResultCard = ({ result }: { result: AdvancedSearchResult }) => {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {result.description}
          </p>
        </div>
        <Badge variant={getPriorityVariant(result.priority)} className="ml-4">
          {result.priority.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Budget</p>
            <p className="text-xs text-muted-foreground">
              {result.budget_min && result.budget_max 
                ? `${result.currency} ${result.budget_min?.toLocaleString()} - ${result.budget_max?.toLocaleString()}`
                : result.budget_max 
                  ? `Up to ${result.currency} ${result.budget_max?.toLocaleString()}`
                  : 'Not specified'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Deadline</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(result.submission_deadline), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        {result.delivery_location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-xs text-muted-foreground">{result.delivery_location}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Posted</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(result.created_at), 'MMM dd')}
            </p>
          </div>
        </div>
      </div>

      <Separator className="mb-4" />

      <div className="flex items-center justify-between">
        <Badge variant="outline">{result.status.replace('_', ' ').toUpperCase()}</Badge>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <Button size="sm">
            Submit Bid
          </Button>
        </div>
      </div>
    </Card>
  );
};

const VendorResultCard = ({ result }: { result: VendorSearchResult }) => {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{result.full_name}</h3>
          {result.company_name && (
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Building className="h-3 w-3" />
              <span className="text-sm">{result.company_name}</span>
            </div>
          )}
          <Badge variant="secondary" className="text-xs">
            {result.verification_status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {result.bio && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {result.bio}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        {result.address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{result.address}</span>
          </div>
        )}
        {result.categories && result.categories.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Categories:</span>
            <span className="text-sm text-muted-foreground">
              {result.categories.length} specialties
            </span>
          </div>
        )}
      </div>

      <Separator className="mb-4" />

      <div className="flex justify-between">
        <Badge variant="outline">
          Member since {format(new Date(result.created_at), 'yyyy')}
        </Badge>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            View Profile
          </Button>
          <Button size="sm">
            Contact
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const AdvancedSearchResults = ({ 
  results, 
  vendorResults,
  loading, 
  totalCount, 
  searchType, 
  onLoadMore, 
  hasMore 
}: AdvancedSearchResultsProps) => {
  const displayResults = searchType === 'rfqs' ? results : vendorResults;

  if (loading && displayResults.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-10 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (displayResults.length === 0 && !loading) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          {searchType === 'rfqs' ? (
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or browse all available{' '}
          {searchType === 'rfqs' ? 'RFQs' : 'vendors'}.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {totalCount} {searchType === 'rfqs' ? 'RFQs' : 'Vendors'} Found
        </h2>
      </div>

      <div className="space-y-4">
        {searchType === 'rfqs' 
          ? results.map((result) => <RFQResultCard key={result.id} result={result} />)
          : vendorResults.map((result) => <VendorResultCard key={result.id} result={result} />)
        }
      </div>

      {hasMore && onLoadMore && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Results'}
          </Button>
        </div>
      )}
    </div>
  );
};
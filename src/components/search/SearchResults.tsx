import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { SearchResult } from "@/hooks/useSearch";
import { 
  FileText, 
  Package, 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign,
  Clock,
  Star,
  Eye,
  MessageCircle
} from "lucide-react";
import { format } from "date-fns";

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  onResultClick?: (result: SearchResult) => void;
  showActions?: boolean;
}

export const SearchResults = ({ 
  results, 
  loading, 
  onResultClick,
  showActions = true 
}: SearchResultsProps) => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "request": return <FileText className="h-4 w-4" />;
      case "offer": return <Package className="h-4 w-4" />;
      case "vendor": return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      request: { label: isRTL ? "طلب" : "Request", variant: "default" as const },
      offer: { label: isRTL ? "عرض" : "Offer", variant: "secondary" as const },
      vendor: { label: isRTL ? "مورد" : "Vendor", variant: "outline" as const }
    };
    return typeMap[type as keyof typeof typeMap] || typeMap.request;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      new: { label: isRTL ? "جديد" : "New", variant: "default" as const },
      active: { label: isRTL ? "نشط" : "Active", variant: "default" as const },
      approved: { label: isRTL ? "موافق عليه" : "Approved", variant: "default" as const },
      pending: { label: isRTL ? "في الانتظار" : "Pending", variant: "secondary" as const },
      completed: { label: isRTL ? "مكتمل" : "Completed", variant: "outline" as const },
      rejected: { label: isRTL ? "مرفوض" : "Rejected", variant: "destructive" as const }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const formatPrice = (price: number | undefined, currency = 'SAR') => {
    if (!price) return null;
    return `${price.toLocaleString()} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            {isRTL ? "لم يتم العثور على نتائج" : "No Results Found"}
          </h3>
          <p className="text-muted-foreground">
            {isRTL ? "جرب تعديل المرشحات أو استخدم كلمات مختلفة" : "Try adjusting your filters or using different keywords"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => {
        const typeBadge = getTypeBadge(result.type);
        const statusBadge = getStatusBadge(result.status);
        
        return (
          <Card 
            key={`${result.type}-${result.id}`} 
            className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onResultClick?.(result)}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-muted/50">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      {result.relevance > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {result.relevance}% {isRTL ? "مطابقة" : "match"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {result.type === 'vendor' && result.metadata.avatar_url && (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={result.metadata.avatar_url} />
                    <AvatarFallback>
                      {result.title.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* Title and Description */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {result.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {result.description}
                </p>
              </div>

              {/* Metadata */}
              <div className={`flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {result.location && (
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="h-3 w-3" />
                    <span>{result.location}</span>
                  </div>
                )}
                
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(result.created_at)}</span>
                </div>

                {result.price && (
                  <div className={`flex items-center gap-1 text-primary font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <DollarSign className="h-3 w-3" />
                    <span>{formatPrice(result.price, result.currency)}</span>
                  </div>
                )}

                {result.type === 'request' && result.metadata.urgency && (
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="h-3 w-3" />
                    <span className="capitalize">{result.metadata.urgency}</span>
                  </div>
                )}

                {result.type === 'offer' && result.metadata.delivery_time_days && (
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="h-3 w-3" />
                    <span>{result.metadata.delivery_time_days} {isRTL ? "أيام" : "days"}</span>
                  </div>
                )}

                {result.rating && (
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Star className="h-3 w-3" />
                    <span>{result.rating}</span>
                  </div>
                )}
              </div>

              {/* Type-specific metadata */}
              {result.type === 'request' && result.metadata.category && (
                <div className={`mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <Badge variant="outline" className="mr-2">
                    {result.metadata.category}
                  </Badge>
                  {result.metadata.client && (
                    <span className="text-sm text-muted-foreground">
                      {isRTL ? "بواسطة:" : "by"} {result.metadata.client}
                    </span>
                  )}
                </div>
              )}

              {result.type === 'offer' && result.metadata.request_title && (
                <div className={`mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? "للطلب:" : "For request:"} 
                  </span>
                  <span className="text-sm font-medium ml-1">
                    {result.metadata.request_title}
                  </span>
                  {result.metadata.vendor && (
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? "بواسطة:" : "by"} {result.metadata.vendor}
                    </div>
                  )}
                </div>
              )}

              {result.type === 'vendor' && (
                <div className={`mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {result.metadata.company_name && (
                    <div className="text-sm font-medium mb-1">
                      {result.metadata.company_name}
                    </div>
                  )}
                  {result.metadata.categories && (
                    <div className="flex flex-wrap gap-1">
                      {result.metadata.categories.slice(0, 3).map((category: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {showActions && (
                <div className={`flex gap-2 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Eye className="h-3 w-3" />
                    {isRTL ? "عرض" : "View"}
                  </Button>
                  
                  {result.type !== 'vendor' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <MessageCircle className="h-3 w-3" />
                      {isRTL ? "رسالة" : "Message"}
                    </Button>
                  )}
                  
                  {result.type === 'request' && (
                    <Button 
                      size="sm"
                      className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Package className="h-3 w-3" />
                      {isRTL ? "تقديم عرض" : "Submit Offer"}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
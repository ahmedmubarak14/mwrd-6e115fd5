import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMatchingSystem } from '@/hooks/useMatchingSystem';
import { useCategories } from '@/hooks/useCategories';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/empty-state';
import { CreateOfferModal } from '@/components/modals/CreateOfferModal';
import { RequestDetailsModal } from '@/components/modals/RequestDetailsModal';
import { 
  Search, 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Plus, 
  Eye, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  Filter,
  Users,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default'
}) => {
  const { isRTL } = useLanguage();
  
  const variantStyles = {
    default: 'border-border',
    success: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10',
    warning: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/10',
    destructive: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'
  };

  return (
    <Card className={cn("relative overflow-hidden transition-all hover:shadow-md", variantStyles[variant])}>
      <CardHeader className="pb-2">
        <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          <CardTitle className={cn("text-sm font-medium text-muted-foreground", isRTL && "text-right")}>
            {title}
          </CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("space-y-1", isRTL && "text-right")}>
          <div className={cn("text-2xl font-bold", isRTL && "text-right")}>{value}</div>
          {trend && (
            <div className={cn(
              "flex items-center text-xs",
              isRTL ? "flex-row-reverse justify-end" : "",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                trend.isPositive 
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}% {trend.label}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const VendorBrowseRequests: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { matchedRequests, loading } = useMatchingSystem();
  const { categories, loading: categoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Request metrics
  const metrics = useMemo(() => {
    if (!matchedRequests || matchedRequests.length === 0) return { total: 0, urgent: 0, highBudget: 0, thisWeek: 0 };
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: matchedRequests.length,
      urgent: matchedRequests.filter(r => r.urgency === 'urgent' || r.urgency === 'high').length,
      highBudget: matchedRequests.filter(r => r.budget_max && r.budget_max > 50000).length,
      thisWeek: matchedRequests.filter(r => new Date(r.created_at) > weekAgo).length,
    };
  }, [matchedRequests]);

  if (loading || categoriesLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-5 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredRequests = matchedRequests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      request.title.toLowerCase().includes(searchLower) ||
      request.category.toLowerCase().includes(searchLower);
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatBudget = (request: any) => {
    if (!request.budget_min && !request.budget_max) return t('vendor.browseRequests.budgetNotSpecified');
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()}`;
    }
    return t('vendor.browseRequests.budgetNegotiable');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  // Get all categories including subcategories for the filter
  const getAllCategories = () => {
    const allCats: any[] = [];
    categories.forEach(category => {
      allCats.push(category);
      if (category.children && category.children.length > 0) {
        allCats.push(...category.children);
      }
    });
    return allCats;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={cn("space-y-2", isRTL && "text-right")}>
        <h1 className="text-3xl font-bold text-foreground">
          {t('vendor.browseRequests.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('vendor.browseRequests.subtitle')}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('vendor.browseRequests.totalRequests')}
          value={metrics.total}
          icon={FileText}
          trend={{ value: 15, label: t('common.vsLastMonth'), isPositive: true }}
        />
        <MetricCard
          title={t('vendor.browseRequests.urgentHighPriority')}
          value={metrics.urgent}
          icon={AlertCircle}
          variant="warning"
        />
        <MetricCard
          title={t('vendor.browseRequests.highBudget')}
          value={metrics.highBudget}
          icon={DollarSign}
          variant="success"
        />
        <MetricCard
          title={t('vendor.browseRequests.newThisWeek')}
          value={metrics.thisWeek}
          icon={TrendingUp}
          trend={{ value: 8, label: t('common.thisWeek'), isPositive: true }}
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Filter className="h-5 w-5" />
            {t('vendor.browseRequests.searchAndFilter')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className={cn(
              "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input 
              placeholder={t('vendor.browseRequests.searchPlaceholder')}
              className={cn(isRTL ? "pr-10 text-right" : "pl-10")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t('vendor.browseRequests.filterByCategory')} />
            </SelectTrigger>
            <SelectContent align={isRTL ? 'end' : 'start'}>
              <SelectItem value="all">{t('vendor.browseRequests.allCategories')}</SelectItem>
              {getAllCategories().map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {isRTL ? category.name_ar : category.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={Search}
          title={t('vendor.browseRequests.noResults')}
          description={t('vendor.browseRequests.noResultsDesc')}
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className={cn(
                    "flex justify-between items-start",
                    isRTL && "flex-row-reverse"
                  )}>
                    <div className="flex-1">
                      <div className={cn(
                        "flex items-start justify-between mb-2",
                        isRTL && "flex-row-reverse"
                      )}>
                        <h3 className={cn(
                          "text-lg font-semibold",
                          isRTL && "text-right"
                        )}>{request.title}</h3>
                        <Badge variant={getUrgencyColor(request.urgency) as any}>
                          {request.urgency}
                        </Badge>
                      </div>
                      <p className={cn(
                        "text-muted-foreground mb-2",
                        isRTL && "text-right"
                      )}>{request.description}</p>
                      <div className={cn(
                        "flex items-center gap-4 mb-2",
                        isRTL && "flex-row-reverse"
                      )}>
                        <span className="text-sm text-primary font-medium">{request.category}</span>
                        {request.location && (
                          <div className={cn(
                            "flex items-center gap-1 text-sm text-muted-foreground",
                            isRTL && "flex-row-reverse"
                          )}>
                            <MapPin className="h-3 w-3" />
                            <span>{request.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className={cn(
                      "flex items-center gap-2 p-3 bg-muted/50 rounded-lg",
                      isRTL && "flex-row-reverse"
                    )}>
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <div className={cn(isRTL && "text-right")}>
                        <p className="text-xs text-muted-foreground">{t('vendor.browseRequests.budget')}</p>
                        <p className="font-semibold text-sm">{formatBudget(request)} {request.currency || 'USD'}</p>
                      </div>
                    </div>
                    
                    {request.deadline && (
                      <div className={cn(
                        "flex items-center gap-2 p-3 bg-muted/50 rounded-lg",
                        isRTL && "flex-row-reverse"
                      )}>
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <div className={cn(isRTL && "text-right")}>
                          <p className="text-xs text-muted-foreground">{t('vendor.browseRequests.deadline')}</p>
                          <p className="font-semibold text-sm">{new Date(request.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className={cn(
                      "flex items-center gap-2 p-3 bg-muted/50 rounded-lg",
                      isRTL && "flex-row-reverse"
                    )}>
                      <Clock className="h-4 w-4 text-orange-500" />
                      <div className={cn(isRTL && "text-right")}>
                        <p className="text-xs text-muted-foreground">{t('vendor.browseRequests.posted')}</p>
                        <p className="font-semibold text-sm">{new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                    <CreateOfferModal requestId={request.id}>
                      <Button className="flex-1">
                        <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                        {t('vendor.browseRequests.submitOffer')}
                      </Button>
                    </CreateOfferModal>
                    <RequestDetailsModal 
                      request={{
                        ...request,
                        status: 'new',
                        user_id: request.client
                      }} 
                      userRole="vendor"
                    >
                      <Button variant="outline">
                        <Eye className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                        {t('vendor.browseRequests.viewDetails')}
                      </Button>
                    </RequestDetailsModal>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

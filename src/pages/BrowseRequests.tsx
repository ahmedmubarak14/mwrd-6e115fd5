import React, { useState, useMemo, memo } from "react";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useMatchingSystem } from "@/hooks/useMatchingSystem";
import { useCategories } from "@/hooks/useCategories";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateOfferModal } from "@/components/modals/CreateOfferModal";
import { RequestDetailsModal } from "@/components/modals/RequestDetailsModal";
import { VendorBreadcrumbs } from "@/components/vendor/VendorBreadcrumbs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Search, Package, MapPin, Calendar, DollarSign, Clock, Plus, Eye, FileText, TrendingUp, AlertCircle, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const BrowseRequestsPage = memo(() => {
  const { t, language, isRTL } = useOptionalLanguage();
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
      <ErrorBoundary>
        <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <VendorBreadcrumbs />
          
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricCard key={i} title="" value="" loading={true} />
            ))}
          </div>
        </div>
      </ErrorBoundary>
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
    if (!request.budget_min && !request.budget_max) return t('browseRequests.budgetNotSpecified');
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()}`;
    }
    return t('browseRequests.budgetNegotiable');
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
    <ErrorBoundary>
      <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <VendorBreadcrumbs />
        
        {/* Header */}
        <div className={cn(
          "flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-8",
          isRTL && "md:flex-row-reverse"
        )}>
          <div className={cn(isRTL && "text-right")}>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
              {t('browseRequests.title')}
            </h1>
            <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
              {t('browseRequests.subtitle')}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title={t('browseRequests.totalRequests')}
            value={metrics.total}
            icon={FileText}
            trend={{ value: 15, label: t('projects.vsLastMonth'), isPositive: true }}
          />
          <MetricCard
            title={t('browseRequests.urgentHighPriority')}
            value={metrics.urgent}
            icon={AlertCircle}
            variant="warning"
          />
          <MetricCard
            title={t('browseRequests.highBudget')}
            value={metrics.highBudget}
            icon={DollarSign}
            variant="success"
          />
          <MetricCard
            title={t('browseRequests.newThisWeek')}
            value={metrics.thisWeek}
            icon={TrendingUp}
            trend={{ value: 8, label: t('projects.thisWeek'), isPositive: true }}
          />
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <Filter className="h-5 w-5" />
              {t('browseRequests.searchAndFilter')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className={cn(
                "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                isRTL ? "right-3" : "left-3"
              )} />
              <Input 
                placeholder={t('browseRequests.searchPlaceholder')}
                className={cn(isRTL ? "pr-10 text-right" : "pl-10")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('browseRequests.filterByCategory')} />
              </SelectTrigger>
              <SelectContent align={isRTL ? 'end' : 'start'}>
                <SelectItem value="all">{t('browseRequests.allCategories')}</SelectItem>
                {getAllCategories().map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {language === 'ar' ? category.name_ar : category.name_en}
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
            title={t('browseRequests.noResults')}
            description={t('browseRequests.noResultsDesc')}
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
                          <p className="text-xs text-muted-foreground">{t('browseRequests.budget')}</p>
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
                            <p className="text-xs text-muted-foreground">{t('browseRequests.deadline')}</p>
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
                          <p className="text-xs text-muted-foreground">{t('browseRequests.posted')}</p>
                          <p className="font-semibold text-sm">{new Date(request.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <CreateOfferModal requestId={request.id}>
                        <Button className="flex-1">
                          <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                          {t('browseRequests.submitOffer')}
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
                          {t('browseRequests.viewDetails')}
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
    </ErrorBoundary>
  );
});

BrowseRequestsPage.displayName = 'BrowseRequestsPage';

export default BrowseRequestsPage;

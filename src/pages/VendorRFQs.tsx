import React, { useState, useMemo } from "react";
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRFQs } from "@/hooks/useRFQs";
import { useBids } from "@/hooks/useBids";
import { useCategories } from "@/hooks/useCategories";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from "@/components/ui/MetricCard";
import { BidSubmissionModal } from "@/components/rfq/BidSubmissionModal";
import { 
  Calendar, 
  Package, 
  MapPin, 
  Clock, 
  Search,
  Filter,
  FileText,
  AlertCircle,
  TrendingUp,
  Eye,
  Send,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const VendorRFQsContent = React.memo(() => {
  const { t } = useLanguage();
  const { t, isRTL, formatCurrency } = languageContext || {
    t: (key: string) => key.split('.').pop() || key,
    isRTL: false,
    formatCurrency: (amount: number) => `${amount.toLocaleString()} SAR`
  };

  const { rfqs, loading: rfqsLoading } = useRFQs();
  const { bids, loading: bidsLoading } = useBids();
  const { categories, loading: categoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter RFQs for vendors (only published and public RFQs)
  const availableRFQs = useMemo(() => {
    if (!rfqs) return [];
    
    return rfqs.filter(rfq => 
      rfq.status === 'published' && 
      rfq.is_public && 
      new Date(rfq.submission_deadline) > new Date()
    );
  }, [rfqs]);

  // Check which RFQs the vendor has already bid on
  const rfqsWithBidStatus = useMemo(() => {
    if (!availableRFQs || !bids) return [];
    
    return availableRFQs.map(rfq => ({
      ...rfq,
      hasBid: bids.some(bid => bid.rfq_id === rfq.id)
    }));
  }, [availableRFQs, bids]);

  // RFQ metrics
  const metrics = useMemo(() => {
    if (!rfqsWithBidStatus) return { total: 0, newThisWeek: 0, highPriority: 0, submitted: 0 };
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: rfqsWithBidStatus.length,
      newThisWeek: rfqsWithBidStatus.filter(r => new Date(r.created_at) > weekAgo).length,
      highPriority: rfqsWithBidStatus.filter(r => r.priority === 'high' || r.priority === 'urgent').length,
      submitted: rfqsWithBidStatus.filter(r => r.hasBid).length,
    };
  }, [rfqsWithBidStatus]);

  // Filter RFQs based on search, status, and category
  const filteredRFQs = useMemo(() => {
    if (!rfqsWithBidStatus) return [];

    return rfqsWithBidStatus.filter((rfq) => {
      const matchesSearch = rfq.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rfq.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === "available") {
        matchesStatus = !rfq.hasBid;
      } else if (statusFilter === "submitted") {
        matchesStatus = rfq.hasBid;
      }
      
      const matchesCategory = categoryFilter === "all" || rfq.category_id === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [rfqsWithBidStatus, searchTerm, statusFilter, categoryFilter]);

  const loading = rfqsLoading || bidsLoading || categoriesLoading;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return t('vendor.rfqs.urgent');
      case 'high': return t('vendor.rfqs.high');
      case 'medium': return t('vendor.rfqs.medium');
      case 'low': return t('vendor.rfqs.low');
      default: return priority;
    }
  };

  if (loading) {
    return (
      <ClientPageContainer>
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </ClientPageContainer>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL && "rtl")} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          {t('vendor.rfqs.availableRFQs')}
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          {t('vendor.rfqs.browseRFQs')}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title={t('vendor.rfqs.totalRFQs')}
          value={metrics.total}
          icon={FileText}
          trend={{ value: 15, label: t('vendor.rfqs.vsLastMonth'), isPositive: true }}
        />
        <MetricCard
          title={t('vendor.rfqs.newThisWeek')}
          value={metrics.newThisWeek}
          icon={TrendingUp}
          trend={{ value: 5, label: t('vendor.rfqs.thisWeek'), isPositive: true }}
          variant="success"
        />
        <MetricCard
          title={t('vendor.rfqs.highPriority')}
          value={metrics.highPriority}
          icon={AlertCircle}
          variant="warning"
        />
        <MetricCard
          title={t('vendor.rfqs.bidsSubmitted')}
          value={metrics.submitted}
          icon={Send}
          variant="default"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center gap-2",
            isRTL && "flex-row-reverse"
          )}>
            <Filter className="h-5 w-5" />
            {t('vendor.rfqs.filtersSearch')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 rtl:md:space-x-reverse">
            <div className="flex-1">
              <div className="relative">
                <Search className={cn(
                  "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                  isRTL ? "right-3" : "left-3"
                )} />
                <Input
                  placeholder={t('vendor.rfqs.searchRFQs')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    isRTL ? "pr-10 text-right" : "pl-10"
                  )}
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('vendor.rfqs.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('vendor.rfqs.allRFQs')}</SelectItem>
                <SelectItem value="available">{t('vendor.rfqs.availableToBid')}</SelectItem>
                <SelectItem value="submitted">{t('vendor.rfqs.alreadySubmitted')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('vendor.rfqs.filterByCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('vendor.rfqs.allCategories')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {isRTL ? category.name_ar : category.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
            <div className={cn(
              "flex items-center gap-2 text-sm text-muted-foreground",
              isRTL && "flex-row-reverse"
            )}>
              <span>
                {t('vendor.rfqs.showingResults')
                  .replace('{0}', filteredRFQs.length.toString())
                  .replace('{1}', metrics.total.toString())}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                }}
              >
                {t('vendor.rfqs.clearFilters')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RFQs Grid */}
      {filteredRFQs.length > 0 ? (
        <div className="space-y-4">
          {filteredRFQs.map((rfq) => (
            <Card key={rfq.id} className="hover:shadow-lg transition-shadow">
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
                        <h3 className="text-lg font-semibold">{rfq.title}</h3>
                        <div className={cn(
                          "flex gap-2",
                          isRTL && "flex-row-reverse"
                        )}>
                          <Badge variant={getPriorityColor(rfq.priority) as any}>
                            {getPriorityLabel(rfq.priority)}
                          </Badge>
                          {rfq.hasBid && (
                            <Badge variant="outline" className="text-success border-success">
                              {t('vendor.rfqs.bidAlreadySubmitted')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2 line-clamp-2">{rfq.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t('vendor.rfqs.budget')}</p>
                        <p className="font-semibold text-sm">
                          {rfq.budget_min && rfq.budget_max 
                            ? `${formatCurrency(rfq.budget_min)} - ${formatCurrency(rfq.budget_max)}`
                            : t('vendor.rfqs.negotiable')
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t('vendor.rfqs.deadline')}</p>
                        <p className="font-semibold text-sm">
                          {format(new Date(rfq.submission_deadline), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t('vendor.rfqs.location')}</p>
                        <p className="font-semibold text-sm">{rfq.delivery_location || t('vendor.rfqs.notSpecified')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t('vendor.rfqs.posted')}</p>
                        <p className="font-semibold text-sm">
                          {format(new Date(rfq.created_at), 'MMM dd')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "flex gap-2 pt-2",
                    isRTL && "flex-row-reverse"
                  )}>
                    {!rfq.hasBid ? (
                      <BidSubmissionModal rfq={rfq}>
                        <Button className={cn(
                          "flex-1 gap-2",
                          isRTL && "flex-row-reverse"
                        )}>
                          <Send className="h-4 w-4" />
                          {t('vendor.rfqs.submitBid')}
                        </Button>
                      </BidSubmissionModal>
                    ) : (
                      <Button variant="outline" className={cn(
                        "flex-1 gap-2",
                        isRTL && "flex-row-reverse"
                      )} disabled>
                        <Send className="h-4 w-4" />
                        {t('vendor.rfqs.bidAlreadySubmitted')}
                      </Button>
                    )}
                    <Button variant="outline" className={cn(
                      "gap-2",
                      isRTL && "flex-row-reverse"
                    )}>
                      <Eye className="h-4 w-4" />
                      {t('vendor.rfqs.viewDetails')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all" 
                ? t('vendor.rfqs.noRFQsFound')
                : t('vendor.rfqs.noAvailableRFQs')
              }
            </h3>
            
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? t('vendor.rfqs.adjustCriteria')
                : t('vendor.rfqs.checkBackLater')
              }
            </p>

            {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                }}
                className={cn(
                  "gap-2",
                  isRTL && "flex-row-reverse"
                )}
              >
                <Package className="h-4 w-4" />
                {t('vendor.rfqs.clearFilters')}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
});

VendorRFQsContent.displayName = "VendorRFQsContent";

const VendorRFQs = () => {
  return (
    <ClientPageContainer>
      <ErrorBoundary>
        <VendorRFQsContent />
      </ErrorBoundary>
    </ClientPageContainer>
  );
};

export default React.memo(VendorRFQs);
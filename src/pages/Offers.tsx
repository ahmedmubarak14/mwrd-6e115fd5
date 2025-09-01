import React, { useState, useMemo, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { VendorBreadcrumbs } from "@/components/vendor/VendorBreadcrumbs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Package, Search, Eye, MessageSquare, Plus, BarChart3, CheckCircle, XCircle, Clock, Filter, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import { CreateOfferModal } from "@/components/modals/CreateOfferModal";
import { OfferDetailsModal } from "@/components/modals/OfferDetailsModal";
import { RealTimeChatModal } from "@/components/modals/RealTimeChatModal";
import { OfferComparisonModal } from "@/components/enhanced/OfferComparisonModal";
import { useToast } from "@/hooks/use-toast";
import { useOffers } from "@/hooks/useOffers";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const OffersPage = memo(() => {
  const { userProfile } = useAuth();
  const { language, t, isRTL } = useOptionalLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);

  const { offers, loading: offersLoading, error: offersError, updateOfferStatus, refetch } = useOffers();

  // Offer metrics
  const metrics = useMemo(() => {
    if (!offers || offers.length === 0) return { total: 0, pending: 0, approved: 0, rejected: 0 };
    
    return {
      total: offers.length,
      pending: offers.filter(o => o.client_approval_status === 'pending').length,
      approved: offers.filter(o => o.client_approval_status === 'approved').length,
      rejected: offers.filter(o => o.client_approval_status === 'rejected').length,
    };
  }, [offers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'warning';
      default: return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return t('offers.status.approved');
      case 'rejected': return t('offers.status.rejected');
      case 'pending': return t('offers.status.pending');
      default: return status;
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.request?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.vendor?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.vendor?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || offer.client_approval_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOfferSelection = (offerId: string, selected: boolean) => {
    if (selected) {
      setSelectedOffers(prev => [...prev, offerId]);
    } else {
      setSelectedOffers(prev => prev.filter(id => id !== offerId));
    }
  };

  const handleSelectAll = () => {
    if (selectedOffers.length === filteredOffers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(filteredOffers.map(offer => offer.id));
    }
  };

  const handleOfferAction = async (offerId: string, action: 'approve' | 'reject', notes?: string) => {
    const mappedAction = action === 'approve' ? 'approved' : 'rejected';
    const success = await updateOfferStatus(offerId, mappedAction, notes);
    if (success) {
      setSelectedOffers(prev => prev.filter(id => id !== offerId));
      await refetch();
    }
  };

  if (offersLoading) {
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

  if (offersError) {
    return (
      <ErrorBoundary>
        <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <VendorBreadcrumbs />
          
          <EmptyState
            icon={Package}
            title={t('common.error')}
            description={offersError}
            action={{
              label: t('common.tryAgain'),
              onClick: () => refetch(),
              variant: "default" as const
            }}
          />
        </div>
      </ErrorBoundary>
    );
  }

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
              {t('offers.title')}
            </h1>
            <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
              {userProfile?.role === 'vendor' 
                ? t('offers.subtitle.vendor')
                : t('offers.subtitle.client')}
            </p>
          </div>
          <div className="flex gap-2">
            {selectedOffers.length > 1 && userProfile?.role === 'client' && (
              <OfferComparisonModal 
                offers={offers.filter(o => selectedOffers.includes(o.id))}
                onOfferAction={handleOfferAction}
              >
                <Button className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t('offers.compare')} ({selectedOffers.length})
                </Button>
              </OfferComparisonModal>
            )}
            {userProfile?.role === 'vendor' && (
              <CreateOfferModal>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('offers.newOffer')}
                </Button>
              </CreateOfferModal>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title={t('offers.totalOffers')}
            value={metrics.total}
            icon={Package}
            trend={{ value: 12, label: t('projects.vsLastMonth'), isPositive: true }}
          />
          <MetricCard
            title={t('offers.pendingOffers')}
            value={metrics.pending}
            icon={Clock}
            variant="warning"
          />
          <MetricCard
            title={t('offers.approvedOffers')}
            value={metrics.approved}
            icon={CheckCircle}
            variant="success"
          />
          <MetricCard
            title={t('offers.rejectedOffers')}
            value={metrics.rejected}
            icon={XCircle}
            variant="destructive"
          />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <Filter className="h-5 w-5" />
              {t('offers.filtersAndSearch')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                    isRTL ? "right-3" : "left-3"
                  )} />
                  <Input
                    placeholder={t('offers.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(isRTL ? "pr-10 text-right" : "pl-10")}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('offers.offerStatus')} />
                </SelectTrigger>
                <SelectContent align={isRTL ? 'end' : 'start'}>
                  <SelectItem value="all">{t('offers.allStatus')}</SelectItem>
                  <SelectItem value="pending">{t('offers.status.pending')}</SelectItem>
                  <SelectItem value="approved">{t('offers.status.approved')}</SelectItem>
                  <SelectItem value="rejected">{t('offers.status.rejected')}</SelectItem>
                </SelectContent>
              </Select>
              
              {userProfile?.role === 'client' && filteredOffers.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="gap-2"
                >
                  <Checkbox 
                    checked={selectedOffers.length === filteredOffers.length}
                    onCheckedChange={handleSelectAll}
                  />
                  {selectedOffers.length === filteredOffers.length 
                    ? t('common.deselectAll')
                    : t('common.selectAll')
                  }
                </Button>
              )}
            </div>

            {(searchTerm || statusFilter !== "all") && (
              <div className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                isRTL && "flex-row-reverse"
              )}>
                <span>{t('offers.showingResults').replace('{count}', filteredOffers.length.toString()).replace('{total}', metrics.total.toString())}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  {t('offers.clearFilters')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offers Grid */}
        {filteredOffers.length === 0 ? (
          <EmptyState
            icon={Package}
            title={searchTerm || statusFilter !== 'all' ? t('offers.noOffersFound') : t('offers.noOffers')}
            description={
              searchTerm || statusFilter !== 'all'
                ? t('offers.tryAdjustingFilters')
                : userProfile?.role === 'vendor'
                  ? t('offers.noOffersDesc.vendor')
                  : t('offers.noOffersDesc.client')
            }
            action={
              !searchTerm && statusFilter === 'all' && userProfile?.role === 'vendor' ? {
                label: t('offers.newOffer'),
                onClick: () => {
                  // Trigger CreateOfferModal
                },
                variant: "default" as const
              } : undefined
            }
          />
        ) : (
          <div className="grid gap-6">
            {filteredOffers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={cn(
                    "flex justify-between items-start",
                    isRTL && "flex-row-reverse"
                  )}>
                    <div className={cn(
                      "flex items-start gap-3 flex-1",
                      isRTL && "flex-row-reverse"
                    )}>
                      {userProfile?.role === 'client' && (
                        <Checkbox
                          checked={selectedOffers.includes(offer.id)}
                          onCheckedChange={(checked) => handleOfferSelection(offer.id, checked as boolean)}
                          className="mt-1"
                        />
                      )}
                      <div className={cn("flex-1", isRTL && "text-right")}>
                        <CardTitle className="text-lg mb-2">{offer.title}</CardTitle>
                        <CardDescription className="mb-2">
                          {t('offers.forRequest')} {offer.request?.title}
                        </CardDescription>
                        {offer.vendor && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {t('offers.vendor')} {offer.vendor.company_name || offer.vendor.full_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={cn(
                      "flex flex-col items-end gap-2",
                      isRTL && "items-start"
                    )}>
                      <Badge variant={getStatusColor(offer.client_approval_status) as any}>
                        {getStatusText(offer.client_approval_status)}
                      </Badge>
                      <div className="text-lg font-bold text-primary">
                        {offer.price?.toLocaleString()} {offer.currency}
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm text-muted-foreground",
                        isRTL && "flex-row-reverse"
                      )}>
                        <Clock className="h-3 w-3" />
                        {offer.delivery_time_days} {t('offers.days')}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    "text-sm text-muted-foreground mb-4 line-clamp-2",
                    isRTL && "text-right"
                  )}>
                    {offer.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <OfferDetailsModal 
                      offerId={offer.id} 
                      userRole={userProfile?.role as any}
                      onUpdated={refetch}
                    >
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {t('offers.viewDetails')}
                      </Button>
                    </OfferDetailsModal>
                    
                    {offer.vendor && (
                      <RealTimeChatModal 
                        recipientId={offer.vendor_id}
                        recipientName={offer.vendor.company_name || offer.vendor.full_name}
                        requestId={offer.request_id}
                        offerId={offer.id}
                      >
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {t('offers.messageVendor')}
                        </Button>
                      </RealTimeChatModal>
                    )}

                    {userProfile?.role === 'client' && offer.client_approval_status === 'pending' && (
                      <>
                        <Button 
                          size="sm"
                          onClick={() => handleOfferAction(offer.id, 'approve')}
                          className="gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          {t('offers.accept')}
                        </Button>
                        <Button 
                          variant="destructive"
                          size="sm"
                          onClick={() => handleOfferAction(offer.id, 'reject')}
                          className="gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          {t('offers.reject')}
                        </Button>
                      </>
                    )}
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

OffersPage.displayName = 'OffersPage';

export { OffersPage as Offers };
export default OffersPage;
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOffers } from '@/hooks/useOffers';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/empty-state';
import { CreateOfferModal } from '@/components/modals/CreateOfferModal';
import { OfferDetailsModal } from '@/components/modals/OfferDetailsModal';
import { OfferComparisonModal } from '@/components/enhanced/OfferComparisonModal';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Search, 
  Eye, 
  MessageSquare, 
  Plus, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter, 
  TrendingUp, 
  AlertCircle, 
  DollarSign,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
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

export const VendorOffers: React.FC = () => {
  const { t, isRTL } = useLanguage();
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
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    return t(`vendor.offers.status.${status}`) || status;
  };

  const filteredOffers = useMemo(() => {
    if (!offers) return [];
    
    return offers.filter(offer => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" || 
        offer.title?.toLowerCase().includes(searchLower) ||
        offer.description?.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === "all" || offer.client_approval_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [offers, searchTerm, statusFilter]);

  const handleSelectOffer = (offerId: string) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOffers.length === filteredOffers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(filteredOffers.map(offer => offer.id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedOffers.length === 0) {
      toast({
        title: t('vendor.offers.noOffersSelected'),
        description: t('vendor.offers.selectOffersFirst'),
        variant: "destructive",
      });
      return;
    }

    try {
      // Handle bulk actions here
      toast({
        title: t('vendor.offers.bulkActionSuccess'),
        description: t('vendor.offers.bulkActionDesc', { count: selectedOffers.length }),
      });
      setSelectedOffers([]);
      refetch();
    } catch (error) {
      toast({
        title: t('vendor.offers.bulkActionError'),
        description: t('vendor.offers.bulkActionErrorDesc'),
        variant: "destructive",
      });
    }
  };

  if (offersLoading) {
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

  if (offersError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h3 className="font-semibold">{t('vendor.offers.errorLoading')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{offersError}</p>
              </div>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                {t('common.tryAgain')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={cn("space-y-2", isRTL && "text-right")}>
        <h1 className="text-3xl font-bold text-foreground">
          {t('vendor.offers.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('vendor.offers.subtitle')}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('vendor.offers.totalOffers')}
          value={metrics.total}
          icon={Package}
          trend={{ value: 15, label: t('common.vsLastMonth'), isPositive: true }}
        />
        <MetricCard
          title={t('vendor.offers.pendingOffers')}
          value={metrics.pending}
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title={t('vendor.offers.approvedOffers')}
          value={metrics.approved}
          icon={CheckCircle}
          variant="success"
        />
        <MetricCard
          title={t('vendor.offers.rejectedOffers')}
          value={metrics.rejected}
          icon={XCircle}
          variant="destructive"
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Filter className="h-5 w-5" />
            {t('vendor.offers.searchAndFilter')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className={cn(
              "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input 
              placeholder={t('vendor.offers.searchPlaceholder')}
              className={cn(isRTL ? "pr-10 text-right" : "pl-10")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          
          <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('vendor.offers.filterByStatus')} />
              </SelectTrigger>
              <SelectContent align={isRTL ? 'end' : 'start'}>
                <SelectItem value="all">{t('vendor.offers.allStatuses')}</SelectItem>
                <SelectItem value="pending">{t('vendor.offers.status.pending')}</SelectItem>
                <SelectItem value="approved">{t('vendor.offers.status.approved')}</SelectItem>
                <SelectItem value="rejected">{t('vendor.offers.status.rejected')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={() => handleBulkAction('delete')} variant="outline" disabled={selectedOffers.length === 0}>
              <XCircle className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('vendor.offers.bulkDelete')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t('vendor.offers.noOffers')}
          description={t('vendor.offers.noOffersDesc')}
        />
      ) : (
        <div className="space-y-4">
          {/* Bulk Actions */}
          {selectedOffers.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                  <span className="text-sm font-medium">
                    {t('vendor.offers.selectedOffers', { count: selectedOffers.length })}
                  </span>
                  <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve')}>
                      <CheckCircle className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                      {t('vendor.offers.bulkApprove')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedOffers([])}>
                      {t('vendor.offers.clearSelection')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-lg transition-shadow">
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
                        <div className={cn(
                          "flex items-center gap-3",
                          isRTL && "flex-row-reverse"
                        )}>
                          <Checkbox
                            checked={selectedOffers.includes(offer.id)}
                            onCheckedChange={() => handleSelectOffer(offer.id)}
                          />
                          <h3 className={cn(
                            "text-lg font-semibold",
                            isRTL && "text-right"
                          )}>{offer.title}</h3>
                        </div>
                        <Badge variant={getStatusColor(offer.client_approval_status) as any}>
                          {getStatusText(offer.client_approval_status)}
                        </Badge>
                      </div>
                      <p className={cn(
                        "text-muted-foreground mb-2",
                        isRTL && "text-right"
                      )}>{offer.description}</p>
                      <div className={cn(
                        "flex items-center gap-4 mb-2",
                        isRTL && "flex-row-reverse"
                      )}>
                        <div className={cn(
                          "flex items-center gap-1 text-sm text-muted-foreground",
                          isRTL && "flex-row-reverse"
                        )}>
                          <DollarSign className="h-3 w-3" />
                          <span>{offer.price ? `$${offer.price.toLocaleString()}` : t('vendor.offers.priceNegotiable')}</span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-sm text-muted-foreground",
                          isRTL && "flex-row-reverse"
                        )}>
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(offer.created_at), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-sm text-muted-foreground",
                          isRTL && "flex-row-reverse"
                        )}>
                          <User className="h-3 w-3" />
                          <span>{offer.client_name || t('vendor.offers.unknownClient')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                    <OfferDetailsModal offer={offer}>
                      <Button variant="outline" className="flex-1">
                        <Eye className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                        {t('vendor.offers.viewDetails')}
                      </Button>
                    </OfferDetailsModal>
                    <Button variant="outline">
                      <MessageSquare className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                      {t('vendor.offers.contactClient')}
                    </Button>
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

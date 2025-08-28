import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOffers } from "@/hooks/useOffers";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Package, DollarSign, Clock, Eye, MapPin, Calendar, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useMemo } from "react";

export const MyOffers = () => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const { offers, loading } = useOffers();

  // Offer metrics
  const metrics = useMemo(() => {
    if (!offers) return { total: 0, pending: 0, approved: 0, rejected: 0 };
    
    return {
      total: offers.length,
      pending: offers.filter(o => o.status === 'pending').length,
      approved: offers.filter(o => o.client_approval_status === 'approved').length,
      rejected: offers.filter(o => o.client_approval_status === 'rejected').length,
    };
  }, [offers]);

  if (loading) {
    return (
      <ClientPageContainer>
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        {/* Loading skeleton for metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </ClientPageContainer>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'approved': return 'outline';
      case 'rejected': return 'destructive';
      case 'accepted': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    return t(`myOffers.status.${status}`) || status;
  };

  const getClientResponseStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return t('myOffers.status.approved');
      case 'rejected':
        return t('myOffers.status.rejected');
      default:
        return t('myOffers.status.pending');
    }
  };

  return (
    <ClientPageContainer
      title={t('myOffers.title')}
      description={t('myOffers.subtitle')}
    >
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Offers"
          value={metrics.total}
          icon={Package}
          trend={{ value: 12, label: "vs last month", isPositive: true }}
        />
        <MetricCard
          title="Pending"
          value={metrics.pending}
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title="Approved"
          value={metrics.approved}
          icon={CheckCircle}
          variant="success"
        />
        <MetricCard
          title="Rejected" 
          value={metrics.rejected}
          icon={AlertCircle}
          variant="destructive"
        />
      </div>

      {offers && offers.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t('myOffers.noOffers')}
          description={t('myOffers.noOffersDesc')}
          action={{
            label: "Browse Requests",
            onClick: () => window.location.href = '/browse-requests',
            variant: "default" as const
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers?.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {t('myOffers.offerNumber')} #{offer.id.slice(0, 8)}
                    </CardTitle>
                    <Badge variant={getStatusColor(offer.status) as any}>
                      {getStatusText(offer.status)}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {offer.description || t('myOffers.noDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-medium">
                        ${offer.price?.toLocaleString() || t('myOffers.priceNotSet')}
                      </span>
                    </div>
                    
                    {offer.delivery_time && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{offer.delivery_time} {t('myOffers.daysDelivery')}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{t('myOffers.submitted')} {format(new Date(offer.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                    
                    {offer.client_approval_status && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{t('myOffers.clientResponse')}:</span>
                          <Badge 
                            variant={offer.client_approval_status === 'approved' ? 'outline' : 
                                   offer.client_approval_status === 'rejected' ? 'destructive' : 'default'}
                            className="text-xs"
                          >
                            {getClientResponseStatusText(offer.client_approval_status)}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </ClientPageContainer>
  );
};

export default MyOffers;

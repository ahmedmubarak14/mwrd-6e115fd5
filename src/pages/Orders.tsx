import React, { useMemo, memo } from "react";
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useOrders } from "@/hooks/useOrders";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/empty-state";
import { VendorBreadcrumbs } from "@/components/vendor/VendorBreadcrumbs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ShoppingCart, DollarSign, Clock, Eye, MapPin, Calendar, CheckCircle, AlertCircle, Package, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const OrdersPage = memo(() => {
  const { userProfile } = useAuth();
  const { t, isRTL } = useOptionalLanguage();
  const { orders, loading } = useOrders();

  // Order metrics
  const metrics = useMemo(() => {
    if (!orders || orders.length === 0) return { total: 0, pending: 0, confirmed: 0, completed: 0 };
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      completed: orders.filter(o => o.status === 'completed').length,
    };
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      case 'in_progress': return 'warning';
      default: return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    return t(`orders.status.${status}`) || status;
  };

  if (loading) {
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
              {t('orders.title')}
            </h1>
            <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
              {t('orders.subtitle')}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title={t('orders.totalOrders')}
            value={metrics.total}
            icon={ShoppingCart}
            trend={{ value: 8, label: t('projects.vsLastMonth'), isPositive: true }}
          />
          <MetricCard
            title={t('orders.pending')}
            value={metrics.pending}
            icon={Clock}
            variant="warning"
          />
          <MetricCard
            title={t('orders.confirmed')}
            value={metrics.confirmed}
            icon={CheckCircle}
            variant="success"
          />
          <MetricCard
            title={t('orders.completed')}
            value={metrics.completed}
            icon={Package}
            variant="success"
          />
        </div>

        {orders && orders.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title={t('orders.noOrders')}
            description={t('orders.noOrdersDesc')}
            action={{
              label: t('orders.browseRequests'),
              onClick: () => window.location.href = '/requests',
              variant: "default" as const
            }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders?.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={cn(
                    "flex justify-between items-start",
                    isRTL && "flex-row-reverse"
                  )}>
                    <CardTitle className={cn(
                      "text-lg flex items-center gap-2",
                      isRTL && "flex-row-reverse"
                    )}>
                      <ShoppingCart className="h-5 w-5" />
                      {t('orders.orderNumber')} #{order.id.slice(0, 8)}
                    </CardTitle>
                    <Badge variant={getStatusColor(order.status) as any}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <CardDescription className={cn(
                    "line-clamp-2",
                    isRTL && "text-right"
                  )}>
                    {order.description || t('orders.noDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className={cn(
                      "flex items-center gap-2 text-sm",
                      isRTL && "flex-row-reverse"
                    )}>
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-medium">
                        ${order.amount?.toLocaleString() || t('orders.amountNotSet')}
                      </span>
                    </div>
                    
                    {order.delivery_date && (
                      <div className={cn(
                        "flex items-center gap-2 text-sm text-muted-foreground",
                        isRTL && "flex-row-reverse"
                      )}>
                        <Clock className="h-4 w-4" />
                        <span>{t('orders.deliveryDate')} {format(new Date(order.delivery_date), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    
                    <div className={cn(
                      "flex items-center gap-2 text-sm text-muted-foreground",
                      isRTL && "flex-row-reverse"
                    )}>
                      <Calendar className="h-4 w-4" />
                      <span>{t('orders.ordered')} {format(new Date(order.date), 'MMM dd, yyyy')}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={cn(
                          "gap-2 flex-1",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        <Eye className="h-4 w-4" />
                        {t('orders.viewDetails')}
                      </Button>
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

OrdersPage.displayName = 'OrdersPage';

export { OrdersPage as Orders };
export default OrdersPage;
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrders } from "@/hooks/useOrders";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingCart, DollarSign, Clock, Eye, MapPin, Calendar, CheckCircle, AlertCircle, Package, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { useMemo } from "react";

export const Orders = () => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
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
    <ClientPageContainer
      title={t('orders.title')}
      description={t('orders.subtitle')}
    >
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Orders"
          value={metrics.total}
          icon={ShoppingCart}
          trend={{ value: 8, label: "vs last month", isPositive: true }}
        />
        <MetricCard
          title="Pending"
          value={metrics.pending}
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title="Confirmed"
          value={metrics.confirmed}
          icon={CheckCircle}
          variant="success"
        />
        <MetricCard
          title="Completed"
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
            label: "Browse Requests",
            onClick: () => window.location.href = '/requests',
            variant: "default" as const
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders?.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {t('orders.orderNumber')} #{order.id.slice(0, 8)}
                  </CardTitle>
                  <Badge variant={getStatusColor(order.status) as any}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {order.description || t('orders.noDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-medium">
                      ${order.amount?.toLocaleString() || t('orders.amountNotSet')}
                    </span>
                  </div>
                  
                  {order.delivery_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{t('orders.deliveryDate')} {format(new Date(order.delivery_date), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{t('orders.ordered')} {format(new Date(order.date), 'MMM dd, yyyy')}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2 flex-1"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ClientPageContainer>
  );
};

export default Orders;
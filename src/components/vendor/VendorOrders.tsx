import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders } from '@/hooks/useOrders';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/empty-state';
import { 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  Eye, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  TrendingUp,
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

export const VendorOrders: React.FC = () => {
  const { t, isRTL } = useLanguage();
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
    return t(`vendor.orders.status.${status}`) || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return AlertCircle;
      case 'in_progress': return Package;
      default: return Clock;
    }
  };

  if (loading) {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={cn("space-y-2", isRTL && "text-right")}>
        <h1 className="text-3xl font-bold text-foreground">
          {t('vendor.orders.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('vendor.orders.subtitle')}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('vendor.orders.totalOrders')}
          value={metrics.total}
          icon={ShoppingCart}
          trend={{ value: 12, label: t('common.vsLastMonth'), isPositive: true }}
        />
        <MetricCard
          title={t('vendor.orders.pendingOrders')}
          value={metrics.pending}
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title={t('vendor.orders.confirmedOrders')}
          value={metrics.confirmed}
          icon={CheckCircle}
          variant="success"
        />
        <MetricCard
          title={t('vendor.orders.completedOrders')}
          value={metrics.completed}
          icon={Package}
          variant="success"
        />
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={t('vendor.orders.noOrders')}
          description={t('vendor.orders.noOrdersDesc')}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
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
                            <StatusIcon className="h-5 w-5 text-muted-foreground" />
                            <h3 className={cn(
                              "text-lg font-semibold",
                              isRTL && "text-right"
                            )}>{order.title || t('vendor.orders.orderTitle', { id: order.id })}</h3>
                          </div>
                          <Badge variant={getStatusColor(order.status) as any}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <p className={cn(
                          "text-muted-foreground mb-2",
                          isRTL && "text-right"
                        )}>{order.description || t('vendor.orders.orderDescription')}</p>
                        <div className={cn(
                          "flex items-center gap-4 mb-2",
                          isRTL && "flex-row-reverse"
                        )}>
                          <div className={cn(
                            "flex items-center gap-1 text-sm text-muted-foreground",
                            isRTL && "flex-row-reverse"
                          )}>
                            <DollarSign className="h-3 w-3" />
                            <span>{order.total_amount ? `$${order.total_amount.toLocaleString()}` : t('vendor.orders.amountTBD')}</span>
                          </div>
                          <div className={cn(
                            "flex items-center gap-1 text-sm text-muted-foreground",
                            isRTL && "flex-row-reverse"
                          )}>
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(order.created_at), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className={cn(
                            "flex items-center gap-1 text-sm text-muted-foreground",
                            isRTL && "flex-row-reverse"
                          )}>
                            <User className="h-3 w-3" />
                            <span>{order.client_name || t('vendor.orders.unknownClient')}</span>
                          </div>
                          {order.delivery_address && (
                            <div className={cn(
                              "flex items-center gap-1 text-sm text-muted-foreground",
                              isRTL && "flex-row-reverse"
                            )}>
                              <MapPin className="h-3 w-3" />
                              <span>{order.delivery_address}</span>
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
                          <p className="text-xs text-muted-foreground">{t('vendor.orders.totalAmount')}</p>
                          <p className="font-semibold text-sm">{order.total_amount ? `$${order.total_amount.toLocaleString()}` : t('vendor.orders.amountTBD')}</p>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "flex items-center gap-2 p-3 bg-muted/50 rounded-lg",
                        isRTL && "flex-row-reverse"
                      )}>
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <div className={cn(isRTL && "text-right")}>
                          <p className="text-xs text-muted-foreground">{t('vendor.orders.orderDate')}</p>
                          <p className="font-semibold text-sm">{format(new Date(order.created_at), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "flex items-center gap-2 p-3 bg-muted/50 rounded-lg",
                        isRTL && "flex-row-reverse"
                      )}>
                        <Clock className="h-4 w-4 text-orange-500" />
                        <div className={cn(isRTL && "text-right")}>
                          <p className="text-xs text-muted-foreground">{t('vendor.orders.deliveryDate')}</p>
                          <p className="font-semibold text-sm">{order.delivery_date ? format(new Date(order.delivery_date), 'MMM dd, yyyy') : t('vendor.orders.dateTBD')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                      <Button variant="outline" className="flex-1">
                        <Eye className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                        {t('vendor.orders.viewDetails')}
                      </Button>
                      <Button variant="outline">
                        <FileText className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                        {t('vendor.orders.viewInvoice')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  Users,
  FileText,
  Package,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AdminQuickActionsProps {
  stats: {
    pendingOffers: number;
    openTickets: number;
    monthlyGrowth: number;
    completedOrders: number;
    confirmedOrders: number;
    totalUsers: number;
  };
  className?: string;
}

export const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({
  stats,
  className
}) => {
  const { t, isRTL, formatNumber } = useLanguage();

  const completionRate = ((stats.completedOrders / (stats.completedOrders + stats.confirmedOrders)) * 100 || 0);

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {/* Requires Immediate Attention */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            {t('admin.requiresImmediateAttention')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.pendingOffers > 0 && (
            <div className={cn("flex items-center justify-between p-3 bg-yellow-50 rounded-lg", isRTL && "flex-row-reverse")}>
              <div className={cn(isRTL ? "text-right" : "text-left")}>
                <p className="font-medium">{t('admin.pendingOfferApprovals')}</p>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(stats.pendingOffers)} {t('admin.offersAwaitingReview')}
                </p>
              </div>
              <Button asChild size="sm">
                <Link to="/admin/offers">{t('common.view')}</Link>
              </Button>
            </div>
          )}
          
          {stats.openTickets > 0 && (
            <div className={cn("flex items-center justify-between p-3 bg-red-50 rounded-lg", isRTL && "flex-row-reverse")}>
              <div className={cn(isRTL ? "text-right" : "text-left")}>
                <p className="font-medium">{t('admin.openSupportTickets')}</p>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(stats.openTickets)} {t('admin.ticketsNeedResponse')}
                </p>
              </div>
              <Button asChild size="sm">
                <Link to="/admin/support">{t('common.view')}</Link>
              </Button>
            </div>
          )}

          {stats.pendingOffers === 0 && stats.openTickets === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p>{t('admin.allCaughtUp')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <TrendingUp className="h-5 w-5 text-green-600" />
            {t('admin.platformPerformance')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <span className="text-sm font-medium">{t('admin.userGrowthMetric')}</span>
              <span className="text-sm text-green-600">+{stats.monthlyGrowth}%</span>
            </div>
            <Progress value={stats.monthlyGrowth} className="w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className={cn("text-center", isRTL ? "text-right" : "text-left")}>
              <p className="text-2xl font-bold">
                {completionRate.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">{t('admin.completionRate')}</p>
            </div>
            <div className={cn("text-center", isRTL ? "text-right" : "text-left")}>
              <p className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</p>
              <p className="text-xs text-muted-foreground">{t('admin.totalUsers')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

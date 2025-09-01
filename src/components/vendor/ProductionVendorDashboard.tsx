import React, { useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Package, Award, DollarSign, TrendingUp, CheckCircle, 
  Star, AlertCircle, Activity, Calendar, FileText, 
  BarChart3, PieChart, MessageSquare, Plus, Eye, Edit
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { useOptimizedVendorStats } from '@/components/vendor/useOptimizedVendorStats';
import { usePerformanceMetrics, PerformanceMonitor } from '@/components/common/PerformanceMetrics';
import { ProductionErrorBoundary } from '@/components/common/ProductionErrorBoundary';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  variant = 'default',
  loading = false
}) => {
  const { isRTL } = useOptionalLanguage() || { isRTL: false };
  
  const variantStyles = {
    default: 'border-border',
    success: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10',
    warning: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/10',
    destructive: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'
  };

  if (loading) {
    return (
      <Card className={cn("relative overflow-hidden", variantStyles[variant])}>
        <CardHeader className="pb-2">
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("relative overflow-hidden transition-all hover:shadow-md", variantStyles[variant])}>
      <CardHeader className="pb-2">
        <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("space-y-1", isRTL && "text-right")}>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center text-xs",
              isRTL ? "flex-row-reverse" : "",
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

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-48" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const ProductionVendorDashboard: React.FC = () => {
  const { 
    language, 
    isRTL, 
    t, 
    formatNumber, 
    formatCurrency, 
    formatDate 
  } = useOptionalLanguage() || {
    language: 'en' as const,
    isRTL: false,
    t: (key: string) => key,
    formatNumber: (num: number) => num.toString(),
    formatCurrency: (amount: number) => `$${amount}`,
    formatDate: (date: Date) => date.toLocaleDateString()
  };

  const { stats, loading, error, userProfile } = useOptimizedVendorStats();
  const { metrics } = usePerformanceMetrics();

  // Status icon helper
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Activity;
      case 'rejected': return AlertCircle;
      default: return AlertCircle;
    }
  };

  // Status variant helper
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'warning';
    }
  };

  // Memoize expensive calculations
  const memoizedStats = useMemo(() => ({
    ...stats,
    formattedEarnings: formatCurrency(stats.totalEarnings),
    formattedMonthlyEarnings: formatCurrency(stats.monthlyEarnings)
  }), [stats, formatCurrency]);

  // Show loading skeleton
  if (loading && !userProfile) {
    return (
      <Suspense fallback={<LoadingSkeleton />}>
        <LoadingSkeleton />
      </Suspense>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h3 className="font-semibold">Error Loading Dashboard</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProductionErrorBoundary showDetails={true} showHomeButton={true}>
      <div className={cn(
        "space-y-8", 
        isRTL && "rtl text-right"
      )}>
        {/* Performance info in development */}
        {process.env.NODE_ENV === 'development' && metrics && (
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
            Render time: {metrics.renderTime.toFixed(2)}ms | 
            Online: {metrics.isOnline ? '✓' : '✗'} |
            Connection: {metrics.connectionSpeed}
          </div>
        )}

        {/* Welcome Header */}
        <div className={cn("space-y-2", isRTL && "text-right")}>
          <h1 className="text-3xl font-bold text-foreground">
            {t('vendor.dashboard.welcome')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {userProfile?.company_name || userProfile?.full_name}
          </p>
        </div>

        {/* CR Status Alert */}
        {stats.crStatus !== 'approved' && (
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="p-4">
              <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <AlertCircle className="h-5 w-5 text-warning" />
                <div className="flex-1">
                  <h3 className="font-semibold text-warning">{t('vendor.cr.verificationRequired')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('vendor.cr.completeVerification')}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild className={cn(isRTL ? "mr-auto" : "ml-auto")}>
                  <Link to="/vendor/cr-management">{t('vendor.cr.updateCR')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Core Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title={t('vendor.dashboard.crVerificationStatus')}
            value={t(`vendor.cr.${stats.crStatus}`)}
            description={t('vendor.dashboard.crVerificationDesc')}
            icon={getStatusIcon(stats.crStatus)}
            variant={getStatusVariant(stats.crStatus) as any}
            loading={loading}
          />
          
          <MetricCard
            title={t('vendor.dashboard.profileCompletionTitle')}
            value={`${stats.profileCompletion}%`}
            description={t('vendor.dashboard.profileCompletionDesc')}
            icon={User}
            trend={{
              value: stats.profileCompletion > 80 ? 5 : -5,
              label: stats.profileCompletion > 80 ? t('common.good') : t('common.needsWork'),
              isPositive: stats.profileCompletion > 80
            }}
            loading={loading}
          />
          
          <MetricCard
            title={t('vendor.dashboard.activeOffersCount')}
            value={formatNumber(stats.activeOffers)}
            description={t('vendor.dashboard.activeOffersCountDesc')}
            icon={Package}
            variant="warning"
            loading={loading}
          />
          
          <MetricCard
            title={t('vendor.dashboard.successRateTitle')}
            value={`${stats.successRate}%`}
            description={t('vendor.dashboard.successRateDesc')}
            icon={Award}
            variant="success"
            loading={loading}
          />
        </div>

        {/* Business Performance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title={t('vendor.dashboard.totalEarningsTitle')}
            value={formatCurrency(stats.totalEarnings)}
            description={t('vendor.dashboard.totalEarningsDesc')}
            icon={DollarSign}
            trend={{
              value: 12,
              label: t('common.vsLastMonth'),
              isPositive: true
            }}
            loading={loading}
          />
          
          <MetricCard
            title={t('vendor.dashboard.monthlyRevenueTitle')}
            value={formatCurrency(stats.monthlyEarnings)}
            description={t('vendor.dashboard.monthlyRevenueDesc')}
            icon={TrendingUp}
            variant="success"
            loading={loading}
          />
          
          <MetricCard
            title={t('vendor.dashboard.completedProjectsTitle')}
            value={formatNumber(stats.completedProjects)}
            description={t('vendor.dashboard.completedProjectsDesc')}
            icon={CheckCircle}
            loading={loading}
          />
          
          <MetricCard
            title={t('vendor.dashboard.clientRatingTitle')}
            value={`${stats.clientRating}/5`}
            description={t('vendor.dashboard.clientRatingDesc')}
            icon={Star}
            variant="success"
            loading={loading}
          />
        </div>

        {/* Quick Actions Section */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Activity className="h-5 w-5 text-primary" />
              {t('vendor.dashboard.quickActions')}
            </CardTitle>
            <CardDescription>
              {t('vendor.dashboard.quickActionsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                asChild
                className="h-auto p-4 flex-col space-y-2 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                variant="outline"
              >
                <Link to="/vendor/rfqs" className="text-center">
                  <Package className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">{t('vendor.dashboard.browseRFQs')}</div>
                    <div className="text-xs opacity-80">{t('vendor.dashboard.newRequests')}</div>
                  </div>
                </Link>
              </Button>
              
              <Button 
                asChild
                className="h-auto p-4 flex-col space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                variant="outline"
              >
                <Link to="/vendor/offers/create" className="text-center">
                  <Plus className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">{t('vendor.dashboard.submitOffer')}</div>
                    <div className="text-xs opacity-80">{t('vendor.dashboard.createNewOffer')}</div>
                  </div>
                </Link>
              </Button>
              
              <Button 
                asChild
                className="h-auto p-4 flex-col space-y-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                variant="outline"
              >
                <Link to="/vendor/messages" className="text-center">
                  <MessageSquare className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">{t('vendor.dashboard.messages')}</div>
                    <div className="text-xs opacity-80">{t('vendor.dashboard.unreadMessages')}</div>
                  </div>
                </Link>
              </Button>
              
              <Button 
                asChild
                className="h-auto p-4 flex-col space-y-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                variant="outline"
              >
                <Link to="/vendor/profile" className="text-center">
                  <User className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">{t('vendor.dashboard.updateProfile')}</div>
                    <div className="text-xs opacity-80">{stats.profileCompletion}% {t('common.completed')}</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Calendar className="h-5 w-5 text-primary" />
                {t('vendor.dashboard.recentActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('vendor.dashboard.newRFQReceived')}</p>
                    <p className="text-xs text-muted-foreground">{t('vendor.dashboard.constructionProject')} - {t('vendor.dashboard.hoursAgo')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('vendor.dashboard.offerSubmitted')}</p>
                    <p className="text-xs text-muted-foreground">{t('vendor.dashboard.officeRenovation')} - {t('vendor.dashboard.hoursAgo')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('vendor.dashboard.profileUpdateRequired')}</p>
                    <p className="text-xs text-muted-foreground">{t('vendor.dashboard.completeVerification')} - {t('vendor.dashboard.dayAgo')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <BarChart3 className="h-5 w-5 text-primary" />
                {t('vendor.dashboard.performanceOverview')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('vendor.dashboard.profileCompletion')}</span>
                    <span className="font-medium">{stats.profileCompletion}%</span>
                  </div>
                  <Progress value={stats.profileCompletion} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('vendor.dashboard.successRateTitle')}</span>
                    <span className="font-medium">{stats.successRate}%</span>
                  </div>
                  <Progress value={stats.successRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('vendor.dashboard.clientRatingTitle')}</span>
                    <span className="font-medium">{stats.clientRating}/5</span>
                  </div>
                  <Progress value={(stats.clientRating / 5) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Performance Monitor for development */}
      <PerformanceMonitor />
    </ProductionErrorBoundary>
  );
};
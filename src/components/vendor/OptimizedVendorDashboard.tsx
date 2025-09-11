import React, { Suspense, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Package, Award, DollarSign, TrendingUp, CheckCircle, 
  Star, AlertCircle, Activity, Calendar, FileText, 
  BarChart3, MessageSquare, Plus, Eye, Target, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOptimizedVendorStats } from '@/components/vendor/useOptimizedVendorStats';
import { useOptimizedFormatters, useOptimizedUserProfile } from '@/hooks/usePerformanceOptimization';
import { ErrorRecovery } from '@/components/ui/error-recovery';
import { EnhancedMetricCard, MetricsGrid, type MetricData } from '@/components/dashboard/enhanced-metrics';
import { DashboardGridSkeleton } from '@/components/ui/skeleton-components';
import { PageLoading } from '@/components/ui/enhanced-loading-states';
import { cn } from '@/lib/utils';

// Memoized Quick Action Button
const QuickActionButton = React.memo<{
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  variant: string;
  className?: string;
}>(({ to, icon: Icon, title, description, variant, className }) => (
  <Button 
    asChild
    className={cn(
      "h-auto p-4 flex-col space-y-2 border-primary/20 transition-all hover:scale-105",
      variant,
      className
    )}
    variant="outline"
  >
    <Link to={to} className="text-center">
      <Icon className="h-6 w-6" />
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs opacity-80">{description}</div>
      </div>
    </Link>
  </Button>
));

QuickActionButton.displayName = 'QuickActionButton';

// Memoized Activity Item
const ActivityItem = React.memo<{
  color: string;
  title: string;
  description: string;
}>(({ color, title, description }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
    <div className={cn("h-2 w-2 rounded-full", color)}></div>
    <div className="flex-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
));

ActivityItem.displayName = 'ActivityItem';

export const OptimizedVendorDashboard: React.FC = React.memo(() => {
  const { language, isRTL, t } = useLanguage();
  const { stats, loading, error, userProfile } = useOptimizedVendorStats();
  const optimizedProfile = useOptimizedUserProfile();
  const { formatCurrency, formatNumber, formatPercentage, formatRelativeTime } = useOptimizedFormatters();

  // Memoized metrics data
  const metricsData = useMemo((): MetricData[] => {
    if (!stats) return [];

    return [
      {
        id: 'cr-status',
        title: t('vendor.dashboard.crVerificationStatus'),
        value: t(`vendor.cr.${stats.crStatus}`),
        description: t('vendor.dashboard.crVerificationDesc'),
        icon: stats.crStatus === 'approved' ? CheckCircle : 
              stats.crStatus === 'pending' ? Activity : AlertCircle,
        variant: stats.crStatus === 'approved' ? 'success' : 
                 stats.crStatus === 'pending' ? 'warning' : 'destructive',
        actionUrl: stats.crStatus !== 'approved' ? '/vendor/cr-management' : undefined,
        actionLabel: stats.crStatus !== 'approved' ? t('vendor.cr.updateCR') : undefined
      },
      {
        id: 'profile-completion',
        title: t('vendor.dashboard.profileCompletionTitle'),
        value: `${stats.profileCompletion}%`,
        description: t('vendor.dashboard.profileCompletionDesc'),
        icon: User,
        progress: {
          value: stats.profileCompletion,
          max: 100,
          label: 'Profile Completion'
        },
        trend: {
          value: stats.profileCompletion > 80 ? 5 : -5,
          label: stats.profileCompletion > 80 ? t('common.good') : t('common.needsWork'),
          isPositive: stats.profileCompletion > 80
        },
        variant: stats.profileCompletion > 80 ? 'success' : 'warning',
        actionUrl: stats.profileCompletion < 100 ? '/vendor/profile' : undefined,
        actionLabel: stats.profileCompletion < 100 ? t('vendor.dashboard.updateProfile') : undefined
      },
      {
        id: 'active-offers',
        title: t('vendor.dashboard.activeOffersCount'),
        value: formatNumber(stats.activeOffers),
        description: t('vendor.dashboard.activeOffersCountDesc'),
        icon: Package,
        variant: 'warning',
        actionUrl: '/vendor/offers',
        actionLabel: t('vendor.dashboard.viewAllOffers')
      },
      {
        id: 'success-rate',
        title: t('vendor.dashboard.successRateTitle'),
        value: formatPercentage(stats.successRate),
        description: t('vendor.dashboard.successRateDesc'),
        icon: Award,
        variant: 'success',
        trend: {
          value: 12,
          label: t('common.vsLastMonth'),
          isPositive: true
        }
      },
      {
        id: 'total-earnings',
        title: t('vendor.dashboard.totalEarningsTitle'),
        value: formatCurrency(stats.totalEarnings),
        description: t('vendor.dashboard.totalEarningsDesc'),
        icon: DollarSign,
        trend: {
          value: 15,
          label: t('common.vsLastMonth'),
          isPositive: true
        },
        metadata: {
          monthlyAverage: formatCurrency(stats.totalEarnings / 12),
          lastPayment: formatRelativeTime(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
        }
      },
      {
        id: 'monthly-revenue',
        title: t('vendor.dashboard.monthlyRevenueTitle'),
        value: formatCurrency(stats.monthlyEarnings),
        description: t('vendor.dashboard.monthlyRevenueDesc'),
        icon: TrendingUp,
        variant: 'success',
        trend: {
          value: 8,
          label: t('common.vsLastMonth'),
          isPositive: true
        }
      },
      {
        id: 'completed-projects',
        title: t('vendor.dashboard.completedProjectsTitle'),
        value: formatNumber(stats.completedProjects),
        description: t('vendor.dashboard.completedProjectsDesc'),
        icon: CheckCircle,
        actionUrl: '/vendor/projects',
        actionLabel: t('vendor.dashboard.viewProjects')
      },
      {
        id: 'client-rating',
        title: t('vendor.dashboard.clientRatingTitle'),
        value: `${stats.clientRating}/5`,
        description: t('vendor.dashboard.clientRatingDesc'),
        icon: Star,
        variant: 'success',
        metadata: {
          totalReviews: 47,
          fiveStars: 32,
          fourStars: 12,
          threeStars: 3
        }
      }
    ];
  }, [stats, t, formatCurrency, formatNumber, formatPercentage, formatRelativeTime]);

  // Memoized quick actions
  const quickActions = useMemo(() => [
    {
      to: '/vendor/rfqs',
      icon: Target,
      title: t('vendor.dashboard.browseRFQs'),
      description: t('vendor.dashboard.newRequests'),
      variant: "bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
    },
    {
      to: '/vendor/offers/create',
      icon: Plus,
      title: t('vendor.dashboard.submitOffer'),
      description: t('vendor.dashboard.createNewOffer'),
      variant: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
    },
    {
      to: '/vendor/messages',
      icon: MessageSquare,
      title: t('vendor.dashboard.messages'),
      description: t('vendor.dashboard.unreadMessages'),
      variant: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      to: '/vendor/profile',
      icon: User,
      title: t('vendor.dashboard.updateProfile'),
      description: `${stats?.profileCompletion || 0}% ${t('common.completed')}`,
      variant: "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
    }
  ], [t, stats?.profileCompletion]);

  // Memoized activity items
  const activityItems = useMemo(() => [
    {
      color: "bg-green-500",
      title: t('vendor.dashboard.newRFQReceived'),
      description: `${t('vendor.dashboard.constructionProject')} - ${t('vendor.dashboard.hoursAgo')}`
    },
    {
      color: "bg-blue-500",
      title: t('vendor.dashboard.offerSubmitted'),
      description: `${t('vendor.dashboard.officeRenovation')} - ${t('vendor.dashboard.hoursAgo')}`
    },
    {
      color: "bg-yellow-500",
      title: t('vendor.dashboard.profileUpdateRequired'),
      description: `${t('vendor.dashboard.completeVerification')} - ${t('vendor.dashboard.dayAgo')}`
    }
  ], [t]);

  // Retry handler
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Show loading skeleton while data is loading
  if (loading && !userProfile) {
    return (
      <Suspense fallback={<PageLoading />}>
        <DashboardGridSkeleton metrics={8} charts={2} />
      </Suspense>
    );
  }

  // Error state with recovery
  if (error) {
    return (
      <ErrorRecovery
        error={error}
        onRetry={handleRetry}
        title={t('common.errorLoadingDashboard')}
        description="Unable to load vendor dashboard data. Please try again."
        showDetails={process.env.NODE_ENV === 'development'}
      />
    );
  }

  return (
    <div className={cn("space-y-8", isRTL && "rtl text-right")}>
      {/* Welcome Header */}
      <div className={cn("space-y-2", isRTL && "text-right")}>
        <h1 className="text-3xl font-bold text-foreground">
          {t('vendor.dashboard.welcome')}
        </h1>
        <p className="text-muted-foreground">
          {optimizedProfile?.companyName || optimizedProfile?.fullName || userProfile?.full_name}
        </p>
      </div>

      {/* CR Status Alert */}
      {stats && stats.crStatus !== 'approved' && (
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

      {/* Enhanced Metrics Grid */}
      <MetricsGrid
        metrics={metricsData}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        columns={4}
        compact={false}
      />

      {/* Quick Actions Section */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Zap className="h-5 w-5 text-primary" />
            {t('vendor.dashboard.quickActions')}
          </CardTitle>
          <CardDescription>
            {t('vendor.dashboard.quickActionsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionButton key={index} {...action} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Activity className="h-5 w-5 text-primary" />
              {t('vendor.dashboard.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityItems.map((item, index) => (
                <ActivityItem key={index} {...item} />
              ))}
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
                  <span className="font-medium">{stats?.profileCompletion || 0}%</span>
                </div>
                <Progress value={stats?.profileCompletion || 0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('vendor.dashboard.responseRate')}</span>
                  <span className="font-medium">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('vendor.dashboard.clientSatisfaction')}</span>
                  <span className="font-medium">{stats?.clientRating || 0}/5</span>
                </div>
                <Progress value={((stats?.clientRating || 0) / 5) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Development Performance Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Development Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>Profile: {optimizedProfile ? 'Optimized' : 'Standard'}</p>
            <p>Formatters: Memoized</p>
            <p>Metrics: {metricsData.length} loaded</p>
            <p>Language: {language}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

OptimizedVendorDashboard.displayName = 'OptimizedVendorDashboard';
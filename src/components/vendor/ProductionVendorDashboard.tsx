import React, { memo, useMemo, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProductionLoadingSpinner } from "@/components/ui/ProductionLoadingSpinner";
import { ProductionErrorBoundary } from "@/components/ui/ProductionErrorBoundary";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { 
  FileText, 
  FolderOpen, 
  Tags, 
  User, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  DollarSign,
  Package,
  Star,
  BarChart3,
  Award,
  MessageSquare
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useOptimizedVendorStats } from "@/hooks/useOptimizedVendorStats";

// Lazy loaded chart component for better performance
const LazyLineChart = memo(() => {
  const LineChart = React.lazy(() => 
    import('recharts').then(module => ({ default: module.LineChart }))
  );
  const Line = React.lazy(() => 
    import('recharts').then(module => ({ default: module.Line }))
  );
  const XAxis = React.lazy(() => 
    import('recharts').then(module => ({ default: module.XAxis }))
  );
  const YAxis = React.lazy(() => 
    import('recharts').then(module => ({ default: module.YAxis }))
  );
  const CartesianGrid = React.lazy(() => 
    import('recharts').then(module => ({ default: module.CartesianGrid }))
  );
  const Tooltip = React.lazy(() => 
    import('recharts').then(module => ({ default: module.Tooltip }))
  );
  const ResponsiveContainer = React.lazy(() => 
    import('recharts').then(module => ({ default: module.ResponsiveContainer }))
  );

  return (
    <Suspense fallback={<SkeletonCard showHeader={false} lines={10} className="h-80" />}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ textAnchor: 'middle' }} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="offers"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Suspense>
  );
});

export const ProductionVendorDashboard = memo(() => {
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { isRTL, formatCurrency, formatNumber } = languageContext || { 
    isRTL: false, 
    formatCurrency: (amount: number) => `$${amount.toLocaleString()}`,
    formatNumber: (num: number) => num.toLocaleString()
  };
  const t = languageContext?.t || ((key: string) => key);
  const navigate = useNavigate();
  const { stats, loading, error, refetch } = useOptimizedVendorStats();

  // Performance monitoring
  const metrics = usePerformanceMonitor('ProductionVendorDashboard');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const quickActions = useMemo(() => [
    {
      title: t('vendor.cr.updateCR'),
      description: t('vendor.cr.verificationRequired'),
      icon: FileText,
      href: "/vendor/cr-management",
      color: "bg-primary",
      count: stats.crStatus === 'pending' ? 1 : undefined
    },
    {
      title: t('vendor.projects.add'),
      description: t('vendor.projects.addFirst'),
      icon: Plus,
      href: "/vendor/projects/new",
      color: "bg-success"
    },
    {
      title: t('vendor.categories.manage'),
      description: t('vendor.categories.select'),
      icon: Tags,
      href: "/vendor/categories",
      color: "bg-warning"
    },
    {
      title: t('vendor.profile.title'),
      description: t('vendor.profile.basicInfo'),
      icon: User,
      href: "/vendor/profile",
      color: "bg-info",
      count: stats.profileCompletion < 100 ? 1 : undefined
    }
  ], [t, stats.crStatus, stats.profileCompletion]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded shimmer" />
          <div className="h-4 w-48 bg-muted rounded shimmer" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} showHeader={false} lines={2} />
          ))}
        </div>
        
        <SkeletonCard lines={5} className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Failed to load dashboard"
        description={error}
        action={{
          label: t('common.retry'),
          onClick: refetch
        }}
      />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            value={`${stats.clientSatisfaction}/5`}
            description={t('vendor.dashboard.clientRatingDesc')}
            icon={Star}
            variant="success"
            loading={loading}
          />
        </div>

        {/* Performance Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('vendor.dashboard.offerTrends')}</CardTitle>
            <CardDescription>
              {t('vendor.dashboard.offerTrendsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <LazyLineChart />
            </div>
          </CardContent>
        </Card>

        {/* Rest of the dashboard content - keeping the same structure as EnhancedVendorDashboard */}
        {/* Quick Actions, Action Items, Business Performance sections... */}
      </div>
    </ProductionErrorBoundary>
  );
});

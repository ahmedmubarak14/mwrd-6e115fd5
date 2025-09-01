import React, { memo, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProductionLoadingSpinner } from "@/components/ui/ProductionLoadingSpinner";
import { ProductionErrorBoundary } from "@/components/ui/ProductionErrorBoundary";
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
  Edit,
  DollarSign,
  Package,
  Star,
  Shield,
  BarChart3,
  Award,
  Users,
  MessageSquare
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useOptimizedVendorStats } from "@/hooks/useOptimizedVendorStats";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const EnhancedVendorDashboard = memo(() => {
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
      <ProductionLoadingSpinner 
        size="lg"
        text={t('common.loading')}
        fullScreen={false}
      />
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <ProductionErrorBoundary showDetails={true} showHomeButton={true}>
      <div className={cn(
        "space-y-8", 
        isRTL && "rtl text-right"
      )}>
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={stats.offerTrends} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ textAnchor: 'middle' }}
                  />
                  <YAxis />
                  <Tooltip 
                    labelStyle={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    contentStyle={{
                      direction: isRTL ? 'rtl' : 'ltr',
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="offers"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <Card>
          <CardHeader>
            <CardTitle>{t('vendor.dashboard.quickActions')}</CardTitle>
            <CardDescription>
              {t('common.getStartedActions')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.href} to={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", action.color)}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{action.title}</h3>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                          {action.count && (
                            <Badge variant="secondary" className="mt-1">
                              {action.count}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Items & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <AlertCircle className="h-5 w-5 text-warning" />
                {t('vendor.dashboard.actionRequired')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.crStatus !== 'approved' && (
                <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{t('vendor.dashboard.completeCRTitle')}</p>
                    <p className="text-sm text-foreground opacity-75">
                      {t('vendor.dashboard.completeCRDesc')}
                    </p>
                  </div>
                  <Link to="/vendor/cr-management">
                    <Button size="sm" variant="outline">{t('common.update')}</Button>
                  </Link>
                </div>
              )}
              
              {stats.profileCompletion < 100 && (
                <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{t('vendor.dashboard.completeProfileTitle')}</p>
                    <p className="text-sm text-foreground opacity-75">
                      {100 - stats.profileCompletion}{t('vendor.dashboard.completeProfileDesc')}
                    </p>
                  </div>
                  <Link to="/vendor/profile">
                    <Button size="sm" variant="outline">{t('common.complete')}</Button>
                  </Link>
                </div>
              )}

              {stats.activeOffers > 0 && (
                <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{t('vendor.dashboard.activeOffersTitle')}</p>
                    <p className="text-sm text-foreground opacity-75">
                      {formatNumber(stats.activeOffers)} {t('vendor.dashboard.activeOffersDesc')}
                    </p>
                  </div>
                  <Link to="/vendor/offers">
                    <Button size="sm" variant="outline">{t('common.view')}</Button>
                  </Link>
                </div>
              )}

              {stats.crStatus === 'approved' && stats.profileCompletion === 100 && stats.activeOffers === 0 && (
                <div className="text-center py-6 text-foreground opacity-75">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p>{t('vendor.dashboard.allSetReady')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <BarChart3 className="h-5 w-5 text-success" />
                {t('vendor.dashboard.quickActions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Button onClick={() => navigate('/vendor/browse-requests')} className={cn("h-auto p-4", isRTL ? "justify-end" : "justify-start")}>
                  <Eye className={cn("h-5 w-5", isRTL ? "ml-3" : "mr-3")} />
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <div className="font-medium">{t('vendor.dashboard.browseRequestsTitle')}</div>
                    <div className="text-xs opacity-75">{t('vendor.dashboard.browseRequestsDesc')}</div>
                  </div>
                </Button>
                
                <Button variant="outline" onClick={() => navigate('/vendor/projects')} className={cn("h-auto p-4", isRTL ? "justify-end" : "justify-start")}>
                  <FolderOpen className={cn("h-5 w-5", isRTL ? "ml-3" : "mr-3")} />
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <div className="font-medium">{t('vendor.dashboard.manageProjectsTitle')}</div>
                    <div className="text-xs opacity-75">{t('vendor.dashboard.manageProjectsDesc')}</div>
                  </div>
                </Button>

                <Button variant="outline" onClick={() => navigate('/vendor/messages')} className={cn("h-auto p-4", isRTL ? "justify-end" : "justify-start")}>
                  <MessageSquare className={cn("h-5 w-5", isRTL ? "ml-3" : "mr-3")} />
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <div className="font-medium">{t('vendor.dashboard.messagesTitle')}</div>
                    <div className="text-xs opacity-75">{t('vendor.dashboard.messagesDesc')}</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Performance Overview */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t('vendor.dashboard.businessPerformance')}</CardTitle>
            <CardDescription>{t('vendor.dashboard.businessPerformanceDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('vendor.dashboard.offerSuccessRate')}</span>
                  <span className="text-sm text-success">
                    {stats.successRate}%
                  </span>
                </div>
                <Progress 
                  value={stats.successRate} 
                  className="w-full" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('vendor.dashboard.profileCompletionTitle')}</span>
                  <span className="text-sm text-primary">
                    {stats.profileCompletion}%
                  </span>
                </div>
                <Progress 
                  value={stats.profileCompletion} 
                  className="w-full" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('vendor.dashboard.clientSatisfactionRate')}</span>
                  <span className="text-sm text-success">
                    {stats.clientSatisfaction}/5
                  </span>
                </div>
                <Progress 
                  value={(stats.clientSatisfaction / 5) * 100} 
                  className="w-full" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProductionErrorBoundary>
  );
});
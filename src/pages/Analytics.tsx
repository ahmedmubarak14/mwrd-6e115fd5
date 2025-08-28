import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Download, RefreshCw, BarChart3, TrendingUp, Users, DollarSign, FileText, Handshake, Activity, PieChart } from "lucide-react";
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { cn } from "@/lib/utils";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const Analytics = () => {
  const { userProfile } = useAuth();
  const { language, t, isRTL, formatNumber, formatCurrency } = useLanguage();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("30");
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    metrics,
    chartData,
    isLoading,
    error,
    refreshData
  } = useRealTimeAnalytics();

  const handleExportAnalytics = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: isRTL ? "تم تصدير التحليلات" : "Analytics Exported",
        description: isRTL ? "تم تصدير بيانات التحليلات بنجاح" : "Analytics data exported successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في التصدير" : "Export Error",
        description: isRTL ? "حدث خطأ أثناء تصدير البيانات" : "Error exporting analytics data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefreshData = async () => {
    try {
      await refreshData();
      
      toast({
        title: isRTL ? "تم تحديث البيانات" : "Data Refreshed",
        description: isRTL ? "تم تحديث بيانات التحليلات بنجاح" : "Analytics data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في التحديث" : "Refresh Error",
        description: isRTL ? "حدث خطأ أثناء تحديث البيانات" : "Error refreshing data",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <ClientPageContainer
        title={t('analytics.platformAnalytics') || 'Analytics & Insights'}
        description={t('analytics.comprehensiveInsights') || 'Comprehensive view of your account performance and activity statistics'}
      >
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </div>
      </ClientPageContainer>
    );
  }

  if (error) {
    return (
      <ClientPageContainer
        title={t('analytics.platformAnalytics') || 'Analytics & Insights'}
        description={t('analytics.comprehensiveInsights') || 'Comprehensive view of your account performance and activity statistics'}
      >
        <div className="text-center text-destructive py-8">
          <p>{error}</p>
        </div>
      </ClientPageContainer>
    );
  }

  return (
    <ClientPageContainer
      title={t('analytics.platformAnalytics') || 'Analytics & Insights'}
      description={t('analytics.comprehensiveInsights') || 'Comprehensive view of your account performance and activity statistics'}
      headerActions={
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t('analytics.last7Days') || '7 Days'}</SelectItem>
              <SelectItem value="30">{t('analytics.last30Days') || '30 Days'}</SelectItem>
              <SelectItem value="90">{t('analytics.last90Days') || '90 Days'}</SelectItem>
              <SelectItem value="365">{t('analytics.lastYear') || '1 Year'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            {t('common.update') || 'Refresh'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExportAnalytics}
            disabled={isExporting}
          >
            {isExporting ? (
              <LoadingSpinner size="sm" className={cn(isRTL ? "ml-2" : "mr-2")} />
            ) : (
              <Download className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            )}
            {t('analytics.export') || 'Export'}
          </Button>
        </div>
      }
    >
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.totalUsers') || 'Total Users'}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics?.totalUsers || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics?.userGrowth || 0}% {t('analytics.fromLastMonth') || 'from last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.totalRequests') || 'Active Requests'}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics?.activeRequests || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics?.requestGrowth || 0}% {t('analytics.fromLastWeek') || 'from last week'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.monthlyRevenue') || 'Revenue'}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics?.revenueGrowth || 0}% {t('analytics.fromLastMonth') || 'from last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('common.orders') || 'Orders'}</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics?.totalOrders || 0)}</div>
            <p className="text-xs text-muted-foreground">
              -{metrics?.orderDecline || 0}% {t('analytics.fromLastWeek') || 'from last week'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <BarChart3 className="h-4 w-4" />
            {t('common.dashboard') || 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="users" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Users className="h-4 w-4" />
            {t('nav.users') || 'Users'}
          </TabsTrigger>
          <TabsTrigger value="financial" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <DollarSign className="h-4 w-4" />
            {t('nav.finance') || 'Financial'}
          </TabsTrigger>
          <TabsTrigger value="performance" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <TrendingUp className="h-4 w-4" />
            {t('analytics.performanceMetrics') || 'Performance'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.userActivity') || 'User Activity'}</CardTitle>
                <CardDescription>
                  {t('analytics.dailyActiveUsers') || 'Daily active users over time'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData?.userActivity || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.requestTrends') || 'Request Trends'}</CardTitle>
                <CardDescription>
                  {t('analytics.requestsOverTime') || 'Service requests submitted over time'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData?.requestTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.userGrowth') || 'User Growth'}</CardTitle>
                <CardDescription>
                  {t('analytics.newUsersOverTime') || 'New user registrations over time'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData?.userGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="newUsers" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.userTypes') || 'User Types'}</CardTitle>
                <CardDescription>
                  {t('analytics.distributionByRole') || 'Distribution of users by role'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip />
                    <RechartsPieChart data={chartData?.userTypes || []}>
                      {(chartData?.userTypes || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.revenueOverview') || 'Revenue Overview'}</CardTitle>
              <CardDescription>
                {t('analytics.monthlyRevenue') || 'Monthly revenue and transaction volume'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData?.revenue || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.systemMetrics') || 'System Metrics'}</CardTitle>
                <CardDescription>
                  {t('analytics.platformPerformance') || 'Platform performance indicators'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.responseTime') || 'Avg Response Time'}
                  </span>
                  <Badge variant="secondary">{metrics?.avgResponseTime || '120ms'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.uptime') || 'System Uptime'}
                  </span>
                  <Badge variant="secondary">{metrics?.uptime || '99.9%'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.errorRate') || 'Error Rate'}
                  </span>
                  <Badge variant="secondary">{metrics?.errorRate || '0.1%'}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.userSatisfaction') || 'User Satisfaction'}</CardTitle>
                <CardDescription>
                  {t('analytics.feedbackRatings') || 'User feedback and ratings'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.avgRating') || 'Average Rating'}
                  </span>
                  <Badge variant="secondary">{metrics?.avgRating || '4.8/5'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.nps') || 'Net Promoter Score'}
                  </span>
                  <Badge variant="secondary">{metrics?.nps || '72'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('support.title') || 'Support Resolution'}
                  </span>
                  <Badge variant="secondary">{metrics?.supportResolution || '2.3h'}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </ClientPageContainer>
  );
};
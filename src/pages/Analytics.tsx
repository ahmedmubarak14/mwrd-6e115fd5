import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useClientAnalytics } from "@/hooks/useClientAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Download, RefreshCw, BarChart3, TrendingUp, Users, DollarSign, FileText, ShoppingCart, Activity, PieChart, Clock } from "lucide-react";
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { cn } from "@/lib/utils";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const Analytics = () => {
  const { userProfile } = useAuth();
  const { language, t, isRTL, formatNumber, formatCurrency } = useLanguage();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("30");
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    analytics,
    loading,
    error,
    fetchAnalytics
  } = useClientAnalytics();

  const handleExportAnalytics = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('analytics.exportAnalyticsTitle'),
        description: t('analytics.exportAnalyticsDesc'),
      });
    } catch (error) {
      toast({
        title: t('analytics.exportError'),
        description: t('analytics.exportErrorDesc'),
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefreshData = async () => {
    try {
      await fetchAnalytics();
      
      toast({
        title: t('analytics.dataRefreshed'),
        description: t('analytics.dataRefreshedDesc'),
      });
    } catch (error) {
      toast({
        title: t('analytics.refreshError'),
        description: t('analytics.refreshErrorDesc'),
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
    <ClientPageContainer
      title={t('analytics.title')}
      description={t('analytics.description')}
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
      title={t('analytics.title')}
      description={t('analytics.description')}
      >
        <div className="text-center text-destructive py-8">
          <p>{error}</p>
        </div>
      </ClientPageContainer>
    );
  }

  return (
    <ClientPageContainer
      title={t('analytics.title')}
      description={t('analytics.description')}
      headerActions={
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t('analytics.last7Days')}</SelectItem>
              <SelectItem value="30">{t('analytics.last30Days')}</SelectItem>
              <SelectItem value="90">{t('analytics.last90Days')}</SelectItem>
              <SelectItem value="365">{t('analytics.lastYear')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={handleRefreshData}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            {t('common.refresh')}
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
            {t('analytics.export')}
          </Button>
        </div>
      }
    >
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.myRequests')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics?.totalRequests || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.requestGrowth && analytics.requestGrowth > 0 ? '+' : ''}{analytics?.requestGrowth || 0}% {t('analytics.fromLastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.activeOrders')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics?.activeOrders || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.currentlyInProgress')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.totalSpending')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics?.totalSpent || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.spendingGrowth && analytics.spendingGrowth > 0 ? '+' : ''}{analytics?.spendingGrowth || 0}% {t('analytics.fromLastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.completionRate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.completionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.ofTotalRequests')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.pendingOffers')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics?.pendingOffers || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.awaitingReview')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.avgOrderValue')}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics?.averageOrderValue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.perCompletedOrder')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.vendorsWorkedWith')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics?.totalVendorsWorkedWith || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.uniqueVendors')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <BarChart3 className="h-4 w-4" />
            {t('analytics.overview')}
          </TabsTrigger>
          <TabsTrigger value="spending" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <DollarSign className="h-4 w-4" />
            {t('analytics.spending')}
          </TabsTrigger>
          <TabsTrigger value="requests" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <FileText className="h-4 w-4" />
            {t('analytics.requests')}
          </TabsTrigger>
          <TabsTrigger value="performance" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <TrendingUp className="h-4 w-4" />
            {t('analytics.performance')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.monthlySpending')}</CardTitle>
                <CardDescription>
                  {t('analytics.spendingTrend')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics?.monthlySpending || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), t('analytics.spending')]} />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
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
                <CardTitle>{t('analytics.requestsByCategory')}</CardTitle>
                <CardDescription>
                  {t('analytics.categoryDistribution')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip />
                    <Pie
                      data={analytics?.requestsByCategory || []} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={120} 
                      dataKey="count"
                    >
                      {(analytics?.requestsByCategory || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.ordersSpendingActivity')}</CardTitle>
              <CardDescription>
                {t('analytics.dailyActivity')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics?.orderTimeline || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'spending' ? formatCurrency(Number(value)) : formatNumber(Number(value)),
                      name === 'spending' ? (isRTL ? 'الإنفاق' : 'Spending') : (isRTL ? 'الطلبات' : 'Orders')
                    ]}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="spending" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.requestsSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.totalRequests')}
                  </span>
                  <Badge variant="secondary">{analytics?.totalRequests || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.activeRequests')}
                  </span>
                  <Badge variant="secondary">{analytics?.activeRequests || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.completedRequests')}
                  </span>
                  <Badge variant="secondary">{analytics?.completedRequests || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.offersSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.pendingOffers')}
                  </span>
                  <Badge variant="secondary">{analytics?.pendingOffers || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.acceptedOffers')}
                  </span>
                  <Badge variant="secondary">{analytics?.acceptedOffers || 0}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.performanceMetrics')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.completionRate')}
                  </span>
                  <Badge variant="secondary">{analytics?.completionRate || 0}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.avgResponseTime')}
                  </span>
                  <Badge variant="secondary">{analytics?.averageResponseTime || 0}h</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('analytics.avgOrderValue')}
                  </span>
                  <Badge variant="secondary">{formatCurrency(analytics?.averageOrderValue || 0)}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </ClientPageContainer>
  );
};
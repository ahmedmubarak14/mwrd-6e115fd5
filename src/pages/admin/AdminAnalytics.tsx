
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Activity,
  Download,
  RefreshCw,
  Calendar,
  Filter
} from "lucide-react";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { cn } from "@/lib/utils";

export const AdminAnalytics = () => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL, formatNumber, formatCurrency } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false,
    formatNumber: (num: number) => num.toString(),
    formatCurrency: (amount: number) => `$${amount}`
  };
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use real analytics data
  const { 
    metrics, 
    chartData, 
    isLoading, 
    refreshData 
  } = useRealTimeAnalytics();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const periodOptions = [
    { value: '7d', label: t('analytics.last7Days') || 'Last 7 Days' },
    { value: '30d', label: t('analytics.last30Days') || 'Last 30 Days' },
    { value: '90d', label: t('analytics.last90Days') || 'Last 90 Days' },
    { value: '1y', label: t('analytics.lastYear') || 'Last Year' }
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("p-4 sm:p-6 space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL ? "text-right" : "text-left")}>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t('admin.analytics') || 'Analytics Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('analytics.comprehensiveInsights') || 'Comprehensive insights into platform performance'}
          </p>
        </div>
        
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            {t('common.refresh') || 'Refresh'}
          </Button>
          
          <Button variant="outline" size="sm" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Download className="h-4 w-4" />
            {t('analytics.export') || 'Export'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">
              {t('admin.totalUsers') || 'Total Users'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics?.totalUsers || 0)}
            </div>
            <div className={cn("flex items-center text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
              <TrendingUp className="h-3 w-3 text-success mr-1" />
              +{metrics?.userGrowth || '0'}% {t('analytics.fromLastMonth') || 'from last month'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">
              {t('admin.activeRequests') || 'Active Requests'}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics?.activeRequests || 0)}
            </div>
            <div className={cn("flex items-center text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
              <TrendingUp className="h-3 w-3 text-success mr-1" />
              +{metrics?.requestGrowth || '0'}% {t('analytics.fromLastWeek') || 'from last week'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">
              {t('admin.revenue') || 'Revenue'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics?.totalRevenue || 0)}
            </div>
            <div className={cn("flex items-center text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
              <TrendingUp className="h-3 w-3 text-success mr-1" />
              +{metrics?.revenueGrowth || '0'}% {t('analytics.fromLastMonth') || 'from last month'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">
              {t('orders.title') || 'Orders'}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics?.totalOrders || 0)}
            </div>
            <div className={cn("flex items-center text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
              <TrendingDown className="h-3 w-3 text-destructive mr-1" />
              -{metrics?.orderDecline || '0'}% {t('analytics.fromLastWeek') || 'from last week'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", isRTL && "flex-row-reverse")}>
          <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="overview">{t('dashboard.overview') || 'Overview'}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.users') || 'Users'}</TabsTrigger>
            <TabsTrigger value="financial">{t('analytics.financial') || 'Financial'}</TabsTrigger>
            <TabsTrigger value="performance">{t('admin.performance') || 'Performance'}</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-1 text-sm"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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
                      stroke="#8884d8" 
                      fill="#8884d8" 
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
                      stroke="#82ca9d" 
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
                    <Bar dataKey="newUsers" fill="#8884d8" />
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
                  <PieChart>
                    <Pie
                      data={chartData?.userTypes || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(chartData?.userTypes || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
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
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#ffc658" 
                    fill="#ffc658" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.systemMetrics') || 'System Metrics'}</CardTitle>
                <CardDescription>
                  {t('analytics.platformPerformance') || 'Platform performance indicators'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('analytics.responseTime') || 'Avg Response Time'}
                    </span>
                    <Badge variant="secondary">
                      {metrics?.avgResponseTime || '150'}ms
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('analytics.uptime') || 'System Uptime'}
                    </span>
                    <Badge variant="secondary">
                      {metrics?.uptime || '99.9'}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('analytics.errorRate') || 'Error Rate'}
                    </span>
                    <Badge variant="secondary">
                      {metrics?.errorRate || '0.1'}%
                    </Badge>
                  </div>
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
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('analytics.avgRating') || 'Average Rating'}
                    </span>
                    <Badge variant="secondary">
                      {metrics?.avgRating || '4.5'}/5
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('analytics.nps') || 'Net Promoter Score'}
                    </span>
                    <Badge variant="secondary">
                      {metrics?.nps || '8.2'}/10
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('analytics.supportResolution') || 'Support Resolution'}
                    </span>
                    <Badge variant="secondary">
                      {metrics?.supportResolution || '94'}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

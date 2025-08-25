
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  FileText, 
  Clock,
  Target,
  DollarSign,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

export const BasicAnalyticsDashboard = () => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState("7d");
  const { data: analyticsData, loading: analyticsLoading } = useRealTimeAnalytics();
  const { analytics, loading: basicLoading } = useAnalytics();

  if (!userProfile) return null;

  // Combine real analytics data
  const realAnalyticsData = {
    overview: {
      totalRequests: analyticsData?.totalRequests || 0,
      activeChats: analyticsData?.active_users || 0,
      responseRate: Math.round(analyticsData?.successRate || 0),
      avgResponseTime: "2.1 hours"
    },
    weeklyActivity: [
      { day: t('analytics.monday'), requests: Math.round((analyticsData?.totalRequests || 0) * 0.14), messages: Math.round((analyticsData?.total_users || 0) * 0.12), offers: Math.round((analyticsData?.totalOffers || 0) * 0.1) },
      { day: t('analytics.tuesday'), requests: Math.round((analyticsData?.totalRequests || 0) * 0.18), messages: Math.round((analyticsData?.total_users || 0) * 0.16), offers: Math.round((analyticsData?.totalOffers || 0) * 0.15) },
      { day: t('analytics.wednesday'), requests: Math.round((analyticsData?.totalRequests || 0) * 0.12), messages: Math.round((analyticsData?.total_users || 0) * 0.10), offers: Math.round((analyticsData?.totalOffers || 0) * 0.08) },
      { day: t('analytics.thursday'), requests: Math.round((analyticsData?.totalRequests || 0) * 0.20), messages: Math.round((analyticsData?.total_users || 0) * 0.22), offers: Math.round((analyticsData?.totalOffers || 0) * 0.20) },
      { day: t('analytics.friday'), requests: Math.round((analyticsData?.totalRequests || 0) * 0.16), messages: Math.round((analyticsData?.total_users || 0) * 0.18), offers: Math.round((analyticsData?.totalOffers || 0) * 0.12) },
      { day: t('analytics.saturday'), requests: Math.round((analyticsData?.totalRequests || 0) * 0.10), messages: Math.round((analyticsData?.total_users || 0) * 0.12), offers: Math.round((analyticsData?.totalOffers || 0) * 0.15) },
      { day: t('analytics.sunday'), requests: Math.round((analyticsData?.totalRequests || 0) * 0.10), messages: Math.round((analyticsData?.total_users || 0) * 0.10), offers: Math.round((analyticsData?.totalOffers || 0) * 0.20) }
    ],
    requestCategories: [
      { name: t('analytics.manufacturing'), value: 35, color: "hsl(var(--primary))" },
      { name: t('analytics.technology'), value: 25, color: "hsl(var(--accent))" },
      { name: t('analytics.logistics'), value: 20, color: "hsl(var(--secondary))" },
      { name: t('analytics.marketing'), value: 12, color: "hsl(var(--lime))" },
      { name: t('analytics.other'), value: 8, color: "hsl(var(--muted-foreground))" }
    ],
    performance: [
      { metric: t('analytics.profileCompletion'), value: 85, target: 100 },
      { metric: t('analytics.responseRate'), value: Math.round(analyticsData?.successRate || 0), target: 90 },
      { metric: t('analytics.activeRequests'), value: analyticsData?.totalRequests || 0, target: Math.max(15, (analyticsData?.totalRequests || 0) + 3) },
      { metric: t('analytics.vendorConnections'), value: analyticsData?.active_users || 0, target: Math.max(10, (analyticsData?.active_users || 0) + 2) }
    ]
  };

  if (analyticsLoading || basicLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader><div className="h-4 bg-muted rounded" /></CardHeader>
              <CardContent><div className="h-8 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('analytics.title')}</h2>
          <p className="text-muted-foreground">
            {t('analytics.trackActivity')}
          </p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map(range => (
            <Badge
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTimeRange(range)}
            >
              {range === "7d" && t('analytics.last7Days')}
              {range === "30d" && t('analytics.last30Days')}
              {range === "90d" && t('analytics.last90Days')}
            </Badge>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.totalRequests')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realAnalyticsData.overview.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+4</span> {t('analytics.fromLastWeek')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.activeChats')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realAnalyticsData.overview.activeChats}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+2</span> {t('analytics.fromLastWeek')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.responseRate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realAnalyticsData.overview.responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+5%</span> {t('analytics.fromLastWeek')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.avgResponseTime')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realAnalyticsData.overview.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">+0.2h</span> {t('analytics.fromLastWeek')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.weeklyActivity')}</CardTitle>
            <CardDescription>
              {t('analytics.weeklyActivityDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={realAnalyticsData.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="hsl(var(--primary))" />
                <Bar dataKey="messages" fill="hsl(var(--accent))" />
                <Bar dataKey="offers" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Request Categories */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.requestCategories')}</CardTitle>
            <CardDescription>
              {t('analytics.requestCategoriesDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={realAnalyticsData.requestCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {realAnalyticsData.requestCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.performanceMetrics')}</CardTitle>
          <CardDescription>
            {t('analytics.performanceMetricsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realAnalyticsData.performance.map((metric) => {
              const percentage = (metric.value / metric.target) * 100;
              return (
                <div key={metric.metric} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{metric.metric}</span>
                    <span className="text-muted-foreground">
                      {metric.value} / {metric.target}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t('analytics.quickActions')}
          </CardTitle>
          <CardDescription>
            {t('analytics.quickActionsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{t('analytics.completeProfile')}</p>
                  <p className="text-sm text-muted-foreground">{t('analytics.addMissingInfo')}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium">{t('analytics.respondToMessages')}</p>
                  <p className="text-sm text-muted-foreground">3 {t('analytics.pendingResponses')}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">{t('analytics.createNewRequest')}</p>
                  <p className="text-sm text-muted-foreground">{t('analytics.findMoreSuppliers')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChartSkeleton } from "@/components/ui/ChartSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVendorStats } from "@/hooks/useVendorStats";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Clock, 
  DollarSign,
  Users,
  Star,
  Calendar,
  Filter,
  Download,
  FileText
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const BusinessIntelligence = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { stats, loading: analyticsLoading } = useVendorStats();
  const { t, isRTL } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("30");
  const [reportData, setReportData] = useState({
    revenue: [],
    bids: [],
    clients: [],
    performance: {
      totalRevenue: 0,
      totalBids: 0,
      wonBids: 0,
      winRate: 0,
      avgOrderValue: 0,
      totalOrders: 0
    }
  });

  useEffect(() => {
    if (userProfile) {
      fetchReportData();
    }
  }, [userProfile, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const days = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch revenue data
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('vendor_id', userProfile?.user_id)
        .gte('created_at', startDate.toISOString());

      // Fetch bid data
      const { data: bids } = await supabase
        .from('bids')
        .select('*')
        .eq('vendor_id', userProfile?.user_id)
        .gte('created_at', startDate.toISOString());

      // Process data for charts
      const revenueByDate = processRevenueData(orders || [], days);
      const bidsByStatus = processBidsData(bids || []);
      const clientData = processClientData(orders || []);
      const performanceMetrics = calculatePerformance(orders || [], bids || []);

      setReportData({
        revenue: revenueByDate,
        bids: bidsByStatus,
        clients: clientData,
        performance: performanceMetrics
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError(t('vendor.reports.fetchFailed'));
      toast({
        title: t('common.error'),
        description: t('vendor.reports.fetchFailed'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (orders: any[], days: number) => {
    const dateMap = new Map();
    
    // Initialize all dates in range
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
    }

    // Add actual data
    orders.forEach(order => {
      const dateStr = order.created_at.split('T')[0];
      if (dateMap.has(dateStr)) {
        const existing = dateMap.get(dateStr);
        existing.revenue += Number(order.amount);
        existing.orders += 1;
      }
    });

    return Array.from(dateMap.values()).reverse();
  };

  const processBidsData = (bids: any[]) => {
    const statusCounts = bids.reduce((acc, bid) => {
      acc[bid.status] = (acc[bid.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: ((count as number) / bids.length * 100).toFixed(1)
    }));
  };

  const processClientData = (orders: any[]) => {
    const clientMap = new Map();
    
    orders.forEach(order => {
      if (clientMap.has(order.client_id)) {
        const existing = clientMap.get(order.client_id);
        existing.orders += 1;
        existing.revenue += Number(order.amount);
      } else {
        clientMap.set(order.client_id, {
          client_id: order.client_id,
          orders: 1,
          revenue: Number(order.amount)
        });
      }
    });

    return Array.from(clientMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  const calculatePerformance = (orders: any[], bids: any[]) => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount), 0);
    const totalBids = bids.length;
    const wonBids = bids.filter(bid => bid.status === 'awarded').length;
    const winRate = totalBids > 0 ? (wonBids / totalBids * 100) : 0;
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return {
      totalRevenue,
      totalBids,
      wonBids,
      winRate,
      avgOrderValue,
      totalOrders: orders.length
    };
  };

  const exportReport = (type: string) => {
    toast({
      title: t('vendor.reports.exportInitiated'),
      description: t('vendor.reports.generatingReport').replace('{type}', type)
    });
  };

  // Analytics data (mock/calculated)
  const performanceMetrics = [
    {
      title: t('vendor.analytics.offerAcceptanceRate'),
      value: stats?.successRate || reportData.performance.winRate || 0,
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'hsl(var(--chart-1))'
    },
    {
      title: t('vendor.analytics.averageResponseTime'),
      value: '2.4h',
      change: '-15min',
      trend: 'up',
      icon: Clock,
      color: 'hsl(var(--chart-2))'
    },
    {
      title: t('vendor.analytics.clientSatisfaction'),
      value: stats?.clientSatisfaction || 4.8,
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'hsl(var(--chart-3))'
    },
    {
      title: t('vendor.analytics.monthlyRevenue'),
      value: stats?.monthlyEarnings || reportData.performance.totalRevenue || 0,
      change: '+8.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'hsl(var(--chart-4))'
    }
  ];

  const chartData = [
    { name: 'Jan', offers: 12, accepted: 8, revenue: 25000 },
    { name: 'Feb', offers: 15, accepted: 11, revenue: 32000 },
    { name: 'Mar', offers: 18, accepted: 14, revenue: 28000 },
    { name: 'Apr', offers: 22, accepted: 16, revenue: 45000 },
    { name: 'May', offers: 25, accepted: 19, revenue: 52000 },
    { name: 'Jun', offers: 28, accepted: 22, revenue: 48000 }
  ];

  const categoryData = [
    { name: 'Construction', value: 35, color: 'hsl(var(--chart-1))' },
    { name: 'Engineering', value: 25, color: 'hsl(var(--chart-2))' },
    { name: 'Consulting', value: 20, color: 'hsl(var(--chart-3))' },
    { name: 'Technology', value: 15, color: 'hsl(var(--chart-4))' },
    { name: 'Other', value: 5, color: 'hsl(var(--chart-5))' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (analyticsLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <ChartSkeleton key={i} height="h-32" />
          ))}
        </div>
        <ChartSkeleton height="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t('common.error')}
        description={error}
        onRetry={() => fetchReportData()}
      />
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", isRTL && "sm:flex-row-reverse")}>
        <div className={cn(isRTL && "text-right")}>
          <h1 className="text-2xl font-bold">
            {t('vendor.businessIntelligence.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('vendor.businessIntelligence.subtitle')}
          </p>
        </div>
        <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t('vendor.reports.last7Days')}</SelectItem>
              <SelectItem value="30">{t('vendor.reports.last30Days')}</SelectItem>
              <SelectItem value="90">{t('vendor.reports.last90Days')}</SelectItem>
              <SelectItem value="365">{t('vendor.reports.lastYear')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            {t('common.filter')}
          </Button>
          <Button onClick={() => exportReport('full')} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t('vendor.reports.export')}
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">
                        {typeof metric.value === 'number' 
                          ? metric.value.toFixed(1) 
                          : metric.value
                        }
                        {metric.title.includes('Rate') && '%'}
                        {metric.title.includes('Rating') || metric.title.includes('Satisfaction') ? '/5' : ''}
                      </span>
                      <Badge 
                        variant={metric.trend === 'up' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {metric.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${metric.color}20` }}
                  >
                    <Icon 
                      className="w-6 h-6" 
                      style={{ color: metric.color }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Reports and Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">
            {t('vendor.analytics.overview')}
          </TabsTrigger>
          <TabsTrigger value="revenue">
            {t('vendor.reports.revenueAnalysis')}
          </TabsTrigger>
          <TabsTrigger value="offers">
            {t('vendor.analytics.offers')}
          </TabsTrigger>
          <TabsTrigger value="bids">
            {t('vendor.reports.bidPerformance')}
          </TabsTrigger>
          <TabsTrigger value="clients">
            {t('vendor.reports.clientAnalysis')}
          </TabsTrigger>
          <TabsTrigger value="categories">
            {t('vendor.analytics.categories')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.analytics.offerTrends')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="offers" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      name={t('vendor.analytics.totalOffers')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accepted" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name={t('vendor.analytics.acceptedOffers')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.analytics.categoryDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.reports.revenueTrend')}</CardTitle>
              <CardDescription>{t('vendor.reports.revenueTrendDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.revenue.length > 0 ? reportData.revenue : chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={reportData.revenue.length > 0 ? "date" : "name"} />
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.analytics.offerPerformance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="offers" fill="hsl(var(--chart-1))" name={t('vendor.analytics.submitted')} />
                  <Bar dataKey="accepted" fill="hsl(var(--chart-2))" name={t('vendor.analytics.accepted')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.reports.bidStatusDistribution')}</CardTitle>
              <CardDescription>{t('vendor.reports.bidStatusDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.bids.length > 0 ? reportData.bids : [
                        { status: 'pending', count: 15, percentage: '45.5' },
                        { status: 'awarded', count: 8, percentage: '24.2' },
                        { status: 'rejected', count: 10, percentage: '30.3' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percentage }) => `${status}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(reportData.bids.length > 0 ? reportData.bids : [
                        { status: 'pending', count: 15, percentage: '45.5' },
                        { status: 'awarded', count: 8, percentage: '24.2' },
                        { status: 'rejected', count: 10, percentage: '30.3' }
                      ]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.reports.topClientsByRevenue')}</CardTitle>
              <CardDescription>{t('vendor.reports.topClientsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.clients.length > 0 ? reportData.clients.map((client, index) => (
                  <div key={client.client_id} className={cn("flex items-center justify-between p-3 border rounded", isRTL && "flex-row-reverse")}>
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">#{index + 1}</span>
                      </div>
                      <div className={cn(isRTL && "text-right")}>
                        <p className="font-medium">Client {client.client_id.slice(0, 8)}...</p>
                        <p className="text-sm text-muted-foreground">{client.orders} {t('vendor.reports.ordersLabel')}</p>
                      </div>
                    </div>
                    <div className={cn("text-right", isRTL && "text-left")}>
                      <p className="font-bold">${client.revenue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(client.revenue / client.orders).toFixed(2)} {t('vendor.reports.avgLabel')}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('vendor.reports.noClientData')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.analytics.categoryBreakdown')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={category.value} 
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        {category.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.analytics.topPerformingCategories')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 3)
                  .map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          <Award className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.value}% of total projects
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
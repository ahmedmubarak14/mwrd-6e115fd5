import React, { useState, useMemo, useCallback } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Package, Clock,
  Calendar, Download, Filter, RefreshCw, Eye, Target, Award,
  Activity, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

import { useLanguage } from '@/contexts/LanguageContext';
import { useOptimizedFormatters } from '@/hooks/usePerformanceOptimization';
import { ResponsiveContainer as MobileContainer } from '@/components/ui/mobile-optimized-components';
import { ErrorRecovery } from '@/components/ui/error-recovery';
import { InlineLoading } from '@/components/ui/enhanced-loading-states';
import { cn } from '@/lib/utils';

// Analytics data types
interface AnalyticsMetric {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  format: 'currency' | 'number' | 'percentage' | 'duration';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ChartData {
  name: string;
  value?: number;
  revenue?: number;
  orders?: number;
  clients?: number;
  date?: string;
  category?: string;
  color?: string;
  [key: string]: any;
}

interface PerformanceData {
  period: string;
  orders: number;
  revenue: number;
  completionRate: number;
  clientSatisfaction: number;
  responseTime: number;
}

// Real-time analytics data hook
const useRealAnalyticsData = () => {
  const [analytics, setAnalytics] = useState<AnalyticsMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch real data from Supabase
        const [revenueRes, ordersRes, usersRes] = await Promise.all([
          supabase.from('financial_transactions')
            .select('amount, created_at')
            .eq('status', 'completed'),
          supabase.from('orders')
            .select('id, amount, status, created_at'),
          supabase.from('user_profiles')
            .select('id, created_at, updated_at')
        ]);

        if (revenueRes.error) throw revenueRes.error;
        if (ordersRes.error) throw ordersRes.error;
        if (usersRes.error) throw usersRes.error;

        // Calculate current period metrics
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Revenue calculations
        const currentRevenue = revenueRes.data
          .filter(t => new Date(t.created_at) > thirtyDaysAgo)
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const previousRevenue = revenueRes.data
          .filter(t => new Date(t.created_at) > sixtyDaysAgo && new Date(t.created_at) <= thirtyDaysAgo)
          .reduce((sum, t) => sum + Number(t.amount), 0);

        // Orders calculations
        const currentOrders = ordersRes.data.filter(o => new Date(o.created_at) > thirtyDaysAgo).length;
        const previousOrders = ordersRes.data
          .filter(o => new Date(o.created_at) > sixtyDaysAgo && new Date(o.created_at) <= thirtyDaysAgo).length;

        // Users calculations
        const activeUsers = usersRes.data.filter(u => new Date(u.updated_at) > thirtyDaysAgo).length;
        const previousActiveUsers = usersRes.data
          .filter(u => new Date(u.updated_at) > sixtyDaysAgo && new Date(u.updated_at) <= thirtyDaysAgo).length;

        // Completion rate calculation
        const completedOrders = ordersRes.data.filter(o => o.status === 'completed').length;
        const completionRate = ordersRes.data.length > 0 ? (completedOrders / ordersRes.data.length) * 100 : 0;
        const previousCompletionRate = 85; // Would need historical data for accurate previous value

        const realMetrics: AnalyticsMetric[] = [
          {
            id: 'revenue',
            title: 'Total Revenue',
            value: currentRevenue,
            previousValue: previousRevenue,
            format: 'currency',
            icon: DollarSign,
            color: 'text-green-600'
          },
          {
            id: 'orders',
    title: 'Total Orders',
    value: 42,
    previousValue: 38,
    format: 'number',
    icon: Package,
    color: 'text-blue-600'
  },
  {
    id: 'completion-rate',
    title: 'Completion Rate',
    value: 94.5,
    previousValue: 91.2,
    format: 'percentage',
    icon: Target,
    color: 'text-purple-600'
  },
  {
    id: 'avg-response',
    title: 'Avg Response Time',
    value: 2.3,
    previousValue: 3.1,
    format: 'duration',
    icon: Clock,
    color: 'text-orange-600'
  }
];

const mockRevenueData: ChartData[] = [
  { name: 'Jan', revenue: 45000, orders: 8, clients: 12 },
  { name: 'Feb', revenue: 52000, orders: 10, clients: 15 },
  { name: 'Mar', revenue: 48000, orders: 9, clients: 14 },
  { name: 'Apr', revenue: 61000, orders: 12, clients: 18 },
  { name: 'May', revenue: 55000, orders: 11, clients: 16 },
  { name: 'Jun', revenue: 67000, orders: 14, clients: 20 }
];

const mockOrdersByCategory: ChartData[] = [
  { name: 'Construction', value: 18, color: '#3b82f6' },
  { name: 'Renovation', value: 14, color: '#10b981' },
  { name: 'Maintenance', value: 8, color: '#f59e0b' },
  { name: 'Consulting', value: 6, color: '#8b5cf6' }
];

const mockPerformanceData: PerformanceData[] = [
  {
    period: 'Week 1',
    orders: 3,
    revenue: 18000,
    completionRate: 100,
    clientSatisfaction: 4.8,
    responseTime: 1.5
  },
  {
    period: 'Week 2', 
    orders: 4,
    revenue: 22000,
    completionRate: 95,
    clientSatisfaction: 4.9,
    responseTime: 2.1
  },
  {
    period: 'Week 3',
    orders: 2,
    revenue: 15000,
    completionRate: 100,
    clientSatisfaction: 4.7,
    responseTime: 1.8
  },
  {
    period: 'Week 4',
    orders: 5,
    revenue: 28000,
    clientSatisfaction: 4.6,
    completionRate: 90,
    responseTime: 2.8
  }
];

// Metric Card Component
const MetricCard = React.memo<{ metric: AnalyticsMetric }>(({ metric }) => {
  const { formatCurrency, formatNumber, formatPercentage } = useOptimizedFormatters();
  const Icon = metric.icon;
  
  const formatValue = (value: number) => {
    switch (metric.format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'duration':
        return `${value}h`;
      default:
        return formatNumber(value);
    }
  };

  const changePercent = ((metric.value - metric.previousValue) / metric.previousValue) * 100;
  const isPositive = changePercent > 0;
  const isNeutral = Math.abs(changePercent) < 0.1;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </p>
            <p className="text-2xl font-bold">
              {formatValue(metric.value)}
            </p>
            <div className="flex items-center gap-2 text-xs">
              {isNeutral ? (
                <Minus className="h-3 w-3 text-muted-foreground" />
              ) : isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              <span className={cn(
                "font-medium",
                isNeutral ? "text-muted-foreground" :
                isPositive ? "text-green-600" : "text-red-600"
              )}>
                {isNeutral ? "No change" : `${Math.abs(changePercent).toFixed(1)}%`}
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-full bg-muted",
            metric.color.replace('text-', 'bg-').replace('-600', '-100')
          )}>
            <Icon className={cn("h-6 w-6", metric.color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MetricCard.displayName = 'MetricCard';

// Chart Components
const RevenueChart = React.memo(() => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={revenueData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip 
        formatter={(value: any, name: string) => [
          name === 'revenue' ? `SAR ${value.toLocaleString()}` : value,
          name === 'revenue' ? 'Revenue' : 'Orders'
        ]}
      />
      <Area
        type="monotone"
        dataKey="revenue"
        stackId="1"
        stroke="#3b82f6"
        fill="#3b82f6"
        fillOpacity={0.6}
      />
    </AreaChart>
  </ResponsiveContainer>
));

RevenueChart.displayName = 'RevenueChart';

const OrdersCategoryChart = React.memo(() => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={mockOrdersByCategory}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {mockOrdersByCategory.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
));

OrdersCategoryChart.displayName = 'OrdersCategoryChart';

const PerformanceChart = React.memo(() => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={mockPerformanceData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="period" />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey="orders" fill="#3b82f6" name="Orders" />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="completionRate"
        stroke="#10b981"
        strokeWidth={2}
        name="Completion Rate (%)"
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="clientSatisfaction"
        stroke="#8b5cf6"
        strokeWidth={2}
        name="Client Rating"
      />
    </LineChart>
  </ResponsiveContainer>
));

PerformanceChart.displayName = 'PerformanceChart';

export const EnhancedAnalyticsDashboard: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const { formatCurrency } = useOptimizedFormatters();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setError(null);
    
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleExport = useCallback(() => {
    // Export analytics data
    console.log('Exporting analytics data...');
  }, []);

  const totalRevenue = useMemo(() => 
    mockRevenueData.reduce((sum, item) => sum + item.revenue, 0)
  , []);

  const totalOrders = useMemo(() => 
    mockRevenueData.reduce((sum, item) => sum + item.orders, 0)
  , []);

  if (loading) {
    return (
      <MobileContainer>
        <InlineLoading text="Loading analytics..." />
      </MobileContainer>
    );
  }

  if (error) {
    return (
      <MobileContainer>
        <ErrorRecovery
          error={error}
          onRetry={handleRefresh}
          title="Failed to load analytics"
          description="Unable to fetch analytics data. Please try again."
        />
      </MobileContainer>
    );
  }

  return (
    <MobileContainer className="space-y-6">
      {/* Header */}
      <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", isRTL && "sm:flex-row-reverse")}>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your business performance and insights
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.map(metric => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>
                  Monthly revenue performance over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Orders by Category
                </CardTitle>
                <CardDescription>
                  Distribution of orders across different service categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersCategoryChart />
              </CardContent>
            </Card>
          </div>
          
          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>6-Month Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalRevenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalOrders}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(totalRevenue / totalOrders)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Order Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>
                Detailed revenue breakdown and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Analysis</CardTitle>
              <CardDescription>
                Order distribution and category performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersCategoryChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Track completion rates and client satisfaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Revenue Growth</p>
                <p className="text-sm text-muted-foreground">
                  Your revenue has increased by 17% compared to last period. Construction projects are driving the most growth.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Award className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">High Performance</p>
                <p className="text-sm text-muted-foreground">
                  Your completion rate of 94.5% is above industry average. Keep up the excellent work!
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Response Time Improvement</p>
                <p className="text-sm text-muted-foreground">
                  Your average response time has improved by 26%. Faster responses lead to higher client satisfaction.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </MobileContainer>
  );
};
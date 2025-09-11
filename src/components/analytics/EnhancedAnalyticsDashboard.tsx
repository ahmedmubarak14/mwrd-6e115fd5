import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { MetricCard } from '@/components/analytics/MetricCard';
import { RevenueChart, OrdersCategoryChart, PerformanceChart, mockOrdersByCategory, mockPerformanceData } from '@/components/analytics/AnalyticsCharts';
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

// Real-time analytics data hook using Supabase
export const EnhancedAnalyticsDashboard: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const { formatCurrency } = useOptimizedFormatters();
  const { metrics, monthlyData, loading: analyticsLoading, error: analyticsError, refetch } = useAnalyticsData();
  
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleExport = useCallback(() => {
    // Export analytics data
    console.log('Exporting analytics data...');
  }, []);

  // Convert metrics to the format expected by MetricCard
  const analytics = useMemo(() => {
    if (!metrics) return [];
    
    return [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: metrics.totalRevenue,
        previousValue: metrics.previousRevenue,
        format: 'currency' as const,
        icon: DollarSign,
        color: 'text-green-600'
      },
      {
        id: 'orders',
        title: 'Total Orders',
        value: metrics.totalOrders,
        previousValue: metrics.previousOrders,
        format: 'number' as const,
        icon: Package,
        color: 'text-blue-600'
      },
      {
        id: 'completion-rate',
        title: 'Completion Rate',
        value: metrics.completionRate,
        previousValue: metrics.previousCompletionRate,
        format: 'percentage' as const,
        icon: Target,
        color: 'text-purple-600'
      },
      {
        id: 'avg-response',
        title: 'Avg Response Time',
        value: metrics.avgResponseTime,
        previousValue: metrics.previousResponseTime,
        format: 'duration' as const,
        icon: Clock,
        color: 'text-orange-600'
      }
    ];
  }, [metrics]);

  // Use real monthly data or fallback to empty array
  const revenueData = monthlyData.length > 0 ? monthlyData : [];

  const totalRevenue = useMemo(() => 
    revenueData.reduce((sum, item) => sum + item.revenue, 0)
  , [revenueData]);

  const totalOrders = useMemo(() => 
    revenueData.reduce((sum, item) => sum + item.orders, 0)
  , [revenueData]);

  if (analyticsLoading) {
    return (
      <MobileContainer>
        <InlineLoading text="Loading analytics..." />
      </MobileContainer>
    );
  }

  if (analyticsError) {
    return (
      <MobileContainer>
        <ErrorRecovery
          error={analyticsError}
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
                <RevenueChart data={revenueData} />
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
                <OrdersCategoryChart data={mockOrdersByCategory} />
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
              <RevenueChart data={revenueData} />
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
              <OrdersCategoryChart data={mockOrdersByCategory} />
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
              <PerformanceChart data={mockPerformanceData} />
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
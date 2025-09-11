import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  Star,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Cell } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductionLoadingSpinner } from '@/components/ui/ProductionLoadingSpinner';

interface VendorMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
  completionRate: number;
  clientSatisfactionRate: number;
  responseTimeHours: number;
  monthlyGrowth: number;
}

interface OrdersByCategory {
  category: string;
  count: number;
  revenue: number;
}

interface RevenueTimeData {
  month: string;
  revenue: number;
  orders: number;
}

export const ProductionVendorAnalytics: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [metrics, setMetrics] = useState<VendorMetrics | null>(null);
  const [ordersByCategory, setOrdersByCategory] = useState<OrdersByCategory[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueTimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVendorAnalytics = async () => {
    if (!user || userProfile?.role !== 'vendor') return;
    
    try {
      setError(null);
      if (!refreshing) setLoading(true);

      // Get vendor's user profile ID for queries
      const { data: vendorProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!vendorProfile) throw new Error('Vendor profile not found');

      // Fetch orders data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          amount,
          status,
          created_at,
          title,
          requests!inner(category)
        `)
        .eq('vendor_id', user.id);

      if (ordersError) throw ordersError;

      // Fetch financial transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('financial_transactions')
        .select('amount, created_at, status')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (transactionsError) throw transactionsError;

      // Calculate metrics
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const totalRevenue = transactionsData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      
      const monthlyRevenue = transactionsData?.filter(t => 
        new Date(t.created_at) >= thisMonth
      ).reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const lastMonthRevenue = transactionsData?.filter(t => {
        const date = new Date(t.created_at);
        return date >= lastMonth && date < thisMonth;
      }).reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const totalOrders = ordersData?.length || 0;
      const completedOrders = ordersData?.filter(o => o.status === 'completed').length || 0;
      const pendingOrders = ordersData?.filter(o => o.status === 'pending').length || 0;

      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
      const monthlyGrowth = lastMonthRevenue > 0 ? 
        ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      const calculatedMetrics: VendorMetrics = {
        totalRevenue,
        monthlyRevenue,
        totalOrders,
        completedOrders,
        pendingOrders,
        averageOrderValue,
        completionRate,
        clientSatisfactionRate: 4.2, // Would need rating system
        responseTimeHours: 8.5, // Would need response time tracking
        monthlyGrowth
      };

      setMetrics(calculatedMetrics);

      // Process orders by category
      const categoryMap = new Map<string, { count: number; revenue: number }>();
      ordersData?.forEach(order => {
        const category = order.requests?.category || 'Other';
        const existing = categoryMap.get(category) || { count: 0, revenue: 0 };
        categoryMap.set(category, {
          count: existing.count + 1,
          revenue: existing.revenue + Number(order.amount || 0)
        });
      });

      const categoriesData = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        count: data.count,
        revenue: data.revenue
      }));

      setOrdersByCategory(categoriesData);

      // Process revenue over time (last 6 months)
      const monthlyRevenueMap = new Map<string, { revenue: number; orders: number }>();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyRevenueMap.set(monthKey, { revenue: 0, orders: 0 });
      }

      transactionsData?.forEach(transaction => {
        const date = new Date(transaction.created_at);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const existing = monthlyRevenueMap.get(monthKey);
        if (existing) {
          existing.revenue += Number(transaction.amount);
        }
      });

      ordersData?.forEach(order => {
        const date = new Date(order.created_at);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const existing = monthlyRevenueMap.get(monthKey);
        if (existing) {
          existing.orders += 1;
        }
      });

      const timeSeriesData = Array.from(monthlyRevenueMap.entries()).map(([month, data]) => ({
        month,
        revenue: data.revenue,
        orders: data.orders
      }));

      setRevenueData(timeSeriesData);
    } catch (err) {
      console.error('Vendor analytics error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVendorAnalytics();

    // Set up real-time subscriptions
    const ordersChannel = supabase
      .channel('vendor-analytics-orders')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `vendor_id=eq.${user?.id}`
        }, 
        () => {
          // Refresh analytics when orders change
          fetchVendorAnalytics();
        }
      )
      .subscribe();

    const transactionsChannel = supabase
      .channel('vendor-analytics-transactions')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public', 
          table: 'financial_transactions',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          // Refresh analytics when transactions change
          fetchVendorAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(transactionsChannel);
    };
  }, [user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVendorAnalytics();
  };

  if (userProfile?.role !== 'vendor') {
    return (
      <Alert>
        <AlertDescription>
          Access denied. This analytics dashboard is only available to vendors.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading && !refreshing) {
    return <ProductionLoadingSpinner size="lg" text="Loading vendor analytics..." />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!metrics) return null;

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vendor Analytics</h2>
          <p className="text-muted-foreground">Real-time insights into your business performance</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className={metrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {metrics.monthlyGrowth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(metrics.monthlyGrowth).toFixed(1)}%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.completedOrders} completed • {metrics.pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completionRate.toFixed(1)}%</div>
            <Progress value={metrics.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.averageOrderValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">per completed order</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="categories">Order Categories</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Monthly revenue and order trends for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      className="text-muted-foreground"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                      formatter={(value: any, name: string) => [
                        name === 'revenue' ? `$${value.toLocaleString()}` : value,
                        name === 'revenue' ? 'Revenue' : 'Orders'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Orders by Category</CardTitle>
                <CardDescription>Distribution of your completed orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ordersByCategory.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No order data available yet
                    </p>
                  ) : (
                    ordersByCategory.map((item, index) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{item.count} orders</div>
                          <div className="text-sm text-muted-foreground">
                            ${item.revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Indicators</CardTitle>
                <CardDescription>Key performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Client Satisfaction</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {metrics.clientSatisfactionRate}/5.0
                    </span>
                  </div>
                  <Progress value={(metrics.clientSatisfactionRate / 5) * 100} />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Response Time</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      {metrics.responseTimeHours.toFixed(1)}h avg
                    </span>
                  </div>
                  <Progress value={Math.max(0, 100 - (metrics.responseTimeHours / 24) * 100)} />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Order Completion</span>
                    <span className="font-medium">{metrics.completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.completionRate} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Business Growth</CardTitle>
                <CardDescription>Track your business growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${metrics.monthlyRevenue.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {metrics.completedOrders}
                    </div>
                    <p className="text-sm text-muted-foreground">Completed Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Orders</span>
                  <Badge variant="secondary">{metrics.pendingOrders}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Order Value</span>
                  <span className="font-medium">${metrics.averageOrderValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Growth Rate</span>
                  <span className={`font-medium ${metrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.monthlyGrowth >= 0 ? '+' : ''}{metrics.monthlyGrowth.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
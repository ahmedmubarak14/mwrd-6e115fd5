import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Download, Calendar, TrendingUp, DollarSign, 
  FileText, Target, Users, Award 
} from "lucide-react";

export const VendorReports = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
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
      toast({
        title: "Error",
        description: "Failed to fetch report data",
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
      title: "Export initiated",
      description: `Generating ${type} report...`
    });
    // Implementation would generate and download the report
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('vendorReports.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('vendorReports.description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => exportReport('full')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('vendorReports.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData.performance.totalRevenue?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              From {reportData.performance.totalOrders || 0} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('vendorReports.winRate')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.performance.winRate?.toFixed(1) || '0'}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {reportData.performance.wonBids || 0} of {reportData.performance.totalBids || 0} bids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('vendorReports.avgOrderValue')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData.performance.avgOrderValue?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Average per order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('vendorReports.activeClients')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.clients.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Unique paying clients
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="bids">Bid Performance</TabsTrigger>
          <TabsTrigger value="clients">Client Analysis</TabsTrigger>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Daily revenue over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Volume</CardTitle>
              <CardDescription>Number of orders per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bid Status Distribution</CardTitle>
              <CardDescription>Breakdown of your bid statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.bids}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percentage }) => `${status}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.bids.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {reportData.bids.map((bid, index) => (
              <Card key={bid.status}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium capitalize">{bid.status}</h3>
                      <p className="text-2xl font-bold">{bid.count}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="secondary" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] + '20' }}
                      >
                        {bid.percentage}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Clients by Revenue</CardTitle>
              <CardDescription>Your most valuable client relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.clients.map((client, index) => (
                  <div key={client.client_id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">Client {client.client_id.slice(0, 8)}...</p>
                        <p className="text-sm text-muted-foreground">{client.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${client.revenue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(client.revenue / client.orders).toFixed(2)} avg
                      </p>
                    </div>
                  </div>
                ))}
                
                {reportData.clients.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No client data available for the selected period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
              <CardDescription>Key performance indicators and insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Financial Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-medium">${reportData.performance.totalRevenue?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order Value:</span>
                      <span className="font-medium">${reportData.performance.avgOrderValue?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Orders:</span>
                      <span className="font-medium">{reportData.performance.totalOrders}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Business Development</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Bid Success Rate:</span>
                      <span className="font-medium">{reportData.performance.winRate?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Bids Submitted:</span>
                      <span className="font-medium">{reportData.performance.totalBids}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Clients:</span>
                      <span className="font-medium">{reportData.clients.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-lg mb-3">Key Insights</h3>
                <div className="space-y-2 text-sm">
                  <p>• Your win rate of {reportData.performance.winRate?.toFixed(1)}% is {
                    (reportData.performance.winRate || 0) > 25 ? 'above' : 'below'
                  } industry average</p>
                  <p>• You have {reportData.clients.length} active clients generating revenue</p>
                  <p>• Your average order value is ${reportData.performance.avgOrderValue?.toFixed(2)}</p>
                  <p>• Revenue trend shows {reportData.revenue.length > 1 ? 
                    (reportData.revenue[reportData.revenue.length - 1]?.revenue > reportData.revenue[0]?.revenue ? 'growth' : 'decline') 
                    : 'stable'} pattern</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
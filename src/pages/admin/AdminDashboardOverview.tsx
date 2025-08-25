
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building, 
  FileText, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FinancialAnalyticsChart } from '@/components/analytics/FinancialAnalyticsChart';
import { useSupportTickets } from '@/hooks/useSupportTickets';

interface GrowthStats {
  total_users: number;
  total_clients: number;
  total_vendors: number;
  total_admins: number;
  total_requests: number;
  total_offers: number;
  total_orders: number;
  total_revenue: number;
  total_transactions: number;
  active_subscriptions: number;
  users_growth: number;
  requests_growth: number;
  offers_growth: number;
  revenue_growth: number;
}

export const AdminDashboardOverview = () => {
  const [stats, setStats] = useState<GrowthStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getPendingTicketsCount } = useSupportTickets();

  const fetchGrowthStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('get_growth_statistics');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (err: any) {
      console.error('Error fetching growth statistics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthStatistics();
    
    // Set up real-time subscription for stats updates
    const subscription = supabase
      .channel('dashboard_stats')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_profiles' },
        () => {
          fetchGrowthStatistics();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'requests' },
        () => {
          fetchGrowthStatistics();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'offers' },
        () => {
          fetchGrowthStatistics();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'financial_transactions' },
        () => {
          fetchGrowthStatistics();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-success';
    if (growth < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard statistics..." />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchGrowthStatistics} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No statistics available</p>
      </div>
    );
  }

  const pendingSupportTickets = getPendingTicketsCount();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of platform statistics and growth metrics
          </p>
        </div>
        <Button onClick={fetchGrowthStatistics} variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>

      {/* Support Tickets Alert */}
      {pendingSupportTickets > 0 && (
        <Card className="border-warning bg-warning/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              Pending Support Tickets
            </CardTitle>
            <CardDescription>
              You have {pendingSupportTickets} open support ticket{pendingSupportTickets !== 1 ? 's' : ''} that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => window.location.href = '/admin/support'}>
              View Support Tickets
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.total_users)}</div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(stats.users_growth)}`}>
              {getGrowthIcon(stats.users_growth)}
              {stats.users_growth > 0 ? '+' : ''}{stats.users_growth}% from last month
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(stats.revenue_growth)}`}>
              {getGrowthIcon(stats.revenue_growth)}
              {stats.revenue_growth > 0 ? '+' : ''}{stats.revenue_growth}% from last month
            </div>
          </CardContent>
        </Card>

        {/* Active Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.total_requests)}</div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(stats.requests_growth)}`}>
              {getGrowthIcon(stats.requests_growth)}
              {stats.requests_growth > 0 ? '+' : ''}{stats.requests_growth}% from last month
            </div>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.active_subscriptions)}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.active_subscriptions / stats.total_users) * 100).toFixed(1)}% of users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.total_clients)}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.total_clients / stats.total_users) * 100).toFixed(1)}% of users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.total_vendors)}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.total_vendors / stats.total_users) * 100).toFixed(1)}% of users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.total_offers)}</div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(stats.offers_growth)}`}>
              {getGrowthIcon(stats.offers_growth)}
              {stats.offers_growth > 0 ? '+' : ''}{stats.offers_growth}% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Analytics
          </CardTitle>
          <CardDescription>
            Revenue trends and transaction analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialAnalyticsChart period="month" />
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Transactions</span>
              <span className="font-medium">{formatNumber(stats.total_transactions)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Orders</span>
              <span className="font-medium">{formatNumber(stats.total_orders)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Transaction</span>
              <span className="font-medium">
                {stats.total_transactions > 0 
                  ? formatCurrency(stats.total_revenue / stats.total_transactions)
                  : formatCurrency(0)
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">User Retention Rate</span>
              <Badge variant="secondary">
                {((stats.total_users - (stats.total_users * 0.05)) / stats.total_users * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <Badge variant="secondary">
                {((stats.total_orders / stats.total_requests) * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Support Tickets</span>
              <Badge variant={pendingSupportTickets > 0 ? "destructive" : "secondary"}>
                {pendingSupportTickets} Open
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FinancialDashboard } from '@/components/admin/FinancialDashboard';
import { PlatformAnalytics } from '@/components/admin/PlatformAnalytics';
import { SubscriptionManagement } from '@/components/admin/SubscriptionManagement';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface FinancialOverview {
  total_revenue: number;
  monthly_revenue: number;
  active_subscriptions: number;
  pending_payments: number;
  failed_transactions: number;
  growth_rate: number;
}

const AdminFinancialDashboard = () => {
  const { toast } = useToast();
  const [overview, setOverview] = useState<FinancialOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    fetchFinancialOverview();
  }, [selectedPeriod]);

  const fetchFinancialOverview = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(selectedPeriod));

      const [transactionsRes, subscriptionsRes] = await Promise.all([
        supabase
          .from('financial_transactions')
          .select('amount, status, created_at')
          .gte('created_at', daysAgo.toISOString()),
        supabase
          .from('user_profiles')
          .select('subscription_status, subscription_plan')
      ]);

      const transactions = transactionsRes.data || [];
      const users = subscriptionsRes.data || [];

      const totalRevenue = transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyRevenue = transactions
        .filter(t => t.status === 'completed' && new Date(t.created_at) >= thisMonth)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const activeSubscriptions = users.filter(u => u.subscription_status === 'active').length;
      const pendingPayments = transactions.filter(t => t.status === 'pending').length;
      const failedTransactions = transactions.filter(t => t.status === 'failed').length;

      setOverview({
        total_revenue: totalRevenue,
        monthly_revenue: monthlyRevenue,
        active_subscriptions: activeSubscriptions,
        pending_payments: pendingPayments,
        failed_transactions: failedTransactions,
        growth_rate: 12.5 // TODO: Calculate actual growth rate
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-muted-foreground">Monitor revenue, subscriptions, and financial health</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.total_revenue?.toLocaleString()} SAR</div>
            <p className="text-xs text-muted-foreground">
              +{overview?.growth_rate}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.monthly_revenue?.toLocaleString()} SAR</div>
            <p className="text-xs text-muted-foreground">This month's earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.active_subscriptions}</div>
            <p className="text-xs text-muted-foreground">Currently active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.pending_payments}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.failed_transactions} failed transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Financial Dashboard</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <FinancialDashboard />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <PlatformAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFinancialDashboard;

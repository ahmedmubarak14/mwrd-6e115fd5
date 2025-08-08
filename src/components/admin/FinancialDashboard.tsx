import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FinancialAnalyticsChart } from '@/components/analytics/FinancialAnalyticsChart';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  RefreshCw,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface FinancialTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  transaction_type: string;
  description: string;
  created_at: string;
  user_profiles?: {
    full_name: string;
    email: string;
    company_name: string;
  } | null;
}

interface FinancialStats {
  total_revenue: number;
  monthly_revenue: number;
  pending_amount: number;
  failed_transactions: number;
  total_transactions: number;
  growth_rate: number;
}

export const FinancialDashboard = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    fetchTransactions();
    fetchFinancialStats();
  }, [selectedPeriod]);

  const fetchTransactions = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(selectedPeriod));

      // Get transactions first
      const { data: transactionData, error: transactionError } = await supabase
        .from('financial_transactions')
        .select('*')
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (transactionError) throw transactionError;

      // Get user profiles separately
      const userIds = transactionData?.map(t => t.user_id).filter(Boolean) || [];
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, company_name')
        .in('id', userIds);

      if (profileError) {
        console.warn('Could not fetch user profiles:', profileError);
      }

      // Combine the data
      const combinedData = transactionData?.map(transaction => ({
        ...transaction,
        user_profiles: profileData?.find(profile => profile.id === transaction.user_id) || null
      })) || [];

      setTransactions(combinedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchFinancialStats = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(selectedPeriod));

      const { data, error } = await supabase
        .from('financial_transactions')
        .select('amount, status, transaction_type, created_at')
        .gte('created_at', daysAgo.toISOString());

      if (error) throw error;

      const transactions = data || [];
      const totalRevenue = transactions
        .filter(t => t.status === 'succeeded' && t.transaction_type === 'payment')
        .reduce((sum, t) => sum + t.amount, 0);

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyRevenue = transactions
        .filter(t => t.status === 'succeeded' && 
                    t.transaction_type === 'payment' && 
                    new Date(t.created_at) >= thisMonth)
        .reduce((sum, t) => sum + t.amount, 0);

      const pendingAmount = transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

      const failedTransactions = transactions
        .filter(t => t.status === 'failed').length;

      setStats({
        total_revenue: totalRevenue,
        monthly_revenue: monthlyRevenue,
        pending_amount: pendingAmount,
        failed_transactions: failedTransactions,
        total_transactions: transactions.length,
        growth_rate: 8.5 // TODO: Calculate actual growth rate
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'succeeded': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'outline';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'refund': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'chargeback': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default: return <CreditCard className="h-4 w-4" />;
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Financial Dashboard</h3>
          <p className="text-sm text-muted-foreground">Monitor revenue, transactions, and financial health</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
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

      {/* Financial Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_revenue?.toLocaleString()} SAR</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.growth_rate}% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.monthly_revenue?.toLocaleString()} SAR</div>
            <p className="text-xs text-muted-foreground">
              This month's earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_amount?.toLocaleString()} SAR</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.failed_transactions}</div>
            <p className="text-xs text-muted-foreground">
              Out of {stats?.total_transactions} total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Financial Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent financial transactions and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionTypeIcon(transaction.transaction_type)}
                      <div>
                        <div className="font-medium">
                          {transaction.user_profiles?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.user_profiles?.email || 'No email'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {transaction.transaction_type === 'refund' ? '-' : '+'}
                        {transaction.amount} {transaction.currency}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No transactions found for the selected period.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <FinancialAnalyticsChart period={selectedPeriod as any} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

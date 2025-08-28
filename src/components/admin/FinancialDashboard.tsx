import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { cn } from '@/lib/utils';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Calendar as CalendarIcon,
  AlertCircle,
  Search,
  Filter,
  Eye,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface FinancialTransaction {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  type: string;
  description: string;
  payment_method?: string;
  transaction_ref?: string;
  created_at: string;
  updated_at: string;
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
  average_transaction: number;
  completed_transactions: number;
}

interface FinancialDashboardProps {
  period: string;
  onRefresh?: () => void;
  onExport?: () => void;
  isRefreshing?: boolean;
  isExporting?: boolean;
}

export const FinancialDashboard = ({ 
  period, 
  onRefresh, 
  onExport, 
  isRefreshing, 
  isExporting 
}: FinancialDashboardProps) => {
  const { toast } = useToast();
  const languageContext = useOptionalLanguage();
  const { t, isRTL, formatNumber, formatCurrency } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false,
    formatNumber: (num: number) => num.toString(),
    formatCurrency: (amount: number) => `$${amount}`
  };

  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>([]);
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
    fetchFinancialStats();
  }, [period]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, statusFilter, typeFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          user_profiles!inner(
            user_id,
            full_name,
            email,
            company_name
          )
        `)
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = data?.map(transaction => ({
        ...transaction,
        user_profiles: transaction.user_profiles ? {
          full_name: transaction.user_profiles.full_name || '',
          email: transaction.user_profiles.email || '',
          company_name: transaction.user_profiles.company_name || ''
        } : null
      })) || [];

      setTransactions(transformedData);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialStats = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('amount, status, type, created_at')
        .gte('created_at', daysAgo.toISOString());

      if (error) throw error;

      const transactionData = data || [];
      
      const totalRevenue = transactionData
        .filter(t => t.status === 'completed' && t.type === 'payment')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyRevenue = transactionData
        .filter(t => t.status === 'completed' && 
                    t.type === 'payment' && 
                    new Date(t.created_at) >= thisMonth)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const pendingAmount = transactionData
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const failedTransactions = transactionData.filter(t => t.status === 'failed').length;
      const completedTransactions = transactionData.filter(t => t.status === 'completed').length;
      const averageTransaction = completedTransactions > 0 ? totalRevenue / completedTransactions : 0;

      // Calculate growth rate
      const periodDays = parseInt(period);
      const previousPeriodStart = new Date();
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (periodDays * 2));
      const previousPeriodEnd = new Date();
      previousPeriodEnd.setDate(previousPeriodEnd.getDate() - periodDays);

      const { data: previousData } = await supabase
        .from('financial_transactions')
        .select('amount, status, type')
        .gte('created_at', previousPeriodStart.toISOString())
        .lt('created_at', previousPeriodEnd.toISOString())
        .eq('status', 'completed')
        .eq('type', 'payment');

      const previousRevenue = previousData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      const growthRate = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      setStats({
        total_revenue: totalRevenue,
        monthly_revenue: monthlyRevenue,
        pending_amount: pendingAmount,
        failed_transactions: failedTransactions,
        completed_transactions: completedTransactions,
        total_transactions: transactionData.length,
        growth_rate: growthRate,
        average_transaction: averageTransaction
      });
    } catch (error: any) {
      console.error('Error fetching financial stats:', error);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.transaction_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user_profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    setFilteredTransactions(filtered);
  };

  const exportTransactions = () => {
    const csvContent = [
      ['ID', 'User', 'Email', 'Amount', 'Status', 'Type', 'Description', 'Payment Method', 'Reference', 'Created At'],
      ...filteredTransactions.map(t => [
        t.id,
        t.user_profiles?.full_name || 'Unknown',
        t.user_profiles?.email || 'N/A',
        t.amount,
        t.status,
        t.type,
        t.description,
        t.payment_method || 'N/A',
        t.transaction_ref || 'N/A',
        new Date(t.created_at).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Fix: Use Analytics badge patterns - no purple badges
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'outline';  // Changed from 'default' to 'outline'
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <TrendingUp className="h-4 w-4 text-foreground opacity-75" />;
      case 'refund': return <TrendingDown className="h-4 w-4 text-foreground opacity-75" />;
      case 'commission': return <AlertCircle className="h-4 w-4 text-foreground opacity-75" />;
      case 'subscription': return <CreditCard className="h-4 w-4 text-foreground opacity-75" />;
      default: return <CreditCard className="h-4 w-4 text-foreground opacity-75" />;
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
    <div className="space-y-4">
      {/* Key Metrics - matching Projects exact pattern */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue || 0)}</div>
            <p className="text-xs text-foreground opacity-75">
              {stats?.growth_rate && stats.growth_rate >= 0 ? '+' : ''}{stats?.growth_rate?.toFixed(1)}% from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CalendarIcon className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.monthly_revenue || 0)}</div>
            <p className="text-xs text-foreground opacity-75">
              Current month earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <BarChart3 className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.average_transaction || 0)}</div>
            <p className="text-xs text-foreground opacity-75">
              {formatNumber(stats?.completed_transactions || 0)} completed transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.pending_amount || 0)}</div>
            <p className="text-xs text-foreground opacity-75">
              {formatNumber(stats?.failed_transactions || 0)} failed transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters - matching Projects pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground opacity-75" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={onRefresh} variant="outline" disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-foreground opacity-75">No transactions found matching your filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getTransactionTypeIcon(transaction.type)}
                      <CardTitle className="text-lg">{transaction.description}</CardTitle>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-foreground opacity-75">
                      <span>User: {transaction.user_profiles?.full_name || 'Unknown User'}</span>
                      <span>•</span>
                      <span>Email: {transaction.user_profiles?.email || 'N/A'}</span>
                      {transaction.user_profiles?.company_name && (
                        <>
                          <span>•</span>
                          <span>Company: {transaction.user_profiles.company_name}</span>
                        </>
                      )}
                    </div>
                    {transaction.transaction_ref && (
                      <div className="text-xs text-foreground opacity-75">
                        Reference: {transaction.transaction_ref}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <Badge variant={getStatusBadgeVariant(transaction.status)}>
                      {transaction.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <div className="text-lg font-bold text-primary">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-foreground opacity-75">Payment Method</p>
                    <p className="text-sm">{transaction.payment_method || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground opacity-75">Transaction Date</p>
                    <p className="text-sm">{format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground opacity-75">Transaction Type</p>
                    <p className="text-sm capitalize">{transaction.type}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  {onExport && (
                    <Button variant="outline" size="sm" onClick={onExport} disabled={isExporting}>
                      <Eye className="h-4 w-4" />
                      Export Data
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
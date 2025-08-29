import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FinancialAnalyticsChart } from '@/components/analytics/FinancialAnalyticsChart';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { cn } from '@/lib/utils';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';

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
  totalRevenue: number;
  totalRefunds: number;
  pendingAmount: number;
  failedTransactions: number;
  transactionCount: number;
  avgTransactionValue: number;
}

export const EnhancedFinancialDashboard = () => {
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
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchFinancialStats();
  }, [selectedPeriod]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, statusFilter, typeFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // Use mock data since financial_transactions table doesn't exist
      const mockTransactions: FinancialTransaction[] = [
        {
          id: '1',
          user_id: 'user1',
          amount: 5000,
          type: 'payment',
          status: 'completed',
          description: 'Service payment',
          payment_method: 'credit_card',
          transaction_ref: 'TXN001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_profiles: {
            full_name: 'John Doe',
            email: 'john@example.com',
            company_name: 'ABC Corp'
          }
        },
        {
          id: '2',
          user_id: 'user2',
          amount: 3500,
          type: 'refund',
          status: 'pending',
          description: 'Refund request',
          payment_method: 'bank_transfer',
          transaction_ref: 'TXN002',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          user_profiles: {
            full_name: 'Jane Smith',
            email: 'jane@example.com',
            company_name: 'XYZ Ltd'
          }
        },
        {
          id: '3',
          user_id: 'user3',
          amount: 7200,
          type: 'payment',
          status: 'completed',
          description: 'Subscription renewal',
          payment_method: 'paypal',
          transaction_ref: 'TXN003',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString(),
          user_profiles: {
            full_name: 'Bob Johnson',
            email: 'bob@example.com',
            company_name: 'Tech Solutions'
          }
        },
        {
          id: '4',
          user_id: 'user4',
          amount: 1800,
          type: 'payment',
          status: 'failed',
          description: 'Payment declined',
          payment_method: 'credit_card',
          transaction_ref: 'TXN004',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          updated_at: new Date(Date.now() - 259200000).toISOString(),
          user_profiles: {
            full_name: 'Alice Brown',
            email: 'alice@example.com',
            company_name: 'Design Studio'
          }
        }
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialStats = async () => {
    try {
      // Use mock data since financial_transactions table doesn't exist
      const mockStats = [
        { amount: 5000, status: 'completed', type: 'payment', created_at: new Date().toISOString() },
        { amount: 3500, status: 'pending', type: 'refund', created_at: new Date(Date.now() - 86400000).toISOString() },
        { amount: 7200, status: 'completed', type: 'payment', created_at: new Date(Date.now() - 172800000).toISOString() },
        { amount: 1800, status: 'failed', type: 'payment', created_at: new Date(Date.now() - 259200000).toISOString() }
      ];

      // Calculate statistics from mock data
      const totalRevenue = mockStats.filter(t => t.status === 'completed' && t.type === 'payment')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalRefunds = mockStats.filter(t => t.status === 'completed' && t.type === 'refund')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const pendingAmount = mockStats.filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const failedTransactions = mockStats.filter(t => t.status === 'failed').length;

      setStats({
        totalRevenue,
        totalRefunds,
        pendingAmount,
        failedTransactions,
        transactionCount: mockStats.length,
        avgTransactionValue: totalRevenue / Math.max(1, mockStats.filter(t => t.status === 'completed').length)
      });

      // Mock chart data
      const chartData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 10000) + 1000,
        transactions: Math.floor(Math.random() * 20) + 5
      }));

      setChartData(chartData);
    } catch (error) {
      console.error('Error fetching financial stats:', error);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.user_profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.user_profiles?.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transaction_ref?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    setFilteredTransactions(filtered);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const handleTransactionClick = (transaction: FinancialTransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  const exportTransactions = () => {
    try {
      const headers = ['ID', 'User', 'Amount', 'Type', 'Status', 'Description', 'Date'];
      const rows = filteredTransactions.map(t => [
        t.id,
        t.user_profiles?.full_name || 'Unknown',
        t.amount,
        t.type,
        t.status,
        t.description,
        new Date(t.created_at).toLocaleDateString()
      ]);
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Transactions exported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export transactions',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground opacity-75">Loading financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-foreground opacity-75">
            Monitor transactions, revenue, and financial performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => { fetchTransactions(); fetchFinancialStats(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground opacity-75">Total Revenue</p>
                  <p className="text-3xl font-bold text-success">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">+12.5% this month</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-success/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground opacity-75">Pending Amount</p>
                  <p className="text-3xl font-bold text-warning">
                    {formatCurrency(stats.pendingAmount)}
                  </p>
                  <p className="text-xs text-foreground opacity-75 mt-1">
                    Awaiting processing
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-warning/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground opacity-75">Failed Transactions</p>
                  <p className="text-3xl font-bold text-destructive">
                    {formatNumber(stats.failedTransactions)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-destructive" />
                    <span className="text-xs text-destructive">Needs attention</span>
                  </div>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground opacity-75">Avg Transaction</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(stats.avgTransactionValue)}
                  </p>
                  <p className="text-xs text-foreground opacity-75 mt-1">
                    Per completed transaction
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>
            Financial performance over the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialAnalyticsChart period="month" />
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            View and manage financial transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => handleTransactionClick(transaction)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {transaction.user_profiles?.full_name || 'Unknown User'}
                    </span>
                    <span className="text-sm text-foreground opacity-75">
                      {transaction.user_profiles?.company_name || transaction.user_profiles?.email}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-foreground opacity-75">
                      {transaction.type}
                    </div>
                  </div>
                  
                  {getStatusBadge(transaction.status)}
                  
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-foreground opacity-75">
              No transactions found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {/* Mock Implementation Notice */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-foreground opacity-75">
          <strong>Note:</strong> This financial dashboard is currently using mock data. 
          Database integration pending schema updates for the financial_transactions table.
        </p>
      </div>
    </div>
  );
};
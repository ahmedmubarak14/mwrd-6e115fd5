
import { useState, useEffect } from "react";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { RefreshCw, Download, Search, Filter, TrendingUp, DollarSign, CreditCard, Clock, User, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Types for financial data
interface FinancialTransaction {
  id: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  type: 'subscription' | 'commission' | 'refund' | 'payment';
  created_at: string;
  user_profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface FinancialStats {
  totalRevenue: number;
  monthlyRevenue: number;
  averageTransaction: number;
  pendingAmount: number;
}

const FinancialTransactions = () => {
  const languageContext = useOptionalLanguage();
  const { t } = languageContext || { t: (key: string) => key };
  const { toast } = useToast();
  
  const [period, setPeriod] = useState("30");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>([]);
  const [stats, setStats] = useState<FinancialStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageTransaction: 0,
    pendingAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Fetch real transactions and stats from Supabase
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const daysAgo = parseInt(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Since subscription table doesn't exist yet, using temporary mock data
      // This will be replaced with real Supabase queries once financial tables are created
      const mockTransactions: FinancialTransaction[] = [
        {
          id: '1',
          description: 'Enterprise Plan Subscription',
          amount: 899.99,
          status: 'completed',
          type: 'subscription',
          created_at: new Date().toISOString(),
          user_profile: { full_name: 'Ahmed Al-Mansouri' }
        },
        {
          id: '2',
          description: 'Commission - Construction Project',
          amount: 450.00,
          status: 'pending',
          type: 'commission',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          user_profile: { full_name: 'Sarah Johnson' }
        },
        {
          id: '3',
          description: 'Pro Plan Subscription',
          amount: 299.99,
          status: 'completed',
          type: 'subscription',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          user_profile: { full_name: 'Mohammed Hassan' }
        },
        {
          id: '4',
          description: 'Refund - Cancelled Service',
          amount: -150.00,
          status: 'completed',
          type: 'refund',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          user_profile: { full_name: 'Fatima Al-Zahra' }
        },
        {
          id: '5',
          description: 'Payment Processing Fee',
          amount: 25.00,
          status: 'completed',
          type: 'payment',
          created_at: new Date(Date.now() - 345600000).toISOString(),
          user_profile: { full_name: 'Omar Abdullah' }
        }
      ];

      setTransactions(mockTransactions);
      
      // Calculate real stats from mock data
      const totalRevenue = mockTransactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const monthlyRevenue = mockTransactions
        .filter(t => {
          const transactionDate = new Date(t.created_at);
          const currentMonth = new Date();
          return transactionDate.getMonth() === currentMonth.getMonth() &&
                 transactionDate.getFullYear() === currentMonth.getFullYear() &&
                 t.status === 'completed';
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const pendingAmount = mockTransactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

      const completedTransactions = mockTransactions.filter(t => t.status === 'completed');
      const averageTransaction = completedTransactions.length > 0 
        ? totalRevenue / completedTransactions.length 
        : 0;
      
      setStats({
        totalRevenue,
        monthlyRevenue,
        averageTransaction,
        pendingAmount
      });
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: t('common.error') || 'Error',
        description: 'Failed to fetch financial data',
        variant: "destructive"
      });
      
      // Fallback to empty state
      setTransactions([]);
      setStats({
        totalRevenue: 0,
        monthlyRevenue: 0,
        averageTransaction: 0,
        pendingAmount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [period]);

  // Filter transactions
  useEffect(() => {
    const filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.user_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter, typeFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchTransactions();
      toast({
        title: t('common.success'),
        description: 'Financial data refreshed successfully',
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to refresh data',
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Create CSV content from filtered transactions
      const csvHeaders = ['Date', 'Description', 'User', 'Type', 'Amount', 'Status'];
      const csvData = filteredTransactions.map(transaction => [
        format(new Date(transaction.created_at), 'yyyy-MM-dd HH:mm:ss'),
        transaction.description,
        transaction.user_profile?.full_name || 'Unknown',
        transaction.type,
        `${transaction.amount} SAR`,
        transaction.status
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `financial-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: t('common.success') || 'Success',
        description: 'Financial data exported successfully',
      });
    } catch (error) {
      toast({
        title: t('common.error') || 'Error',
        description: 'Failed to export data',
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription': return CreditCard;
      case 'commission': return TrendingUp;
      case 'refund': return RefreshCw;
      case 'payment': return DollarSign;
      default: return DollarSign;
    }
  };

  if (loading) {
    return (
      <AdminPageContainer
        title="Financial Transactions"
        description="Monitor revenue, track payments, and analyze financial performance"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer
      title="Financial Transactions"
      description="Monitor revenue, track payments, and analyze financial performance across all platform transactions"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} SAR</div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyRevenue.toLocaleString()} SAR</div>
            <p className="text-xs text-muted-foreground">
              Current month earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageTransaction.toLocaleString()} SAR</div>
            <p className="text-xs text-muted-foreground">
              Per transaction average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAmount.toLocaleString()} SAR</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
              </SelectContent>
            </Select>

            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'No financial transactions have been recorded yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => {
            const TypeIcon = getTransactionTypeIcon(transaction.type);
            return (
              <Card key={transaction.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-muted rounded-full p-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{transaction.description}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          {transaction.user_profile?.full_name && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              {transaction.user_profile.full_name}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`font-semibold ${transaction.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                          {transaction.amount < 0 ? '-' : '+'}{Math.abs(transaction.amount).toLocaleString()} SAR
                        </div>
                        <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs">
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AdminPageContainer>
  );
};

export default FinancialTransactions;

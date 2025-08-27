import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FinancialAnalyticsChart } from '@/components/analytics/FinancialAnalyticsChart';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  RefreshCw,
  Calendar as CalendarIcon,
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
  total_revenue: number;
  monthly_revenue: number;
  pending_amount: number;
  failed_transactions: number;
  total_transactions: number;
  growth_rate: number;
  average_transaction: number;
  completed_transactions: number;
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
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchFinancialStats();
  }, [selectedPeriod, dateRange]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, statusFilter, typeFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('financial_transactions')
        .select(`
          *,
          user_profiles!inner(
            user_id,
            full_name,
            email,
            company_name
          )
        `);

      // Apply date filtering
      if (dateRange.from && dateRange.to) {
        query = query
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString());
      } else {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(selectedPeriod));
        query = query.gte('created_at', daysAgo.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
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
      let query = supabase.from('financial_transactions').select('amount, status, type, created_at');

      // Apply date filtering
      if (dateRange.from && dateRange.to) {
        query = query
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString());
      } else {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(selectedPeriod));
        query = query.gte('created_at', daysAgo.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      const transactionData = data || [];
      
      // Calculate current period stats
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

      // Calculate growth rate compared to previous period
      const periodDays = parseInt(selectedPeriod);
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.transaction_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.user_profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Type filter
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'refund': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'commission': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'subscription': return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const openTransactionDetails = (transaction: FinancialTransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL ? "text-right" : "text-left")}>
          <h3 className="text-lg font-semibold">{t('financial.dashboard')}</h3>
          <p className="text-sm text-muted-foreground">{t('financial.monitorRevenue')}</p>
        </div>
        <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t('time.last7days')}</SelectItem>
              <SelectItem value="30">{t('time.last30days')}</SelectItem>
              <SelectItem value="90">{t('time.last3months')}</SelectItem>
              <SelectItem value="365">{t('time.lastYear')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchTransactions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('financial.refreshData')}
          </Button>
        </div>
      </div>

      {/* Enhanced Financial Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('financial.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue || 0)}</div>
            <p className={cn("text-xs", stats?.growth_rate && stats.growth_rate >= 0 ? "text-green-600" : "text-red-600")}>
              {stats?.growth_rate && stats.growth_rate >= 0 ? '+' : ''}{stats?.growth_rate?.toFixed(1)}% {t('financial.growthFromPeriod')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('financial.monthlyRevenue')}</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.monthly_revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('financial.monthlyEarnings')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('financial.averageTransaction')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.average_transaction || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.completed_transactions || 0)} {t('financial.completedTransactions')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('financial.pendingAmount')}</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.pending_amount || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats?.failed_transactions || 0)} {t('financial.failedTransactions')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">{t('financial.recentTransactions')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('financial.financialAnalytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
                <span>{t('financial.transactionHistory')}</span>
                <Button variant="outline" size="sm" onClick={exportTransactions}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('financial.exportTransactions')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={cn("flex gap-4 flex-wrap", isRTL && "flex-row-reverse")}>
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className={cn("absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
                    <Input
                      placeholder={t('financial.searchTransactions')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={cn(isRTL ? "pr-10" : "pl-10")}
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t('financial.filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('financial.allStatuses')}</SelectItem>
                    <SelectItem value="completed">{t('financial.completed')}</SelectItem>
                    <SelectItem value="pending">{t('financial.pending')}</SelectItem>
                    <SelectItem value="failed">{t('financial.failed')}</SelectItem>
                    <SelectItem value="cancelled">{t('financial.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('financial.filterByType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('financial.allTypes')}</SelectItem>
                    <SelectItem value="payment">{t('financial.payment')}</SelectItem>
                    <SelectItem value="refund">{t('financial.refund')}</SelectItem>
                    <SelectItem value="commission">{t('financial.commission')}</SelectItem>
                    <SelectItem value="subscription">{t('financial.subscription')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className={cn("flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors", isRTL && "flex-row-reverse")}>
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      {getTransactionTypeIcon(transaction.type)}
                      <div className={cn(isRTL ? "text-right" : "text-left")}>
                        <div className="font-medium">
                          {transaction.user_profiles?.full_name || t('financial.unknownUser')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.user_profiles?.email || t('financial.noEmail')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.description}
                        </div>
                      </div>
                    </div>
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      <div className={cn(isRTL ? "text-left" : "text-right")}>
                        <div className="font-medium">
                          {transaction.type === 'refund' ? '-' : '+'}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className={cn("flex items-center gap-2 mt-1", isRTL && "flex-row-reverse")}>
                          <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs">
                            {t(`financial.${transaction.status}`)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openTransactionDetails(transaction)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredTransactions.length === 0 && (
                  <div className={cn("text-center text-muted-foreground py-8", isRTL ? "text-right" : "text-left")}>
                    {t('financial.noTransactions')}
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

      <TransactionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};
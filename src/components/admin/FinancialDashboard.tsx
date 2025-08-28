import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface FinancialDashboardProps {
  period: string;
}

export const FinancialDashboard = ({ period }: FinancialDashboardProps) => {
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
      case 'payment': return <TrendingUp className="h-4 w-4 text-foreground/75" />;
      case 'refund': return <TrendingDown className="h-4 w-4 text-foreground/75" />;
      case 'commission': return <AlertCircle className="h-4 w-4 text-foreground/75" />;
      case 'subscription': return <CreditCard className="h-4 w-4 text-foreground/75" />;
      default: return <CreditCard className="h-4 w-4 text-foreground/75" />;
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
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Stats Cards - matching Analytics exact pattern */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('financial.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue || 0)}</div>
            <p className="text-xs text-foreground/75">
              {stats?.growth_rate && stats.growth_rate >= 0 ? '+' : ''}{stats?.growth_rate?.toFixed(1)}% {t('financial.growthFromPeriod')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('financial.monthlyRevenue')}</CardTitle>
            <CalendarIcon className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.monthly_revenue || 0)}</div>
            <p className="text-xs text-foreground/75">{t('financial.monthlyEarnings')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('financial.averageTransaction')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.average_transaction || 0)}</div>
            <p className="text-xs text-foreground/75">
              {formatNumber(stats?.completed_transactions || 0)} {t('financial.completedTransactions')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('financial.pendingAmount')}</CardTitle>
            <CreditCard className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.pending_amount || 0)}</div>
            <p className="text-xs text-foreground/75">
              {formatNumber(stats?.failed_transactions || 0)} {t('financial.failedTransactions')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs - matching Analytics pattern */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <CreditCard className="h-4 w-4" />
            {t('financial.recentTransactions')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <BarChart3 className="h-4 w-4" />
            {t('financial.analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
                <span>{t('financial.transactionHistory')}</span>
                <Button variant="outline" size="sm" onClick={exportTransactions}>
                  {t('financial.exportTransactions')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className={cn("flex gap-4 flex-wrap", isRTL && "flex-row-reverse")}>
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className={cn("absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/75", isRTL ? "right-3" : "left-3")} />
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
                  </SelectContent>
                </Select>
              </div>

              {/* Transactions List */}
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className={cn("flex items-center justify-between p-3 border rounded-lg", isRTL && "flex-row-reverse")}>
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      {getTransactionTypeIcon(transaction.type)}
                      <div className={cn(isRTL ? "text-right" : "text-left")}>
                        <div className="font-medium text-foreground">{transaction.description}</div>
                        <div className="text-sm text-foreground/75">
                          {transaction.user_profiles?.full_name || 'Unknown'} • {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                        {transaction.transaction_ref && (
                          <div className="text-xs text-foreground/75 mt-1">
                            Ref: {transaction.transaction_ref}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      <div className={cn("text-right", isRTL && "text-left")}>
                        <div className="font-medium text-foreground">{formatCurrency(transaction.amount)}</div>
                        <div className="text-sm text-foreground/75">{transaction.payment_method || 'N/A'}</div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(transaction.status)}>
                        {transaction.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredTransactions.length === 0 && (
                  <div className={cn("text-center text-foreground/75 py-8", isRTL ? "text-right" : "text-left")}>
                    {t('financial.noTransactions')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('financial.analytics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-center text-foreground/75 py-8", isRTL ? "text-right" : "text-left")}>
                {t('financial.analyticsContent')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
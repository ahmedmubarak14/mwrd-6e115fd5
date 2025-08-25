
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FinancialAnalyticsChart } from '@/components/analytics/FinancialAnalyticsChart';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
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
  status: string;
  type: string;
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
  const { t, isRTL, formatNumber, formatCurrency } = useLanguage();
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
        .select('amount, status, type, created_at')
        .gte('created_at', daysAgo.toISOString());

      if (error) throw error;

      const transactions = data || [];
      const totalRevenue = transactions
        .filter(t => t.status === 'completed' && t.type === 'payment')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyRevenue = transactions
        .filter(t => t.status === 'completed' && 
                    t.type === 'payment' && 
                    new Date(t.created_at) >= thisMonth)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const pendingAmount = transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

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
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL ? "text-right" : "text-left")}>
          <h3 className="text-lg font-semibold">{t('financial.dashboard')}</h3>
          <p className="text-sm text-muted-foreground">{t('financial.monitorRevenue')}</p>
        </div>
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
      </div>

      {/* Financial Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('financial.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.growth_rate}% {t('financial.growthFromPeriod')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('financial.monthlyRevenue')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.monthly_revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {t('financial.monthlyEarnings')}
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
              {t('financial.awaitingProcessing')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('financial.failedTransactions')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.failed_transactions || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {t('financial.outOfTotal')} {formatNumber(stats?.total_transactions || 0)} {t('financial.total')}
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
          <Card>
            <CardHeader>
              <CardTitle>{t('financial.transactionHistory')}</CardTitle>
              <CardDescription>{t('financial.transactionDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className={cn("flex items-center justify-between p-4 border rounded-lg", isRTL && "flex-row-reverse")}>
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
                     <div className={cn("text-right", isRTL && "text-left")}>
                       <div className="font-medium">
                         {transaction.type === 'refund' ? '-' : '+'}
                         {formatCurrency(transaction.amount)}
                       </div>
                      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                        <Badge variant={getStatusBadgeVariant(transaction.status)}>
                          {t(`financial.${transaction.status}`)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
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
    </div>
  );
};

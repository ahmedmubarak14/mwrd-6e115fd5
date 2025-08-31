import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Receipt,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface FinancialTransaction {
  id: string;
  type: 'payment' | 'refund' | 'fee' | 'commission' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  description: string;
  reference_id?: string;
  user_id?: string;
  order_id?: string;
  created_at: string;
  updated_at: string;
  payment_method?: string;
  gateway_response?: any;
  user_profile?: {
    full_name?: string;
    email: string;
    company_name?: string;
  };
}

export default function AdminFinancialTransactions() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();
  
  const { t } = useLanguage();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          user_profiles(
            full_name,
            email,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        if (error.code === '42P01') {
          // Table doesn't exist, use demo data
          const demoTransactions: FinancialTransaction[] = [
            {
              id: 'demo-1',
              type: 'payment',
              status: 'completed',
              amount: 15000,
              currency: t('admin.financial.currency'),
              description: t('admin.financial.demoData.paymentForConstruction'),
              reference_id: 'PAY-001',
              user_id: 'demo-user-1',
              order_id: 'order-1',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              payment_method: 'credit_card',
              user_profile: {
                full_name: 'Ahmed Al-Rashid',
                email: 'ahmed@example.com',
                company_name: 'Al-Rashid Construction'
              }
            },
            {
              id: 'demo-2',
              type: 'commission',
              status: 'completed',
              amount: 750,
              currency: t('admin.financial.currency'),
              description: t('admin.financial.demoData.platformCommission'),
              reference_id: 'COM-001',
              user_id: 'demo-user-2',
              order_id: 'order-1',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              updated_at: new Date(Date.now() - 86400000).toISOString(),
              payment_method: 'platform',
              user_profile: {
                full_name: 'Sara Al-Mansouri',
                email: 'sara@example.com',
                company_name: 'Mansouri Trading'
              }
            },
            {
              id: 'demo-3',
              type: 'refund',
              status: 'pending',
              amount: 2500,
              currency: t('admin.financial.currency'),
              description: t('admin.financial.demoData.refundForCancelledOrder'),
              reference_id: 'REF-001',
              user_id: 'demo-user-3',
              order_id: 'order-3',
              created_at: new Date(Date.now() - 172800000).toISOString(),
              updated_at: new Date(Date.now() - 172800000).toISOString(),
              payment_method: 'bank_transfer',
              user_profile: {
                full_name: 'Mohammed Al-Farisi',
                email: 'mohammed@example.com',
                company_name: 'Farisi Electronics'
              }
            }
          ];
          
          setTransactions(demoTransactions);
          toast({
            title: t('admin.financial.demoMode'),
            description: t('admin.financial.demoDescription'),
            variant: "default",
          });
          return;
        }
        throw error;
      }

      const transformedData = (data || []).map(transaction => ({
        id: transaction.id,
        type: transaction.type as FinancialTransaction['type'],
        status: transaction.status as FinancialTransaction['status'],
        amount: Number(transaction.amount) || 0,
        currency: t('admin.financial.currency'), // Use translation instead of hardcoded 'SAR'
        description: transaction.description || t('admin.financial.transaction'), // Use translation
        reference_id: transaction.transaction_ref, // Map transaction_ref to reference_id
        user_id: transaction.user_id,
        order_id: transaction.order_id,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at,
        payment_method: transaction.payment_method,
        gateway_response: undefined, // Not available in current DB schema
        user_profile: transaction.user_profiles
      }));

      setTransactions(transformedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: t('admin.financial.error'),
        description: t('admin.financial.fetchError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusBadge = (status: FinancialTransaction['status']) => {
    const variants = {
      pending: 'secondary',
      completed: 'default',
      failed: 'destructive',
      cancelled: 'secondary'
    } as const;

    const colors = {
      pending: 'bg-yellow-500 hover:bg-yellow-600',
      completed: 'bg-success hover:bg-success/80',
      failed: 'bg-destructive hover:bg-destructive/80',
      cancelled: 'bg-gray-500 hover:bg-gray-600'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {t(`admin.financial.${status}`)}
      </Badge>
    );
  };

  const getTypeBadge = (type: FinancialTransaction['type']) => {
    const colors = {
      payment: 'bg-green-100 text-green-800 border-green-200',
      refund: 'bg-orange-100 text-orange-800 border-orange-200',
      fee: 'bg-purple-100 text-purple-800 border-purple-200',
      commission: 'bg-blue-100 text-blue-800 border-blue-200',
      withdrawal: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge variant="outline" className={colors[type]}>
        {t(`admin.financial.${type}`)}
      </Badge>
    );
  };

  const getStatusIcon = (status: FinancialTransaction['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesTab = selectedTab === 'all' || transaction.status === selectedTab;
    
    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  const transactionStats = {
    total: transactions.length,
    pending: transactions.filter(t => t.status === 'pending').length,
    completed: transactions.filter(t => t.status === 'completed').length,
    failed: transactions.filter(t => t.status === 'failed').length,
    totalAmount: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    totalRevenue: transactions.filter(t => t.status === 'completed' && ['commission', 'fee'].includes(t.type)).reduce((sum, t) => sum + t.amount, 0)
  };

  const exportTransactions = () => {
    const csvContent = [
      t('admin.financial.transactionCsvHeaders'),
      ...filteredTransactions.map(transaction => 
        `${transaction.id},${transaction.type},${transaction.status},${transaction.amount},${transaction.currency},"${transaction.description}",${transaction.reference_id || t('admin.financial.notAvailable')},${format(new Date(transaction.created_at), 'yyyy-MM-dd HH:mm')},${transaction.user_profile?.full_name || t('admin.financial.notAvailable')}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          {t('admin.financialTransactionsTitle')}
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          {t('admin.financialTransactionsDesc')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Receipt className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{transactionStats.total}</p>
                <p className="text-sm text-muted-foreground">{t('admin.financial.totalTransactions')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{transactionStats.completed}</p>
                <p className="text-sm text-muted-foreground">{t('admin.financial.completed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{transactionStats.pending}</p>
                <p className="text-sm text-muted-foreground">{t('admin.financial.pending')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{transactionStats.totalAmount.toLocaleString()} {t('admin.financial.currency')}</p>
                <p className="text-sm text-muted-foreground">{t('admin.financial.totalVolume')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{transactionStats.totalRevenue.toLocaleString()} {t('admin.financial.currency')}</p>
                <p className="text-sm text-muted-foreground">{t('admin.financial.platformRevenue')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('admin.financial.searchTransactions')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t('admin.financial.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.financial.allStatus')}</SelectItem>
              <SelectItem value="pending">{t('admin.financial.pending')}</SelectItem>
              <SelectItem value="completed">{t('admin.financial.completed')}</SelectItem>
              <SelectItem value="failed">{t('admin.financial.failed')}</SelectItem>
              <SelectItem value="cancelled">{t('admin.financial.cancelled')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t('admin.financial.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.financial.allTypes')}</SelectItem>
              <SelectItem value="payment">{t('admin.financial.payment')}</SelectItem>
              <SelectItem value="refund">{t('admin.financial.refund')}</SelectItem>
              <SelectItem value="fee">{t('admin.financial.fee')}</SelectItem>
              <SelectItem value="commission">{t('admin.financial.commission')}</SelectItem>
              <SelectItem value="withdrawal">{t('admin.financial.withdrawal')}</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchTransactions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('admin.financial.refresh')}
          </Button>

          <Button variant="outline" onClick={exportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            {t('admin.financial.export')}
          </Button>
        </div>
      </div>

      {/* Transactions Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">{t('admin.financial.all')} ({transactionStats.total})</TabsTrigger>
          <TabsTrigger value="pending">{t('admin.financial.pending')} ({transactionStats.pending})</TabsTrigger>
          <TabsTrigger value="completed">{t('admin.financial.completed')} ({transactionStats.completed})</TabsTrigger>
          <TabsTrigger value="failed">{t('admin.financial.failed')} ({transactionStats.failed})</TabsTrigger>
          <TabsTrigger value="cancelled">{t('admin.financial.cancelled')}</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">{t('admin.financial.noTransactionsFound')}</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? t('admin.financial.noTransactionsMatch') : t('admin.financial.noTransactionsAvailable')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <p className="font-semibold">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.reference_id && `${t('admin.financial.ref')}: ${transaction.reference_id} • `}
                              {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                            </p>
                          </div>
                        </div>

                        {transaction.user_profile && (
                          <div className="ml-7 text-sm text-muted-foreground">
                            <p>{t('admin.financial.user')}: {transaction.user_profile.full_name || transaction.user_profile.email}</p>
                            {transaction.user_profile.company_name && (
                              <p>{t('admin.financial.company')}: {transaction.user_profile.company_name}</p>
                            )}
                          </div>
                        )}

                        <div className="ml-7 flex items-center gap-2">
                          {getTypeBadge(transaction.type)}
                          {getStatusBadge(transaction.status)}
                          {transaction.payment_method && (
                            <Badge variant="outline">
                              {t(`admin.financial.paymentMethods.${transaction.payment_method}`) || transaction.payment_method.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {transaction.amount.toLocaleString()} {transaction.currency}
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
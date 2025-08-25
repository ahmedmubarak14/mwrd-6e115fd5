
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  transaction_type: string;
  description: string | null;
  created_at: string;
  user_profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

export default function FinancialTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          user_profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions((data as unknown as Transaction[]) || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user_profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'succeeded': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'subscription': return <TrendingUp className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn(isRTL ? "text-right" : "text-left")}>
        <h1 className="text-2xl font-bold">{t('admin.financialTransactions')}</h1>
        <p className="text-muted-foreground">{t('financial.monitorRevenue')}</p>
      </div>

      {/* Search and Filter */}
      <div className={cn("flex flex-col sm:flex-row gap-4", isRTL && "sm:flex-row-reverse")}>
        <div className="flex-1">
          <Input
            placeholder={t('common.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t('common.filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            <SelectItem value="pending">{t('common.pending')}</SelectItem>
            <SelectItem value="succeeded">{t('common.completed')}</SelectItem>
            <SelectItem value="failed">{t('common.failed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">{t('financial.noTransactions')}</p>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader className="pb-3">
                <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                    {getTransactionTypeIcon(transaction.transaction_type)}
                    <div className={cn(isRTL ? "text-right" : "text-left")}>
                      <CardTitle className="text-lg">
                        {transaction.amount} {transaction.currency}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {transaction.user_profiles?.full_name || transaction.user_profiles?.email || t('financial.unknownUser')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transaction.description && (
                    <p className="text-sm">{transaction.description}</p>
                  )}
                  <div className={cn("flex items-center justify-between text-xs text-muted-foreground", isRTL && "flex-row-reverse")}>
                    <span>{t('common.type')}: {transaction.transaction_type}</span>
                    <span>{format(new Date(transaction.created_at), 'PPp')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

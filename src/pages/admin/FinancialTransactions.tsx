import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { format } from "date-fns";
import { DollarSign, Download, RefreshCw, TrendingUp, Clock, CheckCircle, Edit, Trash2, Eye, Users, BarChart3, Calendar, Building, CreditCard, AlertTriangle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { useToast } from "@/hooks/use-toast";

interface AdminFinancialTransaction {
  id: string;
  user_id: string;
  order_id?: string;
  amount: number;
  currency?: string;
  type: 'subscription' | 'commission' | 'refund' | 'payment' | 'invoice_generated' | 'order_payment';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  transaction_ref?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
  user_profile?: {
    full_name: string | null;
    email: string;
    company_name?: string | null;
  } | null;
  order?: {
    id: string;
    title: string;
  } | null;
}

export default function AdminFinancialTransactions() {
  const [transactions, setTransactions] = useState<AdminFinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [editingTransaction, setEditingTransaction] = useState<AdminFinancialTransaction | null>(null);
  const [bulkAction, setBulkAction] = useState<string>("");
  
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  const { toast } = useToast();

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
          user_profile:user_profiles!financial_transactions_user_id_fkey(full_name, email, company_name),
          order:orders(id, title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedTransactions: AdminFinancialTransaction[] = (data || []).map(transaction => ({
        id: transaction.id,
        user_id: transaction.user_id,
        order_id: transaction.order_id,
        amount: Number(transaction.amount) || 0,
        currency: 'SAR', // Default currency as it's not in the database
        type: ['subscription', 'commission', 'refund', 'payment', 'invoice_generated', 'order_payment'].includes(transaction.type) 
          ? transaction.type as AdminFinancialTransaction['type']
          : 'payment',
        status: ['pending', 'completed', 'failed', 'cancelled'].includes(transaction.status)
          ? transaction.status as AdminFinancialTransaction['status']
          : 'pending',
        description: transaction.description,
        transaction_ref: transaction.transaction_ref,
        payment_method: transaction.payment_method,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at,
        user_profile: transaction.user_profile,
        order: transaction.order
      }));

      setTransactions(transformedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (transactionId: string, newStatus: AdminFinancialTransaction['status']) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) throw error;
      
      await fetchTransactions();
      toast({
        title: "Success",
        description: `Transaction status updated to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating transaction status:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction status",
        variant: "destructive"
      });
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', transactionId);

      if (error) throw error;
      
      await fetchTransactions();
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive"
      });
    }
  };

  const handleBulkAction = async () => {
    if (selectedTransactions.length === 0 || !bulkAction) return;

    try {
      if (bulkAction === 'delete') {
        const { error } = await supabase
          .from('financial_transactions')
          .delete()
          .in('id', selectedTransactions);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: `${selectedTransactions.length} transactions deleted`,
        });
      } else {
        const { error } = await supabase
          .from('financial_transactions')
          .update({ status: bulkAction as AdminFinancialTransaction['status'] })
          .in('id', selectedTransactions);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: `${selectedTransactions.length} transactions updated`,
        });
      }

      setSelectedTransactions([]);
      setBulkAction("");
      await fetchTransactions();
    } catch (error: any) {
      console.error('Error with bulk action:', error);
      toast({
        title: "Error",
        description: "Bulk action failed",
        variant: "destructive"
      });
    }
  };

  const handleExportSelected = () => {
    const transactionsToExport = selectedTransactions.length > 0 
      ? filteredTransactions.filter(transaction => selectedTransactions.includes(transaction.id))
      : filteredTransactions;

    const csvContent = [
      'Transaction ID,User,Type,Amount,Currency,Status,Description,Payment Method,Created Date',
      ...transactionsToExport.map(transaction => 
        `${transaction.id},"${transaction.user_profile?.full_name || transaction.user_profile?.email || 'Unknown'}",${transaction.type},${transaction.amount},${transaction.currency || 'SAR'},${transaction.status},"${transaction.description || ''}","${transaction.payment_method || ''}",${format(new Date(transaction.created_at), 'yyyy-MM-dd')}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export completed",
      description: `${transactionsToExport.length} transactions exported to CSV`,
    });
  };

  const handleRefresh = () => {
    fetchTransactions();
    toast({
      title: "Data refreshed",
      description: "Financial transactions data has been updated",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      completed: "default",
      failed: "destructive",
      cancelled: "outline"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      subscription: CreditCard,
      commission: TrendingUp,
      refund: RefreshCw,
      payment: DollarSign,
      invoice_generated: Building,
      order_payment: CheckCircle
    };
    return icons[type as keyof typeof icons] || DollarSign;
  };

  // Analytics calculations
  const currentDate = new Date();
  const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const thisWeekStart = new Date(currentDate);
  thisWeekStart.setDate(currentDate.getDate() - 7);

  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const failedTransactions = transactions.filter(t => t.status === 'failed').length;
  
  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthRevenue = transactions
    .filter(t => t.status === 'completed' && new Date(t.created_at) >= thisMonthStart)
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const avgTransactionValue = completedTransactions > 0 ? totalRevenue / completedTransactions : 0;

  const filteredTransactions = transactions.filter(transaction => {
    const searchMatch = searchTerm === "" || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user_profile?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transaction_ref?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "all" || transaction.status === statusFilter;
    const typeMatch = typeFilter === "all" || transaction.type === typeFilter;
    
    const tabMatch = activeTab === "all" || 
      (activeTab === "revenue" && transaction.amount > 0 && transaction.status === "completed") ||
      (activeTab === "pending" && transaction.status === "pending") ||
      (activeTab === "failed" && ["failed", "cancelled"].includes(transaction.status));
    
    return searchMatch && statusMatch && typeMatch && tabMatch;
  });

  const selectAllTransactions = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map(transaction => transaction.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" data-admin-dashboard>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AdminPageContainer
      title={t('financial.transactions')}
      description={t('financial.description')}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{t('financial.allTransactions')}</TabsTrigger>
          <TabsTrigger value="revenue">{t('financial.revenue')}</TabsTrigger>
          <TabsTrigger value="pending">{t('financial.pending')}</TabsTrigger>
          <TabsTrigger value="failed">{t('financial.failed')}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('financial.totalRevenue')}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} {t('financial.currency')}</div>
                <p className="text-xs text-muted-foreground">
                  From {completedTransactions} completed transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('financial.thisMonth')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{thisMonthRevenue.toLocaleString()} {t('financial.currency')}</div>
                <p className="text-xs text-muted-foreground">
                  {t('financial.currentMonthRevenue')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('financial.pendingAmount')}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingAmount.toLocaleString()} {t('financial.currency')}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingTransactions} pending transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('financial.avgTransaction')}</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgTransactionValue.toLocaleString()} {t('financial.currency')}</div>
                <p className="text-xs text-muted-foreground">
                  {failedTransactions} failed transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Bulk Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('financial.filtersActions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder={t('financial.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('financial.filterByStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('financial.allStatus')}</SelectItem>
                      <SelectItem value="pending">{t('financial.pending')}</SelectItem>
                      <SelectItem value="completed">{t('financial.completed')}</SelectItem>
                      <SelectItem value="failed">{t('financial.failed')}</SelectItem>
                      <SelectItem value="cancelled">{t('financial.cancelled')}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('financial.filterByType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('financial.allTypes')}</SelectItem>
                      <SelectItem value="subscription">{t('financial.subscription')}</SelectItem>
                      <SelectItem value="commission">{t('financial.commission')}</SelectItem>
                      <SelectItem value="payment">{t('financial.payment')}</SelectItem>
                      <SelectItem value="refund">{t('financial.refund')}</SelectItem>
                      <SelectItem value="order_payment">Order Payment</SelectItem>
                      <SelectItem value="invoice_generated">Invoice</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('financial.refresh')}
                    </Button>
                     <Button variant="outline" onClick={handleExportSelected}>
                       <Download className="h-4 w-4 mr-2" />
                       {t('financial.export')}
                    </Button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedTransactions.length > 0 && (
                  <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">
                      {selectedTransactions.length} transaction(s) selected
                    </span>
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Bulk action..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Mark as Completed</SelectItem>
                        <SelectItem value="failed">Mark as Failed</SelectItem>
                        <SelectItem value="cancelled">Mark as Cancelled</SelectItem>
                        <SelectItem value="delete">Delete Transactions</SelectItem>
                      </SelectContent>
                    </Select>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={!bulkAction}>
                          Apply Action
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to {bulkAction === 'delete' ? 'delete' : 'update'} {selectedTransactions.length} transaction(s)?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleBulkAction}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Transactions ({filteredTransactions.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                    onCheckedChange={selectAllTransactions}
                  />
                  <span className="text-sm">Select All</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="py-12 text-center">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                    <p className="text-muted-foreground">No transactions match your current filters</p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => {
                    const TypeIcon = getTypeIcon(transaction.type);
                    return (
                      <div key={transaction.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          checked={selectedTransactions.includes(transaction.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTransactions([...selectedTransactions, transaction.id]);
                            } else {
                              setSelectedTransactions(selectedTransactions.filter(id => id !== transaction.id));
                            }
                          }}
                        />
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-full">
                              <TypeIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">#{transaction.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">{transaction.type}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">
                              {transaction.user_profile?.full_name || transaction.user_profile?.company_name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-muted-foreground">{transaction.user_profile?.email}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm">{transaction.description || 'No description'}</p>
                            {transaction.transaction_ref && (
                              <p className="text-xs text-muted-foreground">Ref: {transaction.transaction_ref}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="font-medium">
                              {transaction.amount.toLocaleString()} {transaction.currency || 'SAR'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            {getStatusBadge(transaction.status)}
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setEditingTransaction(transaction)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Transaction Details</DialogTitle>
                                    <DialogDescription>
                                      View and manage transaction #{transaction.id.slice(0, 8)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Transaction ID</label>
                                        <p className="text-sm text-muted-foreground">{transaction.id}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Status</label>
                                        <div className="mt-1">
                                          <Select 
                                            value={transaction.status} 
                                            onValueChange={(value) => updateTransactionStatus(transaction.id, value as AdminFinancialTransaction['status'])}
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="pending">Pending</SelectItem>
                                              <SelectItem value="completed">Completed</SelectItem>
                                              <SelectItem value="failed">Failed</SelectItem>
                                              <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">User</label>
                                        <p className="text-sm text-muted-foreground">
                                          {transaction.user_profile?.full_name || transaction.user_profile?.company_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{transaction.user_profile?.email}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Type</label>
                                        <p className="text-sm text-muted-foreground">{transaction.type}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Amount</label>
                                        <p className="text-sm text-muted-foreground">
                                          {transaction.amount.toLocaleString()} {transaction.currency || 'SAR'}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Payment Method</label>
                                        <p className="text-sm text-muted-foreground">
                                          {transaction.payment_method || 'Not specified'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Created</label>
                                        <p className="text-sm text-muted-foreground">
                                          {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Reference</label>
                                        <p className="text-sm text-muted-foreground">
                                          {transaction.transaction_ref || 'No reference'}
                                        </p>
                                      </div>
                                    </div>
                                    {transaction.description && (
                                      <div>
                                        <label className="text-sm font-medium">Description</label>
                                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this transaction? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteTransaction(transaction.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageContainer>
  );
}
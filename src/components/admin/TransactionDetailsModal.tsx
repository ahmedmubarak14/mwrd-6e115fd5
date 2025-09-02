import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { 
  DollarSign, 
  Calendar, 
  User, 
  CreditCard, 
  Hash,
  Info,
  Download,
  RefreshCw
} from "lucide-react";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
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
      company_name?: string;
    } | null;
  } | null;
}

export const TransactionDetailsModal = ({ isOpen, onClose, transaction }: TransactionDetailsModalProps) => {
  const { t, isRTL, formatCurrency } = useLanguage();

  const formatDateTime = (date: string) => new Date(date).toLocaleString();

  if (!transaction) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'text-success';
      case 'refund': return 'text-destructive';
      case 'commission': return 'text-warning';
      case 'subscription': return 'text-info';
      default: return 'text-muted-foreground';
    }
  };

  const exportTransaction = () => {
    const csvContent = [
      ['Field', 'Value'],
      ['Transaction ID', transaction.id],
      ['Amount', `${transaction.amount} SAR`],
      ['Status', transaction.status],
      ['Type', transaction.type],
      ['Description', transaction.description],
      ['Payment Method', transaction.payment_method || 'N/A'],
      ['Reference', transaction.transaction_ref || 'N/A'],
      ['User', transaction.user_profiles?.full_name || 'Unknown'],
      ['Email', transaction.user_profiles?.email || 'N/A'],
      ['Company', transaction.user_profiles?.company_name || 'N/A'],
      ['Created', new Date(transaction.created_at).toLocaleString()],
      ['Updated', new Date(transaction.updated_at).toLocaleString()]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transaction-${transaction.id}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-2xl", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader className={cn(isRTL ? "text-right" : "text-left")}>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t('financial.transactionDetails')}
          </DialogTitle>
          <DialogDescription>
            {t('financial.transactionRef')}: {transaction.transaction_ref || transaction.id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Information */}
          <div className={cn("flex justify-between items-start", isRTL && "flex-row-reverse")}>
            <div className={cn("space-y-1", isRTL ? "text-right" : "text-left")}>
              <div className="text-2xl font-bold">
                {transaction.type === 'refund' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(transaction.status)}>
                  {t(`financial.${transaction.status}`)}
                </Badge>
                <span className={cn("text-sm font-medium", getTypeColor(transaction.type))}>
                  {t(`financial.${transaction.type}`)}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={exportTransaction}>
              <Download className="h-4 w-4 mr-2" />
              {t('common.export')}
            </Button>
          </div>

          <Separator />

          {/* Transaction Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                {t('financial.transactionDetails')}
              </h4>
              
              <div className="space-y-3">
                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <div className="text-sm font-medium">{t('common.id')}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {transaction.id}
                    </div>
                  </div>
                </div>

                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <div className="text-sm font-medium">{t('financial.amount')}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>

                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <div className="text-sm font-medium">{t('financial.paymentMethod')}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.payment_method || t('common.notSpecified')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                {t('user.userInformation')}
              </h4>
              
              <div className="space-y-3">
                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <div className="text-sm font-medium">{t('user.fullName')}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.user_profiles?.full_name || t('financial.unknownUser')}
                    </div>
                  </div>
                </div>

                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <div className="h-4 w-4 text-muted-foreground">@</div>
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <div className="text-sm font-medium">{t('user.email')}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.user_profiles?.email || t('financial.noEmail')}
                    </div>
                  </div>
                </div>

                {transaction.user_profiles?.company_name && (
                  <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                    <div className="h-4 w-4 text-muted-foreground">🏢</div>
                    <div className={cn(isRTL ? "text-right" : "text-left")}>
                      <div className="text-sm font-medium">{t('user.companyName')}</div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.user_profiles.company_name}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description and Timestamps */}
          <div className="space-y-4">
            <div className={cn(isRTL ? "text-right" : "text-left")}>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {t('common.description')}
              </h4>
              <p className="text-sm">{transaction.description || t('common.noDescription')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Calendar className="h-4 w-4" />
                <div>
                  <span className="font-medium">{t('common.created')}: </span>
                  {formatDateTime(transaction.created_at)}
                </div>
              </div>
              <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <RefreshCw className="h-4 w-4" />
                <div>
                  <span className="font-medium">{t('common.updated')}: </span>
                  {formatDateTime(transaction.updated_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
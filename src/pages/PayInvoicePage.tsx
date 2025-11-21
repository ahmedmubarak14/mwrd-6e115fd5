import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MoyasarCheckout } from '@/components/payment/MoyasarCheckout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FileText, Calendar, DollarSign, ArrowLeft } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  vendor_id: string;
  order_id: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status: string;
  due_date: string;
  paid_at?: string;
  created_at: string;
  orders: {
    id: string;
    title: string;
  };
  user_profiles: {
    company_name: string;
    full_name: string;
  };
}

export const PayInvoicePage = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const { isRTL, t } = useLanguage();
  const { userProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (invoiceId) {
      loadInvoice();
    }
  }, [invoiceId]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          orders:order_id (id, title),
          user_profiles:vendor_id (company_name, full_name)
        `)
        .eq('id', invoiceId)
        .eq('client_id', userProfile!.id)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error(t('payment.invoiceNotFound'));
      }

      // Check if already paid
      if (data.status === 'paid') {
        navigate(`/client/invoices/${invoiceId}`);
        return;
      }

      setInvoice(data);
    } catch (error: any) {
      console.error('Error loading invoice:', error);
      setError(error.message || t('payment.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Redirect to invoice details page
    navigate(`/client/invoices/${invoiceId}?payment=success`);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setError(error.message || 'Payment failed');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-900 dark:text-red-100 text-center">
              {error || t('payment.invoiceNotFound')}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/client/invoices')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('payment.backToInvoices')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOverdue = new Date(invoice.due_date) < new Date() && invoice.status !== 'paid';

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/client/invoices')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('payment.backToInvoices')}
        </Button>

        <h1 className="text-3xl font-bold mb-2">
          {t('payment.payInvoice')}
        </h1>
        <p className="text-muted-foreground">
          {t('payment.completePayment')}
        </p>
      </div>

      {/* Invoice Details */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {invoice.invoice_number}
            </CardTitle>
            <Badge variant={isOverdue ? 'destructive' : 'secondary'}>
              {isOverdue
                ? t('payment.overdue')
                : invoice.status}
            </Badge>
          </div>
          <CardDescription>
            {invoice.orders?.title || t('orders.title')} #{invoice.order_id.slice(0, 8)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t('payment.vendor')}
              </p>
              <p className="font-medium">
                {invoice.user_profiles?.company_name || invoice.user_profiles?.full_name || 'N/A'}
              </p>
            </div>

            {/* Due Date */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t('payment.dueDate')}
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                  {new Date(invoice.due_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="col-span-full border-t pt-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('payment.subtotal')}
                  </span>
                  <span>{invoice.amount.toLocaleString()} {invoice.currency}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('payment.taxAmount')}
                  </span>
                  <span>{invoice.tax_amount.toLocaleString()} {invoice.currency}</span>
                </div>

                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>{t('payment.total')}</span>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    <span>{invoice.total_amount.toLocaleString()} {invoice.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Checkout */}
      <MoyasarCheckout
        invoiceId={invoice.id}
        amount={invoice.total_amount}
        description={`${invoice.invoice_number} - ${invoice.orders?.title || t('orders.title')}`}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
};

export default PayInvoicePage;

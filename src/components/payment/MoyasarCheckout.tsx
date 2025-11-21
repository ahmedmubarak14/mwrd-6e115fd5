import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { moyasarService, MoyasarPaymentResponse } from '@/services/moyasarService';
import { CreditCard, Smartphone, Apple, CheckCircle, AlertCircle } from 'lucide-react';

interface MoyasarCheckoutProps {
  invoiceId: string;
  amount: number; // in SAR
  description: string;
  onSuccess?: (payment: MoyasarPaymentResponse) => void;
  onError?: (error: any) => void;
}

export const MoyasarCheckout = ({
  invoiceId,
  amount,
  description,
  onSuccess,
  onError,
}: MoyasarCheckoutProps) => {
  const { isRTL } = useLanguage();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [publishableKey, setPublishableKey] = useState<string>('');
  const [supportedMethods, setSupportedMethods] = useState<string[]>([]);

  useEffect(() => {
    initializePaymentGateway();
  }, []);

  const initializePaymentGateway = async () => {
    try {
      setLoading(true);

      // Get payment settings
      const { data: settings, error } = await supabase
        .from('payment_settings')
        .select('*')
        .eq('provider', 'moyasar')
        .eq('is_enabled', true)
        .single();

      if (error || !settings) {
        throw new Error('Payment gateway not configured');
      }

      const pubKey = settings.is_test_mode
        ? settings.publishable_key_test
        : settings.publishable_key_live;

      if (!pubKey) {
        throw new Error('Publishable key not configured');
      }

      setPublishableKey(pubKey);
      setSupportedMethods(settings.supported_payment_methods || ['creditcard']);

      // Create transaction record
      const { data: transactionResult, error: txError } = await supabase
        .rpc('create_payment_transaction', {
          p_invoice_id: invoiceId,
          p_amount: amount,
          p_description: description,
        });

      if (txError || !transactionResult?.success) {
        throw new Error(transactionResult?.error || 'Failed to create transaction');
      }

      // Initialize Moyasar checkout
      await moyasarService.initializeCheckout({
        amount,
        description,
        publishable_api_key: pubKey,
        callback_url: `${window.location.origin}/payment/callback`,
        methods: supportedMethods as any,
        metadata: {
          invoice_id: invoiceId,
          transaction_id: transactionResult.transaction_id,
          user_id: userProfile?.id,
        },
        on_completed: handlePaymentCompleted,
        on_failed: handlePaymentFailed,
      });
    } catch (error: any) {
      console.error('Failed to initialize payment gateway:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message || (isRTL ? 'فشل تهيئة بوابة الدفع' : 'Failed to initialize payment gateway'),
        variant: 'destructive',
      });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCompleted = async (payment: MoyasarPaymentResponse) => {
    try {
      setProcessing(true);

      // Update transaction in database
      const { error } = await supabase
        .from('payment_transactions')
        .update({
          moyasar_payment_id: payment.id,
          moyasar_status: payment.status,
          status: payment.status === 'paid' ? 'completed' : 'processing',
          payment_type: payment.source.type,
          card_brand: payment.source.company,
          card_last_four: payment.source.number,
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('invoice_id', invoiceId)
        .eq('user_id', userProfile!.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      // Update invoice status
      await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', invoiceId);

      setPaymentComplete(true);

      toast({
        title: isRTL ? 'تمت العملية بنجاح' : 'Payment Successful',
        description: isRTL
          ? `تم دفع ${moyasarService.formatAmount(payment.amount)} ر.س بنجاح`
          : `Successfully paid ${moyasarService.formatAmount(payment.amount)} SAR`,
      });

      if (onSuccess) onSuccess(payment);
    } catch (error: any) {
      console.error('Failed to update payment status:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل تحديث حالة الدفع' : 'Failed to update payment status',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentFailed = async (error: any) => {
    try {
      // Update transaction as failed
      await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          failure_reason: error.message || 'Payment failed',
          updated_at: new Date().toISOString(),
        })
        .eq('invoice_id', invoiceId)
        .eq('user_id', userProfile!.id)
        .order('created_at', { ascending: false })
        .limit(1);

      toast({
        title: isRTL ? 'فشل الدفع' : 'Payment Failed',
        description: error.message || (isRTL ? 'فشلت عملية الدفع' : 'Payment failed'),
        variant: 'destructive',
      });

      if (onError) onError(error);
    } catch (updateError) {
      console.error('Failed to update failed payment:', updateError);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (paymentComplete) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
              {isRTL ? 'تمت العملية بنجاح!' : 'Payment Successful!'}
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mt-2">
              {isRTL
                ? 'تم استلام دفعتك وسيتم معالجة طلبك قريباً'
                : 'Your payment has been received and your order will be processed soon'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{isRTL ? 'ملخص الدفع' : 'Payment Summary'}</span>
            <Badge variant="outline" className="text-lg">
              {amount.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}
            </Badge>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'طرق الدفع المتاحة' : 'Available Payment Methods'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {supportedMethods.includes('creditcard') && (
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors">
                <CreditCard className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">
                  {isRTL ? 'بطاقة ائتمان' : 'Credit Card'}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Visa, Mastercard, Mada
                </span>
              </div>
            )}

            {supportedMethods.includes('applepay') && (
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors">
                <Apple className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Apple Pay</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'دفع سريع وآمن' : 'Fast & Secure'}
                </span>
              </div>
            )}

            {supportedMethods.includes('stcpay') && (
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors">
                <Smartphone className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">STC Pay</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'الدفع عبر stc' : 'Pay with STC'}
                </span>
              </div>
            )}
          </div>

          {/* Moyasar Checkout Form */}
          <div className="moyasar-form" />

          {processing && (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-muted-foreground">
                {isRTL ? 'جاري معالجة الدفع...' : 'Processing payment...'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-medium mb-1">
              {isRTL ? 'دفع آمن ومشفر' : 'Secure & Encrypted Payment'}
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              {isRTL
                ? 'جميع المعاملات محمية بتشفير SSL. لا نقوم بتخزين بيانات بطاقتك.'
                : 'All transactions are protected with SSL encryption. We never store your card details.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

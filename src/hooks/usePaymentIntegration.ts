import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

export const usePaymentIntegration = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createCheckoutSession = async (paymentData: PaymentData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a payment",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    
    try {
      // Call the create-checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          metadata: paymentData.metadata
        }
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const processOfferPayment = async (offerId: string, amount: number) => {
    const paymentData: PaymentData = {
      amount,
      currency: 'SAR',
      description: `Payment for offer ${offerId}`,
      metadata: {
        offer_id: offerId,
        user_id: user?.id
      }
    };

    const result = await createCheckoutSession(paymentData);
    
    if (result?.url) {
      // Record the transaction attempt
      await supabase.from('financial_transactions').insert({
        user_id: user?.id,
        amount,
        description: `Payment for offer ${offerId}`,
        type: 'payment',
        status: 'pending',
        metadata: { offer_id: offerId }
      });

      // Redirect to checkout
      window.location.href = result.url;
    }

    return result;
  };

  const processSubscriptionPayment = async (planId: string, planName: string, amount: number, billingPeriod: 'monthly' | 'yearly') => {
    const paymentData: PaymentData = {
      amount,
      currency: 'SAR',
      description: `${planName} subscription (${billingPeriod})`,
      metadata: {
        plan_id: planId,
        plan_name: planName,
        billing_period: billingPeriod,
        user_id: user?.id
      }
    };

    const result = await createCheckoutSession(paymentData);
    
    if (result?.url) {
      // Record the transaction attempt
      await supabase.from('financial_transactions').insert({
        user_id: user?.id,
        amount,
        description: `${planName} subscription`,
        type: 'subscription',
        status: 'pending',
        metadata: { plan_id: planId, billing_period: billingPeriod }
      });

      // Redirect to checkout
      window.location.href = result.url;
    }

    return result;
  };

  const getTransactionHistory = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  };

  return {
    loading,
    createCheckoutSession,
    processOfferPayment,
    processSubscriptionPayment,
    getTransactionHistory
  };
};
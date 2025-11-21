import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getTranslation } from '@/constants/translations';

export interface PaymentMethod {
  id: string;
  user_id: string;
  moyasar_token?: string;
  card_brand?: string;
  card_last_four?: string;
  card_name?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  invoice_id?: string;
  order_id?: string;
  moyasar_payment_id?: string;
  moyasar_status?: string;
  amount: number;
  currency: string;
  description?: string;
  payment_type?: string;
  card_brand?: string;
  card_last_four?: string;
  status: string;
  failure_reason?: string;
  refunded_amount?: number;
  refund_reason?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentStatistics {
  success: boolean;
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  refunded_transactions: number;
  total_amount: number;
  total_refunded: number;
  avg_transaction_amount: number;
  success_rate: number;
}

export const usePayments = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Get translation function - defaults to 'en' for hooks
  const t = (key: string) => getTranslation(key, 'en');

  /**
   * Get user's payment methods
   */
  const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userProfile!.id)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: t('payment.error'),
        description: t('payment.failedToLoadMethods'),
        variant: 'destructive',
      });
      return [];
    }
  };

  /**
   * Add a new payment method
   */
  const addPaymentMethod = async (params: {
    moyasar_token: string;
    card_brand: string;
    card_last_four: string;
    card_name: string;
    is_default?: boolean;
  }): Promise<PaymentMethod | null> => {
    try {
      setLoading(true);

      // If this is set as default, unset others
      if (params.is_default) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', userProfile!.id);
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .insert([{
          user_id: userProfile!.id,
          payment_type: 'card',
          provider: 'moyasar',
          ...params,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: t('payment.success'),
        description: t('payment.paymentMethodAdded'),
      });

      return data;
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      toast({
        title: t('payment.error'),
        description: error.message || t('payment.failedToAddMethod'),
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Set default payment method
   */
  const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Unset all defaults
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userProfile!.id);

      // Set new default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', paymentMethodId)
        .eq('user_id', userProfile!.id);

      if (error) throw error;

      toast({
        title: t('payment.success'),
        description: t('payment.paymentMethodUpdated'),
      });

      return true;
    } catch (error: any) {
      console.error('Error setting default payment method:', error);
      toast({
        title: t('payment.error'),
        description: t('payment.failedToUpdateMethod'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete payment method
   */
  const deletePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethodId)
        .eq('user_id', userProfile!.id);

      if (error) throw error;

      toast({
        title: t('payment.success'),
        description: t('payment.paymentMethodRemoved'),
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting payment method:', error);
      toast({
        title: t('payment.error'),
        description: t('payment.failedToRemoveMethod'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get payment transactions
   */
  const getTransactions = async (filters?: {
    status?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
  }): Promise<PaymentTransaction[]> => {
    try {
      let query = supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', userProfile!.id)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.start_date) {
        query = query.gte('created_at', filters.start_date);
      }

      if (filters?.end_date) {
        query = query.lte('created_at', filters.end_date);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: t('payment.error'),
        description: t('payment.failedToLoadTransactions'),
        variant: 'destructive',
      });
      return [];
    }
  };

  /**
   * Get payment statistics
   */
  const getStatistics = async (params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<PaymentStatistics | null> => {
    try {
      const { data, error } = await supabase.rpc('get_payment_statistics', {
        p_user_id: userProfile!.id,
        p_start_date: params?.start_date || null,
        p_end_date: params?.end_date || null,
      });

      if (error) throw error;
      return data as unknown as PaymentStatistics;
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
      toast({
        title: t('payment.error'),
        description: t('payment.failedToLoadStatistics'),
        variant: 'destructive',
      });
      return null;
    }
  };

  /**
   * Request refund (admin only)
   */
  const requestRefund = async (params: {
    transaction_id: string;
    amount: number;
    reason: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('process_refund', {
        p_transaction_id: params.transaction_id,
        p_amount: params.amount,
        p_reason: params.reason,
      });

      const result = data as { success: boolean; error?: string };

      if (error || !result?.success) {
        throw new Error(result?.error || t('payment.failedToProcessRefund'));
      }

      toast({
        title: t('payment.success'),
        description: t('payment.refundProcessed'),
      });

      return true;
    } catch (error: any) {
      console.error('Error processing refund:', error);
      toast({
        title: t('payment.error'),
        description: error.message || t('payment.failedToProcessRefund'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getPaymentMethods,
    addPaymentMethod,
    setDefaultPaymentMethod,
    deletePaymentMethod,
    getTransactions,
    getStatistics,
    requestRefund,
  };
};

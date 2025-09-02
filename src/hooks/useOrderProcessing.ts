import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  offer_id?: string;
  request_id: string;
  client_id: string;
  vendor_id: string;
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
  delivery_date?: string;
  completion_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useOrderProcessing = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`client_id.eq.${user.id},vendor_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Exclude<Order['status'], 'disputed'>, notes?: string) => {
    try {
      setLoading(true);
      const updateData: any = { status, updated_at: new Date().toISOString() };
      
      if (notes) updateData.notes = notes;
      if (status === 'completed') updateData.completion_date = new Date().toISOString();

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders(); // Refresh orders
      
      toast({
        title: 'Success',
        description: `Order status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, 'confirmed');
  };

  const startProgress = async (orderId: string) => {
    await updateOrderStatus(orderId, 'in_progress');
  };

  const markDelivered = async (orderId: string, notes?: string) => {
    await updateOrderStatus(orderId, 'delivered', notes);
  };

  const completeOrder = async (orderId: string, notes?: string) => {
    await updateOrderStatus(orderId, 'completed', notes);
  };

  const cancelOrder = async (orderId: string, reason?: string) => {
    await updateOrderStatus(orderId, 'cancelled', reason);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    confirmOrder,
    startProgress,
    markDelivered,
    completeOrder,
    cancelOrder,
    refreshOrders: fetchOrders
  };
};
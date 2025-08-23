import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Order {
  id: string;
  title: string;
  client: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
  description: string;
  category: string;
  client_id: string;
  vendor_id: string;
  request_id: string;
  delivery_date?: string;
  completion_date?: string;
  notes?: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, userProfile } = useAuth();

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          client:user_profiles!orders_client_id_fkey(full_name, company_name),
          vendor:user_profiles!orders_vendor_id_fkey(full_name, company_name),
          request:requests(title, category)
        `)
        .order('created_at', { ascending: false });

      // Filter based on user role
      if (userProfile?.role === 'client') {
        query = query.eq('client_id', user.id);
      } else if (userProfile?.role === 'vendor') {
        query = query.eq('vendor_id', user.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const transformedOrders: Order[] = (data || []).map(order => ({
        id: order.id,
        title: order.title || order.request?.title || 'Order',
        client: order.client?.company_name || order.client?.full_name || 'Unknown Client',
        amount: Number(order.amount) || 0,
        currency: 'SAR',
        status: (['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const).includes(order.status as any) 
          ? order.status as Order['status'] 
          : 'pending',
        date: new Date(order.created_at).toISOString().split('T')[0],
        description: order.description || order.notes || '',
        category: order.request?.category || 'General',
        client_id: order.client_id,
        vendor_id: order.vendor_id,
        request_id: order.request_id,
        delivery_date: order.delivery_date,
        completion_date: order.completion_date,
        notes: order.notes
      }));

      setOrders(transformedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          ...(newStatus === 'completed' && { completion_date: new Date().toISOString() })
        })
        .eq('id', orderId);

      if (error) throw error;
      
      // Refresh orders after update
      await fetchOrders();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  };

  const generateInvoice = async (orderId: string) => {
    // This would integrate with a real invoicing system
    // For now, we'll just simulate the action
    try {
      // Could create an invoice record in the database
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          user_id: user?.id,
          order_id: orderId,
          amount: 0,
          type: 'invoice_generated',
          status: 'pending',
          description: 'Invoice generated for order'
        });

      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Error generating invoice:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, userProfile]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    generateInvoice
  };
};
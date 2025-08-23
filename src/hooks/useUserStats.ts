import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserStats {
  clientRating: number;
  suppliersConnected: number;
  totalEarnings: number;
  activeOffers: number;
  totalRequests: number;
  pendingOffers: number;
  successRate: number;
  completedOrders: number;
  responseTime: number;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, userProfile } = useAuth();

  const fetchUserStats = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userId = user.id;
      const isVendor = userProfile?.role === 'vendor';
      const isClient = userProfile?.role === 'client';

      let stats: Partial<UserStats> = {};

      if (isVendor) {
        // Vendor stats
        const [offersResult, ordersResult, conversationsResult, transactionsResult] = await Promise.all([
          // Active offers count
          supabase
            .from('offers')
            .select('id')
            .eq('vendor_id', userId)
            .in('status', ['pending', 'accepted']),
          
          // Completed orders and success rate
          supabase
            .from('orders')
            .select('id, status, amount')
            .eq('vendor_id', userId),
          
          // Connected clients (unique conversations)
          supabase
            .from('conversations')
            .select('client_id')
            .eq('vendor_id', userId),
          
          // Total earnings
          supabase
            .from('financial_transactions')
            .select('amount')
            .eq('user_id', userId)
            .eq('status', 'completed')
        ]);

        const totalOrders = ordersResult.data?.length || 0;
        const completedOrders = ordersResult.data?.filter(o => o.status === 'completed').length || 0;
        const totalEarnings = transactionsResult.data?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
        const uniqueClients = new Set(conversationsResult.data?.map(c => c.client_id) || []).size;

        // Calculate rating from completed orders (simplified - in real app would have rating system)
        const rating = completedOrders > 0 ? Math.min(4.9, 3.5 + (completedOrders / 10)) : 0;

        stats = {
          activeOffers: offersResult.data?.length || 0,
          totalEarnings,
          successRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
          clientRating: Math.round(rating * 10) / 10,
          suppliersConnected: uniqueClients,
          completedOrders,
          responseTime: 2.1 // Simplified - would calculate from message timestamps
        };

      } else if (isClient) {
        // Client stats
        const [requestsResult, offersResult, conversationsResult] = await Promise.all([
          // Total requests
          supabase
            .from('requests')
            .select('id')
            .eq('client_id', userId),
          
          // Pending offers (offers on client's requests)
          supabase
            .from('offers')
            .select('id, request_id')
            .eq('status', 'pending')
            .in('request_id', []),
          
          // Connected suppliers (unique conversations)
          supabase
            .from('conversations')
            .select('vendor_id')
            .eq('client_id', userId)
        ]);

        const uniqueSuppliers = new Set(conversationsResult.data?.map(c => c.vendor_id) || []).size;

        stats = {
          totalRequests: requestsResult.data?.length || 0,
          pendingOffers: offersResult.data?.length || 0,
          suppliersConnected: uniqueSuppliers,
          responseTime: 1.8 // Simplified
        };
      }

      setStats(stats as UserStats);
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [user, userProfile]);

  return {
    stats,
    loading,
    error,
    fetchUserStats
  };
};
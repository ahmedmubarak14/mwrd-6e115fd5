import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface OptimizedVendorStats {
  totalOffers: number;
  activeOffers: number;
  totalEarnings: number;
  monthlyEarnings: number;
  successRate: number;
  averageResponseTime: number;
  profileCompletion: number;
  crStatus: 'pending' | 'approved' | 'rejected' | 'unverified';
  completedProjects: number;
  clientSatisfaction: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    date: string;
  }>;
  offerTrends: Array<{
    date: string;
    offers: number;
  }>;
}

const calculateProfileCompletion = (profile: any): number => {
  if (!profile) return 0;
  
  const requiredFields = [
    'full_name',
    'company_name', 
    'phone',
    'categories',
    'bio',
    'avatar_url'
  ];
  
  const completedFields = requiredFields.filter(field => {
    const value = profile[field];
    if (Array.isArray(value)) return value.length > 0;
    return value && value.toString().trim() !== '';
  });
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
};

export const useOptimizedVendorStats = () => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<OptimizedVendorStats>({
    totalOffers: 0,
    activeOffers: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    successRate: 0,
    averageResponseTime: 0,
    profileCompletion: 0,
    crStatus: 'unverified',
    completedProjects: 0,
    clientSatisfaction: 0,
    recentActivity: [],
    offerTrends: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorStats = useCallback(async () => {
    if (!userProfile?.user_id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel for better performance
      const [offersResult, ordersResult, activityResult] = await Promise.all([
        supabase
          .from('offers')
          .select('id, price, client_approval_status, created_at')
          .eq('vendor_id', userProfile.user_id),
        
        supabase
          .from('orders')
          .select('id, amount, status, completion_date, created_at')
          .eq('vendor_id', userProfile.user_id),
        
        supabase
          .from('activity_feed')
          .select('id, activity_type, description, created_at')
          .eq('user_id', userProfile.user_id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      if (offersResult.error) throw offersResult.error;
      if (ordersResult.error) throw ordersResult.error;
      if (activityResult.error) throw activityResult.error;

      const offers = offersResult.data || [];
      const orders = ordersResult.data || [];
      const activities = activityResult.data || [];

      // Calculate stats
      const totalOffers = offers.length;
      const activeOffers = offers.filter(o => o.client_approval_status === 'pending').length;
      const approvedOffers = offers.filter(o => o.client_approval_status === 'approved').length;
      const successRate = totalOffers > 0 ? Math.round((approvedOffers / totalOffers) * 100) : 0;

      const completedOrders = orders.filter(o => o.status === 'completed');
      const totalEarnings = completedOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyEarnings = completedOrders
        .filter(order => {
          const orderDate = new Date(order.completion_date || order.created_at);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        })
        .reduce((sum, order) => sum + (order.amount || 0), 0);

      const profileCompletion = calculateProfileCompletion(userProfile);
      const crStatus = userProfile.verification_status || 'unverified';

      // Generate offer trends for the last 7 days
      const offerTrends = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dateStr = date.toLocaleDateString();
        
        const dayOffers = offers.filter(offer => {
          const offerDate = new Date(offer.created_at);
          return offerDate.toDateString() === date.toDateString();
        }).length;

        return {
          date: dateStr,
          offers: dayOffers
        };
      });

      // Format recent activity
      const recentActivity = activities.map(activity => ({
        id: activity.id,
        type: activity.activity_type,
        description: activity.description,
        date: new Date(activity.created_at).toLocaleDateString()
      }));

      setStats({
        totalOffers,
        activeOffers,
        totalEarnings,
        monthlyEarnings,
        successRate,
        averageResponseTime: 2.5, // Mock data - would need calculation
        profileCompletion,
        crStatus: crStatus as OptimizedVendorStats['crStatus'],
        completedProjects: completedOrders.length,
        clientSatisfaction: 4.2, // Mock data - would need ratings system
        recentActivity,
        offerTrends
      });

    } catch (err) {
      console.error('Error fetching vendor stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vendor statistics');
    } finally {
      setLoading(false);
    }
  }, [userProfile?.user_id]);

  const refetch = useCallback(() => {
    fetchVendorStats();
  }, [fetchVendorStats]);

  useEffect(() => {
    fetchVendorStats();
  }, [fetchVendorStats]);

  // Memoize the return value to prevent unnecessary re-renders
  const memoizedReturn = useMemo(() => ({
    stats,
    loading,
    error,
    refetch
  }), [stats, loading, error, refetch]);

  return memoizedReturn;
};
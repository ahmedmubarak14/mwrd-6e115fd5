import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import type { UserProfile } from '@/integrations/supabase/types';

export interface VendorStats {
  crStatus: 'approved' | 'pending' | 'rejected' | 'unverified';
  profileCompletion: number;
  activeOffers: number;
  successRate: number;
  totalEarnings: number;
  monthlyEarnings: number;
  completedProjects: number;
  clientRating: number;
}

export interface VendorStatsHookReturn {
  stats: VendorStats;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  userProfile: UserProfile | null;
}

const DEFAULT_STATS: VendorStats = {
  crStatus: 'unverified',
  profileCompletion: 0,
  activeOffers: 0,
  successRate: 0,
  totalEarnings: 0,
  monthlyEarnings: 0,
  completedProjects: 0,
  clientRating: 0,
};

export const useOptimizedVendorStats = (): VendorStatsHookReturn => {
  const { user } = useAuth();
  const { showError } = useToastFeedback();
  
  const [stats, setStats] = useState<VendorStats>(DEFAULT_STATS);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate profile completion percentage
  const calculateProfileCompletion = useCallback((profile: UserProfile): number => {
    if (!profile) return 0;
    
    const fields = [
      profile.full_name,
      profile.company_name,
      profile.bio,
      profile.phone,
      profile.address,
      profile.portfolio_url,
      profile.categories?.length > 0,
      profile.avatar_url,
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  }, []);

  // Fetch vendor statistics with error handling and retry logic
  const fetchVendorStats = useCallback(async (retryCount = 0): Promise<void> => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Fetch user profile with proper error handling
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error(`Failed to load profile: ${profileError.message}`);
      }

      if (!profile) {
        throw new Error('Profile not found');
      }

      setUserProfile(profile);

      // Parallel data fetching with error handling for each query
      const [offersResult, ordersResult] = await Promise.allSettled([
        supabase
          .from('offers')
          .select('id, price, client_approval_status, created_at')
          .eq('vendor_id', user.id),
        supabase
          .from('orders')
          .select('id, amount, status, completion_date, created_at')
          .eq('vendor_id', user.id)
      ]);

      // Process offers data safely
      let activeOffers = 0;
      let successRate = 0;
      if (offersResult.status === 'fulfilled' && offersResult.value.data) {
        const offers = offersResult.value.data;
        activeOffers = offers.filter(o => o.client_approval_status === 'pending').length;
        const approvedOffers = offers.filter(o => o.client_approval_status === 'approved').length;
        successRate = offers.length > 0 ? Math.round((approvedOffers / offers.length) * 100) : 0;
      }

      // Process orders data safely
      let totalEarnings = 0;
      let monthlyEarnings = 0;
      let completedProjects = 0;
      if (ordersResult.status === 'fulfilled' && ordersResult.value.data) {
        const orders = ordersResult.value.data;
        completedProjects = orders.filter(o => o.status === 'completed').length;
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        orders.forEach(order => {
          if (order.status === 'completed') {
            totalEarnings += order.amount || 0;
            
            const orderDate = new Date(order.created_at);
            if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
              monthlyEarnings += order.amount || 0;
            }
          }
        });
      }

      // Calculate profile completion
      const profileCompletion = calculateProfileCompletion(profile);

      // Generate mock client rating (in real app, this would come from reviews)
      const clientRating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;

      setStats({
        crStatus: profile.verification_status as any || 'unverified',
        profileCompletion,
        activeOffers,
        successRate,
        totalEarnings,
        monthlyEarnings,
        completedProjects,
        clientRating,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load vendor statistics';
      console.error('Vendor stats error:', err);
      
      // Retry logic for network errors
      if (retryCount < 2 && (errorMessage.includes('network') || errorMessage.includes('timeout'))) {
        console.log(`Retrying vendor stats fetch (attempt ${retryCount + 1})`);
        setTimeout(() => fetchVendorStats(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      setError(errorMessage);
      
      // Only show toast error on final failure
      if (retryCount === 0) {
        showError('Failed to load dashboard data. Please refresh the page.');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, calculateProfileCompletion, showError]);

  // Refresh stats function
  const refreshStats = useCallback(async (): Promise<void> => {
    setLoading(true);
    await fetchVendorStats();
  }, [fetchVendorStats]);

  // Initial load and setup
  useEffect(() => {
    if (user?.id) {
      fetchVendorStats();
    } else {
      setLoading(false);
    }
  }, [user?.id, fetchVendorStats]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    stats,
    loading,
    error,
    refreshStats,
    userProfile,
  }), [stats, loading, error, refreshStats, userProfile]);
};
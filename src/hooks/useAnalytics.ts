import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AnalyticsData {
  totalRequests?: number;
  totalOffers?: number;
  acceptedOffers?: number;
  completedRequests?: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
  successRate?: number;
  clientSatisfaction?: number;
  responseTime?: number;
  growth?: {
    requests: number;
    offers: number;
    revenue: number;
  };
}

export const useAnalytics = (dateRange = 30) => {
  const [data, setData] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userProfile } = useAuth();

  const fetchAnalytics = async () => {
    if (!user || !userProfile) return;
    
    setLoading(true);
    setError(null);

    try {
      const endDate = new Date();
      const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);
      
      const prevStartDate = new Date(startDate.getTime() - dateRange * 24 * 60 * 60 * 1000);

      // Fetch current period data
      const [requestsResult, offersResult, revenueResult] = await Promise.all([
        // Requests query
        supabase
          .from('requests')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Offers query (for suppliers)
        userProfile.role === 'supplier' 
          ? supabase
              .from('offers')
              .select('*')
              .eq('supplier_id', user.id)
              .gte('created_at', startDate.toISOString())
              .lte('created_at', endDate.toISOString())
          : { data: [], error: null },
        
        // Revenue query (mock for now - would come from financial_transactions)
        supabase
          .from('financial_transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('status', 'succeeded')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      ]);

      // Fetch previous period for growth calculation
      const [prevRequestsResult, prevOffersResult, prevRevenueResult] = await Promise.all([
        supabase
          .from('requests')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', prevStartDate.toISOString())
          .lt('created_at', startDate.toISOString()),
        
        userProfile.role === 'supplier' 
          ? supabase
              .from('offers')
              .select('*')
              .eq('supplier_id', user.id)
              .gte('created_at', prevStartDate.toISOString())
              .lt('created_at', startDate.toISOString())
          : { data: [], error: null },
        
        supabase
          .from('financial_transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('status', 'succeeded')
          .gte('created_at', prevStartDate.toISOString())
          .lt('created_at', startDate.toISOString())
      ]);

      if (requestsResult.error) throw requestsResult.error;
      if (offersResult.error) throw offersResult.error;
      if (revenueResult.error) throw revenueResult.error;

      const requests = requestsResult.data || [];
      const offers = offersResult.data || [];
      const transactions = revenueResult.data || [];
      
      const prevRequests = prevRequestsResult.data || [];
      const prevOffers = prevOffersResult.data || [];
      const prevTransactions = prevRevenueResult.data || [];

      // Calculate analytics
      const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const prevTotalRevenue = prevTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const acceptedOffers = offers.filter(o => o.client_approval_status === 'approved').length;
      const completedRequests = requests.filter(r => r.status === 'completed').length;
      
      // Calculate growth rates
      const requestsGrowth = prevRequests.length > 0 
        ? ((requests.length - prevRequests.length) / prevRequests.length) * 100 
        : 0;
      
      const offersGrowth = prevOffers.length > 0 
        ? ((offers.length - prevOffers.length) / prevOffers.length) * 100 
        : 0;
      
      const revenueGrowth = prevTotalRevenue > 0 
        ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 
        : 0;

      setData({
        totalRequests: requests.length,
        totalOffers: offers.length,
        acceptedOffers,
        completedRequests,
        totalRevenue,
        monthlyRevenue: totalRevenue, // Same for this period
        successRate: offers.length > 0 ? (acceptedOffers / offers.length) * 100 : 0,
        clientSatisfaction: 92, // Mock data - would come from ratings
        responseTime: 68, // Mock data - would be calculated from response times
        growth: {
          requests: requestsGrowth,
          offers: offersGrowth,
          revenue: revenueGrowth
        }
      });

    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user, userProfile, dateRange]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics
  };
};
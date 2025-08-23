import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  total_users: number;
  total_requests: number;
  total_offers: number;
  totalRequests: number;
  totalOffers: number;
  acceptedOffers: number;
  completedRequests: number;
  successRate: number;
  totalRevenue: number;
  clientSatisfaction: number;
  responseTime: number;
  active_users: number;
  revenue: number;
  period: string;
  growth: {
    requests: number;
    offers: number;
    revenue: number;
  };
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch real analytics data from Supabase
      const { data: analyticsData, error: analyticsError } = await supabase
        .rpc('get_analytics_data');

      if (analyticsError) throw analyticsError;

      const baseData = analyticsData?.[0] || {
        total_users: 0,
        total_requests: 0,
        total_offers: 0,
        total_orders: 0,
        active_users: 0,
        total_revenue: 0,
        success_rate: 0
      };

      // Get additional metrics
      const { data: acceptedOffers } = await supabase
        .from('offers')
        .select('id')
        .eq('status', 'accepted');

      const { data: completedOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('status', 'completed');

      // Calculate growth metrics by comparing with previous period
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const [currentPeriodRequests, previousPeriodRequests, currentPeriodOffers, previousPeriodOffers] = await Promise.all([
        supabase.from('requests').select('id').gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('requests').select('id').gte('created_at', sixtyDaysAgo.toISOString()).lt('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('offers').select('id').gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('offers').select('id').gte('created_at', sixtyDaysAgo.toISOString()).lt('created_at', thirtyDaysAgo.toISOString())
      ]);

      const requestsGrowth = previousPeriodRequests.data?.length 
        ? Math.round(((currentPeriodRequests.data?.length || 0) - (previousPeriodRequests.data?.length || 0)) / (previousPeriodRequests.data?.length) * 100)
        : 0;

      const offersGrowth = previousPeriodOffers.data?.length 
        ? Math.round(((currentPeriodOffers.data?.length || 0) - (previousPeriodOffers.data?.length || 0)) / (previousPeriodOffers.data?.length) * 100)
        : 0;

      // Calculate revenue growth from financial transactions
      const [currentRevenue, previousRevenue] = await Promise.all([
        supabase.from('financial_transactions').select('amount').eq('status', 'completed').gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('financial_transactions').select('amount').eq('status', 'completed').gte('created_at', sixtyDaysAgo.toISOString()).lt('created_at', thirtyDaysAgo.toISOString())
      ]);

      const currentRevenueTotal = currentRevenue.data?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
      const previousRevenueTotal = previousRevenue.data?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
      
      const revenueGrowth = previousRevenueTotal > 0 
        ? Math.round(((currentRevenueTotal - previousRevenueTotal) / previousRevenueTotal) * 100)
        : 0;

      const analyticsResult: AnalyticsData = {
        total_users: Number(baseData.total_users) || 0,
        total_requests: Number(baseData.total_requests) || 0,
        total_offers: Number(baseData.total_offers) || 0,
        totalRequests: Number(baseData.total_requests) || 0,
        totalOffers: Number(baseData.total_offers) || 0,
        acceptedOffers: acceptedOffers?.length || 0,
        completedRequests: completedOrders?.length || 0,
        successRate: Number(baseData.success_rate) || 0,
        totalRevenue: Number(baseData.total_revenue) || 0,
        clientSatisfaction: 0, // Will be calculated from order reviews
        responseTime: 0, // Will be calculated from message timestamps
        active_users: Number(baseData.active_users) || 0,
        revenue: Number(baseData.total_revenue) || 0,
        period: 'Last 30 Days',
        growth: {
          requests: requestsGrowth,
          offers: offersGrowth,
          revenue: revenueGrowth
        }
      };

      setAnalytics(analyticsResult);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics
  };
};
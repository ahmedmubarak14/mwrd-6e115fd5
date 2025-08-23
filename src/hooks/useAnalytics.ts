import { useState, useEffect } from 'react';

export interface AnalyticsData {
  total_users: number;
  total_requests: number;
  total_offers: number;
  totalRequests: number;  // Add camelCase versions
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

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Mock analytics data since we don't have analytics tables
      const mockAnalytics: AnalyticsData = {
        total_users: 150,
        total_requests: 89,
        total_offers: 234,
        totalRequests: 89,
        totalOffers: 234,
        acceptedOffers: 156,
        completedRequests: 72,
        successRate: 67,
        totalRevenue: 125000,
        clientSatisfaction: 4.5,
        responseTime: 2.3,
        active_users: 45,
        revenue: 125000,
        period: 'This Month',
        growth: {
          requests: 15,
          offers: 22,
          revenue: 18
        }
      };

      setAnalytics(mockAnalytics);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
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
    fetchAnalytics
  };
};
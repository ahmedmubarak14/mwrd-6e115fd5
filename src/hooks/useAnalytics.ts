import { useState, useEffect } from 'react';

export interface AnalyticsData {
  total_users: number;
  total_requests: number;
  total_offers: number;
  active_users: number;
  revenue: number;
  period: string;
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
        active_users: 45,
        revenue: 125000,
        period: 'This Month'
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
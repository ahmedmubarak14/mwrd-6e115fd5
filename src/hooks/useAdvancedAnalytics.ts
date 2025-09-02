import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AdvancedAnalyticsData {
  kpiMetrics: {
    revenue_growth_rate: number;
    customer_acquisition_cost: number;
    customer_lifetime_value: number;
    churn_rate: number;
    market_penetration: number;
    efficiency_score: number;
  };
  cohortAnalysis: Array<{
    cohort_month: string;
    users_count: number;
    retention_rates: number[];
  }>;
  funnelAnalysis: {
    stages: Array<{ name: string; users: number; conversion_rate: number }>;
    overall_conversion: number;
  };
  segmentation: Array<{
    segment_name: string;
    user_count: number;
    revenue_contribution: number;
    avg_order_value: number;
  }>;
  competitiveAnalysis: {
    market_share: number;
    price_positioning: 'premium' | 'competitive' | 'budget';
    feature_comparison: Array<{ feature: string; us: boolean; competitors: number }>;
  };
}

export const useAdvancedAnalytics = (userRole?: string) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AdvancedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvancedAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Call edge function for advanced analytics computation
      const { data, error } = await supabase.functions.invoke('compute-advanced-analytics', {
        body: { 
          user_id: user.id, 
          user_role: userRole,
          analysis_type: 'comprehensive' 
        }
      });
      
      if (error) throw error;
      
      setAnalytics(data);
    } catch (error: any) {
      console.error('Error fetching advanced analytics:', error);
      setError(error.message);
      
      // Fallback mock data
      setAnalytics({
        kpiMetrics: {
          revenue_growth_rate: 23.5,
          customer_acquisition_cost: 150,
          customer_lifetime_value: 2500,
          churn_rate: 5.2,
          market_penetration: 12.8,
          efficiency_score: 87.3
        },
        cohortAnalysis: [
          { 
            cohort_month: '2024-01',
            users_count: 120,
            retention_rates: [100, 85, 72, 68, 65, 62]
          },
          {
            cohort_month: '2024-02', 
            users_count: 150,
            retention_rates: [100, 88, 75, 71, 68]
          },
          {
            cohort_month: '2024-03',
            users_count: 180,
            retention_rates: [100, 90, 78, 74]
          }
        ],
        funnelAnalysis: {
          stages: [
            { name: 'Visitors', users: 5000, conversion_rate: 100 },
            { name: 'Signups', users: 1200, conversion_rate: 24 },
            { name: 'Active Users', users: 800, conversion_rate: 16 },
            { name: 'Paying Customers', users: 350, conversion_rate: 7 },
            { name: 'Recurring Customers', users: 280, conversion_rate: 5.6 }
          ],
          overall_conversion: 5.6
        },
        segmentation: [
          {
            segment_name: 'Enterprise Clients',
            user_count: 45,
            revenue_contribution: 65,
            avg_order_value: 25000
          },
          {
            segment_name: 'SMB Clients',
            user_count: 180,
            revenue_contribution: 30,
            avg_order_value: 3500
          },
          {
            segment_name: 'Individual Clients',
            user_count: 320,
            revenue_contribution: 5,
            avg_order_value: 850
          }
        ],
        competitiveAnalysis: {
          market_share: 15.7,
          price_positioning: 'competitive',
          feature_comparison: [
            { feature: 'Real-time Analytics', us: true, competitors: 2 },
            { feature: 'AI Predictions', us: true, competitors: 1 },
            { feature: 'Advanced Reporting', us: true, competitors: 4 },
            { feature: 'Mobile App', us: false, competitors: 3 },
            { feature: 'API Integration', us: true, competitors: 5 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async (format: 'pdf' | 'excel' | 'json') => {
    try {
      const { data, error } = await supabase.functions.invoke('export-analytics', {
        body: {
          user_id: user?.id,
          format,
          data: analytics
        }
      });
      
      if (error) throw error;
      
      // Create download link
      const blob = new Blob([data.content], { 
        type: format === 'pdf' ? 'application/pdf' : 
              format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
              'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error: any) {
      console.error('Error exporting analytics:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAdvancedAnalytics();
  }, [user, userRole]);

  return {
    analytics,
    loading,
    error,
    fetchAdvancedAnalytics,
    exportAnalytics
  };
};
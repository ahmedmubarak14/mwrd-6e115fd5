import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PredictiveInsights {
  demandForecast: Array<{ month: string; predicted_demand: number; confidence: number }>;
  priceTrends: Array<{ category: string; current_price: number; predicted_price: number; trend: 'up' | 'down' | 'stable' }>;
  riskAssessment: {
    vendor_risk: number;
    market_risk: number;
    financial_risk: number;
    overall_risk: 'low' | 'medium' | 'high';
  };
  recommendations: Array<{ type: string; title: string; description: string; priority: 'high' | 'medium' | 'low' }>;
  marketOpportunities: Array<{ category: string; opportunity_score: number; estimated_revenue: number; competition_level: number }>;
}

export const usePredictiveAnalytics = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<PredictiveInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictiveInsights = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Call edge function for AI-powered predictions
      const { data, error } = await supabase.functions.invoke('generate-predictive-analytics', {
        body: { user_id: user.id }
      });
      
      if (error) throw error;
      
      setInsights(data);
    } catch (error: any) {
      console.error('Error fetching predictive insights:', error);
      setError(error.message);
      
      // Fallback to mock data for demo
      setInsights({
        demandForecast: [
          { month: 'Jan 2024', predicted_demand: 45, confidence: 0.85 },
          { month: 'Feb 2024', predicted_demand: 52, confidence: 0.78 },
          { month: 'Mar 2024', predicted_demand: 48, confidence: 0.82 },
          { month: 'Apr 2024', predicted_demand: 60, confidence: 0.79 },
          { month: 'May 2024', predicted_demand: 55, confidence: 0.81 },
          { month: 'Jun 2024', predicted_demand: 68, confidence: 0.77 }
        ],
        priceTrends: [
          { category: 'Construction', current_price: 50000, predicted_price: 52000, trend: 'up' },
          { category: 'Engineering', current_price: 35000, predicted_price: 34000, trend: 'down' },
          { category: 'Consulting', current_price: 25000, predicted_price: 25500, trend: 'stable' },
          { category: 'Technology', current_price: 40000, predicted_price: 43000, trend: 'up' }
        ],
        riskAssessment: {
          vendor_risk: 0.25,
          market_risk: 0.40,
          financial_risk: 0.15,
          overall_risk: 'medium'
        },
        recommendations: [
          {
            type: 'pricing',
            title: 'Optimize Construction Category Pricing',
            description: 'Market analysis suggests 8% price increase opportunity in construction services.',
            priority: 'high'
          },
          {
            type: 'market',
            title: 'Focus on Technology Sector',
            description: 'Growing demand detected in technology services with 15% YoY growth.',
            priority: 'high'
          },
          {
            type: 'risk',
            title: 'Diversify Client Portfolio',
            description: 'Reduce dependency on top 3 clients to minimize financial risk.',
            priority: 'medium'
          }
        ],
        marketOpportunities: [
          { category: 'AI & Machine Learning', opportunity_score: 0.92, estimated_revenue: 180000, competition_level: 0.3 },
          { category: 'Green Construction', opportunity_score: 0.87, estimated_revenue: 150000, competition_level: 0.4 },
          { category: 'Digital Transformation', opportunity_score: 0.82, estimated_revenue: 120000, competition_level: 0.5 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictiveInsights();
  }, [user]);

  return {
    insights,
    loading,
    error,
    fetchPredictiveInsights
  };
};
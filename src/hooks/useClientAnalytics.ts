import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ClientAnalyticsData {
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  totalSpent: number;
  activeOrders: number;
  completedOrders: number;
  pendingOffers: number;
  acceptedOffers: number;
  averageOrderValue: number;
  totalVendorsWorkedWith: number;
  requestGrowth: number;
  spendingGrowth: number;
  completionRate: number;
  averageResponseTime: number;
  monthlySpending: Array<{ month: string; amount: number }>;
  requestsByCategory: Array<{ category: string; count: number }>;
  orderTimeline: Array<{ date: string; orders: number; spending: number }>;
}

export const useClientAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ClientAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch client's requests
      const { data: requests } = await supabase
        .from('requests')
        .select('*')
        .eq('client_id', user.id);

      // Fetch client's orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('client_id', user.id);

      // Fetch client's offers (for their requests)
      const { data: offers } = await supabase
        .from('offers')
        .select('*, requests!inner(*)')
        .eq('requests.client_id', user.id);

      // Fetch client's financial transactions
      const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user.id);

      // Calculate metrics
      const totalRequests = requests?.length || 0;
      const activeRequests = requests?.filter(r => r.status === 'new' || r.status === 'in_progress').length || 0;
      const completedRequests = requests?.filter(r => r.status === 'completed').length || 0;
      
      const totalSpent = transactions?.filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
      
      const activeOrders = orders?.filter(o => o.status === 'pending' || o.status === 'in_progress').length || 0;
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
      
      const pendingOffers = offers?.filter(o => o.client_approval_status === 'pending').length || 0;
      const acceptedOffers = offers?.filter(o => o.client_approval_status === 'approved').length || 0;
      
      const averageOrderValue = completedOrders > 0 
        ? totalSpent / completedOrders 
        : 0;

      // Get unique vendors worked with
      const uniqueVendors = new Set(orders?.map(o => o.vendor_id) || []);
      const totalVendorsWorkedWith = uniqueVendors.size;

      // Calculate growth metrics (last 30 days vs previous 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const currentPeriodRequests = requests?.filter(r => 
        new Date(r.created_at) >= thirtyDaysAgo
      ).length || 0;
      
      const previousPeriodRequests = requests?.filter(r => 
        new Date(r.created_at) >= sixtyDaysAgo && new Date(r.created_at) < thirtyDaysAgo
      ).length || 0;

      const requestGrowth = previousPeriodRequests > 0 
        ? Math.round(((currentPeriodRequests - previousPeriodRequests) / previousPeriodRequests) * 100)
        : 0;

      const currentPeriodSpending = transactions?.filter(t => 
        t.status === 'completed' && new Date(t.created_at) >= thirtyDaysAgo
      ).reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
      
      const previousPeriodSpending = transactions?.filter(t => 
        t.status === 'completed' && 
        new Date(t.created_at) >= sixtyDaysAgo && 
        new Date(t.created_at) < thirtyDaysAgo
      ).reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

      const spendingGrowth = previousPeriodSpending > 0 
        ? Math.round(((currentPeriodSpending - previousPeriodSpending) / previousPeriodSpending) * 100)
        : 0;

      const completionRate = totalRequests > 0 
        ? Math.round((completedRequests / totalRequests) * 100)
        : 0;

      // Generate monthly spending data (last 6 months)
      const monthlySpending = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const monthSpending = transactions?.filter(t => 
          t.status === 'completed' && 
          new Date(t.created_at) >= monthStart && 
          new Date(t.created_at) <= monthEnd
        ).reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
        
        monthlySpending.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          amount: monthSpending
        });
      }

      // Generate requests by category
      const categoryCount: { [key: string]: number } = {};
      requests?.forEach(r => {
        categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
      });
      
      const requestsByCategory = Object.entries(categoryCount).map(([category, count]) => ({
        category,
        count
      }));

      // Generate order timeline (last 30 days)
      const orderTimeline = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        
        const dayOrders = orders?.filter(o => 
          new Date(o.created_at) >= dayStart && new Date(o.created_at) < dayEnd
        ).length || 0;
        
        const daySpending = transactions?.filter(t => 
          t.status === 'completed' && 
          new Date(t.created_at) >= dayStart && 
          new Date(t.created_at) < dayEnd
        ).reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
        
        orderTimeline.push({
          date: date.toISOString().split('T')[0],
          orders: dayOrders,
          spending: daySpending
        });
      }

      const analyticsResult: ClientAnalyticsData = {
        totalRequests,
        activeRequests,
        completedRequests,
        totalSpent,
        activeOrders,
        completedOrders,
        pendingOffers,
        acceptedOffers,
        averageOrderValue,
        totalVendorsWorkedWith,
        requestGrowth,
        spendingGrowth,
        completionRate,
        averageResponseTime: 2.3, // Mock data - would need to calculate from messages
        monthlySpending,
        requestsByCategory,
        orderTimeline
      };

      setAnalytics(analyticsResult);
    } catch (error: any) {
      console.error('Error fetching client analytics:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientAnalytics();
  }, [user]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics: fetchClientAnalytics
  };
};
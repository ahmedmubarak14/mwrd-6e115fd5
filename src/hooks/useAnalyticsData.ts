import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsMetrics {
  totalRevenue: number;
  previousRevenue: number;
  totalOrders: number;
  previousOrders: number;
  activeUsers: number;
  previousActiveUsers: number;
  completionRate: number;
  previousCompletionRate: number;
  avgResponseTime: number;
  previousResponseTime: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
  clients: number;
}

export const useAnalyticsData = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate date ranges
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Fetch financial transactions for revenue
        const { data: transactions, error: transactionsError } = await supabase
          .from('financial_transactions')
          .select('amount, created_at, status')
          .eq('status', 'completed');

        if (transactionsError) throw transactionsError;

        // Fetch orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id, amount, status, created_at, completion_date');

        if (ordersError) throw ordersError;

        // Fetch user profiles for active users
        const { data: users, error: usersError } = await supabase
          .from('user_profiles')
          .select('id, created_at, updated_at');

        if (usersError) throw usersError;

        // Calculate metrics
        const currentRevenue = transactions
          .filter(t => new Date(t.created_at) > thirtyDaysAgo)
          .reduce((sum, t) => sum + t.amount, 0);

        const previousRevenue = transactions
          .filter(t => new Date(t.created_at) > sixtyDaysAgo && new Date(t.created_at) <= thirtyDaysAgo)
          .reduce((sum, t) => sum + t.amount, 0);

        const currentOrders = orders.filter(o => new Date(o.created_at) > thirtyDaysAgo).length;
        const previousOrders = orders
          .filter(o => new Date(o.created_at) > sixtyDaysAgo && new Date(o.created_at) <= thirtyDaysAgo).length;

        const activeUsers = users.filter(u => new Date(u.updated_at) > thirtyDaysAgo).length;
        const previousActiveUsers = users
          .filter(u => new Date(u.updated_at) > sixtyDaysAgo && new Date(u.updated_at) <= thirtyDaysAgo).length;

        // Calculate completion rate
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        const completionRate = orders.length > 0 ? (completedOrders / orders.length) * 100 : 0;

        // Calculate average response time (mock for now - would need real data)
        const avgResponseTime = 2.3;
        const previousResponseTime = 3.1;

        setMetrics({
          totalRevenue: currentRevenue,
          previousRevenue,
          totalOrders: currentOrders,
          previousOrders,
          activeUsers,
          previousActiveUsers,
          completionRate,
          previousCompletionRate: 91.2, // Would need historical data
          avgResponseTime,
          previousResponseTime
        });

        // Generate monthly data for charts
        const monthlyRevenue: MonthlyData[] = [];
        for (let i = 5; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
          
          const monthTransactions = transactions.filter(t => {
            const date = new Date(t.created_at);
            return date >= monthStart && date <= monthEnd;
          });

          const monthOrders = orders.filter(o => {
            const date = new Date(o.created_at);
            return date >= monthStart && date <= monthEnd;
          });

          const monthUsers = users.filter(u => {
            const date = new Date(u.created_at);
            return date >= monthStart && date <= monthEnd;
          });

          monthlyRevenue.push({
            month: monthStart.toLocaleDateString('en', { month: 'short' }),
            revenue: monthTransactions.reduce((sum, t) => sum + t.amount, 0),
            orders: monthOrders.length,
            clients: monthUsers.length
          });
        }

        setMonthlyData(monthlyRevenue);
        setLoading(false);
      } catch (err) {
        console.error('Analytics data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  return { metrics, monthlyData, loading, error, refetch: () => window.location.reload() };
};

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { LoadingState } from '@/components/dashboard/shared/LoadingState';
import { AdminStatsCards } from './AdminStatsCards';
import { AdminQuickActions } from './AdminQuickActions';
import { AdminNavigationGrid } from './AdminNavigationGrid';

interface DashboardStats {
  totalUsers: number;
  totalClients: number;
  totalVendors: number;
  totalAdmins: number;
  activeRequests: number;
  confirmedOrders: number;
  completedOrders: number;
  pendingOffers: number;
  openTickets: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export const ConsolidatedAdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalClients: 0,
    totalVendors: 0,
    totalAdmins: 0,
    activeRequests: 0,
    confirmedOrders: 0,
    completedOrders: 0,
    pendingOffers: 0,
    openTickets: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch user statistics
      const { data: userStats } = await supabase
        .rpc('get_user_statistics');

      // Fetch requests statistics
      const { data: requests } = await supabase
        .from('requests')
        .select('id, status, admin_approval_status')
        .eq('admin_approval_status', 'approved');

      // Fetch orders statistics
      const { data: orders } = await supabase
        .from('orders')
        .select('id, status, amount');

      // Fetch offers statistics
      const { data: offers } = await supabase
        .from('offers')
        .select('id, client_approval_status, admin_approval_status');

      // Fetch financial data
      const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('status', 'completed');

      // Fetch support tickets
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('id, status')
        .eq('status', 'open');

      // Calculate stats
      const activeRequests = requests?.filter(r => ['new', 'in_progress'].includes(r.status)).length || 0;
      const confirmedOrders = orders?.filter(o => ['confirmed', 'in_progress'].includes(o.status)).length || 0;
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
      const pendingOffers = offers?.filter(o => o.admin_approval_status === 'pending').length || 0;
      const openTickets = tickets?.length || 0;
      const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      setStats({
        totalUsers: userStats?.[0]?.total_users || 0,
        totalClients: userStats?.[0]?.total_clients || 0,
        totalVendors: userStats?.[0]?.total_vendors || 0,
        totalAdmins: userStats?.[0]?.total_admins || 0,
        activeRequests,
        confirmedOrders,
        completedOrders,
        pendingOffers,
        openTickets,
        totalRevenue,
        monthlyGrowth: 12.5 // Placeholder for now
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: t('common.error'),
        description: t('admin.errorLoadingStats'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleCardClick = (key: string) => {
    // Handle navigation based on card clicked
    console.log('Card clicked:', key);
  };

  if (loading) {
    return <LoadingState message={t('admin.loadingDashboard')} />;
  }

  return (
    <div className={cn("container mx-auto p-6 space-y-8", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={cn("text-3xl font-bold mb-2", isRTL ? "text-right" : "text-left")}>
          {t('admin.dashboard')}
        </h1>
        <p className={cn("text-muted-foreground", isRTL ? "text-right" : "text-left")}>
          {t('admin.welcomeBack')}
        </p>
      </div>

      {/* Stats Cards */}
      <AdminStatsCards 
        stats={stats}
        isLoading={loading}
        onCardClick={handleCardClick}
      />

      {/* Quick Actions & Alerts */}
      <AdminQuickActions stats={stats} />

      {/* Quick Navigation */}
      <AdminNavigationGrid />
    </div>
  );
};

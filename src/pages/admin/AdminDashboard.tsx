import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MetricCard } from '@/components/ui/MetricCard';
import { 
  Users, 
  Building, 
  FileText, 
  ShoppingCart, 
  CheckCircle, 
  Clock,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Ticket,
  DollarSign,
  Package
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

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

import { AdminPageContainer } from '@/components/admin/AdminPageContainer';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getPendingTicketsCount } = useSupportTickets();
  const languageContext = useOptionalLanguage();
  const { t, isRTL, formatNumber, formatCurrency } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false,
    formatNumber: (num: number) => num.toString(),
    formatCurrency: (amount: number) => `$${amount}`
  };
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
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

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

      // Fetch recent activity
      const { data: activity } = await supabase
        .from('activity_feed')
        .select('*, user_profiles(full_name, company_name)')
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentActivity(activity || []);

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

  if (loading) {
    return (
      <AdminPageContainer>
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        {/* Loading skeleton for metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer
      title={t('admin.dashboard')}
      description={t('admin.welcomeBack')}
    >

      {/* Key Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title={t('admin.totalClients')}
          value={formatNumber(stats.totalClients)}
          description={t('admin.activeClientAccounts')}
          icon={Users}
          loading={loading}
        />
        
        <MetricCard
          title={t('admin.totalVendors')}
          value={formatNumber(stats.totalVendors)}
          description={t('admin.registeredVendors')}
          icon={Building}
          loading={loading}
        />
        
        <MetricCard
          title={t('admin.activeRequests')}
          value={formatNumber(stats.activeRequests)}
          description={t('admin.currentlyBeingProcessed')}
          icon={FileText}
          loading={loading}
        />
        
        <MetricCard
          title={t('admin.orders')}
          value={formatNumber(stats.confirmedOrders)}
          description={t('admin.inProgressOrders')}
          icon={ShoppingCart}
          loading={loading}
        />
      </div>

      {/* Order Lifecycle & Support Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title={t('admin.completedOrders')}
          value={formatNumber(stats.completedOrders)}
          description={t('admin.successfullyDelivered')}
          icon={CheckCircle}
          variant="success"
          loading={loading}
        />
        
        <MetricCard
          title={t('admin.pendingOffers')}
          value={formatNumber(stats.pendingOffers)}
          description={t('admin.awaitingAdminApproval')}
          icon={Package}
          variant="warning"
          loading={loading}
        />
        
        <MetricCard
          title={t('admin.supportTickets')}
          value={formatNumber(stats.openTickets)}
          description={t('admin.requireAttention')}
          icon={Ticket}
          variant="destructive"
          loading={loading}
        />
        
        <MetricCard
          title={t('admin.revenue')}
          value={formatCurrency(stats.totalRevenue)}
          description={t('admin.platformCommissionEarned')}
          icon={DollarSign}
          trend={{
            value: stats.monthlyGrowth,
            label: "vs last month",
            isPositive: stats.monthlyGrowth > 0
          }}
          loading={loading}
        />
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              {t('admin.requiresImmediateAttention')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.pendingOffers > 0 && (
              <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div>
                  <p className="font-medium">{t('admin.pendingOfferApprovals')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(stats.pendingOffers)} {t('admin.offersAwaitingReview')}
                  </p>
                </div>
                <Link to="/admin/offers">
                  <Button size="sm" variant="outline">{t('common.view')}</Button>
                </Link>
              </div>
            )}
            
            {stats.openTickets > 0 && (
              <div className="flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div>
                  <p className="font-medium">{t('admin.openSupportTickets')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(stats.openTickets)} {t('admin.ticketsNeedResponse')}
                  </p>
                </div>
                <Link to="/admin/support">
                  <Button size="sm" variant="outline">{t('common.view')}</Button>
                </Link>
              </div>
            )}

            {stats.pendingOffers === 0 && stats.openTickets === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                <p>{t('admin.allCaughtUp')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              {t('admin.platformPerformance')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('admin.userGrowthMetric')}</span>
                <span className="text-sm text-success">+{stats.monthlyGrowth}%</span>
              </div>
              <Progress value={stats.monthlyGrowth} className="w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {((stats.completedOrders / (stats.completedOrders + stats.confirmedOrders)) * 100 || 0).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">{t('admin.completionRate')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</p>
                <p className="text-xs text-muted-foreground">{t('admin.totalUsers')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>{t('admin.quickAccess')}</CardTitle>
          <CardDescription>
            {t('admin.jumpToKeyFunctions')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/users">
              <Button variant="outline" className="h-20 flex-col hover:scale-105 transition-transform">
                <div className="flex flex-col items-center">
                  <Users className="h-6 w-6 mb-2" />
                  {t('admin.manageUsers')}
                </div>
              </Button>
            </Link>
            <Link to="/admin/requests">
              <Button variant="outline" className="h-20 flex-col hover:scale-105 transition-transform">
                <div className="flex flex-col items-center">
                  <FileText className="h-6 w-6 mb-2" />
                  {t('admin.viewRequests')}
                </div>
              </Button>
            </Link>
            <Link to="/admin/offers">
              <Button variant="outline" className="h-20 flex-col hover:scale-105 transition-transform">
                <div className="flex flex-col items-center">
                  <Package className="h-6 w-6 mb-2" />
                  {t('admin.reviewOffers')}
                </div>
              </Button>
            </Link>
            <Link to="/admin/support">
              <Button variant="outline" className="h-20 flex-col hover:scale-105 transition-transform">
                <div className="flex flex-col items-center">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  {t('admin.supportCenter')}
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AdminPageContainer>
  );
};

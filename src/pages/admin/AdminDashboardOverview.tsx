import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
import { useLanguage } from '@/contexts/LanguageContext';
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

export const AdminDashboardOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getPendingTicketsCount } = useSupportTickets();
  const { t, isRTL, formatNumber, formatCurrency } = useLanguage();
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
      <div className={cn("container mx-auto p-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('admin.loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("container mx-auto p-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-8">
        <h1 className={cn("text-3xl font-bold mb-2", isRTL ? "text-right" : "text-left")}>
          {t('admin.dashboard')}
        </h1>
        <p className={cn("text-muted-foreground", isRTL ? "text-right" : "text-left")}>
          {t('admin.welcomeBack')}
        </p>
      </div>

      {/* Key Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.totalClients')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", isRTL ? "text-right" : "text-left")}>
              {formatNumber(stats.totalClients)}
            </div>
            <p className={cn("text-xs text-muted-foreground", isRTL ? "text-right" : "text-left")}>
              {t('admin.activeClientAccounts')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.totalVendors')}</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", isRTL ? "text-right" : "text-left")}>
              {formatNumber(stats.totalVendors)}
            </div>
            <p className={cn("text-xs text-muted-foreground", isRTL ? "text-right" : "text-left")}>
              {t('admin.registeredVendors')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.activeRequests')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", isRTL ? "text-right" : "text-left")}>
              {formatNumber(stats.activeRequests)}
            </div>
            <p className={cn("text-xs text-muted-foreground", isRTL ? "text-right" : "text-left")}>
              {t('admin.currentlyBeingProcessed')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.orders')}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", isRTL ? "text-right" : "text-left")}>
              {formatNumber(stats.confirmedOrders)}
            </div>
            <p className={cn("text-xs text-muted-foreground", isRTL ? "text-right" : "text-left")}>
              {t('admin.inProgressOrders')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Lifecycle & Support Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.completedOrders')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold text-green-600", isRTL ? "text-right" : "text-left")}>
              {formatNumber(stats.completedOrders)}
            </div>
            <p className={cn("text-xs text-muted-foreground", isRTL ? "text-right" : "text-left")}>
              {t('admin.successfullyDelivered')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.pendingOffers')}</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold text-yellow-600", isRTL ? "text-right" : "text-left")}>
              {formatNumber(stats.pendingOffers)}
            </div>
            <p className={cn("text-xs text-muted-foreground", isRTL ? "text-right" : "text-left")}>
              {t('admin.awaitingAdminApproval')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.supportTickets')}</CardTitle>
            <Ticket className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold text-red-600", isRTL ? "text-right" : "text-left")}>
              {formatNumber(stats.openTickets)}
            </div>
            <p className={cn("text-xs text-muted-foreground", isRTL ? "text-right" : "text-left")}>
              {t('admin.requireAttention')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.revenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", isRTL ? "text-right" : "text-left")}>
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className={cn("text-xs text-muted-foreground", isRTL ? "text-right" : "text-left")}>
              {t('admin.platformCommissionEarned')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              {t('admin.requiresImmediateAttention')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.pendingOffers > 0 && (
              <div className={cn("flex items-center justify-between p-3 bg-yellow-50 rounded-lg", isRTL && "flex-row-reverse")}>
                <div className={cn(isRTL ? "text-right" : "text-left")}>
                  <p className="font-medium">{t('admin.pendingOfferApprovals')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(stats.pendingOffers)} {t('admin.offersAwaitingReview')}
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link to="/admin/offers">{t('common.view')}</Link>
                </Button>
              </div>
            )}
            
            {stats.openTickets > 0 && (
              <div className={cn("flex items-center justify-between p-3 bg-red-50 rounded-lg", isRTL && "flex-row-reverse")}>
                <div className={cn(isRTL ? "text-right" : "text-left")}>
                  <p className="font-medium">{t('admin.openSupportTickets')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(stats.openTickets)} {t('admin.ticketsNeedResponse')}
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link to="/admin/support">{t('common.view')}</Link>
                </Button>
              </div>
            )}

            {stats.pendingOffers === 0 && stats.openTickets === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p>{t('admin.allCaughtUp')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <TrendingUp className="h-5 w-5 text-green-600" />
              {t('admin.platformPerformance')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                <span className="text-sm font-medium">{t('admin.userGrowthMetric')}</span>
                <span className="text-sm text-green-600">+{stats.monthlyGrowth}%</span>
              </div>
              <Progress value={stats.monthlyGrowth} className="w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className={cn("text-center", isRTL ? "text-right" : "text-left")}>
                <p className="text-2xl font-bold">
                  {((stats.completedOrders / (stats.completedOrders + stats.confirmedOrders)) * 100 || 0).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">{t('admin.completionRate')}</p>
              </div>
              <div className={cn("text-center", isRTL ? "text-right" : "text-left")}>
                <p className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</p>
                <p className="text-xs text-muted-foreground">{t('admin.totalUsers')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className={cn(isRTL ? "text-right" : "text-left")}>{t('admin.quickAccess')}</CardTitle>
          <CardDescription className={cn(isRTL ? "text-right" : "text-left")}>
            {t('admin.jumpToKeyFunctions')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className={cn("h-20 flex-col", isRTL && "text-center")}>
              <Link to="/admin/users" className={cn("flex flex-col items-center", isRTL && "text-center")}>
                <Users className="h-6 w-6 mb-2" />
                {t('admin.manageUsers')}
              </Link>
            </Button>
            <Button asChild variant="outline" className={cn("h-20 flex-col", isRTL && "text-center")}>
              <Link to="/admin/requests" className={cn("flex flex-col items-center", isRTL && "text-center")}>
                <FileText className="h-6 w-6 mb-2" />
                {t('admin.viewRequests')}
              </Link>
            </Button>
            <Button asChild variant="outline" className={cn("h-20 flex-col", isRTL && "text-center")}>
              <Link to="/admin/offers" className={cn("flex flex-col items-center", isRTL && "text-center")}>
                <Package className="h-6 w-6 mb-2" />
                {t('admin.reviewOffers')}
              </Link>
            </Button>
            <Button asChild variant="outline" className={cn("h-20 flex-col", isRTL && "text-center")}>
              <Link to="/admin/support" className={cn("flex flex-col items-center", isRTL && "text-center")}>
                <MessageSquare className="h-6 w-6 mb-2" />
                {t('admin.supportCenter')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

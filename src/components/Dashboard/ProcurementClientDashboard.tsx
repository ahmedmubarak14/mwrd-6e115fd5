
import { useState, useEffect } from "react";
import { AlertTriangle, Plus, Eye, MessageSquare, Package, TrendingUp, CheckCircle, Clock, FileText, ShoppingCart, FileClock,  } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MetricCard } from "@/components/ui/MetricCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

interface ClientStats {
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  totalOffers: number;
  pendingOffers: number;
  acceptedOffers: number;
  totalOrders: number;
  completedOrders: number;
  totalSpent: number;
  avgResponseTime: number;
}

export const ProcurementClientDashboard = () => {
  const { t, isRTL, formatNumber, formatCurrency } = useLanguage();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<ClientStats>({
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    totalOffers: 0,
    pendingOffers: 0,
    acceptedOffers: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const fetchClientStats = async () => {
    if (!userProfile?.user_id) return;
    
    try {
      setLoading(true);
      
      // Fetch client's requests
      const { data: requests, error: requestsError } = await supabase
        .from('requests')
        .select('id, status, created_at, updated_at')
        .eq('client_id', userProfile.user_id);

      if (requestsError) {
        console.error('Error fetching requests:', requestsError);
        throw requestsError;
      }

      // Fetch offers for client's requests
      const { data: offers, error: offersError } = await supabase
        .from('offers')
        .select('id, client_approval_status, status, price, currency, created_at, request_id')
        .in('request_id', requests?.map(r => r.id) || []);

      if (offersError) {
        console.error('Error fetching offers:', offersError);
        throw offersError;
      }

      // Fetch client's orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, status, amount, currency, created_at, completion_date')
        .eq('client_id', userProfile.user_id);

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      // Fetch client's financial transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('financial_transactions')
        .select('amount, created_at, status')
        .eq('user_id', userProfile.user_id)
        .eq('status', 'completed');

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        throw transactionsError;
      }

      // Calculate statistics
      const totalRequests = requests?.length || 0;
      const activeRequests = requests?.filter(r => ['new', 'in_progress'].includes(r.status)).length || 0;
      const completedRequests = requests?.filter(r => r.status === 'completed').length || 0;
      
      const totalOffers = offers?.length || 0;
      const pendingOffers = offers?.filter(o => o.client_approval_status === 'pending').length || 0;
      const acceptedOffers = offers?.filter(o => o.client_approval_status === 'approved').length || 0;
      
      const totalOrders = orders?.length || 0;
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
      
      const totalSpent = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      
      // Calculate average response time (hours between request creation and first offer)
      let avgResponseTime = 0;
      if (requests && offers && requests.length > 0) {
        const responseTimes = requests
          .map(request => {
            const requestOffers = offers.filter(o => o.request_id === request.id);
            if (requestOffers.length > 0) {
              const firstOffer = requestOffers.sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              )[0];
              const requestTime = new Date(request.created_at).getTime();
              const firstOfferTime = new Date(firstOffer.created_at).getTime();
              return (firstOfferTime - requestTime) / (1000 * 60 * 60); // Convert to hours
            }
            return null;
          })
          .filter(time => time !== null) as number[];
        
        if (responseTimes.length > 0) {
          avgResponseTime = Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length);
        }
      }

      const newStats = {
        totalRequests,
        activeRequests,
        completedRequests,
        totalOffers,
        pendingOffers,
        acceptedOffers,
        totalOrders,
        completedOrders,
        totalSpent,
        avgResponseTime
      };

      setStats(newStats);

      // Fetch recent activity from activity feed
      const { data: activity, error: activityError } = await supabase
        .from('activity_feed')
        .select('*')
        .eq('user_id', userProfile.user_id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityError) {
        console.error('Error fetching activity:', activityError);
      } else {
        setRecentActivity(activity || []);
      }

    } catch (error) {
      console.error('Error fetching client stats:', error);
      toast({
        title: t('common.error'),
        description: t('common.errors.loadFailed'),
        variant: "destructive"
      });
      
      // Set fallback stats to prevent UI breaking
      setStats({
        totalRequests: 0,
        activeRequests: 0,
        completedRequests: 0,
        totalOffers: 0,
        pendingOffers: 0,
        acceptedOffers: 0,
        totalOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
        avgResponseTime: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientStats();
  }, [userProfile]);

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.welcomeMessage')}
        </p>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title={t('dashboard.metrics.totalRequests.title')}
          value={formatNumber(stats.totalRequests)}
          description={t('dashboard.metrics.totalRequests.description')}
          icon={FileText}
          loading={loading}
        />
        
        <MetricCard
          title={t('dashboard.metrics.activeRequests.title')}
          value={formatNumber(stats.activeRequests)}
          description={t('dashboard.metrics.activeRequests.description')}
          icon={FileClock}
          loading={loading}
        />
        
        <MetricCard
          title={t('dashboard.metrics.pendingOffers.title')}
          value={formatNumber(stats.pendingOffers)}
          description={t('dashboard.metrics.pendingOffers.description')}
          icon={Package}
          variant="warning"
          loading={loading}
        />
        
        <MetricCard
          title={t('dashboard.metrics.completedOrders.title')}
          value={formatNumber(stats.completedOrders)}
          description={t('dashboard.metrics.completedOrders.description')}
          icon={CheckCircle}
          variant="success"
          loading={loading}
        />
      </div>

      {/* Performance & Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title={t('dashboard.metrics.totalSpent.title')}
          value={formatCurrency(stats.totalSpent)}
          description={t('dashboard.metrics.totalSpent.description')}
          icon={ShoppingCart}
          loading={loading}
        />
        
        <MetricCard
          title={t('dashboard.metrics.successRate.title')}
          value={`${stats.totalRequests ? Math.round((stats.completedRequests / stats.totalRequests) * 100) : 0}%`}
          description={t('dashboard.metrics.successRate.description')}
          icon={TrendingUp}
          variant="success"
          loading={loading}
        />
        
        <MetricCard
          title={t('dashboard.metrics.averageResponse.title')}
          value={`${stats.avgResponseTime}h`}
          description={t('dashboard.metrics.averageResponse.description')}
          icon={Clock}
          loading={loading}
        />
        
        <MetricCard
          title={t('dashboard.metrics.offersReceived.title')}
          value={formatNumber(stats.totalOffers)}
          description={t('dashboard.metrics.offersReceived.description')}
          icon={Package}
          loading={loading}
        />
      </div>

      {/* Action Items & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              {t('dashboard.actions.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.pendingOffers > 0 && (
              <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div>
                  <p className="font-medium">{t('dashboard.actions.pendingOfferReviews')}</p>
                  <p className="text-sm text-foreground opacity-75">
                    {formatNumber(stats.pendingOffers)} {t('dashboard.actions.offersNeedDecision')}
                  </p>
                </div>
                <Link to="/offers">
                  <Button size="sm" variant="outline">{t('dashboard.actions.review')}</Button>
                </Link>
              </div>
            )}
            
            {stats.activeRequests > 0 && (
              <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div>
                  <p className="font-medium">{t('dashboard.actions.activeRequests')}</p>
                  <p className="text-sm text-foreground opacity-75">
                    {formatNumber(stats.activeRequests)} {t('dashboard.actions.requestsInProgress')}
                  </p>
                </div>
                <Link to="/requests">
                  <Button size="sm" variant="outline">{t('dashboard.actions.monitor')}</Button>
                </Link>
              </div>
            )}

            {stats.pendingOffers === 0 && stats.activeRequests === 0 && (
              <div className="text-center py-6 text-foreground opacity-75">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                <p>{t('dashboard.actions.allCaughtUp')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              {t('dashboard.actions.quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button onClick={() => navigate('/requests/create')} className="h-auto p-4 justify-start">
                <Plus className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{t('dashboard.actions.createNewRequest')}</div>
                  <div className="text-xs opacity-75">{t('dashboard.actions.createNewRequestDesc')}</div>
                </div>
              </Button>
              
              <Button variant="outline" onClick={() => navigate('/vendors')} className="h-auto p-4 justify-start">
                <Eye className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{t('dashboard.actions.browseVendors')}</div>
                  <div className="text-xs opacity-75">{t('dashboard.actions.browseVendorsDesc')}</div>
                </div>
              </Button>

              <Button variant="outline" onClick={() => navigate('/messages')} className="h-auto p-4 justify-start">
                <MessageSquare className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{t('dashboard.actions.messages')}</div>
                  <div className="text-xs opacity-75">{t('dashboard.actions.messagesDesc')}</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{t('dashboard.performance.title')}</CardTitle>
          <CardDescription>{t('dashboard.performance.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('dashboard.performance.requestSuccessRate')}</span>
                <span className="text-sm text-success">
                  {stats.totalRequests ? Math.round((stats.completedRequests / stats.totalRequests) * 100) : 0}%
                </span>
              </div>
              <Progress 
                value={stats.totalRequests ? (stats.completedRequests / stats.totalRequests) * 100 : 0} 
                className="w-full" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('dashboard.performance.offerAcceptanceRate')}</span>
                <span className="text-sm text-primary">
                  {stats.totalOffers ? Math.round((stats.acceptedOffers / stats.totalOffers) * 100) : 0}%
                </span>
              </div>
              <Progress 
                value={stats.totalOffers ? (stats.acceptedOffers / stats.totalOffers) * 100 : 0} 
                className="w-full" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('dashboard.performance.orderCompletion')}</span>
                <span className="text-sm text-success">
                  {stats.totalOrders ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                </span>
              </div>
              <Progress 
                value={stats.totalOrders ? (stats.completedOrders / stats.totalOrders) * 100 : 0} 
                className="w-full" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

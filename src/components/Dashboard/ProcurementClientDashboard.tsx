
import { useState, useEffect } from "react";
import { AlertTriangle, Plus, Eye, MessageSquare, Package, TrendingUp, CheckCircle, Clock, FileText, ShoppingCart } from "lucide-react";
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
    if (!userProfile) return;
    
    try {
      setLoading(true);
      
      // Fetch requests statistics
      const { data: requests, error: requestsError } = await supabase
        .from('requests')
        .select('id, status')
        .eq('client_id', userProfile.user_id);

      if (requestsError) throw requestsError;

      // Fetch offers statistics  
      const { data: offers, error: offersError } = await supabase
        .from('offers')
        .select('id, client_approval_status, price')
        .in('request_id', requests?.map(r => r.id) || []);

      if (offersError) throw offersError;

      // Fetch orders statistics
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, status, amount')
        .eq('client_id', userProfile.user_id);

      if (ordersError) throw ordersError;

      // Calculate statistics
      const totalRequests = requests?.length || 0;
      const activeRequests = requests?.filter(r => ['new', 'in_progress'].includes(r.status)).length || 0;
      const completedRequests = requests?.filter(r => r.status === 'completed').length || 0;
      
      const totalOffers = offers?.length || 0;
      const pendingOffers = offers?.filter(o => o.client_approval_status === 'pending').length || 0;
      const acceptedOffers = offers?.filter(o => o.client_approval_status === 'approved').length || 0;
      
      const totalOrders = orders?.length || 0;
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
      const totalSpent = orders?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0;

      setStats({
        totalRequests,
        activeRequests,
        completedRequests,
        totalOffers,
        pendingOffers,
        acceptedOffers,
        totalOrders,
        completedOrders,
        totalSpent,
        avgResponseTime: 24 // Mock data
      });

      // Fetch recent activity
      const { data: activity } = await supabase
        .from('activity_feed')
        .select('*')
        .eq('user_id', userProfile.user_id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity(activity || []);

    } catch (error) {
      console.error('Error fetching client stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive"
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
          {t('dashboard.title') === 'dashboard.title' ? 'Client Dashboard' : t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.welcomeMessage') === 'dashboard.welcomeMessage' 
            ? 'Welcome to your procurement dashboard' 
            : t('dashboard.welcomeMessage')}
        </p>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Requests"
          value={formatNumber(stats.totalRequests)}
          description="Procurement requests created"
          icon={FileText}
          loading={loading}
        />
        
        <MetricCard
          title="Active Requests"
          value={formatNumber(stats.activeRequests)}
          description="Currently being processed"
          icon={Clock}
          loading={loading}
        />
        
        <MetricCard
          title="Pending Offers"
          value={formatNumber(stats.pendingOffers)}
          description="Awaiting your review"
          icon={Package}
          variant="warning"
          loading={loading}
        />
        
        <MetricCard
          title="Completed Orders"
          value={formatNumber(stats.completedOrders)}
          description="Successfully delivered"
          icon={CheckCircle}
          variant="success"
          loading={loading}
        />
      </div>

      {/* Performance & Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          description="Total procurement value"
          icon={ShoppingCart}
          loading={loading}
        />
        
        <MetricCard
          title="Success Rate"
          value={`${stats.totalRequests ? Math.round((stats.completedRequests / stats.totalRequests) * 100) : 0}%`}
          description="Request completion rate"
          icon={TrendingUp}
          variant="success"
          loading={loading}
        />
        
        <MetricCard
          title="Average Response"
          value={`${stats.avgResponseTime}h`}
          description="Vendor response time"
          icon={Clock}
          loading={loading}
        />
        
        <MetricCard
          title="Offers Received"
          value={formatNumber(stats.totalOffers)}
          description="Total vendor proposals"
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
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.pendingOffers > 0 && (
              <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div>
                  <p className="font-medium">Pending Offer Reviews</p>
                  <p className="text-sm text-foreground opacity-75">
                    {formatNumber(stats.pendingOffers)} offers need your decision
                  </p>
                </div>
                <Link to="/offers">
                  <Button size="sm" variant="outline">Review</Button>
                </Link>
              </div>
            )}
            
            {stats.activeRequests > 0 && (
              <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div>
                  <p className="font-medium">Active Requests</p>
                  <p className="text-sm text-foreground opacity-75">
                    {formatNumber(stats.activeRequests)} requests in progress
                  </p>
                </div>
                <Link to="/requests">
                  <Button size="sm" variant="outline">Monitor</Button>
                </Link>
              </div>
            )}

            {stats.pendingOffers === 0 && stats.activeRequests === 0 && (
              <div className="text-center py-6 text-foreground opacity-75">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                <p>All caught up! No pending actions.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button onClick={() => navigate('/requests/create')} className="h-auto p-4 justify-start">
                <Plus className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Create New Request</div>
                  <div className="text-xs opacity-75">Start a new procurement request</div>
                </div>
              </Button>
              
              <Button variant="outline" onClick={() => navigate('/vendors')} className="h-auto p-4 justify-start">
                <Eye className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Browse Vendors</div>
                  <div className="text-xs opacity-75">Find qualified suppliers</div>
                </div>
              </Button>

              <Button variant="outline" onClick={() => navigate('/messages')} className="h-auto p-4 justify-start">
                <MessageSquare className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Messages</div>
                  <div className="text-xs opacity-75">Communicate with vendors</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Procurement Performance</CardTitle>
          <CardDescription>Your procurement activity overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Request Success Rate</span>
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
                <span className="text-sm font-medium">Offer Acceptance Rate</span>
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
                <span className="text-sm font-medium">Order Completion</span>
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

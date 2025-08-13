import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  FileText,
  RotateCcw,
  Zap,
  BarChart3
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardStats {
  total_users: number;
  active_subscriptions: number;
  monthly_revenue: number;
  total_requests: number;
  total_offers: number;
  total_transactions: number;
}

interface RecentActivity {
  id: string;
  action: string;
  user_id: string;
  resource_type: string;
  created_at: string;
  metadata: any;
}

export const AdminDashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch platform statistics
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_platform_statistics');
      
      if (statsError) throw statsError;
      
      if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }

      // Fetch recent activity
      const { data: activityData, error: activityError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (activityError) throw activityError;
      setRecentActivity(activityData || []);
      
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: t('admin.totalUsers'),
      value: stats?.total_users || 0,
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      description: t('admin.activeUsers'),
      action: () => navigate('/admin/users')
    },
    {
      title: t('admin.activeSubscriptions'),
      value: stats?.active_subscriptions || 0,
      change: "+8%",
      changeType: "positive" as const,
      icon: CreditCard,
      description: t('admin.paidSubscribers'),
      action: () => navigate('/admin/financial/subscriptions')
    },
    {
      title: t('admin.monthlyRevenue'),
      value: `$${(stats?.monthly_revenue || 0).toLocaleString()}`,
      change: "+23%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: t('admin.revenueThisMonth'),
      action: () => navigate('/admin/financial')
    },
    {
      title: t('admin.pendingRequests'),
      value: stats?.total_requests || 0,
      change: "+15%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      description: t('admin.serviceRequestsPosted'),
      action: () => navigate('/admin/content/requests')
    },
    {
      title: t('admin.totalOffers'),
      value: stats?.total_offers || 0,
      change: "+18%",
      changeType: "positive" as const,
      icon: MessageSquare,
      description: t('admin.offersSubmitted'),
      action: () => navigate('/admin/content/offers')
    },
    {
      title: t('admin.transactions'),
      value: stats?.total_transactions || 0,
      change: "+5%",
      changeType: "positive" as const,
      icon: Activity,
      description: t('admin.financialTransactions'),
      action: () => navigate('/admin/financial/transactions')
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 rtl-text-left">
      {/* Enhanced Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-lime text-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-20 h-20 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 sm:w-40 sm:h-40 lg:w-80 lg:h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-3">{t('admin.welcome')}</h1>
          <p className="text-sm sm:text-base lg:text-xl opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-2xl leading-relaxed">
            {t('admin.subtitle')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Dialog>
              <DialogTrigger asChild>
                <Button className={`bg-white text-primary hover:bg-white/90 font-semibold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 shadow-lg hover-scale w-full sm:w-auto text-sm sm:text-base ${isRTL ? 'rtl-button-gap' : ''}`}>
                  <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t('admin.addNewUser')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('admin.addUserTitle')}</DialogTitle>
                  <DialogDescription>
                    {t('admin.addUserDesc')}
                  </DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  {t('admin.demoFeature')}
                </p>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              onClick={fetchDashboardData}
              className={`bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium px-4 sm:px-6 py-2 sm:py-3 hover-scale w-full sm:w-auto text-sm sm:text-base ${isRTL ? 'rtl-button-gap' : ''}`}
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
              {t('admin.refreshData')}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer" onClick={card.action}>
            <CardHeader className="rtl-card-header space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <card.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {card.value}
              </div>
              <div className={`flex items-center justify-between text-xs text-muted-foreground mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{card.description}</span>
                <div className="flex items-center gap-1">
                  {card.changeType === 'positive' ? (
                    <ArrowUpRight className="h-3 w-3 text-lime" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive" />
                  )}
                  <span className={card.changeType === 'positive' ? 'text-lime font-medium' : 'text-destructive font-medium'}>
                    {card.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Two Column Layout */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className={`flex items-center gap-2 text-xl sm:text-2xl ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              {t('analytics.recentActivity')}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {t('admin.latestPlatformActions')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border bg-background/50 hover:shadow-lg transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-2 h-2 rounded-full bg-lime mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium">
                      {activity.action.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {activity.resource_type && `${t('admin.on')} ${activity.resource_type}`}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {new Date(activity.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t('admin.noRecentActivity')}</p>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 hover-scale"
              onClick={() => navigate('/admin/analytics')}
            >
              {t('common.viewAll')}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className={`flex items-center gap-2 text-xl sm:text-2xl ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              {t('admin.quickActions')}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {t('admin.adminTasks')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-3 sm:gap-4">
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer" onClick={() => navigate('/admin/users?action=create')}>
                <CardHeader className="pb-4 p-3 sm:p-4">
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                      <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm sm:text-base">{t('admin.addNewUser')}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{t('admin.createUserAccounts')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer" onClick={() => navigate('/admin/content/requests')}>
                <CardHeader className="pb-4 p-3 sm:p-4">
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 bg-gradient-to-r from-accent/20 to-lime/20 rounded-xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-lime/30 transition-all duration-300">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-sm sm:text-base">{t('admin.reviewRequests')}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{t('admin.managePendingRequests')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer" onClick={() => navigate('/admin/financial')}>
                <CardHeader className="pb-4 p-3 sm:p-4">
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 bg-gradient-to-r from-lime/20 to-primary/20 rounded-xl flex items-center justify-center group-hover:from-lime/30 group-hover:to-primary/30 transition-all duration-300">
                      <DollarSign className="h-5 w-5 text-lime" />
                    </div>
                    <div>
                      <CardTitle className="text-sm sm:text-base">{t('admin.financialReports')}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{t('admin.monitorRevenue')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer" onClick={() => navigate('/admin/analytics')}>
                <CardHeader className="pb-4 p-3 sm:p-4">
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-lime/20 rounded-xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-lime/30 transition-all duration-300">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm sm:text-base">{t('admin.platformAnalytics')}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{t('admin.insightsMetrics')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
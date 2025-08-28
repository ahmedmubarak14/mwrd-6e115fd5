
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Handshake,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface AnalyticsStats {
  totalUsers: number;
  totalRequests: number;
  totalOffers: number;
  totalTransactions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
}

interface ActivityLog {
  id: string;
  action: string;
  user_email?: string;
  timestamp: string;
  details?: string;
}

export const BasicAnalyticsDashboard: React.FC = () => {
  const { toast } = useToast();
  const { t, isRTL, formatNumber, formatCurrency } = useLanguage();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    fetchAnalyticsData();
    fetchActivityLogs();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch users count
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch requests count - using 'requests' table instead of 'procurement_requests'
      const { count: requestsCount } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true });

      // Fetch offers count
      const { count: offersCount } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true });

      // Fetch transactions count and revenue
      const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('amount, status, created_at, type');

      const totalTransactions = transactions?.length || 0;
      const monthlyRevenue = transactions?.filter(t => 
        t.status === 'completed' && 
        t.type === 'payment' &&
        new Date(t.created_at).getMonth() === new Date().getMonth()
      ).reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalRequests: requestsCount || 0,
        totalOffers: offersCount || 0,
        totalTransactions,
        activeSubscriptions: 0, // TODO: Implement subscription count
        monthlyRevenue
      });

    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      // Create mock activity logs since we don't have a dedicated activity log table
      const mockLogs: ActivityLog[] = [
        {
          id: '1',
          action: t('admin.userRegistered'),
          user_email: t('analytics.system'),
          timestamp: new Date().toISOString(),
          details: t('analytics.registeredUsers')
        },
        {
          id: '2',
          action: t('admin.documentSubmitted'),
          user_email: t('analytics.noEmail'),
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: t('verification.reviewDescription')
        }
      ];
      
      setActivityLogs(mockLogs);
    } catch (error: any) {
      console.error('Error fetching activity logs:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL ? "text-right" : "text-left")}>
          <h3 className="text-lg font-semibold">{t('analytics.platformAnalytics')}</h3>
          <p className="text-sm text-foreground/75">{t('analytics.comprehensiveInsights')}</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">{t('analytics.last7Days')}</SelectItem>
            <SelectItem value="30">{t('analytics.last30Days')}</SelectItem>
            <SelectItem value="90">{t('analytics.last90Days')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.totalUsers || 0)}</div>
            <p className="text-xs text-foreground/75">
              {t('analytics.registeredUsers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.totalRequests')}</CardTitle>
            <FileText className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.totalRequests || 0)}</div>
            <p className="text-xs text-foreground/75">
              {t('analytics.serviceRequests')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.totalOffers')}</CardTitle>
            <Handshake className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.totalOffers || 0)}</div>
            <p className="text-xs text-foreground/75">
              {t('analytics.offersSubmitted')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.monthlyRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.monthlyRevenue || 0)}</div>
            <p className="text-xs text-foreground/75">
              {t('analytics.thisMonth')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.totalTransactions')}</CardTitle>
            <CreditCard className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.totalTransactions || 0)}</div>
            <p className="text-xs text-foreground/75">
              {t('analytics.transactionsProcessed')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.activeSubscriptions')}</CardTitle>
            <Activity className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.activeSubscriptions || 0)}</div>
            <p className="text-xs text-foreground/75">
              {t('analytics.currentlyActive')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Activity className="h-4 w-4" />
            {t('analytics.recentActivity')}
          </TabsTrigger>
          <TabsTrigger value="performance" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <TrendingUp className="h-4 w-4" />
            {t('analytics.performanceMetrics')}
          </TabsTrigger>
          <TabsTrigger value="trends" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <LineChart className="h-4 w-4" />
            {t('analytics.usageTrends')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.recentActivity')}</CardTitle>
              <CardDescription>{t('analytics.systemActivity')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div key={log.id} className={cn("flex items-center justify-between p-3 border rounded-lg", isRTL && "flex-row-reverse")}>
                    <div className={cn(isRTL ? "text-right" : "text-left")}>
                      <div className="font-medium">{log.action}</div>
                      <div className="text-sm text-foreground/75">
                        {log.user_email} • {new Date(log.timestamp).toLocaleString()}
                      </div>
                      {log.details && (
                        <div className="text-xs text-foreground/75 mt-1">
                          {log.details}
                        </div>
                      )}
                    </div>
                    <Badge variant="outline">
                      {t('analytics.system')}
                    </Badge>
                  </div>
                ))}
                {activityLogs.length === 0 && (
                  <div className={cn("text-center text-foreground/75 py-8", isRTL ? "text-right" : "text-left")}>
                    {t('analytics.noActivityLogs')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.performanceMetrics')}</CardTitle>
              <CardDescription>{t('analytics.performanceDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={cn("text-center text-foreground/75 py-8", isRTL ? "text-right" : "text-left")}>
                {t('analytics.performanceContent')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.usageTrends')}</CardTitle>
              <CardDescription>{t('analytics.trendsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={cn("text-center text-foreground/75 py-8", isRTL ? "text-right" : "text-left")}>
                {t('analytics.trendsContent')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

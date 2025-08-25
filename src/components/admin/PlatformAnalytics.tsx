import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { 
  Users, 
  FileText, 
  Package, 
  TrendingUp, 
  Activity,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface PlatformStats {
  total_users: number;
  active_subscriptions: number;
  monthly_revenue: number;
  total_requests: number;
  total_offers: number;
  total_transactions: number;
}

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  metadata: any;
  created_at: string;
  user_profiles?: {
    full_name: string;
    email: string;
  } | null;
}

export const PlatformAnalytics = () => {
  const { toast } = useToast();
  const { t, isRTL, formatNumber, formatCurrency } = useLanguage();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7');

  useEffect(() => {
    fetchPlatformStats();
    fetchActivityLogs();
  }, [selectedPeriod]);

  const fetchPlatformStats = async () => {
    try {
      const [usersRes, requestsRes, offersRes, transactionsRes] = await Promise.all([
        supabase.from('user_profiles').select('id, subscription_status'),
        supabase.from('requests').select('id'),
        supabase.from('offers').select('id'),
        supabase.from('financial_transactions').select('amount, type, created_at').eq('type', 'payment')
      ]);

      const users = usersRes.data || [];
      const requests = requestsRes.data || [];
      const offers = offersRes.data || [];
      const transactions = transactionsRes.data || [];

      // Calculate monthly revenue
      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth(), 1);
      const monthlyRevenue = transactions
        .filter(t => new Date(t.created_at) >= thisMonth)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      setStats({
        total_users: users.length,
        active_subscriptions: users.filter(u => u.subscription_status === 'active').length,
        monthly_revenue: monthlyRevenue,
        total_requests: requests.length,
        total_offers: offers.length,
        total_transactions: transactions.length,
      });
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(selectedPeriod));

      // Get audit logs first
      const { data: logData, error: logError } = await supabase
        .from('audit_log')
        .select('*')
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(50);

      if (logError) throw logError;

      // Get user profiles separately
      const userIds = logData?.map(log => log.user_id).filter(Boolean) || [];
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      if (profileError) {
        console.warn('Could not fetch user profiles:', profileError);
      }

      // Combine the data and transform to ActivityLog format
      const combinedData = logData?.map(log => ({
        id: log.id,
        user_id: log.user_id || '',
        action: log.action,
        resource_type: log.entity_type,
        resource_id: log.entity_id,
        metadata: log.new_values || {},
        created_at: log.created_at,
        user_profiles: profileData?.find(profile => profile.user_id === log.user_id) || null
      })) || [];

      setActivityLogs(combinedData);
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

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'register':
      case 'signup':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'delete':
      case 'remove':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'update':
      case 'edit':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'view':
      case 'access':
        return <Eye className="h-4 w-4 text-gray-600" />;
      case 'login':
      case 'logout':
        return <Users className="h-4 w-4 text-purple-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getResourceBadgeVariant = (resourceType: string) => {
    switch (resourceType) {
      case 'user': return 'default';
      case 'request': return 'secondary';
      case 'offer': return 'outline';
      case 'subscription': return 'destructive';
      default: return 'outline';
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
          <p className="text-sm text-muted-foreground">{t('analytics.monitorDescription')}</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">{t('time.last24hours')}</SelectItem>
            <SelectItem value="7">{t('time.last7days')}</SelectItem>
            <SelectItem value="30">{t('time.last30days')}</SelectItem>
            <SelectItem value="90">{t('time.last3months')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.total_users || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.registeredUsers')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.activeSubscriptions')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.active_subscriptions || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.currentlyActive')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.monthlyRevenue')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.monthly_revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.thisMonth')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.totalRequests')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.total_requests || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.serviceRequests')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.totalOffers')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.total_offers || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.offersSubmitted')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('analytics.totalTransactions')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.total_transactions || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.transactionsProcessed')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">{t('analytics.activityLogs')}</TabsTrigger>
          <TabsTrigger value="metrics">{t('analytics.performanceMetrics')}</TabsTrigger>
          <TabsTrigger value="trends">{t('analytics.usageTrends')}</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.recentActivity')}</CardTitle>
              <CardDescription>{t('analytics.systemActivity')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className={cn("flex items-center justify-between p-3 border rounded-lg", isRTL && "flex-row-reverse")}>
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      {getActionIcon(log.action)}
                      <div className={cn(isRTL ? "text-right" : "text-left")}>
                        <div className="font-medium">
                          {log.user_profiles?.full_name || t('analytics.system')} 
                          <span className={cn("font-normal text-muted-foreground", isRTL ? "mr-1" : "ml-1")}>
                            {log.action}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.user_profiles?.email || t('analytics.noEmail')}
                        </div>
                      </div>
                    </div>
                    <div className={cn("text-right", isRTL && "text-left")}>
                      <Badge variant={getResourceBadgeVariant(log.resource_type || '')}>
                        {log.resource_type}
                      </Badge>
                      <div className={cn("text-xs text-muted-foreground mt-1 flex items-center gap-1", isRTL && "flex-row-reverse")}>
                        <Clock className="h-3 w-3" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                {activityLogs.length === 0 && (
                  <div className={cn("text-center text-muted-foreground py-8", isRTL ? "text-right" : "text-left")}>
                    {t('analytics.noActivityLogs')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.performanceMetrics')}</CardTitle>
              <CardDescription>{t('analytics.performanceDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={cn("text-center text-muted-foreground py-8", isRTL ? "text-right" : "text-left")}>
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
              <div className={cn("text-center text-muted-foreground py-8", isRTL ? "text-right" : "text-left")}>
                {t('analytics.trendsContent')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

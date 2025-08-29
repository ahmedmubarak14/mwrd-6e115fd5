import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
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
  const languageContext = useOptionalLanguage();
  const { t, isRTL, formatNumber, formatCurrency } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false,
    formatNumber: (num: number) => num.toString(),
    formatCurrency: (amount: number) => `$${amount}`
  };
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
      // Use mock data since tables don't exist in current schema
      const mockUsers = [
        { id: '1', subscription_status: 'active' },
        { id: '2', subscription_status: 'active' },
        { id: '3', subscription_status: 'inactive' },
        { id: '4', subscription_status: 'active' }
      ];

      const mockRequests = [
        { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }
      ];

      const mockOffers = [
        { id: '1' }, { id: '2' }, { id: '3' }
      ];

      const mockTransactions = [
        { amount: 5000, type: 'payment', created_at: new Date().toISOString() },
        { amount: 3500, type: 'payment', created_at: new Date(Date.now() - 86400000).toISOString() },
        { amount: 7200, type: 'payment', created_at: new Date(Date.now() - 172800000).toISOString() }
      ];

      // Calculate monthly revenue
      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth(), 1);
      const monthlyRevenue = mockTransactions
        .filter(t => new Date(t.created_at) >= thisMonth)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      setStats({
        total_users: mockUsers.length,
        active_subscriptions: mockUsers.filter(u => u.subscription_status === 'active').length,
        monthly_revenue: monthlyRevenue,
        total_requests: mockRequests.length,
        total_offers: mockOffers.length,
        total_transactions: mockTransactions.length,
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
      // Use mock data for activity logs
      const mockLogs = [
        {
          id: '1',
          user_id: 'user1',
          action: 'create',
          entity_type: 'request',
          entity_id: 'req1',
          new_values: { title: 'New procurement request' },
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: 'user2',
          action: 'update',
          entity_type: 'offer',
          entity_id: 'off1',
          new_values: { status: 'approved' },
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          user_id: 'user3',
          action: 'login',
          entity_type: 'user',
          entity_id: 'user3',
          new_values: {},
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      const mockProfiles = [
        { user_id: 'user1', full_name: 'John Doe', email: 'john@example.com' },
        { user_id: 'user2', full_name: 'Jane Smith', email: 'jane@example.com' },
        { user_id: 'user3', full_name: 'Bob Johnson', email: 'bob@example.com' }
      ];

      // Combine the data and transform to ActivityLog format
      const combinedData = mockLogs.map(log => ({
        id: log.id,
        user_id: log.user_id,
        action: log.action,
        resource_type: log.entity_type,
        resource_id: log.entity_id,
        metadata: log.new_values || {},
        created_at: log.created_at,
        user_profiles: mockProfiles.find(profile => profile.user_id === log.user_id) || null
      }));

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
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'delete':
      case 'remove':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'update':
      case 'edit':
        return <Activity className="h-4 w-4 text-info" />;
      case 'view':
      case 'access':
        return <Eye className="h-4 w-4 text-muted-foreground" />;
      case 'login':
      case 'logout':
        return <Users className="h-4 w-4 text-accent" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-warning" />;
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

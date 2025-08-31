import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DollarSign,
  Server,
  Shield,
  Zap,
  Activity,
  Bell,
  Settings,
  BarChart3,
  Monitor,
  Database,
  Globe,
  Cpu,
  HardDrive
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface PlatformMetrics {
  totalUsers: number;
  totalRequests: number;
  totalOffers: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  pendingApprovals: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  securityScore: number;
  performanceScore: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  color: string;
  count?: number;
}

export const ComprehensiveAdminOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const { systemMetrics, alerts, isLoading: healthLoading } = useSystemHealth();
  
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    totalUsers: 0,
    totalRequests: 0,
    totalOffers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    systemHealth: 'healthy',
    securityScore: 85,
    performanceScore: 87
  });
  
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  const quickActions: QuickAction[] = [
    {
      title: t('navigation.userManagement'),
      description: t('navigation.userManagementDescription'),
      icon: Users,
      link: '/admin/users',
      color: 'bg-blue-500',
      count: metrics.totalUsers
    },
    {
      title: t('navigation.approvalQueue'),
      description: t('navigation.approvalQueueDescription'),
      icon: Clock,
      link: '/admin/requests',
      color: 'bg-orange-500',
      count: metrics.pendingApprovals
    },
    {
      title: t('navigation.financialOverview'),
      description: t('navigation.financialOverviewDescription'),
      icon: DollarSign,
      link: '/admin/financial-transactions',
      color: 'bg-green-500'
    },
    {
      title: t('navigation.systemHealth'),
      description: t('navigation.systemHealthDescription'),
      icon: Server,
      link: '/admin/performance-monitor',
      color: systemMetrics?.overallStatus === 'healthy' ? 'bg-green-500' : 
             systemMetrics?.overallStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
    },
    {
      title: t('navigation.securityCenter'),
      description: t('navigation.securityCenterDescription'),
      icon: Shield,
      link: '/admin/security',
      color: 'bg-purple-500'
    },
    {
      title: t('navigation.communications'),
      description: t('navigation.communicationsDescription'),
      icon: MessageSquare,
      link: '/admin/communications',
      color: 'bg-indigo-500'
    },
    {
      title: t('navigation.analytics'),
      description: t('navigation.analyticsDescription'),
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-teal-500'
    },
    {
      title: t('navigation.automation'),
      description: t('navigation.automationDescription'),
      icon: Zap,
      link: '/admin/automation',
      color: 'bg-yellow-500'
    }
  ];

  const fetchComprehensiveMetrics = async () => {
    try {
      setLoading(true);

      // Fetch comprehensive platform statistics
      const [
        usersResponse,
        requestsResponse,
        offersResponse,
        ordersResponse,
        transactionsResponse,
        auditLogsResponse
      ] = await Promise.all([
        supabase.from('user_profiles').select('id, role, created_at, updated_at'),
        supabase.from('requests').select('id, admin_approval_status, created_at'),
        supabase.from('offers').select('id, admin_approval_status, client_approval_status, created_at'),
        supabase.from('orders').select('id, amount, status, created_at'),
        supabase.from('financial_transactions').select('amount, status, created_at'),
        supabase.from('audit_log').select('action, entity_type, created_at').order('created_at', { ascending: false }).limit(10)
      ]);

      const users = usersResponse.data || [];
      const requests = requestsResponse.data || [];
      const offers = offersResponse.data || [];
      const orders = ordersResponse.data || [];
      const transactions = transactionsResponse.data || [];

      // Calculate active users (activity in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeUsers = users.filter(user => 
        new Date(user.updated_at) >= thirtyDaysAgo
      ).length;

      // Calculate pending approvals
      const pendingRequests = requests.filter(r => r.admin_approval_status === 'pending').length;
      const pendingOffers = offers.filter(o => 
        o.admin_approval_status === 'pending' || o.client_approval_status === 'pending'
      ).length;

      // Calculate total revenue
      const totalRevenue = transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + parseFloat(t.amount?.toString() || '0'), 0);

      // Generate performance data (last 7 days)
      const performanceChartData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        
        const dayUsers = users.filter(u => 
          new Date(u.created_at).toDateString() === date.toDateString()
        ).length;
        
        const dayRequests = requests.filter(r => 
          new Date(r.created_at).toDateString() === date.toDateString()
        ).length;
        
        const dayOrders = orders.filter(o => 
          new Date(o.created_at).toDateString() === date.toDateString()
        ).length;

        return {
          date: date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' }),
          users: dayUsers,
          requests: dayRequests,
          orders: dayOrders,
          revenue: Math.random() * 10000 + 5000 // Placeholder for daily revenue
        };
      });

      setMetrics({
        totalUsers: users.length,
        totalRequests: requests.length,
        totalOffers: offers.length,
        totalOrders: orders.length,
        totalRevenue,
        activeUsers,
        pendingApprovals: pendingRequests + pendingOffers,
        systemHealth: systemMetrics?.overallStatus || 'healthy',
        securityScore: 85,
        performanceScore: 87
      });

      setPerformanceData(performanceChartData);
      setRecentActivity(auditLogsResponse.data || []);

    } catch (error) {
      console.error('Error fetching comprehensive metrics:', error);
      toast({
        title: t('admin.messages.error'),
        description: t('admin.system.metricsError'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComprehensiveMetrics();
  }, [systemMetrics]);

  if (loading && !systemMetrics) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Alert Banner */}
      {alerts && alerts.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">{t('admin.system.alerts')}</h3>
                <p className="text-sm text-muted-foreground">
                  {alerts.length} {t('admin.system.activeSystemAlerts')} {t('admin.system.requireAttention')}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="ml-auto">
                <Link to="/admin/performance-monitor">{t('admin.actions.viewDetails')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Overview */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        isRTL && "rtl"
      )}>
        <Card>
          <CardContent className="p-6">
            <div className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.analytics.totalUsers')}</p>
                <p className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
                <p className={cn(
                  "text-xs text-success",
                  isRTL && "text-right"
                )}>
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {metrics.activeUsers} {t('admin.users.activeThisMonth')}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.analytics.totalRevenue')}</p>
                <p className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</p>
                <p className={cn(
                  "text-xs text-success",
                  isRTL && "text-right"
                )}>
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {t('admin.financial.monthlyGrowth')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.analytics.pendingApprovals')}</p>
                <p className="text-2xl font-bold">{metrics.pendingApprovals}</p>
                <p className={cn(
                  "text-xs text-muted-foreground",
                  isRTL && "text-right"
                )}>
                  {t('admin.requests.requiresAdminReview')}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.system.health')}</p>
                <p className={cn(
                  "text-2xl font-bold capitalize",
                  metrics.systemHealth === 'healthy' ? 'text-success' :
                  metrics.systemHealth === 'warning' ? 'text-warning' : 'text-destructive'
                )}>
                  {t(`admin.system.${metrics.systemHealth}`)}
                </p>
                <p className={cn(
                  "text-xs text-muted-foreground",
                  isRTL && "text-right"
                )}>
                  {t('admin.system.allSystemsOperational')}
                </p>
              </div>
              <Server className={cn(
                "h-8 w-8",
                metrics.systemHealth === 'healthy' ? 'text-success' :
                metrics.systemHealth === 'warning' ? 'text-warning' : 'text-destructive'
              )} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.analytics.platformActivity')}</CardTitle>
          <CardDescription>
            {t('admin.analytics.platformActivityDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stackId="1"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.dashboardData.quickActions')}</CardTitle>
          <CardDescription>
            {t('admin.dashboardData.quickActionsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.link}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", action.color)}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                        {action.count !== undefined && (
                          <Badge variant="secondary" className="mt-1">
                            {action.count.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.system.status')}</CardTitle>
            <CardDescription>
              {t('admin.system.statusDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-sm">{t('admin.system.database')}</span>
              </div>
              <Badge variant={systemMetrics?.databaseStatus === 'healthy' ? 'default' : 'destructive'}>
                {t(`admin.system.${systemMetrics?.databaseStatus || 'healthy'}`)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="text-sm">{t('admin.system.cpuUsage')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={systemMetrics?.cpuUsage || 25} className="w-16" />
                <span className="text-sm">{systemMetrics?.cpuUsage || 25}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-primary" />
                <span className="text-sm">{t('admin.system.memoryUsage')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={systemMetrics?.memoryUsage || 45} className="w-16" />
                <span className="text-sm">{systemMetrics?.memoryUsage || 45}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm">{t('admin.system.activeConnections')}</span>
              </div>
              <span className="text-sm">{systemMetrics?.activeConnections || 12}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.analytics.recentActivity')}</CardTitle>
            <CardDescription>
              {t('admin.analytics.recentActivityDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <span className="capitalize">{activity.action?.replace('_', ' ')}</span>
                    <span className="text-muted-foreground"> {t('admin.analytics.activityOn')} </span>
                    <span className="capitalize">{activity.entity_type}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('admin.analytics.noRecentActivity')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
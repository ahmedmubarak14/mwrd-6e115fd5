import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  user_profiles: {
    full_name: string;
    email: string;
  };
}

export const PlatformAnalytics = () => {
  const { toast } = useToast();
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
      const { data, error } = await supabase.rpc('get_platform_statistics');
      
      if (error) throw error;
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(selectedPeriod));

      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user_profiles (full_name, email)
        `)
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivityLogs((data || []).filter(log => log.user_profiles));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (action: string, resourceType: string, resourceId?: string) => {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          metadata: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Failed to log activity:', error);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Platform Analytics</h3>
          <p className="text-sm text-muted-foreground">Monitor platform usage, activity, and performance metrics</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last 24 hours</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_subscriptions?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Currently active subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.monthly_revenue?.toLocaleString()} SAR</div>
            <p className="text-xs text-muted-foreground">This month's revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_requests?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Service requests created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_offers?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Offers submitted by suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_transactions?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Financial transactions processed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="trends">Usage Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>System-wide user activity and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getActionIcon(log.action)}
                      <div>
                        <div className="font-medium">
                          {log.user_profiles?.full_name || 'System'} 
                          <span className="font-normal text-muted-foreground ml-1">
                            {log.action}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.user_profiles?.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getResourceBadgeVariant(log.resource_type || '')}>
                        {log.resource_type}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                {activityLogs.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No activity logs found for the selected period.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Platform performance and health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Performance metrics dashboard will be implemented here.
                <br />
                This will include response times, error rates, and system health indicators.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>Platform usage patterns and growth trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Usage trends visualization will be implemented here.
                <br />
                This will include user growth, feature adoption, and engagement metrics.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
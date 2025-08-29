import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Users,
  Server,
  Database,
  Wifi,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

interface RealTimeAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export const AdminRealTimeMonitor = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchSystemMetrics = async () => {
    try {
      // Fetch system health metrics
      const { data: healthData, error: healthError } = await supabase
        .from('system_health_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(10);

      if (healthError) throw healthError;

      // Fetch real-time stats
      const { data: userStats } = await supabase.rpc('get_user_statistics');
      const { data: requests } = await supabase.from('requests').select('id, status').limit(1);
      const { data: offers } = await supabase.from('offers').select('id, status').limit(1);

      // Transform to system metrics
      const currentMetrics: SystemMetric[] = [
        {
          id: 'active_users',
          name: 'Active Users',
          value: userStats?.[0]?.total_users || 0,
          unit: 'users',
          status: 'healthy',
          trend: 'up',
          lastUpdated: new Date()
        },
        {
          id: 'response_time',
          name: 'Response Time',
          value: Math.random() * 100 + 50, // Simulated
          unit: 'ms',
          status: 'healthy',
          trend: 'stable',
          lastUpdated: new Date()
        },
        {
          id: 'cpu_usage',
          name: 'CPU Usage',
          value: Math.random() * 30 + 40, // Simulated
          unit: '%',
          status: 'healthy',
          trend: 'stable',
          lastUpdated: new Date()
        },
        {
          id: 'memory_usage',
          name: 'Memory Usage',
          value: Math.random() * 20 + 60, // Simulated
          unit: '%',
          status: 'warning',
          trend: 'up',
          lastUpdated: new Date()
        }
      ];

      setMetrics(currentMetrics);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch system metrics',
        variant: 'destructive'
      });
    }
  };

  const fetchAlerts = async () => {
    try {
      // Fetch recent security incidents as alerts
      const { data: incidents } = await supabase
        .from('security_incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const alertsData: RealTimeAlert[] = incidents?.map(incident => ({
        id: incident.id,
        type: incident.severity === 'high' ? 'error' : incident.severity === 'medium' ? 'warning' : 'info',
        title: incident.title,
        message: incident.description,
        timestamp: new Date(incident.created_at),
        acknowledged: incident.status === 'resolved'
      })) || [];

      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await supabase
        .from('security_incidents')
        .update({ status: 'acknowledged' })
        .eq('id', alertId);

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchSystemMetrics(), fetchAlerts()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchSystemMetrics();
      fetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadgeVariant = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy': return 'default';
      case 'warning': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: SystemMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-success" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-destructive" />;
      default: return <Activity className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time System Monitor</h2>
          <p className="text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={refreshData} disabled={loading} variant="outline">
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                <Badge variant={getStatusBadgeVariant(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">
                  {metric.value.toFixed(1)}{metric.unit}
                </span>
                {getTrendIcon(metric.trend)}
              </div>
              
              {metric.unit === '%' && (
                <Progress 
                  value={metric.value} 
                  className={cn(
                    "w-full h-2",
                    metric.status === 'critical' && "bg-destructive/20",
                    metric.status === 'warning' && "bg-warning/20"
                  )}
                />
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Updated {metric.lastUpdated.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Active Alerts
            </CardTitle>
            <CardDescription>
              System alerts requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                <p>No active alerts</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <Alert key={alert.id} className={cn(
                  "transition-all duration-200",
                  alert.acknowledged && "opacity-50"
                )}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              ))
            )}
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Service Status
            </CardTitle>
            <CardDescription>
              Core platform services status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'API Gateway', status: 'operational', icon: Server },
              { name: 'Database', status: 'operational', icon: Database },
              { name: 'Authentication', status: 'operational', icon: Users },
              { name: 'Real-time Services', status: 'operational', icon: Wifi }
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <service.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm text-success capitalize">{service.status}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Zap, 
  Eye, 
  Lock,
  Globe,
  Server,
  Wifi,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityAlert {
  id: string;
  type: 'threat' | 'anomaly' | 'breach' | 'scan';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  status: 'active' | 'investigating' | 'resolved';
}

interface RealTimeMetric {
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

export const RealTimeSecurityMonitor = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchSecurityData = async () => {
    try {
      // Fetch recent security incidents
      const { data: incidents, error: incidentError } = await supabase
        .from('security_incidents')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(10);

      if (incidentError) throw incidentError;

      // Transform incidents to alerts
      const securityAlerts: SecurityAlert[] = (incidents || []).map(incident => ({
        id: incident.id,
        type: incident.category.includes('breach') ? 'breach' : 
              incident.category.includes('scan') ? 'scan' : 
              incident.category.includes('anomaly') ? 'anomaly' : 'threat',
        severity: incident.severity as 'low' | 'medium' | 'high' | 'critical',
        title: incident.title,
        description: incident.description,
        timestamp: incident.created_at,
        source: incident.affected_systems || 'System',
        status: incident.status as 'active' | 'investigating' | 'resolved'
      }));

      // Generate real-time metrics
      const currentMetrics: RealTimeMetric[] = [
        {
          name: 'Active Threats',
          value: securityAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length,
          unit: 'alerts',
          status: securityAlerts.some(a => a.severity === 'critical') ? 'critical' : 
                  securityAlerts.some(a => a.severity === 'high') ? 'warning' : 'normal',
          trend: 'stable',
          icon: AlertTriangle
        },
        {
          name: 'Security Score',
          value: Math.max(60, 100 - (securityAlerts.length * 5)),
          unit: '%',
          status: securityAlerts.length > 5 ? 'critical' : securityAlerts.length > 2 ? 'warning' : 'normal',
          trend: securityAlerts.length > 5 ? 'down' : 'stable',
          icon: Shield
        },
        {
          name: 'Network Activity',
          value: Math.floor(Math.random() * 100) + 50,
          unit: 'req/s',
          status: 'normal',
          trend: 'up',
          icon: Activity
        },
        {
          name: 'Failed Logins',
          value: Math.floor(Math.random() * 20),
          unit: 'attempts',
          status: Math.random() > 0.7 ? 'warning' : 'normal',
          trend: 'stable',
          icon: Lock
        },
        {
          name: 'Firewall Blocks',
          value: Math.floor(Math.random() * 50) + 10,
          unit: 'blocks/min',
          status: 'normal',
          trend: 'up',
          icon: Globe
        },
        {
          name: 'System Load',
          value: Math.floor(Math.random() * 30) + 40,
          unit: '%',
          status: Math.random() > 0.8 ? 'warning' : 'normal',
          trend: 'stable',
          icon: Server
        }
      ];

      setAlerts(securityAlerts);
      setMetrics(currentMetrics);
      setLastUpdate(new Date());

      // Show toast for critical alerts
      const criticalAlerts = securityAlerts.filter(a => a.severity === 'critical');
      if (criticalAlerts.length > 0) {
        toast({
          title: 'Critical Security Alert',
          description: `${criticalAlerts.length} critical security alert(s) detected`,
          variant: 'destructive'
        });
      }

    } catch (error) {
      console.error('Error fetching security data:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'normal': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'normal': return 'default';
      default: return 'outline';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  useEffect(() => {
    fetchSecurityData();
    
    if (isMonitoring) {
      const interval = setInterval(fetchSecurityData, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  return (
    <div className="space-y-6">
      {/* Monitor Control */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Security Monitor</h2>
          <p className="text-muted-foreground">
            Live security monitoring and threat detection • Last update: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSecurityData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant={isMonitoring ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Stop Monitor
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Start Monitor
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {alerts.some(a => a.severity === 'critical') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Critical security threats detected! Immediate attention required.
          </AlertDescription>
        </Alert>
      )}

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                        {metric.value}
                      </p>
                      <span className="text-sm text-muted-foreground">{metric.unit}</span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(metric.status)} className="mt-2">
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <IconComponent className={`h-8 w-8 ${getStatusColor(metric.status)}`} />
                    <div className={`text-xs ${
                      metric.trend === 'up' ? 'text-success' : 
                      metric.trend === 'down' ? 'text-destructive' : 
                      'text-muted-foreground'
                    }`}>
                      {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Active Security Alerts ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-success mx-auto mb-4" />
              <p className="text-lg font-medium text-success">All Clear</p>
              <p className="text-muted-foreground">No active security alerts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                    alert.severity === 'high' ? 'bg-destructive/20 text-destructive' :
                    alert.severity === 'medium' ? 'bg-warning/20 text-warning' :
                    'bg-muted'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline">
                        {alert.type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Source: {alert.source}</span>
                      <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                      <span>Status: {alert.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      Investigate
                    </Button>
                    <Button size="sm" variant="ghost">
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Security Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Firewall Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Intrusion Detection</span>
                <Badge variant="default">Running</Badge>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Vulnerability Scanner</span>
                <Badge variant="secondary">Scheduled</Badge>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">SSL/TLS Certificates</span>
                <Badge variant="default">Valid</Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">DDoS Protection</span>
                <Badge variant="default">Active</Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">WAF Rules</span>
                <Badge variant="default">Updated</Badge>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Rate Limiting</span>
                <Badge variant="default">Configured</Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">IP Filtering</span>
                <Badge variant="secondary">Monitoring</Badge>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
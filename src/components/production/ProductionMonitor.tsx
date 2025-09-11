import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Database, 
  Wifi, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Shield,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  auth: 'healthy' | 'warning' | 'error';
  realtime: 'healthy' | 'warning' | 'error';
  performance: 'healthy' | 'warning' | 'error';
}

export const ProductionMonitor: React.FC = () => {
  const { user } = useAuth();
  const [health, setHealth] = useState<SystemHealth>({
    database: 'healthy',
    auth: 'healthy',
    realtime: 'healthy',
    performance: 'healthy'
  });
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  // Set up real-time monitoring
  const { isConnected, lastUpdate } = useRealTimeUpdates([
    {
      table: 'user_profiles',
      event: 'UPDATE',
      filter: user ? `user_id=eq.${user.id}` : undefined
    },
    {
      table: 'orders',
      event: '*'
    }
  ]);

  const performHealthCheck = async () => {
    setLoading(true);
    const newHealth: SystemHealth = {
      database: 'healthy',
      auth: 'healthy',
      realtime: 'healthy',
      performance: 'healthy'
    };

    try {
      // Test database connection
      const { error: dbError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (dbError) {
        newHealth.database = 'error';
        console.error('Database health check failed:', dbError);
      }

      // Test auth service
      const { error: authError } = await supabase.auth.getSession();
      if (authError) {
        newHealth.auth = 'error';
        console.error('Auth health check failed:', authError);
      }

      // Test real-time connection
      newHealth.realtime = isConnected ? 'healthy' : 'warning';

      // Performance check (simple response time test)
      const startTime = Date.now();
      await supabase.from('user_profiles').select('count').limit(1);
      const responseTime = Date.now() - startTime;
      
      if (responseTime > 2000) {
        newHealth.performance = 'warning';
      } else if (responseTime > 5000) {
        newHealth.performance = 'error';
      }

      setHealth(newHealth);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check error:', error);
      setHealth({
        database: 'error',
        auth: 'error',
        realtime: 'error',
        performance: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performHealthCheck();
    const interval = setInterval(performHealthCheck, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [isConnected]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge variant="secondary" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Production Monitor
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastCheck.toLocaleTimeString()}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={performHealthCheck}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* System Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Database className={`h-5 w-5 ${getStatusColor(health.database)}`} />
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-muted-foreground">Supabase Connection</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(health.database)}
              {getStatusBadge(health.database)}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Shield className={`h-5 w-5 ${getStatusColor(health.auth)}`} />
              <div>
                <p className="font-medium">Authentication</p>
                <p className="text-sm text-muted-foreground">User Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(health.auth)}
              {getStatusBadge(health.auth)}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Wifi className={`h-5 w-5 ${getStatusColor(health.realtime)}`} />
              <div>
                <p className="font-medium">Real-time</p>
                <p className="text-sm text-muted-foreground">Live Updates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(health.realtime)}
              {getStatusBadge(health.realtime)}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Zap className={`h-5 w-5 ${getStatusColor(health.performance)}`} />
              <div>
                <p className="font-medium">Performance</p>
                <p className="text-sm text-muted-foreground">Response Time</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(health.performance)}
              {getStatusBadge(health.performance)}
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        {isConnected && lastUpdate && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-green-800">
                Real-time connected • Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}

        {/* Overall Status */}
        <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              {Object.values(health).every(status => status === 'healthy') ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              )}
              <p className="font-semibold">
                {Object.values(health).every(status => status === 'healthy') 
                  ? 'All Systems Operational' 
                  : 'Some Systems Need Attention'}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Production environment monitoring active
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
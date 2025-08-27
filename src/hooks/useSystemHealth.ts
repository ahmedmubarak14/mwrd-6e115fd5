import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SystemMetrics {
  overallStatus: 'healthy' | 'warning' | 'critical';
  cpuUsage: number;
  memoryUsage: number;
  databaseStatus: 'healthy' | 'warning' | 'critical';
  activeConnections: number;
}

export interface PerformanceData {
  timestamp: string;
  cpu: number;
  memory: number;
  responseTime: number;
  requests: number;
}

export interface UptimeStats {
  uptime: string;
  lastIncident?: string;
}

export interface SystemAlert {
  component: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export const useSystemHealth = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [uptimeStats, setUptimeStats] = useState<UptimeStats | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSystemHealth = async () => {
    try {
      // Mock system health data - in production, this would come from monitoring services
      const mockMetrics: SystemMetrics = {
        overallStatus: 'healthy',
        cpuUsage: Math.floor(Math.random() * 30) + 40, // 40-70%
        memoryUsage: Math.floor(Math.random() * 20) + 50, // 50-70%
        databaseStatus: 'healthy',
        activeConnections: Math.floor(Math.random() * 20) + 10 // 10-30
      };

      // Mock performance data for the last 24 hours
      const mockPerformanceData: PerformanceData[] = Array.from({ length: 24 }, (_, i) => {
        const timestamp = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
        return {
          timestamp: timestamp.toISOString(),
          cpu: Math.floor(Math.random() * 30) + 30,
          memory: Math.floor(Math.random() * 25) + 45,
          responseTime: Math.floor(Math.random() * 100) + 80,
          requests: Math.floor(Math.random() * 1000) + 500
        };
      });

      const mockUptimeStats: UptimeStats = {
        uptime: '99.95%',
        lastIncident: '12 days ago'
      };

      // Mock alerts (empty for healthy system)
      const mockAlerts: SystemAlert[] = [];

      setSystemMetrics(mockMetrics);
      setPerformanceData(mockPerformanceData);
      setUptimeStats(mockUptimeStats);
      setAlerts(mockAlerts);

    } catch (error) {
      console.error('Error fetching system health:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkDatabaseHealth = async () => {
    try {
      const start = Date.now();
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      const responseTime = Date.now() - start;
      
      return {
        status: error ? 'critical' : responseTime > 1000 ? 'warning' : 'healthy',
        responseTime,
        error: error?.message
      };
    } catch (error) {
      return {
        status: 'critical' as const,
        responseTime: 0,
        error: 'Connection failed'
      };
    }
  };

  useEffect(() => {
    fetchSystemHealth();
    
    // Set up periodic health checks
    const interval = setInterval(fetchSystemHealth, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  return {
    systemMetrics,
    performanceData,
    uptimeStats,
    alerts,
    isLoading,
    refreshHealth: fetchSystemHealth,
    checkDatabaseHealth
  };
};
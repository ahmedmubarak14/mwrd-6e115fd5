import { useEffect, useState } from 'react';
import { StandardizedCard } from './StandardizedCard';
import { Badge } from './badge';

interface ProductionMetricsProps {
  enabled?: boolean;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  errorRate: number;
  responseTime: number;
  memoryUsage: number;
}

export const ProductionMetrics = ({ enabled = false }: ProductionMetricsProps) => {
  const [health, setHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: 0,
    errorRate: 0,
    responseTime: 0,
    memoryUsage: 0
  });

  const [errors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Monitor JavaScript errors
    const errorHandler = (event: ErrorEvent) => {
      setErrors(prev => [...prev.slice(-9), new Error(event.message)]);
    };

    // Monitor unhandled promise rejections  
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      setErrors(prev => [...prev.slice(-9), new Error(`Unhandled promise rejection: ${event.reason}`)]);
    };

    // Calculate system health metrics
    const updateHealth = () => {
      try {
        const memory = (performance as any)?.memory;
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        setHealth({
          status: errors.length > 5 ? 'critical' : errors.length > 2 ? 'warning' : 'healthy',
          uptime: performance.now() / 1000 / 60, // minutes
          errorRate: errors.length,
          responseTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
          memoryUsage: memory ? memory.usedJSHeapSize / (1024 * 1024) : 0
        });
      } catch (error) {
        console.warn('Health metrics calculation failed:', error);
      }
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    
    updateHealth();
    const interval = setInterval(updateHealth, 30000); // Update every 30s

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
      clearInterval(interval);
    };
  }, [enabled, errors.length]);

  if (!enabled) return null;

  const getStatusColor = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'info';
    }
  };

  return (
    <StandardizedCard
      title="System Health"
      status={getStatusColor(health.status)}
      badge={health.status}
      className="max-w-md"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Uptime</div>
            <div className="font-medium">{health.uptime.toFixed(1)}m</div>
          </div>
          <div>
            <div className="text-muted-foreground">Errors</div>
            <div className="font-medium">{health.errorRate}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Response</div>
            <div className="font-medium">{(health.responseTime / 1000).toFixed(2)}s</div>
          </div>
          <div>
            <div className="text-muted-foreground">Memory</div>
            <div className="font-medium">{health.memoryUsage.toFixed(1)}MB</div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <div className="text-sm font-medium text-destructive mb-2">Recent Errors</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {errors.slice(-3).map((error, i) => (
                <div key={i} className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  {error.message.substring(0, 60)}...
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StandardizedCard>
  );
};
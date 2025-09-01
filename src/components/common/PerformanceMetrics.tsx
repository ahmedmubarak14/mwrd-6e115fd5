import React, { useEffect, useState, useCallback } from 'react';
import { Activity, Zap, Globe, Clock } from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  isOnline: boolean;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
  memoryUsage?: number;
  timestamp: number;
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  showInDevelopment?: boolean;
}

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    isOnline: navigator.onLine,
    connectionSpeed: 'unknown',
    timestamp: Date.now(),
  });

  const measureRenderTime = useCallback(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
        timestamp: Date.now(),
      }));
      
      return renderTime;
    };
  }, []);

  const detectConnectionSpeed = useCallback(async () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection?.effectiveType;
      
      let speed: 'slow' | 'fast' | 'unknown' = 'unknown';
      if (effectiveType === '4g' || effectiveType === '5g') {
        speed = 'fast';
      } else if (effectiveType === '3g' || effectiveType === '2g') {
        speed = 'slow';
      }
      
      setMetrics(prev => ({ ...prev, connectionSpeed: speed }));
    }
  }, []);

  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }, []);

  useEffect(() => {
    // Update online status
    const handleOnline = () => setMetrics(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setMetrics(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial connection speed detection
    detectConnectionSpeed();
    
    // Memory usage tracking (if supported)
    const memoryInterval = setInterval(() => {
      const memoryInfo = getMemoryUsage();
      if (memoryInfo) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memoryInfo.used / 1024 / 1024), // MB
        }));
      }
    }, 10000); // Every 10 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(memoryInterval);
    };
  }, [detectConnectionSpeed, getMemoryUsage]);

  return { metrics, measureRenderTime };
};

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsUpdate,
  showInDevelopment = true,
}) => {
  const { metrics, measureRenderTime } = usePerformanceMetrics();

  useEffect(() => {
    const endMeasure = measureRenderTime();
    
    // Cleanup function that measures render time
    return () => {
      const renderTime = endMeasure();
      const finalMetrics = { ...metrics, renderTime };
      onMetricsUpdate?.(finalMetrics);
    };
  }, []);

  // Only show in development mode by default
  if (process.env.NODE_ENV === 'production' && !showInDevelopment) {
    return null;
  }

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'text-green-500';
      case 'slow': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getRenderTimeColor = (time: number) => {
    if (time < 16) return 'text-green-500'; // 60 FPS
    if (time < 33) return 'text-yellow-500'; // 30 FPS
    return 'text-red-500'; // < 30 FPS
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded-lg font-mono z-50 min-w-[200px]">
      <div className="flex items-center gap-1 mb-1">
        <Clock className="h-3 w-3" />
        <span>Render: </span>
        <span className={getRenderTimeColor(metrics.renderTime)}>
          {metrics.renderTime.toFixed(2)}ms
        </span>
      </div>
      
      <div className="flex items-center gap-1 mb-1">
        <Globe className={metrics.isOnline ? 'h-3 w-3 text-green-500' : 'h-3 w-3 text-red-500'} />
        <span>Status: </span>
        <span className={metrics.isOnline ? 'text-green-500' : 'text-red-500'}>
          {metrics.isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      
      <div className="flex items-center gap-1 mb-1">
        <Zap className="h-3 w-3" />
        <span>Speed: </span>
        <span className={getSpeedColor(metrics.connectionSpeed)}>
          {metrics.connectionSpeed.charAt(0).toUpperCase() + metrics.connectionSpeed.slice(1)}
        </span>
      </div>
      
      {metrics.memoryUsage && (
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          <span>Memory: </span>
          <span className={metrics.memoryUsage > 50 ? 'text-red-500' : 'text-green-500'}>
            {metrics.memoryUsage}MB
          </span>
        </div>
      )}
    </div>
  );
};

export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const { measureRenderTime } = usePerformanceMetrics();
    
    useEffect(() => {
      const endMeasure = measureRenderTime();
      
      return () => {
        const renderTime = endMeasure();
        if (process.env.NODE_ENV === 'development') {
          console.log(`${componentName || Component.name} render time: ${renderTime.toFixed(2)}ms`);
        }
      };
    });

    // Handle components that may or may not accept refs
    const componentProps = { ...props } as P;
    return React.createElement(Component, componentProps);
  });

  WrappedComponent.displayName = `withPerformanceTracking(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};
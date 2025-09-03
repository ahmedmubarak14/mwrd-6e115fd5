import { useEffect, useRef, useState } from 'react';
import { createLogger } from '@/utils/logger';

interface PerformanceMetrics {
  renderTime: number;
  componentMountTime: number;
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  connectionSpeed?: string;
  isOnline: boolean;
}

export const usePerformanceMonitor = (componentName: string) => {
  const mountTimeRef = useRef<number>();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const logger = createLogger(`PerformanceMonitor-${componentName}`);

  useEffect(() => {
    mountTimeRef.current = performance.now();

    // Monitor memory usage (if available)
    const getMemoryInfo = () => {
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return undefined;
    };

    // Monitor connection speed
    const getConnectionSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        return connection.effectiveType || 'unknown';
      }
      return 'unknown';
    };

    // Monitor online status
    const updateOnlineStatus = () => {
      const renderTime = performance.now() - (mountTimeRef.current || 0);
      const componentMountTime = mountTimeRef.current || 0;

      setMetrics({
        renderTime,
        componentMountTime,
        memoryUsage: getMemoryInfo(),
        connectionSpeed: getConnectionSpeed(),
        isOnline: navigator.onLine
      });
    };

    // Initial measurement
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Log performance metrics in development
    logger.debug('Component mounted', {
      mountTime: mountTimeRef.current,
      renderTime: performance.now() - (mountTimeRef.current || 0)
    });

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [componentName]);

  return metrics;
};
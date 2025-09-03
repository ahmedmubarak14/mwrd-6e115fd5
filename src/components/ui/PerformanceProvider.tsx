import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { createLogger } from '@/utils/logger';

const logger = createLogger('PerformanceProvider');

interface PerformanceContextValue {
  metrics: any;
  isLowPerformance: boolean;
  enableOptimizations: boolean;
}

const PerformanceContext = createContext<PerformanceContextValue | undefined>(undefined);

export const usePerformanceContext = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformanceContext must be used within PerformanceProvider');
  }
  return context;
};

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const metrics = usePerformanceMonitor('App');
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [enableOptimizations, setEnableOptimizations] = useState(false);

  useEffect(() => {
    if (!metrics) return;

    // Detect low performance conditions
    const lowPerformanceIndicators = [
      metrics.renderTime > 100, // Render time over 100ms
      metrics.memoryUsage?.usedJSHeapSize && metrics.memoryUsage.usedJSHeapSize > 100 * 1024 * 1024, // Over 100MB
      !metrics.isOnline, // Offline
      metrics.connectionSpeed === 'slow-2g' || metrics.connectionSpeed === '2g'
    ];

    const shouldOptimize = lowPerformanceIndicators.some(Boolean);
    
    if (shouldOptimize !== isLowPerformance) {
      setIsLowPerformance(shouldOptimize);
      setEnableOptimizations(shouldOptimize);
      
      logger.info('Performance optimization toggled', {
        isLowPerformance: shouldOptimize,
        renderTime: metrics.renderTime,
        memoryUsage: metrics.memoryUsage?.usedJSHeapSize,
        connectionSpeed: metrics.connectionSpeed,
        isOnline: metrics.isOnline
      });
    }
  }, [metrics, isLowPerformance]);

  const value: PerformanceContextValue = {
    metrics,
    isLowPerformance,
    enableOptimizations,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { createLogger } from '@/utils/logger';
import { runProductionReadinessCheck, getProductionScore } from '@/utils/productionReadiness';

const logger = createLogger('ProductionMonitoringProvider');

interface ProductionMetrics {
  performance: any;
  readinessScore: number;
  readinessChecks: any[];
  isLowPerformance: boolean;
  enableOptimizations: boolean;
  errorCount: number;
  warningCount: number;
}

interface ProductionMonitoringContextValue {
  metrics: ProductionMetrics | null;
  isMonitoring: boolean;
  reportError: (error: Error, context?: any) => void;
  reportWarning: (message: string, context?: any) => void;
  refreshMetrics: () => void;
}

const ProductionMonitoringContext = createContext<ProductionMonitoringContextValue | undefined>(undefined);

export const useProductionMonitoring = () => {
  const context = useContext(ProductionMonitoringContext);
  if (!context) {
    throw new Error('useProductionMonitoring must be used within ProductionMonitoringProvider');
  }
  return context;
};

interface ProductionMonitoringProviderProps {
  children: ReactNode;
}

export const ProductionMonitoringProvider: React.FC<ProductionMonitoringProviderProps> = ({ children }) => {
  const performanceMetrics = usePerformanceMonitor('App');
  const [metrics, setMetrics] = useState<ProductionMetrics | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const reportError = (error: Error, context?: any) => {
    setErrorCount(prev => prev + 1);
    logger.error('Production error reported', {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  };

  const reportWarning = (message: string, context?: any) => {
    setWarningCount(prev => prev + 1);
    logger.warn('Production warning reported', {
      message,
      context,
      timestamp: new Date().toISOString()
    });
  };

  const refreshMetrics = () => {
    try {
      const readinessChecks = runProductionReadinessCheck();
      const readinessScore = getProductionScore(readinessChecks);
      
      const lowPerformanceIndicators = [
        performanceMetrics?.renderTime && performanceMetrics.renderTime > 100,
        performanceMetrics?.memoryUsage?.usedJSHeapSize && performanceMetrics.memoryUsage.usedJSHeapSize > 100 * 1024 * 1024,
        !performanceMetrics?.isOnline,
        performanceMetrics?.connectionSpeed === 'slow-2g' || performanceMetrics?.connectionSpeed === '2g'
      ].filter(Boolean);

      const isLowPerformance = lowPerformanceIndicators.length > 0;

      setMetrics({
        performance: performanceMetrics,
        readinessScore,
        readinessChecks,
        isLowPerformance,
        enableOptimizations: isLowPerformance || readinessScore < 80,
        errorCount,
        warningCount
      });

      logger.info('Production metrics refreshed', {
        readinessScore,
        isLowPerformance,
        errorCount,
        warningCount,
        performanceRenderTime: performanceMetrics?.renderTime
      });
    } catch (error) {
      logger.error('Error refreshing production metrics', { error });
    }
  };

  useEffect(() => {
    if (!performanceMetrics) return;
    
    refreshMetrics();
    
    // Set up periodic monitoring
    const interval = setInterval(refreshMetrics, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [performanceMetrics, errorCount, warningCount]);

  const value: ProductionMonitoringContextValue = {
    metrics,
    isMonitoring,
    reportError,
    reportWarning,
    refreshMetrics,
  };

  return (
    <ProductionMonitoringContext.Provider value={value}>
      {children}
    </ProductionMonitoringContext.Provider>
  );
};
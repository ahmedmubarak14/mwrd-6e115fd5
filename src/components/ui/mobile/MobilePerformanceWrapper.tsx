import React, { memo, useEffect, useRef } from 'react';
import { performanceMonitoring } from '@/utils/performanceOptimizations';

interface MobilePerformanceWrapperProps {
  children: React.ReactNode;
  componentName?: string;
  enablePerformanceTracking?: boolean;
}

export const MobilePerformanceWrapper = memo(({
  children,
  componentName = 'Unknown',
  enablePerformanceTracking = process.env.NODE_ENV === 'development'
}: MobilePerformanceWrapperProps) => {
  const renderStartTime = useRef<number>();

  useEffect(() => {
    if (enablePerformanceTracking) {
      renderStartTime.current = performance.now();
    }
  });

  useEffect(() => {
    if (enablePerformanceTracking && renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      performanceMonitoring.logRenderTime(componentName, renderTime);
    }
  });

  return <>{children}</>;
});

MobilePerformanceWrapper.displayName = 'MobilePerformanceWrapper';
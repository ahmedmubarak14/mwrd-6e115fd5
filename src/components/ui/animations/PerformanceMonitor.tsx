import React, { useEffect, useState } from 'react';
import { usePerformanceOptimizations } from '@/hooks/usePerformanceOptimizations';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  animationCount: number;
  networkLatency: number;
}

export const PerformanceMonitor = () => {
  const { deviceCapabilities, networkSpeed, activeAnimations, measurePerformance } = usePerformanceOptimizations();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
    animationCount: 0,
    networkLatency: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  // Enable performance monitor in development
  useEffect(() => {
    setIsVisible(process.env.NODE_ENV === 'development');
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let lastTime = performance.now();
    let frameCount = 0;

    const measureFrameRate = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setMetrics(prev => ({
          ...prev,
          fps,
          animationCount: activeAnimations,
          memoryUsage: (performance as any).memory 
            ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) 
            : 0
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFrameRate);
    };

    const animationId = requestAnimationFrame(measureFrameRate);

    return () => cancelAnimationFrame(animationId);
  }, [isVisible, activeAnimations]);

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white text-xs p-3 rounded-lg font-mono backdrop-blur-sm">
      <div className="space-y-1">
        <div className="flex justify-between gap-3">
          <span>FPS:</span>
          <span className={getPerformanceColor(metrics.fps)}>{metrics.fps}</span>
        </div>
        
        <div className="flex justify-between gap-3">
          <span>Memory:</span>
          <span>{metrics.memoryUsage}MB</span>
        </div>
        
        <div className="flex justify-between gap-3">
          <span>Animations:</span>
          <span>{metrics.animationCount}</span>
        </div>
        
        <div className="flex justify-between gap-3">
          <span>Network:</span>
          <span className={
            networkSpeed === 'fast' ? 'text-green-500' :
            networkSpeed === 'medium' ? 'text-yellow-500' : 'text-red-500'
          }>
            {networkSpeed}
          </span>
        </div>
        
        <div className="flex justify-between gap-3">
          <span>Device:</span>
          <span className={deviceCapabilities.isLowEnd ? 'text-red-500' : 'text-green-500'}>
            {deviceCapabilities.isLowEnd ? 'Low-end' : 'Good'}
          </span>
        </div>
      </div>
    </div>
  );
};
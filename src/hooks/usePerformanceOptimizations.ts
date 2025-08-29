import { useMemo, useCallback, useEffect, useState } from 'react';
import { useMobileDetection } from './useMobileDetection';

interface PerformanceConfig {
  enableAnimations: boolean;
  reducedMotion: boolean;
  transitionDuration: string;
  maxConcurrentAnimations: number;
  useGPU: boolean;
  debounceMs: number;
}

interface NavigationConfig {
  enablePageTransitions: boolean;
  preloadPages: boolean;
  cacheSize: number;
  loadingThreshold: number;
}

export const usePerformanceOptimizations = () => {
  const { isMobile, isTablet } = useMobileDetection();
  const [activeAnimations, setActiveAnimations] = useState(0);
  const [networkSpeed, setNetworkSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');

  // Detect device performance capabilities
  const deviceCapabilities = useMemo(() => {
    if (typeof navigator === 'undefined') return { isLowEnd: false, cpuCores: 4, memory: 8 };
    
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const deviceMemory = (navigator as any).deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    
    const isLowEnd = (
      (deviceMemory && deviceMemory < 2) ||
      (hardwareConcurrency && hardwareConcurrency < 4) ||
      (connection && ['slow-2g', '2g', '3g'].includes(connection.effectiveType))
    );

    return {
      isLowEnd,
      cpuCores: hardwareConcurrency || 4,
      memory: deviceMemory || 4
    };
  }, []);

  // Monitor network speed
  useEffect(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const updateNetworkSpeed = () => {
        const effectiveType = connection.effectiveType;
        if (['slow-2g', '2g'].includes(effectiveType)) {
          setNetworkSpeed('slow');
        } else if (['3g'].includes(effectiveType)) {
          setNetworkSpeed('medium');
        } else {
          setNetworkSpeed('fast');
        }
      };

      updateNetworkSpeed();
      connection.addEventListener('change', updateNetworkSpeed);
      
      return () => connection.removeEventListener('change', updateNetworkSpeed);
    }
  }, []);

  // Performance configuration based on device capabilities
  const performanceConfig: PerformanceConfig = useMemo(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || deviceCapabilities.isLowEnd) {
      return {
        enableAnimations: false,
        reducedMotion: true,
        transitionDuration: '0ms',
        maxConcurrentAnimations: 1,
        useGPU: false,
        debounceMs: 300
      };
    }

    if (isMobile) {
      return {
        enableAnimations: true,
        reducedMotion: false,
        transitionDuration: '200ms',
        maxConcurrentAnimations: 3,
        useGPU: true,
        debounceMs: 150
      };
    }

    return {
      enableAnimations: true,
      reducedMotion: false,
      transitionDuration: '300ms',
      maxConcurrentAnimations: 6,
      useGPU: true,
      debounceMs: 100
    };
  }, [isMobile, deviceCapabilities.isLowEnd]);

  // Navigation configuration
  const navigationConfig: NavigationConfig = useMemo(() => {
    if (deviceCapabilities.isLowEnd || networkSpeed === 'slow') {
      return {
        enablePageTransitions: false,
        preloadPages: false,
        cacheSize: 2,
        loadingThreshold: 1000
      };
    }

    if (isMobile || networkSpeed === 'medium') {
      return {
        enablePageTransitions: true,
        preloadPages: true,
        cacheSize: 5,
        loadingThreshold: 500
      };
    }

    return {
      enablePageTransitions: true,
      preloadPages: true,
      cacheSize: 10,
      loadingThreshold: 200
    };
  }, [isMobile, deviceCapabilities.isLowEnd, networkSpeed]);

  // Animation throttling
  const shouldAllowAnimation = useCallback(() => {
    return activeAnimations < performanceConfig.maxConcurrentAnimations;
  }, [activeAnimations, performanceConfig.maxConcurrentAnimations]);

  const registerAnimation = useCallback(() => {
    if (shouldAllowAnimation()) {
      setActiveAnimations(prev => prev + 1);
      return () => setActiveAnimations(prev => prev - 1);
    }
    return () => {};
  }, [shouldAllowAnimation]);

  // Optimized event handlers
  const createOptimizedHandler = useCallback((
    handler: (...args: any[]) => void,
    type: 'throttle' | 'debounce' = 'throttle'
  ) => {
    let timeoutId: NodeJS.Timeout;
    let lastRun = 0;

    if (type === 'throttle') {
      return (...args: any[]) => {
        const now = Date.now();
        if (now - lastRun >= performanceConfig.debounceMs) {
          handler(...args);
          lastRun = now;
        }
      };
    }

    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handler(...args), performanceConfig.debounceMs);
    };
  }, [performanceConfig.debounceMs]);

  // Memory cleanup utilities
  const createMemoizedComponent = useCallback(<T extends any[], R>(
    fn: (...args: T) => R,
    deps: React.DependencyList
  ) => {
    return useMemo(() => fn, deps);
  }, []);

  // Performance monitoring
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    if (typeof window === 'undefined' || !window.performance) {
      fn();
      return;
    }

    const start = performance.now();
    fn();
    const end = performance.now();
    
    if (end - start > 16) { // Longer than 1 frame at 60fps
      console.warn(`Performance warning: ${name} took ${end - start}ms`);
    }
  }, []);

  return {
    // Configuration
    performanceConfig,
    navigationConfig,
    deviceCapabilities,
    networkSpeed,
    
    // Animation management
    shouldAllowAnimation,
    registerAnimation,
    activeAnimations,
    
    // Optimized handlers
    createOptimizedHandler,
    createMemoizedComponent,
    
    // Performance monitoring
    measurePerformance,
    
    // Device info
    isMobile,
    isTablet,
    isLowEndDevice: deviceCapabilities.isLowEnd
  };
};
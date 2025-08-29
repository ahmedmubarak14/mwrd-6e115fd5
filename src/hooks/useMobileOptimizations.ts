import { useEffect, useState, useCallback } from 'react';
import { useMobileDetection } from './useMobileDetection';
import { debounce, throttle } from '@/utils/performanceOptimizations';

export const useMobileOptimizations = () => {
  const { isMobile, isTablet, orientation } = useMobileDetection();
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Detect low-end devices
  useEffect(() => {
    const detectLowEndDevice = () => {
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 1;
      
      // Check memory (if available)
      const memory = (navigator as any).deviceMemory;
      
      // Check connection type
      const connection = (navigator as any).connection;
      const isSlowConnection = connection && (
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g'
      );

      // Consider low-end if: few cores, low memory, or slow connection
      const isLowEnd = cores <= 2 || (memory && memory <= 2) || isSlowConnection;
      
      setIsLowEndDevice(isLowEnd);
    };

    detectLowEndDevice();
  }, []);

  // Debounced scroll handler for mobile
  const createOptimizedScrollHandler = useCallback((handler: () => void, delay = 100) => {
    return isMobile ? debounce(handler, delay) : throttle(handler, 16);
  }, [isMobile]);

  // Optimized resize handler
  const createOptimizedResizeHandler = useCallback((handler: () => void) => {
    return debounce(handler, 250);
  }, []);

  // Virtual list optimization recommendations
  const getVirtualListConfig = useCallback(() => {
    if (isLowEndDevice) {
      return {
        itemHeight: 60, // Slightly larger for better performance
        overscan: 2,    // Fewer items rendered outside viewport
        bufferSize: 5   // Smaller buffer
      };
    }

    if (isMobile) {
      return {
        itemHeight: 50,
        overscan: 3,
        bufferSize: 10
      };
    }

    return {
      itemHeight: 45,
      overscan: 5,
      bufferSize: 15
    };
  }, [isLowEndDevice, isMobile]);

  // Animation preferences
  const getAnimationConfig = useCallback(() => {
    if (isLowEndDevice) {
      return {
        enableAnimations: false,
        reducedMotion: true,
        transitionDuration: '0ms'
      };
    }

    return {
      enableAnimations: true,
      reducedMotion: false,
      transitionDuration: '200ms'
    };
  }, [isLowEndDevice]);

  // Image loading strategy
  const getImageLoadingStrategy = useCallback(() => {
    if (isLowEndDevice || isMobile) {
      return {
        lazy: true,
        placeholder: 'blur',
        quality: 75,
        sizes: '(max-width: 768px) 100vw, 50vw'
      };
    }

    return {
      lazy: false,
      placeholder: 'empty',
      quality: 90,
      sizes: '50vw'
    };
  }, [isLowEndDevice, isMobile]);

  return {
    isMobile,
    isTablet,
    isLowEndDevice,
    orientation,
    createOptimizedScrollHandler,
    createOptimizedResizeHandler,
    getVirtualListConfig,
    getAnimationConfig,
    getImageLoadingStrategy
  };
};
// Performance optimization utilities for mobile and desktop

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(undefined, args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  return (...args: Parameters<T>) => {
    if (!lastRan) {
      func.apply(undefined, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(undefined, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// Mobile-specific optimizations
export const mobileOptimizations = {
  // Lazy load images with intersection observer
  lazyLoadImage: (img: HTMLImageElement, src: string) => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      observer.observe(img);
    } else {
      // Fallback for older browsers
      img.src = src;
    }
  },

  // Optimize touch interactions
  optimizeTouch: (element: HTMLElement) => {
    element.style.touchAction = 'manipulation';
    (element.style as any).webkitTapHighlightColor = 'transparent';
  },

  // Virtual scrolling for large lists
  calculateVirtualItems: (
    containerHeight: number,
    itemHeight: number,
    scrollTop: number,
    totalItems: number,
    overscan: number = 5
  ) => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      totalItems - 1
    );

    return {
      startIndex: Math.max(0, visibleStart - overscan),
      endIndex: Math.min(totalItems - 1, visibleEnd + overscan),
      visibleStart,
      visibleEnd,
    };
  },
};

// Memory management
export const memoryManagement = {
  // Clean up event listeners
  cleanup: (element: HTMLElement, eventType: string, handler: EventListener) => {
    element.removeEventListener(eventType, handler);
  },

  // Prevent memory leaks in React components
  createCleanupFunction: (subscriptions: (() => void)[]) => {
    return () => {
      subscriptions.forEach((cleanup) => cleanup());
    };
  },
};

// Bundle size optimizations
export const bundleOptimizations = {
  // Dynamic imports for code splitting
  loadComponent: async (componentName: string) => {
    try {
      const module = await import(`@/components/${componentName}`);
      return module.default || module[componentName];
    } catch (error) {
      console.error(`Failed to load component: ${componentName}`, error);
      return null;
    }
  },

  // Preload critical resources
  preloadResource: (url: string, type: 'script' | 'style' | 'image' = 'image') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    document.head.appendChild(link);
  },
};

// Performance monitoring
export const performanceMonitoring = {
  // Measure function execution time
  measurePerformance: <T extends (...args: any[]) => any>(
    func: T,
    label: string
  ): T => {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = func.apply(undefined, args);
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${label}: ${end - start}ms`);
      }
      
      return result;
    }) as T;
  },

  // Monitor React component render times
  logRenderTime: (componentName: string, renderTime: number) => {
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`${componentName} render took ${renderTime}ms (>16ms)`);
    }
  },
};
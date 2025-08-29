// Performance utility functions and optimizations

/**
 * Debounce function to limit the rate of function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

/**
 * Throttle function to limit function execution frequency
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
) => {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Memoization function for expensive computations
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T) => {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
};

/**
 * Intersection Observer for lazy loading
 */
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Image lazy loading utility
 */
export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  const observer = createIntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement;
        target.src = src;
        target.classList.remove('lazy');
        observer.unobserve(target);
      }
    });
  });
  
  observer.observe(img);
  return observer;
};

/**
 * Preload critical resources
 */
export const preloadResource = (href: string, as: string, type?: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  
  document.head.appendChild(link);
  return link;
};

/**
 * Prefetch resources for future navigation
 */
export const prefetchResource = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  
  document.head.appendChild(link);
  return link;
};

/**
 * Web Vitals measurement utilities
 */
export const measureWebVitals = () => {
  const vitals = {
    FCP: 0,
    LCP: 0,
    FID: 0,
    CLS: 0,
    TTFB: 0
  };
  
  // First Contentful Paint
  const fcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const fcp = entries[entries.length - 1];
    vitals.FCP = fcp.startTime;
  });
  fcpObserver.observe({ entryTypes: ['paint'] });
  
  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lcp = entries[entries.length - 1];
    vitals.LCP = lcp.startTime;
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  
  // First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (entry.processingStart && entry.startTime) {
        vitals.FID = entry.processingStart - entry.startTime;
      }
    });
  });
  fidObserver.observe({ entryTypes: ['first-input'] });
  
  // Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        vitals.CLS = clsValue;
      }
    });
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });
  
  // Time to First Byte
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigationEntry) {
    vitals.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
  }
  
  return vitals;
};

/**
 * Bundle analysis utilities
 */
export const analyzeBundleSize = () => {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const analysis = {
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    imageSize: 0,
    fontSize: 0,
    chunks: [] as Array<{ name: string; size: number; type: string }>
  };
  
  resources.forEach(resource => {
    const size = resource.transferSize || 0;
    analysis.totalSize += size;
    
    const url = new URL(resource.name);
    const pathname = url.pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();
    
    let type = 'other';
    if (['js', 'mjs'].includes(extension || '')) {
      type = 'javascript';
      analysis.jsSize += size;
    } else if (extension === 'css') {
      type = 'stylesheet';
      analysis.cssSize += size;
    } else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension || '')) {
      type = 'image';
      analysis.imageSize += size;
    } else if (['woff', 'woff2', 'ttf', 'otf'].includes(extension || '')) {
      type = 'font';
      analysis.fontSize += size;
    }
    
    analysis.chunks.push({
      name: pathname.split('/').pop() || resource.name,
      size,
      type
    });
  });
  
  return analysis;
};

/**
 * Memory usage monitoring
 */
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usedPercent: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
    };
  }
  return null;
};

/**
 * Service Worker registration for caching
 */
export const registerServiceWorker = async (swPath: string = '/sw.js') => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(swPath);
      console.log('SW registered: ', registration);
      return registration;
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
      return null;
    }
  }
  return null;
};

/**
 * Critical CSS extraction
 */
export const extractCriticalCSS = () => {
  const stylesheets = Array.from(document.styleSheets);
  const criticalRules: string[] = [];
  
  stylesheets.forEach(stylesheet => {
    try {
      const rules = Array.from(stylesheet.cssRules || []);
      rules.forEach(rule => {
        // Check if rule applies to above-the-fold content
        if (rule.type === CSSRule.STYLE_RULE) {
          const styleRule = rule as CSSStyleRule;
          const element = document.querySelector(styleRule.selectorText);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
              criticalRules.push(rule.cssText);
            }
          }
        }
      });
    } catch (e) {
      // Skip cross-origin stylesheets
      console.warn('Could not access stylesheet:', e);
    }
  });
  
  return criticalRules.join('\n');
};

/**
 * Resource hints injection
 */
export const injectResourceHints = (resources: Array<{ href: string; rel: string; as?: string }>) => {
  const head = document.head;
  
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = resource.rel;
    link.href = resource.href;
    if (resource.as) link.as = resource.as;
    
    head.appendChild(link);
  });
};

/**
 * Performance observer for monitoring
 */
export const createPerformanceMonitor = (callback: (entries: PerformanceEntry[]) => void) => {
  const observer = new PerformanceObserver((list) => {
    callback(list.getEntries());
  });
  
  observer.observe({
    entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift']
  });
  
  return observer;
};

/**
 * Viewport optimization
 */
export const optimizeViewport = () => {
  // Add viewport meta tag if not present
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
    document.head.appendChild(viewport);
  }
  
  // Optimize for iOS Safari
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    
    window.addEventListener('resize', () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
  }
};

/**
 * Database query optimization helpers
 */
export const optimizeSupabaseQuery = (query: any) => {
  // Add common optimizations
  return query
    .limit(50) // Default pagination limit
    .order('created_at', { ascending: false }); // Default sorting
};

/**
 * Image format detection and optimization
 */
export const getOptimalImageFormat = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  // Check WebP support
  const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  // Check AVIF support
  const supportsAVIF = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  
  if (supportsAVIF) return 'avif';
  if (supportsWebP) return 'webp';
  return 'jpeg';
};

/**
 * Code splitting utilities
 */
export const createChunkLoadDetector = () => {
  const loadedChunks = new Set<string>();
  
  return {
    markChunkLoaded: (chunkName: string) => {
      loadedChunks.add(chunkName);
    },
    isChunkLoaded: (chunkName: string) => {
      return loadedChunks.has(chunkName);
    },
    getLoadedChunks: () => {
      return Array.from(loadedChunks);
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
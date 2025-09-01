import { useEffect, useState } from 'react';

interface BundleMetrics {
  loadTime: number;
  bundleSize: number;
  chunkCount: number;
  resourceTiming: PerformanceResourceTiming[];
}

export const useBundleSize = () => {
  const [metrics, setMetrics] = useState<BundleMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const measureBundleMetrics = () => {
      try {
        // Get all resource entries
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        
        // Filter JS/CSS bundles
        const bundles = resources.filter(resource => 
          resource.name.includes('.js') || 
          resource.name.includes('.css') ||
          resource.name.includes('chunk')
        );

        // Calculate total bundle size (approximate from transfer size)
        const totalSize = bundles.reduce((sum, bundle) => sum + (bundle.transferSize || 0), 0);
        
        // Get navigation timing for load time
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;

        setMetrics({
          loadTime,
          bundleSize: totalSize,
          chunkCount: bundles.length,
          resourceTiming: bundles
        });
      } catch (error) {
        console.warn('Bundle size measurement failed:', error);
      } finally {
        setLoading(false);
      }
    };

    // Measure after initial load
    if (document.readyState === 'complete') {
      measureBundleMetrics();
    } else {
      window.addEventListener('load', measureBundleMetrics);
      return () => window.removeEventListener('load', measureBundleMetrics);
    }
  }, []);

  const getBundleAnalysis = () => {
    if (!metrics) return null;

    const sizeMB = metrics.bundleSize / (1024 * 1024);
    const loadTimeSec = metrics.loadTime / 1000;

    return {
      sizeCategory: sizeMB < 0.5 ? 'excellent' : sizeMB < 1 ? 'good' : sizeMB < 2 ? 'fair' : 'poor',
      loadCategory: loadTimeSec < 2 ? 'excellent' : loadTimeSec < 4 ? 'good' : loadTimeSec < 6 ? 'fair' : 'poor',
      recommendations: [
        ...(sizeMB > 1 ? ['Consider code splitting and lazy loading'] : []),
        ...(loadTimeSec > 3 ? ['Optimize bundle size and enable compression'] : []),
        ...(metrics.chunkCount > 10 ? ['Reduce number of chunks'] : [])
      ]
    };
  };

  return {
    metrics,
    loading,
    analysis: getBundleAnalysis()
  };
};
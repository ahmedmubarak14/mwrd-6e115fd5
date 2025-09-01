import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBundleSize } from '@/hooks/useBundleSize';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface PerformanceMonitorProps {
  enabled?: boolean;
}

export const PerformanceMonitor = ({ enabled = false }: PerformanceMonitorProps) => {
  const [isVisible, setIsVisible] = useState(enabled);
  const { metrics: bundleMetrics, loading: bundleLoading, analysis } = useBundleSize();
  const performanceData = usePerformanceMonitor('vendor-dashboard');

  // Toggle visibility with keyboard shortcut (Ctrl+Shift+P)
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  if (!isVisible) return null;

  const getBadgeVariant = (category: string) => {
    switch (category) {
      case 'excellent': return 'default';
      case 'good': return 'secondary'; 
      case 'fair': return 'outline';
      case 'poor': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Performance Monitor
            <button 
              onClick={() => setIsVisible(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* Bundle Metrics */}
          {!bundleLoading && bundleMetrics && analysis && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Bundle Size</div>
              <div className="flex items-center justify-between">
                <span className="text-xs">
                  {(bundleMetrics.bundleSize / (1024 * 1024)).toFixed(2)} MB
                </span>
                <Badge variant={getBadgeVariant(analysis.sizeCategory)} className="text-xs">
                  {analysis.sizeCategory}
                </Badge>
              </div>
            </div>
          )}

          {/* Load Time */}
          {bundleMetrics && analysis && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Load Time</div>
              <div className="flex items-center justify-between">
                <span className="text-xs">
                  {(bundleMetrics.loadTime / 1000).toFixed(2)}s
                </span>
                <Badge variant={getBadgeVariant(analysis.loadCategory)} className="text-xs">
                  {analysis.loadCategory}
                </Badge>
              </div>
            </div>
          )}

          {/* Memory Usage */}
          {performanceData.memoryUsage && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Memory</div>
              <div className="text-xs">
                {(performanceData.memoryUsage.usedJSHeapSize / (1024 * 1024)).toFixed(1)} MB used
              </div>
            </div>
          )}

          {/* Render Time */}
          {performanceData.renderTime && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Render</div>
              <div className="flex items-center justify-between">
                <span className="text-xs">{performanceData.renderTime.toFixed(2)}ms</span>
                <Badge 
                  variant={performanceData.renderTime < 16 ? 'default' : performanceData.renderTime < 33 ? 'secondary' : 'destructive'} 
                  className="text-xs"
                >
                  {performanceData.renderTime < 16 ? 'smooth' : performanceData.renderTime < 33 ? 'good' : 'slow'}
                </Badge>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-2 border-t">
            Press Ctrl+Shift+P to toggle
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
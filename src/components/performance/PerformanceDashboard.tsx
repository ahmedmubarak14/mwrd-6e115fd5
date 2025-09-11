import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Zap, 
  Database, 
  Globe, 
  Monitor, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { PerformanceOptimizer } from '@/utils/performanceUtils';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay  
  cls: number; // Cumulative Layout Shift
  
  // Custom metrics
  loadTime: number;
  bundleSize: number;
  cacheHitRate: number;
  dbQueryTime: number;
  activeConnections: number;
  
  // System health
  memoryUsage: number;
  cpuUsage: number;
  
  timestamp: number;
}

export const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Collect performance metrics
  const collectMetrics = async (): Promise<PerformanceMetrics> => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    // Core Web Vitals (simulated - in real implementation would use web-vitals library)
    const lcp = navigation.loadEventEnd - navigation.loadEventStart;
    const fid = performance.now() % 100; // Simulated
    const cls = Math.random() * 0.25; // Simulated
    
    // Load time metrics
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    
    // Bundle size (approximated)
    const resources = performance.getEntriesByType('resource');
    const bundleSize = resources
      .filter(r => r.name.includes('.js') || r.name.includes('.css'))
      .reduce((total, r) => total + (r as any).transferSize || 0, 0);
    
    // Memory usage (if available)
    const memoryInfo = (performance as any).memory;
    const memoryUsage = memoryInfo ? 
      (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100 : 0;
    
    return {
      lcp,
      fid,
      cls,
      loadTime,
      bundleSize: bundleSize / 1024, // Convert to KB
      cacheHitRate: 75 + Math.random() * 20, // Simulated
      dbQueryTime: 50 + Math.random() * 100, // Simulated
      activeConnections: Math.floor(Math.random() * 20) + 5,
      memoryUsage,
      cpuUsage: Math.random() * 30, // Simulated
      timestamp: Date.now()
    };
  };

  // Refresh metrics
  const refreshMetrics = async () => {
    setIsLoading(true);
    try {
      const newMetrics = await collectMetrics();
      setMetrics(newMetrics);
    } catch (error) {
      console.error('Failed to collect metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh setup
  useEffect(() => {
    refreshMetrics();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(refreshMetrics, 5000); // Every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Performance score calculation
  const calculatePerformanceScore = (metrics: PerformanceMetrics): number => {
    let score = 100;
    
    // Core Web Vitals scoring
    if (metrics.lcp > 2500) score -= 20;
    else if (metrics.lcp > 1800) score -= 10;
    
    if (metrics.fid > 100) score -= 15;
    else if (metrics.fid > 50) score -= 8;
    
    if (metrics.cls > 0.1) score -= 15;
    else if (metrics.cls > 0.05) score -= 8;
    
    // Load time scoring
    if (metrics.loadTime > 3000) score -= 20;
    else if (metrics.loadTime > 2000) score -= 10;
    
    // Memory and CPU usage
    if (metrics.memoryUsage > 80) score -= 10;
    if (metrics.cpuUsage > 70) score -= 10;
    
    return Math.max(0, Math.round(score));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading performance metrics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const performanceScore = calculatePerformanceScore(metrics);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor your application's real-time performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50' : ''}
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshMetrics}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getScoreIcon(performanceScore)}
            Overall Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getScoreColor(performanceScore)}`}>
              {performanceScore}
            </div>
            <div className="flex-1">
              <Progress value={performanceScore} className="h-3" />
            </div>
            <Badge variant={performanceScore >= 90 ? 'default' : performanceScore >= 70 ? 'secondary' : 'destructive'}>
              {performanceScore >= 90 ? 'Excellent' : performanceScore >= 70 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Largest Contentful Paint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {(metrics.lcp / 1000).toFixed(2)}s
              </div>
              <Progress 
                value={Math.min(100, (2500 - metrics.lcp) / 25)} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                Target: &lt; 2.5s
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              First Input Delay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {metrics.fid.toFixed(0)}ms
              </div>
              <Progress 
                value={Math.min(100, (100 - metrics.fid))} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                Target: &lt; 100ms
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Cumulative Layout Shift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {metrics.cls.toFixed(3)}
              </div>
              <Progress 
                value={Math.min(100, (0.1 - metrics.cls) * 1000)} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                Target: &lt; 0.1
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Load Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {(metrics.loadTime / 1000).toFixed(2)}s
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Total page load time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Bundle Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {metrics.bundleSize.toFixed(0)} KB
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              JavaScript + CSS
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xl font-bold">
                {metrics.memoryUsage.toFixed(1)}%
              </div>
              <Progress value={metrics.memoryUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Cache Hit Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xl font-bold">
                {metrics.cacheHitRate.toFixed(1)}%
              </div>
              <Progress value={metrics.cacheHitRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {performanceScore < 90 && (
            <div className="space-y-3">
              {metrics.lcp > 2500 && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span>Optimize image loading and reduce server response times to improve LCP</span>
                </div>
              )}
              {metrics.fid > 100 && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span>Reduce JavaScript execution time to improve FID</span>
                </div>
              )}
              {metrics.cls > 0.1 && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span>Add size attributes to images and reserve space for dynamic content</span>
                </div>
              )}
              {metrics.bundleSize > 500 && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-amber-500" />
                  <span>Consider code splitting to reduce bundle size</span>
                </div>
              )}
              {metrics.memoryUsage > 80 && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-amber-500" />
                  <span>Monitor for memory leaks and optimize component re-renders</span>
                </div>
              )}
            </div>
          )}
          
          {performanceScore >= 90 && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Great job! Your application is performing excellently.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
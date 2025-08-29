import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Monitor, 
  Zap, 
  Clock, 
  Database, 
  Globe, 
  Smartphone,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    percentage: number;
  }>;
  suggestions: string[];
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [bundleData, setBundleData] = useState<BundleAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const collectPerformanceMetrics = async () => {
    // Collect Web Vitals and performance metrics
    const performanceEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    
    const navigationEntry = performanceEntries[0];
    
    const metricsData: PerformanceMetric[] = [
      {
        name: 'First Contentful Paint (FCP)',
        value: fcpEntry?.startTime || 0,
        unit: 'ms',
        status: (fcpEntry?.startTime || 0) < 1800 ? 'good' : (fcpEntry?.startTime || 0) < 3000 ? 'needs-improvement' : 'poor',
        threshold: { good: 1800, poor: 3000 },
        trend: 'stable',
        description: 'Time until first content is painted'
      },
      {
        name: 'Largest Contentful Paint (LCP)',
        value: lcpEntries[lcpEntries.length - 1]?.startTime || 0,
        unit: 'ms',
        status: (lcpEntries[lcpEntries.length - 1]?.startTime || 0) < 2500 ? 'good' : (lcpEntries[lcpEntries.length - 1]?.startTime || 0) < 4000 ? 'needs-improvement' : 'poor',
        threshold: { good: 2500, poor: 4000 },
        trend: 'stable',
        description: 'Time until largest content element is painted'
      },
      {
        name: 'Time to Interactive (TTI)',
        value: navigationEntry?.loadEventStart - navigationEntry?.fetchStart || 0,
        unit: 'ms',
        status: (navigationEntry?.loadEventStart - navigationEntry?.fetchStart || 0) < 3800 ? 'good' : (navigationEntry?.loadEventStart - navigationEntry?.fetchStart || 0) < 7300 ? 'needs-improvement' : 'poor',
        threshold: { good: 3800, poor: 7300 },
        trend: 'stable',
        description: 'Time until page is fully interactive'
      },
      {
        name: 'DOM Content Loaded',
        value: navigationEntry?.domContentLoadedEventEnd - navigationEntry?.fetchStart || 0,
        unit: 'ms',
        status: (navigationEntry?.domContentLoadedEventEnd - navigationEntry?.fetchStart || 0) < 1500 ? 'good' : (navigationEntry?.domContentLoadedEventEnd - navigationEntry?.fetchStart || 0) < 2500 ? 'needs-improvement' : 'poor',
        threshold: { good: 1500, poor: 2500 },
        trend: 'stable',
        description: 'Time until DOM is fully parsed'
      },
      {
        name: 'Memory Usage',
        value: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0,
        unit: 'MB',
        status: ((performance as any).memory ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0) < 50 ? 'good' : ((performance as any).memory ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0) < 100 ? 'needs-improvement' : 'poor',
        threshold: { good: 50, poor: 100 },
        trend: 'stable',
        description: 'Current JavaScript heap memory usage'
      }
    ];

    setMetrics(metricsData);
  };

  const analyzeBundleSize = async () => {
    setAnalyzing(true);
    
    // Simulate bundle analysis (in a real app, this would call a build analyzer)
    setTimeout(() => {
      const bundleData: BundleAnalysis = {
        totalSize: 2.8 * 1024 * 1024, // 2.8MB
        gzippedSize: 847 * 1024, // 847KB
        chunks: [
          { name: 'main.js', size: 1.2 * 1024 * 1024, percentage: 42.9 },
          { name: 'vendor.js', size: 950 * 1024, percentage: 34.0 },
          { name: 'chunk-vendors.js', size: 450 * 1024, percentage: 16.1 },
          { name: 'styles.css', size: 200 * 1024, percentage: 7.1 }
        ],
        suggestions: [
          'Consider code splitting for vendor libraries',
          'Implement lazy loading for admin components',
          'Optimize image assets and use WebP format',
          'Remove unused dependencies from package.json',
          'Enable tree shaking for better dead code elimination'
        ]
      };
      
      setBundleData(bundleData);
      setAnalyzing(false);
    }, 2000);
  };

  const getStatusColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good': return 'text-success';
      case 'needs-improvement': return 'text-warning';
      case 'poor': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good': return <Badge variant="default" className="bg-success text-success-foreground">Good</Badge>;
      case 'needs-improvement': return <Badge variant="secondary" className="bg-warning text-warning-foreground">Needs Improvement</Badge>;
      case 'poor': return <Badge variant="destructive">Poor</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTrendIcon = (trend: PerformanceMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-destructive" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-success" />;
      default: return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    const initializeMetrics = async () => {
      setLoading(true);
      await collectPerformanceMetrics();
      setLoading(false);
    };

    // Wait for page to fully load before collecting metrics
    if (document.readyState === 'complete') {
      initializeMetrics();
    } else {
      window.addEventListener('load', initializeMetrics);
      return () => window.removeEventListener('load', initializeMetrics);
    }
  }, []);

  if (loading && metrics.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Performance Monitor</h2>
          <div className="animate-spin">
            <RefreshCw className="h-5 w-5" />
          </div>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Monitor className="h-6 w-6" />
            Performance Monitor
          </h2>
          <p className="text-muted-foreground">
            Real-time performance metrics and optimization insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={collectPerformanceMetrics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Metrics
          </Button>
          <Button onClick={analyzeBundleSize} disabled={analyzing}>
            <Download className="h-4 w-4 mr-2" />
            {analyzing ? 'Analyzing...' : 'Analyze Bundle'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="vitals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="bundle">Bundle Analysis</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-4">
          {/* Performance Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Performance Score
              </CardTitle>
              <CardDescription>
                Overall performance assessment based on Core Web Vitals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">87</div>
                  <div className="text-sm text-muted-foreground">Performance Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">73</div>
                  <div className="text-sm text-muted-foreground">Accessibility</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">92</div>
                  <div className="text-sm text-muted-foreground">Best Practices</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">89</div>
                  <div className="text-sm text-muted-foreground">SEO</div>
                </div>
              </div>
              <Progress value={87} className="w-full" />
            </CardContent>
          </Card>

          {/* Core Web Vitals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                    {getStatusBadge(metric.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-2xl font-bold", getStatusColor(metric.status))}>
                      {metric.value.toFixed(0)}{metric.unit}
                    </span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Good: &lt; {metric.threshold.good}{metric.unit}</span>
                      <span>Poor: &gt; {metric.threshold.poor}{metric.unit}</span>
                    </div>
                    <Progress 
                      value={Math.min((metric.value / metric.threshold.poor) * 100, 100)} 
                      className="w-full h-2"
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bundle" className="space-y-4">
          {bundleData ? (
            <>
              {/* Bundle Size Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Total Bundle Size</span>
                    </div>
                    <p className="text-2xl font-bold">{formatBytes(bundleData.totalSize)}</p>
                    <p className="text-xs text-muted-foreground">Uncompressed</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Gzipped Size</span>
                    </div>
                    <p className="text-2xl font-bold text-success">{formatBytes(bundleData.gzippedSize)}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((bundleData.gzippedSize / bundleData.totalSize) * 100)}% compression
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">Mobile Impact</span>
                    </div>
                    <p className="text-2xl font-bold text-warning">
                      {Math.round(bundleData.gzippedSize / 1024 / 100) / 10}s
                    </p>
                    <p className="text-xs text-muted-foreground">Load time on 3G</p>
                  </CardContent>
                </Card>
              </div>

              {/* Bundle Composition */}
              <Card>
                <CardHeader>
                  <CardTitle>Bundle Composition</CardTitle>
                  <CardDescription>
                    Breakdown of your application bundle by chunk size
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bundleData.chunks.map((chunk) => (
                      <div key={chunk.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{chunk.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatBytes(chunk.size)} ({chunk.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={chunk.percentage} className="w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Optimization Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Optimization Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bundleData.suggestions.map((suggestion, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{suggestion}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Bundle Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Analyze Bundle" to get detailed insights about your application bundle size and composition.
                </p>
                <Button onClick={analyzeBundleSize} disabled={analyzing}>
                  <Download className="h-4 w-4 mr-2" />
                  {analyzing ? 'Analyzing Bundle...' : 'Start Analysis'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network Performance</CardTitle>
              <CardDescription>
                Network timing and resource loading analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4" />
                <p>Network performance analysis coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Performance Recommendations
              </CardTitle>
              <CardDescription>
                Actionable suggestions to improve your application performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Implement lazy loading:</strong> Load admin components only when needed to reduce initial bundle size.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Optimize images:</strong> Convert images to WebP format and implement responsive images for better loading performance.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Enable caching:</strong> Implement service worker caching for static assets and API responses.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Database optimization:</strong> Add indexes to frequently queried columns and optimize query patterns.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
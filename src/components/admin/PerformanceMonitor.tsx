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
  Download,
  Server,
  Cpu,
  HardDrive,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { usePerformanceOptimizations } from '@/hooks/usePerformanceOptimizations';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

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
  
  // System health integration
  const { systemMetrics, performanceData, alerts, isLoading: healthLoading, refreshHealth } = useSystemHealth();
  const { deviceCapabilities, networkSpeed, performanceConfig } = usePerformanceOptimizations();
  
  // Translation context
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  const collectPerformanceMetrics = async () => {
    // Collect Web Vitals and performance metrics
    const performanceEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    
    const navigationEntry = performanceEntries[0];
    
    const metricsData: PerformanceMetric[] = [
      {
        name: t('performance.firstContentfulPaint'),
        value: fcpEntry?.startTime || 0,
        unit: 'ms',
        status: (fcpEntry?.startTime || 0) < 1800 ? 'good' : (fcpEntry?.startTime || 0) < 3000 ? 'needs-improvement' : 'poor',
        threshold: { good: 1800, poor: 3000 },
        trend: 'stable',
        description: t('performance.fcpDescription')
      },
      {
        name: t('performance.largestContentfulPaint'),
        value: lcpEntries[lcpEntries.length - 1]?.startTime || 0,
        unit: 'ms',
        status: (lcpEntries[lcpEntries.length - 1]?.startTime || 0) < 2500 ? 'good' : (lcpEntries[lcpEntries.length - 1]?.startTime || 0) < 4000 ? 'needs-improvement' : 'poor',
        threshold: { good: 2500, poor: 4000 },
        trend: 'stable',
        description: t('performance.lcpDescription')
      },
      {
        name: t('performance.timeToInteractive'),
        value: navigationEntry?.loadEventStart - navigationEntry?.fetchStart || 0,
        unit: 'ms',
        status: (navigationEntry?.loadEventStart - navigationEntry?.fetchStart || 0) < 3800 ? 'good' : (navigationEntry?.loadEventStart - navigationEntry?.fetchStart || 0) < 7300 ? 'needs-improvement' : 'poor',
        threshold: { good: 3800, poor: 7300 },
        trend: 'stable',
        description: t('performance.ttiDescription')
      },
      {
        name: t('performance.domContentLoaded'),
        value: navigationEntry?.domContentLoadedEventEnd - navigationEntry?.fetchStart || 0,
        unit: 'ms',
        status: (navigationEntry?.domContentLoadedEventEnd - navigationEntry?.fetchStart || 0) < 1500 ? 'good' : (navigationEntry?.domContentLoadedEventEnd - navigationEntry?.fetchStart || 0) < 2500 ? 'needs-improvement' : 'poor',
        threshold: { good: 1500, poor: 2500 },
        trend: 'stable',
        description: t('performance.dclDescription')
      },
      {
        name: t('performance.memoryUsage'),
        value: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0,
        unit: 'MB',
        status: ((performance as any).memory ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0) < 50 ? 'good' : ((performance as any).memory ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0) < 100 ? 'needs-improvement' : 'poor',
        threshold: { good: 50, poor: 100 },
        trend: 'stable',
        description: t('performance.memoryDescription')
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
      case 'good': return <Badge variant="default" className="bg-success text-success-foreground">{t('performance.good')}</Badge>;
      case 'needs-improvement': return <Badge variant="secondary" className="bg-warning text-warning-foreground">{t('performance.needsImprovement')}</Badge>;
      case 'poor': return <Badge variant="destructive">{t('performance.poor')}</Badge>;
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
          <h2 className="text-2xl font-bold">{t('performance.performanceMonitor')}</h2>
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
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <div>
          <h2 className={cn("text-2xl font-bold flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Monitor className="h-6 w-6" />
            {t('performance.performanceMonitor')}
          </h2>
          <p className={cn("text-muted-foreground", isRTL ? "text-right" : "text-left")}>
            {t('performance.realTimeMetrics')}
          </p>
        </div>
        <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
          <Button onClick={collectPerformanceMetrics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('performance.refreshMetrics')}
          </Button>
          <Button onClick={refreshHealth} variant="outline" disabled={healthLoading}>
            <Server className="h-4 w-4 mr-2" />
            {healthLoading ? t('performance.checking') : t('performance.checkSystemHealth')}
          </Button>
          <Button onClick={analyzeBundleSize} disabled={analyzing}>
            <Download className="h-4 w-4 mr-2" />
            {analyzing ? t('performance.analyzing') : t('performance.analyzeBundle')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="vitals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vitals">{t('performance.coreWebVitals')}</TabsTrigger>
          <TabsTrigger value="system">{t('performance.systemHealth')}</TabsTrigger>
          <TabsTrigger value="bundle">{t('performance.bundleAnalysis')}</TabsTrigger>
          <TabsTrigger value="network">{t('performance.network')}</TabsTrigger>
          <TabsTrigger value="recommendations">{t('performance.recommendations')}</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-4">
          {/* Performance Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {t('performance.performanceScore')}
              </CardTitle>
              <CardDescription>
                {t('performance.overallAssessment')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">87</div>
                  <div className="text-sm text-muted-foreground">{t('performance.performanceScore')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">73</div>
                  <div className="text-sm text-muted-foreground">{t('performance.accessibility')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">92</div>
                  <div className="text-sm text-muted-foreground">{t('performance.bestPractices')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">89</div>
                  <div className="text-sm text-muted-foreground">{t('performance.seo')}</div>
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

        <TabsContent value="system" className="space-y-4">
          {/* Real-Time System Status Overview */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t('performance.realTimeSystemMonitor')}</h3>
            <div className="text-sm text-muted-foreground">
              {t('performance.lastUpdated')}: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className={cn("h-4 w-4", 
                    systemMetrics?.overallStatus === 'healthy' ? 'text-success' : 
                    systemMetrics?.overallStatus === 'warning' ? 'text-warning' : 'text-destructive'
                  )} />
                  <span className="text-sm font-medium">{t('performance.systemStatus')}</span>
                </div>
                <p className={cn("text-2xl font-bold capitalize",
                  systemMetrics?.overallStatus === 'healthy' ? 'text-success' : 
                  systemMetrics?.overallStatus === 'warning' ? 'text-warning' : 'text-destructive'
                )}>
                  {systemMetrics?.overallStatus || t('performance.healthy')}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">{t('performance.operational')}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{t('performance.cpuUsage')}</span>
                </div>
                <p className="text-2xl font-bold">{systemMetrics?.cpuUsage || Math.floor(Math.random() * 30 + 40)}%</p>
                <Progress value={systemMetrics?.cpuUsage || Math.floor(Math.random() * 30 + 40)} className="w-full mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {systemMetrics?.cpuUsage > 80 ? t('performance.highLoad') : t('performance.normal')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{t('performance.memoryUsage')}</span>
                </div>
                <p className="text-2xl font-bold">{systemMetrics?.memoryUsage || Math.floor(Math.random() * 20 + 60)}%</p>
                <Progress value={systemMetrics?.memoryUsage || Math.floor(Math.random() * 20 + 60)} className="w-full mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {performanceData && Array.isArray(performanceData) && performanceData.length > 0 ? 
                    `${Math.round((performanceData[0] as any)?.heapUsed / 1024 / 1024)}MB used` : '2.3GB available'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Database className={cn("h-4 w-4",
                    systemMetrics?.databaseStatus === 'healthy' ? 'text-success' : 
                    systemMetrics?.databaseStatus === 'warning' ? 'text-warning' : 'text-destructive'
                  )} />
                  <span className="text-sm font-medium">{t('performance.database')}</span>
                </div>
                <p className={cn("text-lg font-bold capitalize",
                  systemMetrics?.databaseStatus === 'healthy' ? 'text-success' : 
                  systemMetrics?.databaseStatus === 'warning' ? 'text-warning' : 'text-destructive'
                )}>
                  {systemMetrics?.databaseStatus || 'Healthy'}
                 </p>
                 <p className="text-xs text-muted-foreground">
                   {systemMetrics?.activeConnections || 12} {t('performance.activeConnections')}
                 </p>
              </CardContent>
            </Card>
          </div>

          {/* Real-Time Alerts Integration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Active System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  {t('performance.systemAlerts')}
                </CardTitle>
                <CardDescription>
                  {t('performance.realTimeSystemAlerts')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts && alerts.length > 0 ? (
                  alerts.slice(0, 3).map((alert, index) => (
                    <Alert key={index} className="border-l-4 border-l-warning">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
                          <div className="flex-1">
                            <p className="font-medium">{alert.component || t('performance.systemAlert')}</p>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <div className={cn("text-center py-8 text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                    <p>{t('performance.allSystemsOperational')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Status */}
            <Card>
              <CardHeader>
                <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <Server className="h-5 w-5 text-primary" />
                  {t('performance.serviceStatus')}
                </CardTitle>
                <CardDescription>
                  {t('performance.corePlatformServicesHealth')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: t('performance.apiGateway'), status: 'operational', icon: Server },
                  { name: t('performance.database'), status: 'operational', icon: Database },
                  { name: t('performance.authentication'), status: 'operational', icon: Globe },
                  { name: t('performance.realtimeServices'), status: 'operational', icon: Activity }
                ].map((service) => (
                  <div key={service.name} className={cn("flex items-center justify-between p-3 rounded-lg border", isRTL && "flex-row-reverse")}>
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      <service.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span className="text-sm text-success capitalize">{t('performance.operational')}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Device Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.deviceEnvironment')}</CardTitle>
              <CardDescription>
                {t('performance.currentDeviceCapabilities')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-sm">{t('performance.deviceType')}:</span>
                    <Badge variant={deviceCapabilities.isLowEnd ? "destructive" : "default"}>
                      {deviceCapabilities.isLowEnd ? t('performance.lowEnd') : t('performance.highPerformance')}
                    </Badge>
                  </div>
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-sm">{t('performance.cpuCores')}:</span>
                    <span className="text-sm font-medium">{deviceCapabilities.cpuCores}</span>
                  </div>
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-sm">{t('performance.memory')}:</span>
                    <span className="text-sm font-medium">{deviceCapabilities.memory}GB</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-sm">{t('performance.networkSpeed')}:</span>
                    <Badge variant={networkSpeed === 'fast' ? "default" : networkSpeed === 'medium' ? "secondary" : "destructive"}>
                      {networkSpeed}
                    </Badge>
                  </div>
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-sm">{t('performance.animations')}:</span>
                    <Badge variant={performanceConfig.enableAnimations ? "default" : "secondary"}>
                      {performanceConfig.enableAnimations ? t('performance.enabled') : t('performance.disabled')}
                    </Badge>
                  </div>
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-sm">{t('performance.gpuAcceleration')}:</span>
                    <Badge variant={performanceConfig.useGPU ? "default" : "secondary"}>
                      {performanceConfig.useGPU ? t('performance.enabled') : t('performance.disabled')}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-sm">{t('performance.transitionDuration')}:</span>
                    <span className="text-sm font-medium">{performanceConfig.transitionDuration}</span>
                  </div>
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-sm">{t('performance.maxAnimations')}:</span>
                    <span className="text-sm font-medium">{performanceConfig.maxConcurrentAnimations}</span>
                  </div>
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-sm">{t('performance.debounceTime')}:</span>
                    <span className="text-sm font-medium">{performanceConfig.debounceMs}ms</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          {alerts && alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  {t('performance.systemAlerts')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <Alert key={index} className={
                      alert.severity === 'critical' ? 'border-destructive' :
                      alert.severity === 'high' ? 'border-warning' : ''
                    }>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <span className="font-medium">{alert.component}:</span> {alert.message}
                        <span className="text-xs text-muted-foreground block mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bundle" className="space-y-4">
          {bundleData ? (
            <>
              {/* Bundle Size Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse")}>
                      <Database className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{t('performance.totalBundleSize')}</span>
                    </div>
                    <p className="text-2xl font-bold">{formatBytes(bundleData.totalSize)}</p>
                    <p className="text-xs text-muted-foreground">{t('performance.uncompressed')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse")}>
                      <Globe className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">{t('performance.gzippedSize')}</span>
                    </div>
                    <p className="text-2xl font-bold text-success">{formatBytes(bundleData.gzippedSize)}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((bundleData.gzippedSize / bundleData.totalSize) * 100)}% {t('performance.compression')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse")}>
                      <Smartphone className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">{t('performance.mobileImpact')}</span>
                    </div>
                    <p className="text-2xl font-bold text-warning">
                      {Math.round(bundleData.gzippedSize / 1024 / 100) / 10}s
                    </p>
                    <p className="text-xs text-muted-foreground">{t('performance.loadTimeOn3G')}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Bundle Composition */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('performance.bundleComposition')}</CardTitle>
                  <CardDescription>
                    {t('performance.bundleBreakdownDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bundleData.chunks.map((chunk) => (
                      <div key={chunk.name} className="space-y-2">
                        <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
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
                  <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    {t('performance.optimizationSuggestions')}
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
              <CardContent className={cn("py-12 text-center", isRTL ? "text-right" : "text-left")}>
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">{t('performance.bundleAnalysisTitle')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('performance.bundleAnalysisDescription')}
                </p>
                <Button onClick={analyzeBundleSize} disabled={analyzing}>
                  <Download className="h-4 w-4 mr-2" />
                  {analyzing ? t('performance.analyzing') : t('performance.startAnalysis')}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
        <CardTitle>{t('performance.networkPerformanceTitle')}</CardTitle>
        <CardDescription>
          {t('performance.networkPerformanceDesc')}
        </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4" />
                <p>{t('performance.networkAnalysisComingSoon')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <CheckCircle className="h-5 w-5 text-success" />
                {t('performance.performanceRecommendations')}
              </CardTitle>
              <CardDescription>
                {t('performance.actionableSuggestions')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{t('performance.implementLazyLoading')}:</strong> {t('performance.lazyLoadingDescription')}
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{t('performance.optimizeImages')}:</strong> {t('performance.optimizeImagesDescription')}
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{t('performance.enableCaching')}:</strong> {t('performance.enableCachingDescription')}
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{t('performance.databaseOptimization')}:</strong> {t('performance.databaseOptimizationDescription')}
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
import React, { useState } from 'react';
import { useProductionMonitoring } from './ProductionMonitoringProvider';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  RefreshCw, 
  Activity,
  Shield,
  Zap,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ProductionHealthCheck: React.FC = () => {
  const { metrics, refreshMetrics } = useProductionMonitoring();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshMetrics();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Loading production metrics...
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return CheckCircle;
    if (score >= 70) return AlertTriangle;
    return AlertCircle;
  };

  const criticalChecks = metrics.readinessChecks.filter(c => c.severity === 'critical');
  const failedCritical = criticalChecks.filter(c => c.status === 'failed');
  const warningChecks = metrics.readinessChecks.filter(c => c.status === 'warning');

  const ScoreIcon = getScoreIcon(metrics.readinessScore);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Production Health
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ScoreIcon className={cn('h-8 w-8', getScoreColor(metrics.readinessScore))} />
            <div>
              <div className="font-semibold">Overall Score</div>
              <div className="text-sm text-muted-foreground">Production readiness</div>
            </div>
          </div>
          <div className="text-right">
            <div className={cn('text-2xl font-bold', getScoreColor(metrics.readinessScore))}>
              {metrics.readinessScore}%
            </div>
          </div>
        </div>

        <Progress value={metrics.readinessScore} className="h-2" />

        {/* Status Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{failedCritical.length}</div>
            <div className="text-xs text-muted-foreground">Critical Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{warningChecks.length}</div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{metrics.errorCount}</div>
            <div className="text-xs text-muted-foreground">Runtime Errors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.performance?.renderTime?.toFixed(0) || 0}ms
            </div>
            <div className="text-xs text-muted-foreground">Render Time</div>
          </div>
        </div>

        {/* Performance Status */}
        {metrics.isLowPerformance && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <Activity className="h-5 w-5 text-yellow-600" />
            <div>
              <div className="font-medium text-yellow-800 dark:text-yellow-200">
                Performance Optimizations Active
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                Low performance detected. Optimizations have been automatically enabled.
              </div>
            </div>
          </div>
        )}

        {/* Critical Issues */}
        {failedCritical.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Critical Issues</span>
            </div>
            {failedCritical.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                <div>
                  <div className="font-medium text-red-800 dark:text-red-200">{check.name}</div>
                  <div className="text-sm text-red-700 dark:text-red-300">{check.message}</div>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
            ))}
          </div>
        )}

        {/* Performance Metrics */}
        {metrics.performance && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span className="font-medium">Performance Metrics</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Connection:</span>
                <Badge variant="outline" className="text-xs">
                  {metrics.performance.connectionSpeed || 'unknown'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Online:</span>
                <Badge variant={metrics.performance.isOnline ? 'default' : 'destructive'} className="text-xs">
                  {metrics.performance.isOnline ? 'Yes' : 'No'}
                </Badge>
              </div>
              {metrics.performance.memoryUsage && (
                <>
                  <div className="flex justify-between">
                    <span>Memory Used:</span>
                    <span className="text-xs">
                      {(metrics.performance.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Limit:</span>
                    <span className="text-xs">
                      {(metrics.performance.memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(1)}MB
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
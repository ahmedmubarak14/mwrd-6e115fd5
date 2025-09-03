import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Zap,
  Monitor,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { generateFinalProductionReport, ProductionReadinessReport } from '@/utils/finalProductionReport';
import { cn } from '@/lib/utils';

export const ProductionReadinessCard: React.FC = () => {
  const [report, setReport] = useState<ProductionReadinessReport>(generateFinalProductionReport());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setReport(generateFinalProductionReport());
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production-ready': return 'text-green-600';
      case 'needs-improvements': return 'text-yellow-600';
      case 'critical-issues': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'production-ready': return CheckCircle;
      case 'needs-improvements': return AlertTriangle;
      case 'critical-issues': return AlertCircle;
      default: return Shield;
    }
  };

  const StatusIcon = getStatusIcon(report.status);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Production Readiness
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
        {/* Overall Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon className={cn('h-8 w-8', getStatusColor(report.status))} />
            <div>
              <div className="font-semibold capitalize">
                {report.status.replace('-', ' ')}
              </div>
              <div className="text-sm text-muted-foreground">
                Overall readiness status
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={cn('text-2xl font-bold', getStatusColor(report.status))}>
              {report.overallScore}%
            </div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>

        <Progress value={report.overallScore} className="h-2" />

        {/* Status Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={cn('text-lg font-bold', {
              'text-green-600': report.securityStatus === 'secure',
              'text-yellow-600': report.securityStatus === 'warnings',
              'text-red-600': report.securityStatus === 'critical',
            })}>
              <Shield className="h-5 w-5 mx-auto mb-1" />
            </div>
            <div className="text-xs text-muted-foreground capitalize">
              {report.securityStatus}
            </div>
          </div>
          
          <div className="text-center">
            <div className={cn('text-lg font-bold', {
              'text-green-600': report.performanceStatus === 'optimized',
              'text-yellow-600': report.performanceStatus === 'good',
              'text-red-600': report.performanceStatus === 'needs-optimization',
            })}>
              <Zap className="h-5 w-5 mx-auto mb-1" />
            </div>
            <div className="text-xs text-muted-foreground capitalize">
              {report.performanceStatus}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              <Monitor className="h-5 w-5 mx-auto mb-1" />
            </div>
            <div className="text-xs text-muted-foreground">Monitoring</div>
          </div>
        </div>

        {/* Completed Phases */}
        <div className="space-y-2">
          <div className="font-medium text-sm">Completed Phases</div>
          <div className="space-y-1">
            {report.completedPhases.map((phase, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-muted-foreground">{phase.replace('✅ ', '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Issues */}
        {report.criticalIssues.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-sm text-red-600">Critical Issues</div>
            {report.criticalIssues.map((issue, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-red-800 dark:text-red-200">{issue.name}</div>
                  <div className="text-red-700 dark:text-red-300">{issue.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Next Steps */}
        {report.nextSteps.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-sm">Next Steps</div>
            <div className="space-y-1">
              {report.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{step.replace('• ', '')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Console logs remaining: {report.consoleLogsRemaining}
          </div>
          <Badge variant={report.status === 'production-ready' ? 'default' : 'secondary'}>
            {report.status === 'production-ready' ? 'Ready' : 'In Progress'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
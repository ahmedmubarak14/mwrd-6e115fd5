import React from 'react';
import { useProductionMonitoring } from './ProductionMonitoringProvider';
import { Badge } from './badge';
import { AlertCircle, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductionStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export const ProductionStatusIndicator: React.FC<ProductionStatusIndicatorProps> = ({ 
  className,
  showDetails = false 
}) => {
  const { metrics, isMonitoring } = useProductionMonitoring();

  if (!metrics) {
    return null;
  }

  const getStatusColor = () => {
    if (metrics.readinessScore >= 90) return 'bg-green-500';
    if (metrics.readinessScore >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = () => {
    if (metrics.readinessScore >= 90) return CheckCircle;
    if (metrics.readinessScore >= 70) return AlertTriangle;
    return AlertCircle;
  };

  const getStatusText = () => {
    if (metrics.readinessScore >= 90) return 'Excellent';
    if (metrics.readinessScore >= 80) return 'Good';
    if (metrics.readinessScore >= 70) return 'Fair';
    return 'Needs Attention';
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-2">
        <div className={cn('h-2 w-2 rounded-full', getStatusColor())} />
        <StatusIcon className={cn('h-4 w-4', {
          'text-green-600': metrics.readinessScore >= 90,
          'text-yellow-600': metrics.readinessScore >= 70 && metrics.readinessScore < 90,
          'text-red-600': metrics.readinessScore < 70,
        })} />
        {showDetails && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{getStatusText()}</span>
            <Badge variant="outline" className="text-xs">
              {metrics.readinessScore}%
            </Badge>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {metrics.errorCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {metrics.errorCount} errors
            </Badge>
          )}
          {metrics.warningCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {metrics.warningCount} warnings
            </Badge>
          )}
          {metrics.isLowPerformance && (
            <Badge variant="outline" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Low Performance
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
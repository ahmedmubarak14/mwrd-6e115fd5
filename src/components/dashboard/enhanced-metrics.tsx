import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info, 
  Eye, 
  EyeOff,
  MoreHorizontal 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricCardSkeleton } from '@/components/ui/skeleton-components';
import { ErrorRecovery } from '@/components/ui/error-recovery';

export interface MetricData {
  id: string;
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label: string;
    period?: string;
    isPositive?: boolean;
  };
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

export interface EnhancedMetricCardProps extends MetricData {
  loading?: boolean;
  error?: string | Error;
  onRetry?: () => void;
  onToggleVisibility?: () => void;
  isVisible?: boolean;
  compact?: boolean;
  className?: string;
}

export const EnhancedMetricCard: React.FC<EnhancedMetricCardProps> = ({
  id,
  title,
  value,
  description,
  icon: Icon,
  trend,
  progress,
  variant = 'default',
  actionUrl,
  actionLabel,
  metadata,
  loading = false,
  error,
  onRetry,
  onToggleVisibility,
  isVisible = true,
  compact = false,
  className
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Variant styling
  const variantStyles = useMemo(() => ({
    default: 'border-border bg-card',
    success: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10',
    warning: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/10',
    destructive: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10',
    info: 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10'
  }), []);

  const iconColors = useMemo(() => ({
    default: 'text-muted-foreground',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    destructive: 'text-red-600',
    info: 'text-blue-600'
  }), []);

  // Loading state
  if (loading) {
    return <MetricCardSkeleton className={className} />;
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("relative overflow-hidden border-destructive/20", className)}>
        <CardContent className="p-4">
          <ErrorRecovery
            error={error}
            onRetry={onRetry}
            variant="minimal"
            title="Failed to load metric"
          />
        </CardContent>
      </Card>
    );
  }

  // Hidden state
  if (!isVisible) {
    return (
      <Card className={cn("relative overflow-hidden border-dashed border-muted-foreground/30 bg-muted/20", className)}>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <EyeOff className="h-4 w-4" />
            <span className="text-sm">Metric hidden</span>
            {onToggleVisibility && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
                className="h-6 px-2 text-xs"
              >
                Show
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.isPositive === undefined) {
      return trend.value > 0 ? TrendingUp : trend.value < 0 ? TrendingDown : Minus;
    }
    
    return trend.isPositive ? TrendingUp : TrendingDown;
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-md",
      variantStyles[variant],
      compact && "p-3",
      className
    )}>
      {/* Header */}
      <CardHeader className={cn("pb-2", compact && "pb-1 p-3")}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "text-sm font-medium text-muted-foreground flex items-center gap-2",
            compact && "text-xs"
          )}>
            <Icon className={cn("h-4 w-4", iconColors[variant])} />
            {title}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            {onToggleVisibility && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <Eye className="h-3 w-3" />
              </Button>
            )}
            
            {(metadata || description) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <Info className="h-3 w-3" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className={cn("space-y-3", compact && "p-3 pt-0")}>
        {/* Main value */}
        <div className="space-y-1">
          <div className={cn(
            "text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
            compact && "text-xl"
          )}>
            {value}
          </div>
          
          {description && (
            <p className={cn("text-xs text-muted-foreground", compact && "text-xs")}>
              {description}
            </p>
          )}
        </div>

        {/* Progress bar */}
        {progress && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress.label || 'Progress'}</span>
              <span>{progress.value}/{progress.max}</span>
            </div>
            <Progress 
              value={(progress.value / progress.max) * 100} 
              className="h-2"
            />
          </div>
        )}

        {/* Trend indicator */}
        {trend && (
          <div className="flex items-center gap-2">
            <Badge variant={
              trend.isPositive === undefined 
                ? (trend.value >= 0 ? 'default' : 'secondary')
                : (trend.isPositive ? 'default' : 'destructive')
            } className="text-xs flex items-center gap-1">
              {TrendIcon && <TrendIcon className="h-3 w-3" />}
              {trend.value > 0 && '+'}
              {trend.value}
              {trend.value !== 0 && '%'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {trend.label}
              {trend.period && ` (${trend.period})`}
            </span>
          </div>
        )}

        {/* Action button */}
        {actionUrl && actionLabel && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-7"
            asChild
          >
            <a href={actionUrl}>{actionLabel}</a>
          </Button>
        )}

        {/* Expandable details */}
        {showDetails && (metadata || description) && (
          <div className="mt-3 p-3 bg-muted/30 rounded-lg space-y-2">
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            
            {metadata && Object.keys(metadata).length > 0 && (
              <div className="space-y-1">
                <h5 className="text-xs font-medium">Details:</h5>
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Metrics grid component
export interface MetricsGridProps {
  metrics: MetricData[];
  loading?: boolean;
  error?: string | Error;
  onRetry?: () => void;
  columns?: number;
  compact?: boolean;
  className?: string;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  metrics,
  loading = false,
  error,
  onRetry,
  columns = 4,
  compact = false,
  className
}) => {
  const [hiddenMetrics, setHiddenMetrics] = useState<Set<string>>(new Set());

  const toggleMetricVisibility = (metricId: string) => {
    setHiddenMetrics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(metricId)) {
        newSet.delete(metricId);
      } else {
        newSet.add(metricId);
      }
      return newSet;
    });
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  if (error) {
    return (
      <div className={className}>
        <ErrorRecovery
          error={error}
          onRetry={onRetry}
          variant="inline"
          title="Failed to load metrics"
          description="Unable to fetch dashboard metrics. Please try again."
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-4 lg:gap-6",
      gridClasses[Math.min(columns, 6) as keyof typeof gridClasses],
      className
    )}>
      {loading 
        ? Array.from({ length: Math.min(metrics.length || 4, 8) }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))
        : metrics.map((metric) => (
            <EnhancedMetricCard
              key={metric.id}
              {...metric}
              isVisible={!hiddenMetrics.has(metric.id)}
              onToggleVisibility={() => toggleMetricVisibility(metric.id)}
              compact={compact}
            />
          ))
      }
    </div>
  );
};
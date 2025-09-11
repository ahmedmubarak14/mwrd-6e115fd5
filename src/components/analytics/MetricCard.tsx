import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useOptimizedFormatters } from '@/hooks/usePerformanceOptimization';
import { cn } from '@/lib/utils';

interface AnalyticsMetric {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  format: 'currency' | 'number' | 'percentage' | 'duration';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface MetricCardProps {
  metric: AnalyticsMetric;
}

export const MetricCard = React.memo<MetricCardProps>(({ metric }) => {
  const { formatCurrency, formatNumber, formatPercentage } = useOptimizedFormatters();
  const Icon = metric.icon;
  
  const formatValue = (value: number) => {
    switch (metric.format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'duration':
        return `${value}h`;
      default:
        return formatNumber(value);
    }
  };

  const changePercent = ((metric.value - metric.previousValue) / metric.previousValue) * 100;
  const isPositive = changePercent > 0;
  const isNeutral = Math.abs(changePercent) < 0.1;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </p>
            <p className="text-2xl font-bold">
              {formatValue(metric.value)}
            </p>
            <div className="flex items-center gap-2 text-xs">
              {isNeutral ? (
                <Minus className="h-3 w-3 text-muted-foreground" />
              ) : isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600" />
              )}
              <span className={cn(
                "font-medium",
                isNeutral ? "text-muted-foreground" :
                isPositive ? "text-green-600" : "text-red-600"
              )}>
                {isNeutral ? "No change" : `${Math.abs(changePercent).toFixed(1)}%`}
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-full bg-muted",
            metric.color.replace('text-', 'bg-').replace('-600', '-100')
          )}>
            <Icon className={cn("h-6 w-6", metric.color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MetricCard.displayName = 'MetricCard';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ProjectMetrics {
  completionRate: number;
  avgResponseTime: string;
  successRate: number;
  activeProjects: number;
}

interface ClientOverviewMetricsProps {
  metrics?: ProjectMetrics;
  isLoading?: boolean;
  className?: string;
}

export const ClientOverviewMetrics: React.FC<ClientOverviewMetricsProps> = ({
  metrics = {
    completionRate: 78,
    avgResponseTime: '4.2h',
    successRate: 94,
    activeProjects: 12
  },
  isLoading = false,
  className
}) => {
  const { t, isRTL, formatNumber } = useLanguage();

  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <div className="h-5 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const performanceMetrics = [
    {
      label: t('dashboard.metrics.completionRate'),
      value: `${metrics.completionRate}%`,
      progress: metrics.completionRate,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: t('dashboard.metrics.avgResponseTime'),
      value: metrics.avgResponseTime,
      progress: 85, // Assuming good response time
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: t('dashboard.metrics.successRate'),
      value: `${metrics.successRate}%`,
      progress: metrics.successRate,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('dashboard.performanceOverview')}
          </div>
          <Badge variant="outline">
            {formatNumber(metrics.activeProjects)} {t('dashboard.active')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <div className={cn("p-1.5 rounded-lg", metric.bgColor)}>
                  <metric.icon className={cn("h-4 w-4", metric.color)} />
                </div>
                <span className="text-sm font-medium">{metric.label}</span>
              </div>
              <span className="text-sm font-bold">{metric.value}</span>
            </div>
            <Progress value={metric.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

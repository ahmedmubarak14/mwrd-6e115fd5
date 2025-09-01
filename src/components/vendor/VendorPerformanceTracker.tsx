import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useVendorStats } from "@/hooks/useVendorStats";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Clock, 
  DollarSign,
  Users,
  Star,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Zap
} from "lucide-react";

interface PerformanceMetric {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  status: 'excellent' | 'good' | 'needs_improvement';
  icon: any;
  color: string;
}

export const VendorPerformanceTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { stats, loading } = useVendorStats();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  const performanceMetrics: PerformanceMetric[] = [
    {
      id: 'response_time',
      name: t('vendor.performance.responseTime'),
      current: 2.4,
      target: 4.0,
      unit: 'hours',
      trend: 'up',
      trendValue: '-15min',
      status: 'excellent',
      icon: Clock,
      color: 'hsl(var(--success))'
    },
    {
      id: 'offer_acceptance',
      name: t('vendor.performance.offerAcceptance'),
      current: stats?.successRate || 72,
      target: 80,
      unit: '%',
      trend: 'up',
      trendValue: '+8%',
      status: 'good',
      icon: Target,
      color: 'hsl(var(--primary))'
    },
    {
      id: 'client_satisfaction',
      name: t('vendor.performance.clientSatisfaction'),
      current: stats?.clientSatisfaction || 4.8,
      target: 4.5,
      unit: '/5',
      trend: 'up',
      trendValue: '+0.2',
      status: 'excellent',
      icon: Star,
      color: 'hsl(var(--warning))'
    },
    {
      id: 'project_completion',
      name: t('vendor.performance.projectCompletion'),
      current: 94,
      target: 95,
      unit: '%',
      trend: 'stable',
      trendValue: '0%',
      status: 'needs_improvement',
      icon: CheckCircle,
      color: 'hsl(var(--chart-2))'
    },
    {
      id: 'revenue_growth',
      name: t('vendor.performance.revenueGrowth'),
      current: 15.3,
      target: 20,
      unit: '%',
      trend: 'up',
      trendValue: '+2.1%',
      status: 'good',
      icon: DollarSign,
      color: 'hsl(var(--chart-3))'
    },
    {
      id: 'client_retention',
      name: t('vendor.performance.clientRetention'),
      current: 89,
      target: 85,
      unit: '%',
      trend: 'up',
      trendValue: '+4%',
      status: 'excellent',
      icon: Users,
      color: 'hsl(var(--chart-4))'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'hsl(var(--success))';
      case 'good':
        return 'hsl(var(--primary))';
      case 'needs_improvement':
        return 'hsl(var(--warning))';
      default:
        return 'hsl(var(--muted-foreground))';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return CheckCircle;
      case 'good':
        return Target;
      case 'needs_improvement':
        return AlertTriangle;
      default:
        return Target;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'default';
      case 'good':
        return 'secondary';
      case 'needs_improvement':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const overallScore = Math.round(
    performanceMetrics.reduce((acc, metric) => {
      const progress = calculateProgress(metric.current, metric.target);
      return acc + progress;
    }, 0) / performanceMetrics.length
  );

  const getOverallStatus = (score: number) => {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    return 'needs_improvement';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {t('vendor.performance.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('vendor.performance.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('week')}
          >
            {t('common.week')}
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            {t('common.month')}
          </Button>
          <Button 
            variant={selectedPeriod === 'quarter' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('quarter')}
          >
            {t('common.quarter')}
          </Button>
        </div>
      </div>

      {/* Overall Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            {t('vendor.performance.overallScore')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <p className="text-3xl font-bold">{overallScore}%</p>
              <Badge variant={getStatusBadgeVariant(getOverallStatus(overallScore))}>
                {t(`vendor.performance.${getOverallStatus(overallScore)}`)}
              </Badge>
            </div>
            <div className="w-24 h-24">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={getStatusColor(getOverallStatus(overallScore))}
                  strokeWidth="8"
                  strokeDasharray={`${overallScore * 2.83} 283`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <Progress value={overallScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performanceMetrics.map((metric) => {
          const Icon = metric.icon;
          const StatusIcon = getStatusIcon(metric.status);
          const progress = calculateProgress(metric.current, metric.target);
          
          return (
            <Card key={metric.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="p-2 rounded-full"
                    style={{ backgroundColor: `${metric.color}20` }}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ color: metric.color }}
                    />
                  </div>
                  <Badge variant={getStatusBadgeVariant(metric.status)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {t(`vendor.performance.${metric.status}`)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">{metric.name}</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">
                      {typeof metric.current === 'number' 
                        ? metric.current.toFixed(metric.unit === '/5' ? 1 : 0)
                        : metric.current
                      }
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {metric.unit}
                    </span>
                    <div className="flex items-center space-x-1">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : metric.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      ) : null}
                      <span className={`text-xs ${
                        metric.trend === 'up' ? 'text-success' : 
                        metric.trend === 'down' ? 'text-destructive' : 
                        'text-muted-foreground'
                      }`}>
                        {metric.trendValue}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t('vendor.performance.current')}</span>
                      <span>{t('vendor.performance.target')}: {metric.target}{metric.unit}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">{t('vendor.performance.trends')}</TabsTrigger>
          <TabsTrigger value="goals">{t('vendor.performance.goals')}</TabsTrigger>
          <TabsTrigger value="insights">{t('vendor.performance.insights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.performance.performanceTrends')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-full"
                        style={{ backgroundColor: `${metric.color}20` }}
                      >
                        <metric.icon 
                          className="w-4 h-4" 
                          style={{ color: metric.color }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{metric.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {metric.current}{metric.unit} / {metric.target}{metric.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : metric.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      ) : null}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-success' : 
                        metric.trend === 'down' ? 'text-destructive' : 
                        'text-muted-foreground'
                      }`}>
                        {metric.trendValue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.performance.performanceGoals')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceMetrics
                  .filter(metric => metric.current < metric.target)
                  .map((metric) => (
                    <div key={metric.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{metric.name}</h4>
                        <Badge variant="outline">
                          {Math.round(calculateProgress(metric.current, metric.target))}% {t('vendor.performance.complete')}
                        </Badge>
                      </div>
                      <Progress value={calculateProgress(metric.current, metric.target)} />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{t('vendor.performance.current')}: {metric.current}{metric.unit}</span>
                        <span>{t('vendor.performance.target')}: {metric.target}{metric.unit}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.performance.performanceInsights')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <h4 className="font-medium text-success">{t('vendor.performance.strengths')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('vendor.performance.strengthsDesc')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                    <div>
                      <h4 className="font-medium text-warning">{t('vendor.performance.improvements')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('vendor.performance.improvementsDesc')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-start space-x-3">
                    <Target className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary">{t('vendor.performance.recommendations')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('vendor.performance.recommendationsDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
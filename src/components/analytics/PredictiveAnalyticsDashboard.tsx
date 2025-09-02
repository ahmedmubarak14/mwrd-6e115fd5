import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { usePredictiveAnalytics } from "@/hooks/usePredictiveAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Zap,
  RefreshCw,
  Lightbulb,
  ShieldAlert,
  BarChart3
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from 'recharts';

export const PredictiveAnalyticsDashboard = () => {
  const { t, isRTL, formatNumber, formatCurrency } = useLanguage();
  const { toast } = useToast();
  
  const {
    insights,
    loading,
    error,
    fetchPredictiveInsights
  } = usePredictiveAnalytics();

  const handleRefresh = async () => {
    try {
      await fetchPredictiveInsights();
      toast({
        title: t('analytics.aiInsightsRefreshed'),
        description: t('analytics.aiInsightsRefreshedDesc'),
      });
    } catch (error) {
      toast({
        title: t('analytics.refreshError'),
        description: t('analytics.refreshErrorDesc'),
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="relative">
          <Brain className="h-12 w-12 text-primary animate-pulse" />
          <div className="absolute -top-1 -right-1">
            <LoadingSpinner size="sm" />
          </div>
        </div>
        <p className="text-muted-foreground">{t('analytics.aiAnalyzing')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button onClick={handleRefresh} variant="outline" size="sm" className="ml-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.retry')}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const riskLevel = insights?.riskAssessment.overall_risk;
  const riskColor = riskLevel === 'low' ? 'text-green-600' : 
                   riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", isRTL && "sm:flex-row-reverse")}>
        <div className={cn(isRTL && "text-right")}>
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">{t('analytics.aiPoweredInsights')}</h1>
          </div>
          <p className="text-muted-foreground">{t('analytics.aiInsightsDesc')}</p>
        </div>
        
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('analytics.refreshInsights')}
        </Button>
      </div>

      {/* Risk Assessment Overview */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <ShieldAlert className="h-5 w-5" />
                <span>{t('analytics.riskAssessment')}</span>
              </CardTitle>
              <CardDescription>{t('analytics.riskAssessmentDesc')}</CardDescription>
            </div>
            <Badge variant={riskLevel === 'low' ? 'default' : 'destructive'} className={riskColor}>
              {t(`analytics.risk.${riskLevel}`)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('analytics.vendorRisk')}</span>
                <span>{Math.round((insights?.riskAssessment.vendor_risk || 0) * 100)}%</span>
              </div>
              <Progress value={(insights?.riskAssessment.vendor_risk || 0) * 100} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('analytics.marketRisk')}</span>
                <span>{Math.round((insights?.riskAssessment.market_risk || 0) * 100)}%</span>
              </div>
              <Progress value={(insights?.riskAssessment.market_risk || 0) * 100} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('analytics.financialRisk')}</span>
                <span>{Math.round((insights?.riskAssessment.financial_risk || 0) * 100)}%</span>
              </div>
              <Progress value={(insights?.riskAssessment.financial_risk || 0) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights?.recommendations.map((rec, index) => (
          <Card key={index} className={cn(
            "border-l-4",
            rec.priority === 'high' ? "border-l-red-500" :
            rec.priority === 'medium' ? "border-l-yellow-500" : "border-l-green-500"
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Lightbulb className={cn(
                  "h-4 w-4",
                  rec.priority === 'high' ? "text-red-500" :
                  rec.priority === 'medium' ? "text-yellow-500" : "text-green-500"
                )} />
                <CardTitle className="text-sm">{rec.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              <Badge 
                variant={rec.priority === 'high' ? 'destructive' : 'secondary'} 
                className="mt-2"
                size="sm"
              >
                {t(`analytics.priority.${rec.priority}`)}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Predictive Analytics Tabs */}
      <Tabs defaultValue="demand" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demand">{t('analytics.demandForecasting')}</TabsTrigger>
          <TabsTrigger value="pricing">{t('analytics.priceTrends')}</TabsTrigger>
          <TabsTrigger value="opportunities">{t('analytics.marketOpportunities')}</TabsTrigger>
          <TabsTrigger value="scenarios">{t('analytics.scenarios')}</TabsTrigger>
        </TabsList>

        <TabsContent value="demand" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.demandForecast')}</CardTitle>
              <CardDescription>{t('analytics.demandForecastDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={insights?.demandForecast || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'predicted_demand' ? formatNumber(Number(value)) : `${Math.round(Number(value) * 100)}%`,
                      name === 'predicted_demand' ? t('analytics.predictedDemand') : t('analytics.confidence')
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="predicted_demand" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="hsl(var(--secondary))" 
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.priceTrendAnalysis')}</CardTitle>
              <CardDescription>{t('analytics.priceTrendDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights?.priceTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        trend.trend === 'up' ? "bg-green-100 text-green-600" :
                        trend.trend === 'down' ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                      )}>
                        {trend.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                         trend.trend === 'down' ? <TrendingDown className="h-4 w-4" /> : 
                         <BarChart3 className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{trend.category}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(trend.current_price)} → {formatCurrency(trend.predicted_price)}
                        </div>
                      </div>
                    </div>
                    <Badge variant={
                      trend.trend === 'up' ? 'default' : 
                      trend.trend === 'down' ? 'destructive' : 'secondary'
                    }>
                      {trend.trend === 'up' ? '+' : trend.trend === 'down' ? '-' : ''}
                      {Math.abs(((trend.predicted_price - trend.current_price) / trend.current_price) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.topOpportunities')}</CardTitle>
                <CardDescription>{t('analytics.opportunitiesDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights?.marketOpportunities.map((opportunity, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{opportunity.category}</span>
                        <Badge variant="default">
                          {Math.round(opportunity.opportunity_score * 100)}%
                        </Badge>
                      </div>
                      <Progress value={opportunity.opportunity_score * 100} />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{t('analytics.estRevenue')}: {formatCurrency(opportunity.estimated_revenue)}</span>
                        <span>{t('analytics.competition')}: {Math.round(opportunity.competition_level * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.opportunityMatrix')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={insights?.marketOpportunities || []}>
                    <CartesianGrid />
                    <XAxis 
                      type="number" 
                      dataKey="opportunity_score"
                      name={t('analytics.opportunityScore')}
                      domain={[0, 1]}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="estimated_revenue"
                      name={t('analytics.estimatedRevenue')}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'estimated_revenue' ? formatCurrency(Number(value)) : 
                        Math.round(Number(value) * 100) + '%',
                        name === 'estimated_revenue' ? t('analytics.estRevenue') : t('analytics.score')
                      ]}
                    />
                    <Scatter 
                      dataKey="estimated_revenue" 
                      fill="hsl(var(--primary))"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{t('analytics.bestCase')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-green-600">+35%</div>
                <p className="text-sm text-muted-foreground">
                  {t('analytics.bestCaseDesc')}
                </p>
                <div className="text-sm">
                  <div>{t('analytics.expectedRevenue')}: {formatCurrency(250000)}</div>
                  <div>{t('analytics.marketShare')}: +5.2%</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="text-yellow-600 flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>{t('analytics.likelyCase')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-yellow-600">+18%</div>
                <p className="text-sm text-muted-foreground">
                  {t('analytics.likelyCaseDesc')}
                </p>
                <div className="text-sm">
                  <div>{t('analytics.expectedRevenue')}: {formatCurrency(180000)}</div>
                  <div>{t('analytics.marketShare')}: +2.1%</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{t('analytics.worstCase')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-red-600">-8%</div>
                <p className="text-sm text-muted-foreground">
                  {t('analytics.worstCaseDesc')}
                </p>
                <div className="text-sm">
                  <div>{t('analytics.expectedRevenue')}: {formatCurrency(120000)}</div>
                  <div>{t('analytics.marketShare')}: -1.5%</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
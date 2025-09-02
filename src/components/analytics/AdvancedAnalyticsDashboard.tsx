import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAdvancedAnalytics } from "@/hooks/useAdvancedAnalytics";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Clock,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  AlertCircle
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';

export const AdvancedAnalyticsDashboard = () => {
  const { userProfile } = useAuth();
  const { t, isRTL, formatNumber, formatCurrency } = useLanguage();
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'json'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    analytics,
    loading,
    error,
    fetchAdvancedAnalytics,
    exportAnalytics
  } = useAdvancedAnalytics(userProfile?.role);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAnalytics(exportFormat);
      toast({
        title: t('analytics.exportSuccess'),
        description: t('analytics.exportSuccessDesc'),
      });
    } catch (error) {
      toast({
        title: t('analytics.exportError'),
        description: t('analytics.exportErrorDesc'),
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchAdvancedAnalytics();
      toast({
        title: t('analytics.dataRefreshed'),
        description: t('analytics.dataRefreshedDesc'),
      });
    } catch (error) {
      toast({
        title: t('analytics.refreshError'),
        description: t('analytics.refreshErrorDesc'),
        variant: 'destructive'
      });
    }
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="text-destructive">{error}</p>
        <Button onClick={handleRefresh} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", isRTL && "sm:flex-row-reverse")}>
        <div className={cn(isRTL && "text-right")}>
          <h1 className="text-3xl font-bold">{t('analytics.advancedDashboard')}</h1>
          <p className="text-muted-foreground">{t('analytics.advancedDashboardDesc')}</p>
        </div>
        
        <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
          <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.refresh')}
          </Button>
          
          <Button onClick={handleExport} disabled={isExporting} size="sm">
            {isExporting ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {t('analytics.export')}
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.revenueGrowthRate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.kpiMetrics.revenue_growth_rate}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{analytics?.kpiMetrics.revenue_growth_rate}%
              </Badge>
              <span>{t('analytics.vsLastMonth')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.customerAcquisitionCost')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics?.kpiMetrics.customer_acquisition_cost || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.perNewCustomer')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.customerLifetimeValue')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics?.kpiMetrics.customer_lifetime_value || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('analytics.avgPerCustomer')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.churnRate')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.kpiMetrics.churn_rate}%</div>
            <Progress value={analytics?.kpiMetrics.churn_rate} className="w-full mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.marketPenetration')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.kpiMetrics.market_penetration}%</div>
            <Progress value={analytics?.kpiMetrics.market_penetration} className="w-full mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.efficiencyScore')}</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.kpiMetrics.efficiency_score}%</div>
            <Badge variant={analytics?.kpiMetrics.efficiency_score > 80 ? 'default' : 'secondary'}>
              {analytics?.kpiMetrics.efficiency_score > 80 ? t('analytics.excellent') : t('analytics.good')}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="cohort" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cohort">{t('analytics.cohortAnalysis')}</TabsTrigger>
          <TabsTrigger value="funnel">{t('analytics.funnelAnalysis')}</TabsTrigger>
          <TabsTrigger value="segmentation">{t('analytics.segmentation')}</TabsTrigger>
          <TabsTrigger value="competitive">{t('analytics.competitive')}</TabsTrigger>
          <TabsTrigger value="insights">{t('analytics.insights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="cohort" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.userRetentionCohorts')}</CardTitle>
              <CardDescription>{t('analytics.cohortAnalysisDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analytics?.cohortAnalysis || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cohort_month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="users_count" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.conversionFunnel')}</CardTitle>
              <CardDescription>{t('analytics.funnelAnalysisDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.funnelAnalysis.stages.map((stage, index) => (
                  <div key={stage.name} className="flex items-center space-x-4">
                    <div className="w-24 text-sm font-medium">{stage.name}</div>
                    <div className="flex-1">
                      <Progress value={stage.conversion_rate} className="h-3" />
                    </div>
                    <div className="w-20 text-sm text-right">
                      {formatNumber(stage.users)} ({stage.conversion_rate}%)
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {analytics?.funnelAnalysis.overall_conversion}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t('analytics.overallConversion')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segmentation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.customerSegments')}</CardTitle>
                <CardDescription>{t('analytics.segmentationDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip />
                    <Pie
                      data={analytics?.segmentation || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="user_count"
                      nameKey="segment_name"
                    >
                      {(analytics?.segmentation || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.revenueBySegment')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.segmentation || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment_name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue_contribution" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.marketPosition')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {analytics?.competitiveAnalysis.market_share}%
                  </div>
                  <p className="text-sm text-muted-foreground">{t('analytics.marketShare')}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{t('analytics.pricePositioning')}</span>
                    <Badge variant="secondary">
                      {analytics?.competitiveAnalysis.price_positioning}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.featureComparison')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.competitiveAnalysis.feature_comparison.map((feature) => (
                    <div key={feature.feature} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{feature.feature}</span>
                        {feature.us ? (
                          <Badge variant="default" size="sm">
                            <Award className="h-3 w-3 mr-1" />
                            {t('analytics.available')}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" size="sm">
                            {t('analytics.missing')}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {feature.competitors}/{analytics?.competitiveAnalysis.feature_comparison.length} {t('analytics.competitors')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.keyInsights')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">{t('analytics.opportunityDetected')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('analytics.revenueGrowthOpportunity')}
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-600">{t('analytics.attentionRequired')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('analytics.churnRateWarning')}
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-600">{t('analytics.performanceHighlight')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('analytics.efficiencyScoreExcellent')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.recommendations')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">{t('analytics.focusOnRetention')}</div>
                    <p className="text-xs text-muted-foreground">
                      {t('analytics.retentionRecommendation')}
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">{t('analytics.optimizeFunnel')}</div>
                    <p className="text-xs text-muted-foreground">
                      {t('analytics.funnelRecommendation')}
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">{t('analytics.expandMarket')}</div>
                    <p className="text-xs text-muted-foreground">
                      {t('analytics.marketRecommendation')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
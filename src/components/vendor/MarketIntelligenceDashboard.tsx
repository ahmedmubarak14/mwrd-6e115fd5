import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Target,
  Award,
  Clock,
  Users,
  Eye,
  Activity,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DemandTrend {
  month: string;
  rfq_count: number;
  avg_budget: number;
  category: string;
}

interface PricingBand {
  category: string;
  price_range: string;
  bid_count: number;
  min_price: number;
  max_price: number;
  avg_price: number;
  median_price: number;
}

interface PopularSpec {
  category: string;
  keyword: string;
  frequency: number;
}

interface CompetitionInsight {
  category: string;
  avg_offers_per_rfq: number;
  avg_response_time_hours: number;
  win_rate_benchmark: number;
  total_rfqs: number;
}

interface MarketPosition {
  your_stats: {
    offers_submitted: number;
    avg_response_time_hours: number;
    win_count: number;
    win_rate: number;
  };
  market_benchmarks: {
    avg_offers_per_vendor: number;
    avg_response_time_hours: number;
    avg_win_rate: number;
  };
  performance_vs_market: {
    response_time: 'better' | 'below' | 'average';
    activity: 'above_average' | 'below_average' | 'average';
  };
}

const COLORS = ['#004F54', '#66023C', '#765A3F', '#0088FE', '#00C49F', '#FFBB28'];

export const MarketIntelligenceDashboard = () => {
  const { t, isRTL } = useLanguage();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [demandTrends, setDemandTrends] = useState<DemandTrend[]>([]);
  const [pricingBands, setPricingBands] = useState<PricingBand[]>([]);
  const [popularSpecs, setPopularSpecs] = useState<PopularSpec[]>([]);
  const [competition, setCompetition] = useState<CompetitionInsight[]>([]);
  const [marketPosition, setMarketPosition] = useState<MarketPosition | null>(null);

  useEffect(() => {
    if (userProfile?.id) {
      fetchMarketIntelligence();
    }
  }, [userProfile?.id]);

  const fetchMarketIntelligence = async () => {
    if (!userProfile?.id) return;

    setLoading(true);
    try {
      const [trendsRes, pricingRes, specsRes, competitionRes, positionRes] = await Promise.all([
        supabase.rpc('get_vendor_demand_trends', { p_vendor_id: userProfile.id, p_months: 6 }),
        supabase.rpc('get_pricing_bands', { p_vendor_id: userProfile.id, p_months: 3 }),
        supabase.rpc('get_popular_specifications', { p_vendor_id: userProfile.id, p_months: 3 }),
        supabase.rpc('get_competition_insights', { p_vendor_id: userProfile.id, p_months: 3 }),
        supabase.rpc('get_vendor_market_position', { p_vendor_id: userProfile.id }),
      ]);

      if (trendsRes.error) throw trendsRes.error;
      if (pricingRes.error) throw pricingRes.error;
      if (specsRes.error) throw specsRes.error;
      if (competitionRes.error) throw competitionRes.error;
      if (positionRes.error) throw positionRes.error;

      setDemandTrends(trendsRes.data || []);
      setPricingBands(pricingRes.data || []);
      setPopularSpecs(specsRes.data || []);
      setCompetition(competitionRes.data || []);
      setMarketPosition(positionRes.data);
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
      toast({
        title: t('vendor.marketIntelligence.error'),
        description: t('vendor.marketIntelligence.loadError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (performance: string) => {
    if (performance === 'better' || performance === 'above_average') return 'text-green-600';
    if (performance === 'below' || performance === 'below_average') return 'text-red-600';
    return 'text-yellow-600';
  };

  const getPerformanceIcon = (performance: string) => {
    if (performance === 'better' || performance === 'above_average') return <TrendingUp className="h-4 w-4" />;
    if (performance === 'below' || performance === 'below_average') return <TrendingDown className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getPerformanceLabel = (performance: string) => {
    const labels = {
      better: t('vendor.marketIntelligence.betterThanMarket'),
      below: t('vendor.marketIntelligence.belowMarket'),
      average: t('vendor.marketIntelligence.marketAverage'),
      above_average: t('vendor.marketIntelligence.aboveAverage'),
      below_average: t('vendor.marketIntelligence.belowAverage'),
    };
    return labels[performance as keyof typeof labels] || performance;
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text={t('vendor.marketIntelligence.loading')} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          {t('vendor.marketIntelligence.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('vendor.marketIntelligence.subtitle')}
        </p>
      </div>

      {/* Anonymity Notice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">
                {t('vendor.marketIntelligence.anonymityNotice')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('vendor.marketIntelligence.anonymityDescription')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Performance vs Market */}
      {marketPosition && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {t('vendor.marketIntelligence.performanceVsMarket')}
            </CardTitle>
            <CardDescription>
              {t('vendor.marketIntelligence.lastThreeMonths')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Response Time Comparison */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {t('vendor.marketIntelligence.responseTime')}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={getPerformanceColor(marketPosition.performance_vs_market.response_time)}
                  >
                    {getPerformanceIcon(marketPosition.performance_vs_market.response_time)}
                    {getPerformanceLabel(marketPosition.performance_vs_market.response_time)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('vendor.marketIntelligence.you')}</p>
                    <p className="font-bold">
                      {marketPosition.your_stats.avg_response_time_hours.toFixed(1)}h
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('vendor.marketIntelligence.market')}</p>
                    <p className="font-bold">
                      {marketPosition.market_benchmarks.avg_response_time_hours.toFixed(1)}h
                    </p>
                  </div>
                </div>
              </div>

              {/* Win Rate Comparison */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {t('vendor.marketIntelligence.winRate')}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('vendor.marketIntelligence.you')}</p>
                    <p className="font-bold">{marketPosition.your_stats.win_rate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('vendor.marketIntelligence.market')}</p>
                    <p className="font-bold">{marketPosition.market_benchmarks.avg_win_rate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {t('vendor.marketIntelligence.activityLevel')}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={getPerformanceColor(marketPosition.performance_vs_market.activity)}
                  >
                    {getPerformanceIcon(marketPosition.performance_vs_market.activity)}
                    {getPerformanceLabel(marketPosition.performance_vs_market.activity)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('vendor.marketIntelligence.you')}</p>
                    <p className="font-bold">{marketPosition.your_stats.offers_submitted}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('vendor.marketIntelligence.average')}</p>
                    <p className="font-bold">
                      {marketPosition.market_benchmarks.avg_offers_per_vendor.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Different Insights */}
      <Tabs defaultValue="demand" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="demand">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('vendor.marketIntelligence.demand')}
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <DollarSign className="h-4 w-4 mr-2" />
            {t('vendor.marketIntelligence.pricing')}
          </TabsTrigger>
          <TabsTrigger value="specs">
            <Lightbulb className="h-4 w-4 mr-2" />
            {t('vendor.marketIntelligence.specs')}
          </TabsTrigger>
          <TabsTrigger value="competition">
            <Users className="h-4 w-4 mr-2" />
            {t('vendor.marketIntelligence.competition')}
          </TabsTrigger>
        </TabsList>

        {/* Demand Trends Tab */}
        <TabsContent value="demand" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.marketIntelligence.demandTrends')}</CardTitle>
              <CardDescription>
                {t('vendor.marketIntelligence.demandTrendsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {demandTrends.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {t('vendor.marketIntelligence.insufficientData')}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={demandTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="rfq_count"
                      name={t('vendor.marketIntelligence.rfqCount')}
                      stroke="#004F54"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avg_budget"
                      name={t('vendor.marketIntelligence.avgBudget')}
                      stroke="#66023C"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Bands Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.marketIntelligence.winningPriceBands')}</CardTitle>
              <CardDescription>
                {t('vendor.marketIntelligence.winningPriceBandsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pricingBands.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {t('vendor.marketIntelligence.insufficientData')}
                </div>
              ) : (
                <div className="space-y-4">
                  {pricingBands.map((band, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">{band.category}</h3>
                          <Badge variant="outline">{band.bid_count} {t('vendor.marketIntelligence.bids')}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">{t('vendor.marketIntelligence.min')}</p>
                            <p className="font-bold">{band.min_price.toLocaleString()} SAR</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t('vendor.marketIntelligence.median')}</p>
                            <p className="font-bold">{band.median_price.toLocaleString()} SAR</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t('vendor.marketIntelligence.average')}</p>
                            <p className="font-bold">{band.avg_price.toLocaleString()} SAR</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t('vendor.marketIntelligence.max')}</p>
                            <p className="font-bold">{band.max_price.toLocaleString()} SAR</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Popular Specifications Tab */}
        <TabsContent value="specs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.marketIntelligence.popularSpecs')}</CardTitle>
              <CardDescription>
                {t('vendor.marketIntelligence.popularSpecsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {popularSpecs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {t('vendor.marketIntelligence.insufficientData')}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {popularSpecs.slice(0, 20).map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <span className="text-sm font-medium truncate">{spec.keyword}</span>
                      <Badge variant="secondary" className="ml-2">
                        {spec.frequency}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competition Tab */}
        <TabsContent value="competition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.marketIntelligence.competitionInsights')}</CardTitle>
              <CardDescription>
                {t('vendor.marketIntelligence.competitionInsightsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {competition.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {t('vendor.marketIntelligence.insufficientData')}
                </div>
              ) : (
                <div className="space-y-4">
                  {competition.map((comp, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">{comp.category}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                {t('vendor.marketIntelligence.avgOffers')}
                              </p>
                            </div>
                            <p className="text-2xl font-bold">{comp.avg_offers_per_rfq.toFixed(1)}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                {t('vendor.marketIntelligence.responseTime')}
                              </p>
                            </div>
                            <p className="text-2xl font-bold">{comp.avg_response_time_hours.toFixed(1)}h</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="h-4 w-4 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                {t('vendor.marketIntelligence.winRate')}
                              </p>
                            </div>
                            <p className="text-2xl font-bold">{comp.win_rate_benchmark.toFixed(1)}%</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <BarChart3 className="h-4 w-4 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                {t('vendor.marketIntelligence.totalRFQs')}
                              </p>
                            </div>
                            <p className="text-2xl font-bold">{comp.total_rfqs}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1 text-blue-900 dark:text-blue-100">
                {t('vendor.marketIntelligence.howToUse')}
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>
                  • {isRTL
                    ? 'استخدم نطاقات الأسعار لتقديم عروض تنافسية'
                    : 'Use pricing bands to submit competitive bids'}
                </li>
                <li>
                  • {isRTL
                    ? 'اطلع على المواصفات الشائعة لفهم احتياجات السوق'
                    : 'Review popular specs to understand market needs'}
                </li>
                <li>
                  • {isRTL
                    ? 'قارن أدائك بمعايير السوق لتحديد مجالات التحسين'
                    : 'Compare your performance to market benchmarks to identify improvement areas'}
                </li>
                <li>
                  • {isRTL
                    ? 'راقب اتجاهات الطلب لتخطيط قدرتك الإنتاجية'
                    : 'Monitor demand trends to plan your capacity'}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

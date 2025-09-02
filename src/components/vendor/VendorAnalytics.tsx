import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChartSkeleton } from "@/components/ui/ChartSkeleton";
import { useVendorStats } from "@/hooks/useVendorStats";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Clock, 
  DollarSign,
  Users,
  Star,
  Calendar,
  Filter
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const VendorAnalytics = () => {
  const { stats, loading } = useVendorStats();
  const languageContext = useLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <ChartSkeleton key={i} height="h-32" />
          ))}
        </div>
        <ChartSkeleton height="h-96" />
      </div>
    );
  }

  const performanceMetrics = [
    {
      title: t('vendor.analytics.offerAcceptanceRate'),
      value: stats?.successRate || 0,
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'hsl(var(--chart-1))'
    },
    {
      title: t('vendor.analytics.averageResponseTime'),
      value: '2.4h',
      change: '-15min',
      trend: 'up',
      icon: Clock,
      color: 'hsl(var(--chart-2))'
    },
    {
      title: t('vendor.analytics.clientSatisfaction'),
      value: stats?.clientSatisfaction || 0,
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'hsl(var(--chart-3))'
    },
    {
      title: t('vendor.analytics.monthlyRevenue'),
      value: stats?.monthlyEarnings || 0,
      change: '+8.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'hsl(var(--chart-4))'
    }
  ];

  const chartData = [
    { name: 'Jan', offers: 12, accepted: 8, revenue: 25000 },
    { name: 'Feb', offers: 15, accepted: 11, revenue: 32000 },
    { name: 'Mar', offers: 18, accepted: 14, revenue: 28000 },
    { name: 'Apr', offers: 22, accepted: 16, revenue: 45000 },
    { name: 'May', offers: 25, accepted: 19, revenue: 52000 },
    { name: 'Jun', offers: 28, accepted: 22, revenue: 48000 }
  ];

  const categoryData = [
    { name: 'Construction', value: 35, color: 'hsl(var(--chart-1))' },
    { name: 'Engineering', value: 25, color: 'hsl(var(--chart-2))' },
    { name: 'Consulting', value: 20, color: 'hsl(var(--chart-3))' },
    { name: 'Technology', value: 15, color: 'hsl(var(--chart-4))' },
    { name: 'Other', value: 5, color: 'hsl(var(--chart-5))' }
  ];

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {t('vendor.analytics.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('vendor.analytics.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            {t('common.filter')}
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            {t('common.dateRange')}
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">
                        {typeof metric.value === 'number' 
                          ? metric.value.toFixed(1) 
                          : metric.value
                        }
                        {metric.title.includes('Rate') && '%'}
                        {metric.title.includes('Rating') && '/5'}
                      </span>
                      <Badge 
                        variant={metric.trend === 'up' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {metric.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${metric.color}20` }}
                  >
                    <Icon 
                      className="w-6 h-6" 
                      style={{ color: metric.color }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            {t('vendor.analytics.overview')}
          </TabsTrigger>
          <TabsTrigger value="offers">
            {t('vendor.analytics.offers')}
          </TabsTrigger>
          <TabsTrigger value="revenue">
            {t('vendor.analytics.revenue')}
          </TabsTrigger>
          <TabsTrigger value="categories">
            {t('vendor.analytics.categories')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.analytics.offerTrends')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="offers" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      name={t('vendor.analytics.totalOffers')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accepted" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name={t('vendor.analytics.acceptedOffers')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.analytics.categoryDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.analytics.offerPerformance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="offers" fill="hsl(var(--chart-1))" name={t('vendor.analytics.submitted')} />
                  <Bar dataKey="accepted" fill="hsl(var(--chart-2))" name={t('vendor.analytics.accepted')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.analytics.revenueGrowth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--chart-3))" 
                    fill="hsl(var(--chart-3))"
                    fillOpacity={0.3}
                    name={t('vendor.analytics.revenue')}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.analytics.categoryBreakdown')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={category.value} 
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        {category.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.analytics.topPerformingCategories')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 3)
                  .map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          <Award className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.value}% of total projects
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
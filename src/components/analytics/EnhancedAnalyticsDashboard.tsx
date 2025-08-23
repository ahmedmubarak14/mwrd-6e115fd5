import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Package, 
  Banknote,
  Activity,
  RefreshCw,
  Wifi,
  WifiOff,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Pie
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const EnhancedAnalyticsDashboard = () => {
  const { userProfile } = useAuth();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [dateRange, setDateRange] = useState(30);
  const [selectedChart, setSelectedChart] = useState<'bar' | 'pie' | 'line'>('bar');
  
  const { 
    data, 
    loading, 
    error, 
    refetch, 
    isRealTimeEnabled, 
    toggleRealTime 
  } = useRealTimeAnalytics(dateRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Analytics</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = [
    {
      name: isRTL ? 'الطلبات' : 'Requests',
      value: data?.totalRequests || 0,
      growth: data?.growth?.requests || 0
    },
    {
      name: isRTL ? 'العروض' : 'Offers',
      value: data?.totalOffers || 0,
      growth: data?.growth?.offers || 0
    },
    {
      name: isRTL ? 'المقبولة' : 'Accepted',
      value: data?.acceptedOffers || 0,
      growth: 0
    },
    {
      name: isRTL ? 'المكتملة' : 'Completed',
      value: data?.completedRequests || 0,
      growth: 0
    }
  ];

  const pieData = [
    { name: isRTL ? 'مقبولة' : 'Accepted', value: data?.acceptedOffers || 0 },
    { name: isRTL ? 'معلقة' : 'Pending', value: (data?.totalOffers || 0) - (data?.acceptedOffers || 0) }
  ];

  const performanceMetrics = [
    {
      title: isRTL ? 'معدل النجاح' : 'Success Rate',
      value: Math.round(data?.successRate || 0),
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      title: isRTL ? 'رضا العملاء' : 'Client Satisfaction',
      value: data?.clientSatisfaction || 0,
      icon: Users,
      color: 'text-lime'
    },
    {
      title: isRTL ? 'وقت الاستجابة' : 'Response Time',
      value: data?.responseTime || 0,
      icon: Activity,
      color: 'text-accent'
    }
  ];

  const stats = userProfile?.role === 'supplier' ? [
    {
      title: isRTL ? 'إجمالي العروض' : 'Total Offers',
      value: data?.totalOffers?.toString() || '0',
      description: `${data?.growth?.offers ? (data.growth.offers > 0 ? '+' : '') + data.growth.offers.toFixed(1) + '%' : '0%'} ${isRTL ? 'من الفترة السابقة' : 'from last period'}`,
      icon: Package,
      color: 'text-primary',
      growth: data?.growth?.offers || 0
    },
    {
      title: isRTL ? 'العروض المقبولة' : 'Accepted Offers',
      value: data?.acceptedOffers?.toString() || '0',
      description: `${Math.round(data?.successRate || 0)}% ${isRTL ? 'معدل نجاح' : 'success rate'}`,
      icon: TrendingUp,
      color: 'text-lime',
      growth: 0
    },
    {
      title: isRTL ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: data?.totalRevenue?.toLocaleString() || '0',
      description: `${data?.growth?.revenue ? (data.growth.revenue > 0 ? '+' : '') + data.growth.revenue.toFixed(1) + '%' : '0%'} ${isRTL ? 'من الفترة السابقة' : 'from last period'}`,
      icon: Banknote,
      color: 'text-accent',
      growth: data?.growth?.revenue || 0,
      currency: true
    }
  ] : [
    {
      title: isRTL ? 'إجمالي الطلبات' : 'Total Requests',
      value: data?.totalRequests?.toString() || '0',
      description: `${data?.growth?.requests ? (data.growth.requests > 0 ? '+' : '') + data.growth.requests.toFixed(1) + '%' : '0%'} ${isRTL ? 'من الفترة السابقة' : 'from last period'}`,
      icon: FileText,
      color: 'text-primary',
      growth: data?.growth?.requests || 0
    },
    {
      title: isRTL ? 'الطلبات المكتملة' : 'Completed Requests',
      value: data?.completedRequests?.toString() || '0',
      description: `${data?.totalRequests ? Math.round((data.completedRequests || 0) / data.totalRequests * 100) : 0}% ${isRTL ? 'معدل الإنجاز' : 'completion rate'}`,
      icon: TrendingUp,
      color: 'text-lime',
      growth: 0
    },
    {
      title: isRTL ? 'العروض المستلمة' : 'Offers Received',
      value: data?.totalOffers?.toString() || '0',
      description: `${data?.totalRequests ? Math.round((data.totalOffers || 0) / data.totalRequests * 100) / 100 : 0} ${isRTL ? 'عروض لكل طلب' : 'offers per request'}`,
      icon: Package,
      color: 'text-accent',
      growth: data?.growth?.offers || 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{isRTL ? 'لوحة التحليلات' : 'Analytics Dashboard'}</h2>
          <p className="text-muted-foreground">
            {isRTL ? 'نظرة شاملة على أداءك' : 'Comprehensive overview of your performance'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={dateRange.toString()} onValueChange={(value) => setDateRange(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{isRTL ? '7 أيام' : '7 days'}</SelectItem>
              <SelectItem value="30">{isRTL ? '30 يوم' : '30 days'}</SelectItem>
              <SelectItem value="90">{isRTL ? '90 يوم' : '90 days'}</SelectItem>
              <SelectItem value="365">{isRTL ? 'سنة' : '1 year'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleRealTime}
            className={isRealTimeEnabled ? 'bg-primary/10' : ''}
          >
            {isRealTimeEnabled ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isRTL ? 'مباشر' : 'Live'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4" />
            {isRTL ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="flex items-center gap-2">
                {stat.growth !== 0 && (
                  stat.growth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-lime" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )
                )}
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.currency && (
                  <img 
                    src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                    alt="SAR" 
                    className="h-5 w-5 opacity-80"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Chart */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{isRTL ? 'نظرة عامة على الأداء' : 'Performance Overview'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'تصور تفاعلي لبياناتك' : 'Interactive visualization of your data'}
                </CardDescription>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={selectedChart === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedChart('bar')}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedChart === 'pie' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedChart('pie')}
                >
                  <PieChart className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedChart === 'line' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedChart('line')}
                >
                  <LineChart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {selectedChart === 'bar' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {selectedChart === 'pie' && (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
              {selectedChart === 'line' && (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {isRTL ? 'مقاييس الأداء' : 'Performance Metrics'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    <span className="text-sm font-medium">{metric.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
            
            {isRealTimeEnabled && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Wifi className="h-4 w-4" />
                  {isRTL ? 'التحديث المباشر مفعل' : 'Real-time updates enabled'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
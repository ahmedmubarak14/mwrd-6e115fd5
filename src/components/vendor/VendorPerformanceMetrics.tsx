import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  DollarSign, 
  Clock, 
  Users, 
  Star,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  AlertCircle,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { cn } from '@/lib/utils';

interface PerformanceData {
  winRate: number;
  totalBids: number;
  acceptedBids: number;
  rejectedBids: number;
  pendingBids: number;
  totalRevenue: number;
  monthlyRevenue: number;
  avgResponseTime: number;
  clientSatisfaction: number;
  repeatClients: number;
  totalClients: number;
  completionRate: number;
  onTimeDelivery: number;
}

interface BidAnalytics {
  category: string;
  bids: number;
  wins: number;
  winRate: number;
  avgValue: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  bids: number;
  wins: number;
}

interface ClientData {
  name: string;
  company: string;
  totalOrders: number;
  totalValue: number;
  satisfaction: number;
  lastOrder: string;
  status: 'active' | 'inactive' | 'new';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const VendorPerformanceMetrics: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [timeRange, setTimeRange] = useState('6months');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from API
  const performanceData: PerformanceData = {
    winRate: 68.5,
    totalBids: 45,
    acceptedBids: 31,
    rejectedBids: 12,
    pendingBids: 2,
    totalRevenue: 125000,
    monthlyRevenue: 18500,
    avgResponseTime: 2.3,
    clientSatisfaction: 4.7,
    repeatClients: 8,
    totalClients: 12,
    completionRate: 94.2,
    onTimeDelivery: 91.8
  };

  const bidAnalytics: BidAnalytics[] = [
    { category: 'Construction', bids: 15, wins: 11, winRate: 73.3, avgValue: 8500 },
    { category: 'Electrical', bids: 12, wins: 8, winRate: 66.7, avgValue: 3200 },
    { category: 'Interior Design', bids: 10, wins: 7, winRate: 70.0, avgValue: 12000 },
    { category: 'IT Services', bids: 8, wins: 5, winRate: 62.5, avgValue: 4500 }
  ];

  const revenueData: RevenueData[] = [
    { month: 'Jul', revenue: 12000, bids: 8, wins: 5 },
    { month: 'Aug', revenue: 15000, bids: 10, wins: 7 },
    { month: 'Sep', revenue: 18000, bids: 12, wins: 8 },
    { month: 'Oct', revenue: 22000, bids: 15, wins: 10 },
    { month: 'Nov', revenue: 19500, bids: 13, wins: 9 },
    { month: 'Dec', revenue: 25000, bids: 16, wins: 11 }
  ];

  const clientData: ClientData[] = [
    { name: 'Ahmed Al-Rashid', company: 'Tech Solutions Inc.', totalOrders: 8, totalValue: 45000, satisfaction: 4.8, lastOrder: '2024-01-15', status: 'active' },
    { name: 'Sarah Johnson', company: 'Green Building Co.', totalOrders: 5, totalValue: 32000, satisfaction: 4.6, lastOrder: '2024-01-10', status: 'active' },
    { name: 'Mohammed Al-Sheikh', company: 'Modern Interiors', totalOrders: 3, totalValue: 18000, satisfaction: 4.9, lastOrder: '2024-01-08', status: 'active' },
    { name: 'Fatima Al-Zahra', company: 'Smart Office Ltd.', totalOrders: 2, totalValue: 12000, satisfaction: 4.5, lastOrder: '2023-12-20', status: 'inactive' },
    { name: 'Omar Hassan', company: 'Future Tech', totalOrders: 1, totalValue: 8500, satisfaction: 4.7, lastOrder: '2024-01-05', status: 'new' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getPerformanceColor = (value: number, type: 'rate' | 'time' | 'satisfaction') => {
    if (type === 'rate') {
      if (value >= 80) return 'text-green-600';
      if (value >= 60) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (type === 'time') {
      if (value <= 2) return 'text-green-600';
      if (value <= 4) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (type === 'satisfaction') {
      if (value >= 4.5) return 'text-green-600';
      if (value >= 3.5) return 'text-yellow-600';
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3" />;
      case 'inactive': return <AlertCircle className="h-3 w-3" />;
      case 'new': return <Star className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('vendor.performance.title')}</h1>
          <p className="text-muted-foreground">{t('vendor.performance.description')}</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">{t('vendor.performance.lastMonth')}</SelectItem>
              <SelectItem value="3months">{t('vendor.performance.last3Months')}</SelectItem>
              <SelectItem value="6months">{t('vendor.performance.last6Months')}</SelectItem>
              <SelectItem value="1year">{t('vendor.performance.lastYear')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('vendor.performance.export')}
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.refresh')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('vendor.performance.overview')}</TabsTrigger>
          <TabsTrigger value="bidding">{t('vendor.performance.bidding')}</TabsTrigger>
          <TabsTrigger value="revenue">{t('vendor.performance.revenue')}</TabsTrigger>
          <TabsTrigger value="clients">{t('vendor.performance.clients')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('vendor.performance.winRate')}</p>
                    <p className={cn("text-2xl font-bold", getPerformanceColor(performanceData.winRate, 'rate'))}>
                      {formatPercentage(performanceData.winRate)}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+5.2% {t('vendor.performance.vsLastMonth')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('vendor.performance.totalRevenue')}</p>
                    <p className="text-2xl font-bold">{formatCurrency(performanceData.totalRevenue)}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12.3% {t('vendor.performance.vsLastMonth')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('vendor.performance.clientSatisfaction')}</p>
                    <p className={cn("text-2xl font-bold", getPerformanceColor(performanceData.clientSatisfaction, 'satisfaction'))}>
                      {performanceData.clientSatisfaction}/5.0
                    </p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+0.2 {t('vendor.performance.vsLastMonth')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('vendor.performance.avgResponseTime')}</p>
                    <p className={cn("text-2xl font-bold", getPerformanceColor(performanceData.avgResponseTime, 'time'))}>
                      {performanceData.avgResponseTime}h
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">-0.5h {t('vendor.performance.vsLastMonth')}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.performance.revenueTrend')}</CardTitle>
                <CardDescription>{t('vendor.performance.revenueTrendDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), t('vendor.performance.revenue')]} />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.performance.bidWinRate')}</CardTitle>
                <CardDescription>{t('vendor.performance.bidWinRateDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bids" fill="#8884d8" name={t('vendor.performance.bids')} />
                    <Bar dataKey="wins" fill="#82ca9d" name={t('vendor.performance.wins')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bidding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.performance.bidAnalytics')}</CardTitle>
                <CardDescription>{t('vendor.performance.bidAnalyticsDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bidAnalytics.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{category.category}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category.bids} {t('vendor.performance.bids')} • {category.wins} {t('vendor.performance.wins')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPercentage(category.winRate)}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(category.avgValue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('vendor.performance.categoryBreakdown')}</CardTitle>
                <CardDescription>{t('vendor.performance.categoryBreakdownDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={bidAnalytics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, winRate }) => `${category}: ${formatPercentage(winRate)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="bids"
                    >
                      {bidAnalytics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('vendor.performance.totalRevenue')}</p>
                    <p className="text-2xl font-bold">{formatCurrency(performanceData.totalRevenue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('vendor.performance.monthlyRevenue')}</p>
                    <p className="text-2xl font-bold">{formatCurrency(performanceData.monthlyRevenue)}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('vendor.performance.avgOrderValue')}</p>
                    <p className="text-2xl font-bold">{formatCurrency(performanceData.totalRevenue / performanceData.acceptedBids)}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.performance.revenueGrowth')}</CardTitle>
              <CardDescription>{t('vendor.performance.revenueGrowthDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), t('vendor.performance.revenue')]} />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('vendor.performance.totalClients')}</p>
                    <p className="text-2xl font-bold">{performanceData.totalClients}</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('vendor.performance.repeatClients')}</p>
                    <p className="text-2xl font-bold">{performanceData.repeatClients}</p>
                  </div>
                  <Award className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('vendor.performance.clientRetention')}</p>
                    <p className="text-2xl font-bold">{formatPercentage((performanceData.repeatClients / performanceData.totalClients) * 100)}</p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('vendor.performance.clientList')}</CardTitle>
              <CardDescription>{t('vendor.performance.clientListDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientData.map((client) => (
                  <div key={client.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{client.name}</h4>
                        <p className="text-sm text-muted-foreground">{client.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(client.totalValue)}</p>
                        <p className="text-xs text-muted-foreground">{client.totalOrders} {t('vendor.performance.orders')}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{client.satisfaction}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{client.lastOrder}</p>
                      </div>
                      <Badge className={cn("gap-1", getStatusColor(client.status))}>
                        {getStatusIcon(client.status)}
                        {t(`vendor.performance.status.${client.status}`)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

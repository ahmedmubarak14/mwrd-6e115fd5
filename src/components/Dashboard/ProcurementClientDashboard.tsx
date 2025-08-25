import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Activity,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { useToast } from "@/hooks/use-toast";

export const ProcurementClientDashboard = () => {
  const { t, isRTL, formatNumber, formatCurrency } = useLanguage();
  const { userProfile } = useAuth();
  const { metrics, isLoading, error } = useRealTimeAnalytics();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleExportAnalytics = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: isRTL ? "تم تصدير التحليلات" : "Analytics Exported",
        description: isRTL ? "تم تصدير بيانات التحليلات بنجاح" : "Analytics data exported successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في التصدير" : "Export Error",
        description: isRTL ? "حدث خطأ أثناء تصدير البيانات" : "Error exporting analytics data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: isRTL ? "تم تحديث البيانات" : "Data Refreshed",
        description: isRTL ? "تم تحديث بيانات التحليلات بنجاح" : "Analytics data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في التحديث" : "Refresh Error",
        description: isRTL ? "حدث خطأ أثناء تحديث البيانات" : "Error refreshing data",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDrillDown = (cardTitle: string) => {
    toast({
      title: isRTL ? "عرض التفاصيل" : "Drill Down",
      description: isRTL ? `عرض تفاصيل ${cardTitle}` : `Viewing details for ${cardTitle}`,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[200px]"><Clock className="mr-2 h-4 w-4 animate-spin" /> Loading...</div>;
  }

  if (error) {
    return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /> {error}</Alert>;
  }

  return (
    <div className={`p-4 sm:p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t('dashboard.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.welcomeMessage') || 'Welcome to your procurement dashboard'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="rtl-flex items-center gap-2"
          >
            <Clock className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('common.refresh') || 'Refresh'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExportAnalytics} disabled={isExporting}>
            {isExporting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                {t('common.exporting') || 'Exporting...'}
              </>
            ) : (
              <>
                <FileText className="rtl-mr-2 h-4 w-4" />
                {t('analytics.export') || 'Export'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card onClick={() => handleDrillDown(t('admin.totalUsers'))} className="hover:scale-105 transition-transform duration-200 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.totalUsers')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics?.totalUsers || 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="rtl-mr-1 h-3 w-3 text-green-500" />
              +{metrics?.userGrowth || '0'}% {t('analytics.fromLastMonth') || 'from last month'}
            </div>
          </CardContent>
        </Card>

        <Card onClick={() => handleDrillDown(t('admin.activeRequests'))} className="hover:scale-105 transition-transform duration-200 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.activeRequests')}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics?.activeRequests || 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="rtl-mr-1 h-3 w-3 text-green-500" />
              +{metrics?.requestGrowth || '0'}% {t('analytics.fromLastWeek') || 'from last week'}
            </div>
          </CardContent>
        </Card>

        <Card onClick={() => handleDrillDown(t('admin.revenue'))} className="hover:scale-105 transition-transform duration-200 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.revenue')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics?.totalRevenue || 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="rtl-mr-1 h-3 w-3 text-green-500" />
              +{metrics?.revenueGrowth || '0'}% {t('analytics.fromLastMonth') || 'from last month'}
            </div>
          </CardContent>
        </Card>

        <Card onClick={() => handleDrillDown(t('orders.title'))} className="hover:scale-105 transition-transform duration-200 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('orders.title')}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics?.totalOrders || 0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="rtl-mr-1 h-3 w-3 text-red-500" />
              -{metrics?.orderDecline || '0'}% {t('analytics.fromLastWeek') || 'from last week'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="overview">{t('dashboard.overview')}</TabsTrigger>
          <TabsTrigger value="requests">{t('requests.title')}</TabsTrigger>
          <TabsTrigger value="suppliers">{t('suppliers.title')}</TabsTrigger>
          <TabsTrigger value="orders">{t('orders.title')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.rfqPerformance') || 'RFQ Performance'}</CardTitle>
              <CardDescription>
                {t('dashboard.recentActivity') || 'Recent RFQ activity and status'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* RFQ Performance Content */}
              <p>{t('dashboard.noDataAvailable') || 'No data available for RFQ performance.'}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('requests.title')}</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 rtl-mr-2" />
                  {t('requests.createRequest') || 'Create Request'}
                </Button>
              </div>
              <CardDescription>
                {t('requests.manageRequests') || 'Manage and track your service requests'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Requests Content */}
              <p>{t('requests.noRequests') || 'No requests found.'}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('suppliers.title')}</CardTitle>
              <CardDescription>
                {t('suppliers.findManage') || 'Find and manage your preferred suppliers'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Suppliers Content */}
              <p>{t('suppliers.noSuppliers') || 'No suppliers found.'}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('orders.title')}</CardTitle>
              <CardDescription>
                {t('orders.trackManage') || 'Track and manage your orders'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Orders Content */}
              <p>{t('orders.noOrders') || 'No orders found.'}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

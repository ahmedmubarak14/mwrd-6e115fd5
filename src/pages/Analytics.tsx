import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart3, TrendingUp, Users, Eye, Calendar, Activity, Download, Filter, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { dummyApi } from "@/utils/dummyApi";
import { useState } from "react";

export const Analytics = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState("30");
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock analytics data based on user role
  const getAnalyticsData = () => {
    if (userProfile?.role === 'supplier') {
      return {
        cards: [
          {
            title: isRTL ? 'إجمالي العروض' : 'Total Offers',
            value: '42',
            description: isRTL ? '+12% من الشهر الماضي' : '+12% from last month',
            icon: BarChart3,
            color: 'text-blue-600'
          },
          {
            title: isRTL ? 'العروض المقبولة' : 'Accepted Offers',
            value: '28',
            description: isRTL ? 'معدل نجاح 67%' : '67% success rate',
            icon: TrendingUp,
            color: 'text-green-600'
          },
          {
            title: isRTL ? 'العملاء الجدد' : 'New Clients',
            value: '15',
            description: isRTL ? '+23% من الشهر الماضي' : '+23% from last month',
            icon: Users,
            color: 'text-purple-600'
          },
          {
            title: isRTL ? 'مشاهدات الملف' : 'Profile Views',
            value: '156',
            description: isRTL ? '+8% من الأسبوع الماضي' : '+8% from last week',
            icon: Eye,
            color: 'text-orange-600'
          }
        ],
        charts: [
          {
            title: isRTL ? 'أداء العروض الشهرية' : 'Monthly Offers Performance',
            description: isRTL ? 'مقارنة العروض المُرسلة والمقبولة' : 'Comparison of sent vs accepted offers'
          }
        ]
      };
    } else {
      return {
        cards: [
          {
            title: isRTL ? 'إجمالي الطلبات' : 'Total Requests',
            value: '24',
            description: isRTL ? '+18% من الشهر الماضي' : '+18% from last month',
            icon: BarChart3,
            color: 'text-blue-600'
          },
          {
            title: isRTL ? 'الطلبات المكتملة' : 'Completed Requests',
            value: '19',
            description: isRTL ? 'معدل إنجاز 79%' : '79% completion rate',
            icon: TrendingUp,
            color: 'text-green-600'
          },
          {
            title: isRTL ? 'مقدمي الخدمات' : 'Service Providers',
            value: '12',
            description: isRTL ? 'متوسط 3.2 عروض لكل طلب' : 'Average 3.2 offers per request',
            icon: Users,
            color: 'text-purple-600'
          },
          {
            title: isRTL ? 'الفعاليات النشطة' : 'Active Events',
            value: '5',
            description: isRTL ? '3 قادمة هذا الشهر' : '3 upcoming this month',
            icon: Calendar,
            color: 'text-orange-600'
          }
        ],
        charts: [
          {
            title: isRTL ? 'نشاط الطلبات الشهرية' : 'Monthly Request Activity',
            description: isRTL ? 'عدد الطلبات والعروض المستلمة' : 'Number of requests and received offers'
          }
        ]
      };
    }
  };

  const analyticsData = getAnalyticsData();

  const handleExportAnalytics = async () => {
    setIsExporting(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await dummyApi.exportAnalytics({
        start: startDate,
        end: endDate
      });

      if (response.success) {
        toast({
          title: isRTL ? "تم تصدير التحليلات" : "Analytics Exported",
          description: isRTL ? "تم تصدير بيانات التحليلات بنجاح" : "Analytics data exported successfully",
        });
        window.open(response.data?.downloadUrl || '#', '_blank');
      }
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
      // Simulate API call to refresh data
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
    // In a real app, this would navigate to a detailed view
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-arabic' : ''}`}>
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h1 className="text-3xl font-bold mb-2">
                  {isRTL ? 'تحليلات الأداء' : 'Performance Analytics'}
                </h1>
                <p className="text-muted-foreground">
                  {isRTL ? 'راقب أداءك واحصل على رؤى قيمة لتحسين نتائجك' : 'Monitor your performance and gain valuable insights to improve your results'}
                </p>
              </div>
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Select value={dateRange} onValueChange={setDateRange}>
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
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                  className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRTL ? 'تحديث' : 'Refresh'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportAnalytics}
                  disabled={isExporting}
                  className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? (isRTL ? 'جاري التصدير...' : 'Exporting...') : (isRTL ? 'تصدير' : 'Export')}
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsData.cards.map((card, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleDrillDown(card.title)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 p-0 h-auto text-xs text-primary hover:text-primary/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDrillDown(card.title);
                      }}
                    >
                      {isRTL ? 'عرض التفاصيل' : 'View Details'} →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {isRTL ? 'نظرة عامة على الأداء' : 'Performance Overview'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        {isRTL ? 'معدل النجاح' : 'Success Rate'}
                      </span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        {isRTL ? 'رضا العملاء' : 'Client Satisfaction'}
                      </span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        {isRTL ? 'الوقت المستجابة' : 'Response Time'}
                      </span>
                      <span className="text-sm text-muted-foreground">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>{analyticsData.charts[0].title}</CardTitle>
                    <CardDescription>{analyticsData.charts[0].description}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDrillDown(analyticsData.charts[0].title)}
                    className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                  >
                    <Eye className="h-4 w-4" />
                    {isRTL ? 'تفاصيل' : 'Details'}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
                       onClick={() => handleDrillDown(analyticsData.charts[0].title)}>
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'انقر لعرض المخططات التفاعلية' : 'Click to view interactive charts'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className={`flex items-center gap-4 p-3 rounded-lg bg-muted/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <p className="text-sm font-medium">
                          {isRTL ? `نشاط ${item}` : `Activity ${item}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isRTL ? 'منذ ساعتين' : '2 hours ago'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
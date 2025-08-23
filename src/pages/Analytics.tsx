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
import { useState } from "react";
import { EnhancedAnalyticsDashboard } from "@/components/analytics/EnhancedAnalyticsDashboard";
import { Footer } from "@/components/ui/layout/Footer";

export const Analytics = () => {
  const { userProfile } = useAuth();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState("30");
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock analytics data based on user role
  const getAnalyticsData = () => {
    if (userProfile?.role === 'vendor') {
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
      // Simulate export functionality
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
            <EnhancedAnalyticsDashboard />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
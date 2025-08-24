
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { BasicAnalyticsDashboard } from "@/components/analytics/BasicAnalyticsDashboard";

export const Analytics = () => {
  const { userProfile } = useAuth();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  const [dateRange, setDateRange] = useState("30");
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  return (
    <DashboardLayout className={isRTL ? 'font-arabic' : ''}>
      <div className="max-w-7xl mx-auto space-y-6">
        <BasicAnalyticsDashboard />
      </div>
    </DashboardLayout>
  );
};

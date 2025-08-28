import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { BasicAnalyticsDashboard } from "@/components/analytics/BasicAnalyticsDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Download, RefreshCw, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {isRTL ? "التحليلات والإحصائيات" : "Analytics & Insights"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? "عرض شامل لأداء حسابك وإحصائيات النشاط" : "Comprehensive view of your account performance and activity statistics"}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
              <SelectItem value="365">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {isRTL ? "تحديث" : "Refresh"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExportAnalytics}
            disabled={isExporting}
          >
            {isExporting ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {isRTL ? "تصدير" : "Export"}
          </Button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <BasicAnalyticsDashboard />
    </div>
  );
};
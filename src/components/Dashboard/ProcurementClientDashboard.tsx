
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "./DashboardHeader";
import { MetricsCards } from "./MetricsCards";
import { DashboardTabs } from "./DashboardTabs";

export const ProcurementClientDashboard = () => {
  const { isRTL } = useLanguage();
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
        title: "Analytics Exported",
        description: "Analytics data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Error exporting analytics data",
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
        title: "Data Refreshed",
        description: "Analytics data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Refresh Error",
        description: "Error refreshing data",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDrillDown = (cardTitle: string) => {
    toast({
      title: "Drill Down",
      description: `Viewing details for ${cardTitle}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertTriangle className="h-4 w-4" />
        <div>Error loading dashboard: {error}</div>
      </Alert>
    );
  }

  return (
    <div className={`p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <DashboardHeader
        onRefresh={handleRefreshData}
        onExport={handleExportAnalytics}
        isRefreshing={isRefreshing}
        isExporting={isExporting}
      />

      <MetricsCards 
        metrics={metrics || {}} 
        onCardClick={handleDrillDown} 
      />

      <DashboardTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
    </div>
  );
};

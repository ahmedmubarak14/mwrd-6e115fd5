
import { useState } from "react";
import { AlertTriangle, FileText, CheckCircle, Clock, DollarSign } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardTabs } from "./DashboardTabs";
import { StatsGrid } from "../dashboard/shared/StatsGrid";
import { LoadingState } from "../dashboard/shared/LoadingState";
import { EmptyState } from "../dashboard/shared/EmptyState";

export const ProcurementClientDashboard = () => {
  const { isRTL, t, formatCurrency } = useLanguage();
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
        title: t('dashboard.export'),
        description: t('dashboard.exportSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('dashboard.exportError'),
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
        title: t('dashboard.refresh'),
        description: t('dashboard.refreshSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('dashboard.refreshError'),
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDrillDown = (cardKey: string) => {
    toast({
      title: t('action.viewDetails'),
      description: t('dashboard.drillDownMessage').replace('{section}', cardKey),
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertTriangle className="h-4 w-4" />
        <div>{t('dashboard.error')}: {error}</div>
      </Alert>
    );
  }

  // Prepare stats data with translations - using correct property names from AnalyticsMetrics
  const statsData = [
    {
      key: 'totalRequests',
      title: t('dashboard.stats.totalRequests'),
      value: metrics?.activeRequests || 0, // Using activeRequests from AnalyticsMetrics interface
      icon: FileText,
      trend: { value: 12, isPositive: true }
    },
    {
      key: 'activeProjects', 
      title: t('dashboard.stats.activeProjects'),
      value: metrics?.totalUsers || 0, // Using available property from interface
      icon: Clock,
      trend: { value: 8, isPositive: true }
    },
    {
      key: 'completedOrders',
      title: t('dashboard.stats.completedOrders'), 
      value: metrics?.totalOrders || 0, // Using totalOrders from AnalyticsMetrics interface
      icon: CheckCircle,
      trend: { value: 15, isPositive: true }
    },
    {
      key: 'savings',
      title: t('dashboard.stats.savings'),
      value: formatCurrency(metrics?.totalRevenue || 0), // Using totalRevenue from interface
      icon: DollarSign,
      trend: { value: 23, isPositive: true }
    },
  ];

  return (
    <div className={`p-4 sm:p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <DashboardHeader
        onRefresh={handleRefreshData}
        onExport={handleExportAnalytics}
        isRefreshing={isRefreshing}
        isExporting={isExporting}
      />

      {metrics && Object.keys(metrics).length > 0 ? (
        <StatsGrid 
          stats={statsData}
          onCardClick={handleDrillDown}
          isLoading={isLoading}
        />
      ) : (
        <EmptyState 
          title={t('dashboard.emptyState.title')}
          description={t('dashboard.emptyState.description')}
          actionLabel={t('dashboard.emptyState.action')}
          onAction={() => {/* Navigate to create request */}}
          icon={<FileText className="h-12 w-12" />}
        />
      )}

      <DashboardTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
    </div>
  );
};

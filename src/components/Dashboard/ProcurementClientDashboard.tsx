
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardTabs } from "./DashboardTabs";
import { ClientStatsCards } from "../dashboard/client/ClientStatsCards";
import { ClientQuickActions } from "../dashboard/client/ClientQuickActions";
import { ClientOverviewMetrics } from "../dashboard/client/ClientOverviewMetrics";
import { LoadingState } from "../dashboard/shared/LoadingState";
import { EmptyState } from "../dashboard/shared/EmptyState";

export const ProcurementClientDashboard = () => {
  const { isRTL, t } = useLanguage();
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

  const handleCardClick = (cardKey: string) => {
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

  return (
    <div className={`p-4 sm:p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <DashboardHeader
        onRefresh={handleRefreshData}
        onExport={handleExportAnalytics}
        isRefreshing={isRefreshing}
        isExporting={isExporting}
      />

      {metrics && Object.keys(metrics).length > 0 ? (
        <>
          <ClientStatsCards 
            metrics={metrics}
            isLoading={isLoading}
            onCardClick={handleCardClick}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <ClientQuickActions 
                recentActivity={{
                  newMessages: 3,
                  pendingRequests: metrics?.activeRequests || 0,
                  activeOffers: 8
                }}
              />
            </div>
            <div>
              <ClientOverviewMetrics 
                metrics={{
                  completionRate: 78,
                  avgResponseTime: '4.2h',
                  successRate: 94,
                  activeProjects: metrics?.totalUsers || 0
                }}
                isLoading={isLoading}
              />
            </div>
          </div>
        </>
      ) : (
        <EmptyState 
          title={t('dashboard.emptyState.title')}
          description={t('dashboard.emptyState.description')}
          actionLabel={t('dashboard.emptyState.action')}
          onAction={() => {/* Navigate to create request */}}
        />
      )}

      <DashboardTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
    </div>
  );
};

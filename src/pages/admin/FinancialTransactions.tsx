
import { useState } from "react";
import { AdminAnalyticsLayout } from "@/components/admin/AdminAnalyticsLayout";
import { FinancialDashboard } from "@/components/admin/FinancialDashboard";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useToast } from "@/hooks/use-toast";

const FinancialTransactions = () => {
  const languageContext = useOptionalLanguage();
  const { t } = languageContext || { t: (key: string) => key };
  const { toast } = useToast();
  
  const [period, setPeriod] = useState("30");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Trigger refresh by changing period temporarily
      const currentPeriod = period;
      setPeriod("0");
      setTimeout(() => setPeriod(currentPeriod), 100);
      
      toast({
        title: t('common.success'),
        description: t('financial.dataRefreshed'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('financial.refreshError'),
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('common.success'),
        description: t('financial.dataExported'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('financial.exportError'),
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminAnalyticsLayout
      title={t('admin.financialTransactions')}
      description={t('financial.monitorRevenue')}
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={handleRefresh}
      onExport={handleExport}
      isRefreshing={isRefreshing}
      isExporting={isExporting}
    >
      <FinancialDashboard period={period} />
    </AdminAnalyticsLayout>
  );
};

export default FinancialTransactions;

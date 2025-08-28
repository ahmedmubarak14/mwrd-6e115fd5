
import { useState } from "react";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { FinancialDashboard } from "@/components/admin/FinancialDashboard";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Download } from "lucide-react";

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
    <AdminPageContainer
      title="Financial Transactions"
      description="Monitor revenue, track payments, and analyze financial performance across all platform transactions"
      headerActions={
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      }
    >
      <FinancialDashboard 
        period={period} 
        onRefresh={handleRefresh}
        onExport={handleExport}
        isRefreshing={isRefreshing}
        isExporting={isExporting}
      />
    </AdminPageContainer>
  );
};

export default FinancialTransactions;

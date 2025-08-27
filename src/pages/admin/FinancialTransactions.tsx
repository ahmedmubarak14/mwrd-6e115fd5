
import { EnhancedFinancialDashboard } from "@/components/admin/EnhancedFinancialDashboard";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

const FinancialTransactions = () => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn(isRTL ? "text-right" : "text-left")}>
        <h1 className="text-3xl font-bold">{t('admin.financialTransactions')}</h1>
        <p className="text-muted-foreground">
          {t('financial.monitorRevenue')}
        </p>
      </div>
      <EnhancedFinancialDashboard />
    </div>
  );
};

export default FinancialTransactions;

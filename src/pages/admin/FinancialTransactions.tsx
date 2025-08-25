
import { FinancialDashboard } from "@/components/admin/FinancialDashboard";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const FinancialTransactions = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn(isRTL ? "text-right" : "text-left")}>
        <h1 className="text-3xl font-bold">{t('admin.financialTransactions')}</h1>
        <p className="text-muted-foreground">
          {t('financial.monitorRevenue')}
        </p>
      </div>
      <FinancialDashboard />
    </div>
  );
};

export default FinancialTransactions;

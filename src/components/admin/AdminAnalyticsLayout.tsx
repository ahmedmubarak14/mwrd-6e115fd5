import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Download } from 'lucide-react';

interface AdminAnalyticsLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  isRefreshing?: boolean;
  isExporting?: boolean;
  className?: string;
}

export const AdminAnalyticsLayout = ({
  children,
  title,
  description,
  period = "30",
  onPeriodChange,
  onRefresh,
  onExport,
  isRefreshing = false,
  isExporting = false,
  className
}: AdminAnalyticsLayoutProps) => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  return (
    <div className={cn("max-w-7xl mx-auto space-y-6 p-6", className)}>
      {/* Header Section - matches Analytics style exactly */}
      <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL ? "text-right" : "text-left")}>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-foreground/75">{description}</p>
          )}
        </div>
        <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
          {onPeriodChange && (
            <Select value={period} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">{t('analytics.last7Days') || 'Last 7 Days'}</SelectItem>
                <SelectItem value="30">{t('analytics.last30Days') || 'Last 30 Days'}</SelectItem>
                <SelectItem value="90">{t('analytics.last90Days') || 'Last 90 Days'}</SelectItem>
                <SelectItem value="365">{t('analytics.lastYear') || 'Last Year'}</SelectItem>
              </SelectContent>
            </Select>
          )}
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin", !isRTL && "mr-2", isRTL && "ml-2")} />
              {t('common.refresh') || 'Refresh'}
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport} disabled={isExporting}>
              <Download className={cn("h-4 w-4", !isRTL && "mr-2", isRTL && "ml-2")} />
              {t('common.export') || 'Export'}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
};
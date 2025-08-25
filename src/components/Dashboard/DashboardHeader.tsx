
import { Button } from "@/components/ui/button";
import { Clock, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  isRefreshing: boolean;
  isExporting: boolean;
}

export const DashboardHeader = ({ onRefresh, onExport, isRefreshing, isExporting }: DashboardHeaderProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {t('dashboard.title') === 'dashboard.title' ? 'Dashboard' : t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.welcomeMessage') === 'dashboard.welcomeMessage' 
            ? 'Welcome to your procurement dashboard' 
            : t('dashboard.welcomeMessage')}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Clock className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {t('common.refresh') === 'common.refresh' ? 'Refresh' : t('common.refresh')}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExport} 
          disabled={isExporting}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isExporting ? (
            <Clock className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {isExporting 
            ? (t('common.exporting') === 'common.exporting' ? 'Exporting...' : t('common.exporting'))
            : (t('analytics.export') === 'analytics.export' ? 'Export' : t('analytics.export'))
          }
        </Button>
      </div>
    </div>
  );
};

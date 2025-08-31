import { ComprehensiveAdminOverview } from '@/components/admin/ComprehensiveAdminOverview';
import { useLanguage } from '@/contexts/LanguageContext';

export const AdminDashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          {t('admin.dashboard')}
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          {t('admin.dashboardData.description')}
        </p>
      </div>

      {/* Comprehensive Admin Overview */}
      <ComprehensiveAdminOverview />
    </div>
  );
};
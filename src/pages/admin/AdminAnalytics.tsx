import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { BasicAnalyticsDashboard } from '@/components/analytics/BasicAnalyticsDashboard';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminAnalytics() {
  const { t } = useLanguage();

  return (
    <AdminPageContainer
      title={t('admin.analytics.platformAnalytics')}
      description={t('admin.analytics.monitorDescription')}
    >
      <BasicAnalyticsDashboard />
    </AdminPageContainer>
  );
}
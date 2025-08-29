import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { BasicAnalyticsDashboard } from '@/components/analytics/BasicAnalyticsDashboard';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

export default function AdminAnalytics() {
  const languageContext = useOptionalLanguage();
  const { t } = languageContext || { t: (key: string) => key };

  return (
    <AdminPageContainer
      title={t('analytics.platformAnalytics')}
      description={t('analytics.monitorDescription')}
    >
      <BasicAnalyticsDashboard />
    </AdminPageContainer>
  );
}
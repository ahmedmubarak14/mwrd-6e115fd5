import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { AdminCommunicationCenter as CommunicationCenterComponent } from '@/components/admin/AdminCommunicationCenter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminCommunicationCenter() {
  const { t } = useLanguage();

  return (
    <AdminPageContainer
      title={t('admin.communicationCenter')}
      description={t('admin.communicationCenterDescription')}
    >
      <CommunicationCenterComponent />
    </AdminPageContainer>
  );
}
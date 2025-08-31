import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { AdminCommunicationCenter as CommunicationCenterComponent } from '@/components/admin/AdminCommunicationCenter';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

export default function AdminCommunicationCenter() {
  const languageContext = useOptionalLanguage();
  const { t } = languageContext || { t: (key: string) => key };

  return (
    <AdminPageContainer
      title={t('admin.communicationCenter')}
      description={t('admin.communicationCenterDescription')}
    >
      <CommunicationCenterComponent />
    </AdminPageContainer>
  );
}
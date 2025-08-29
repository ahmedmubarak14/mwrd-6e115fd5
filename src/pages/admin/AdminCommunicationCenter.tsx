import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { AdminCommunicationCenter as CommunicationCenterComponent } from '@/components/admin/AdminCommunicationCenter';

export default function AdminCommunicationCenter() {
  return (
    <AdminPageContainer
      title="Communication Center"
      description="Manage notifications, broadcasts, and user communications"
    >
      <CommunicationCenterComponent />
    </AdminPageContainer>
  );
}
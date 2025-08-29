import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { AdminRealTimeMonitor as RealTimeMonitorComponent } from '@/components/admin/AdminRealTimeMonitor';

export default function AdminRealTimeMonitor() {
  return (
    <AdminPageContainer
      title="Real-Time Monitor"
      description="Monitor system health and performance metrics in real-time"
    >
      <RealTimeMonitorComponent />
    </AdminPageContainer>
  );
}
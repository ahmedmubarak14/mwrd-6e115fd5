import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { PerformanceMonitor } from '@/components/admin/PerformanceMonitor';

export default function AdminPerformanceMonitor() {
  return (
    <AdminPageContainer
      title="Performance Monitor"
      description="Monitor application performance metrics and optimize user experience"
    >
      <PerformanceMonitor />
    </AdminPageContainer>
  );
}
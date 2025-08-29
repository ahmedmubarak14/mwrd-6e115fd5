import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { BasicAnalyticsDashboard } from '@/components/analytics/BasicAnalyticsDashboard';

export default function AdminAnalytics() {
  return (
    <AdminPageContainer
      title="Platform Analytics"
      description="View comprehensive analytics and reports for the platform"
    >
      <BasicAnalyticsDashboard />
    </AdminPageContainer>
  );
}
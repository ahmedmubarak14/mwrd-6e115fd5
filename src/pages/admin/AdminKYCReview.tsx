import { AdminKYCReview } from '@/components/admin/AdminKYCReview';

const AdminKYCReviewPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">KYC Review</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve KYC submissions from clients
        </p>
      </div>
      <AdminKYCReview />
    </div>
  );
};

export default AdminKYCReviewPage;

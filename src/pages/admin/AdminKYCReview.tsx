import { AdminKYCReview } from '@/components/admin/AdminKYCReview';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminKYCReviewPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.kyc.title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('admin.kyc.subtitle')}
        </p>
      </div>
      <AdminKYCReview />
    </div>
  );
};

export default AdminKYCReviewPage;

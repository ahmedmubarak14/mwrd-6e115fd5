import { AdminKYVReview } from '@/components/admin/AdminKYVReview';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminKYVReviewPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.kyv.title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('admin.kyv.subtitle')}
        </p>
      </div>
      <AdminKYVReview />
    </div>
  );
};

export default AdminKYVReviewPage;

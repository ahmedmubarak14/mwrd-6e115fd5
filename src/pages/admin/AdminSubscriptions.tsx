
import React from 'react';
import { SubscriptionManagement } from '@/components/admin/SubscriptionManagement';
import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

const AdminSubscriptions: React.FC = () => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  
  return (
    <div data-admin-dashboard>
      <AdminPageContainer
        title={t('admin.subscriptions')}
        description={t('admin.subscriptionsDescription')}
      >
        <SubscriptionManagement />
      </AdminPageContainer>
    </div>
  );
};

export default AdminSubscriptions;

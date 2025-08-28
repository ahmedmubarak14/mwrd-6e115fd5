
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
    <AdminPageContainer
      title={t('admin.subscriptions')}
      description={t('admin.subscriptionsDescription')}
    >
      <div data-admin-dashboard>
        <SubscriptionManagement />
      </div>
    </AdminPageContainer>
  );
};

export default AdminSubscriptions;

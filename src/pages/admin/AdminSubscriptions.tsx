
import React from 'react';
import { SubscriptionManagement } from '@/components/admin/SubscriptionManagement';
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const AdminSubscriptions: React.FC = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn(isRTL ? "text-right" : "text-left")}>
        <h1 className="text-2xl font-bold">{t('admin.subscriptions')}</h1>
        <p className="text-muted-foreground">{t('admin.subscriptionsDescription')}</p>
      </div>
      <SubscriptionManagement />
    </div>
  );
};

export default AdminSubscriptions;

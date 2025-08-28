
import React from 'react';
import { VerificationQueue } from '@/components/admin/VerificationQueue';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { cn } from '@/lib/utils';

const AdminVerificationQueue: React.FC = () => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'} data-admin-dashboard>
      <div className={cn(isRTL ? "text-right" : "text-left")}>
        <h1 className="text-3xl font-bold">{t('verification.queue')}</h1>
        <p className="text-muted-foreground">
          {t('verification.reviewAndApprove')}
        </p>
      </div>
      <VerificationQueue />
    </div>
  );
};

export default AdminVerificationQueue;

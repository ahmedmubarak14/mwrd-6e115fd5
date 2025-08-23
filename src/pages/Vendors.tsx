
import React from 'react';
import { VendorDirectory } from '@/components/vendors/VendorDirectory';
import { useLanguage } from '@/contexts/LanguageContext';

const Vendors: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <VendorDirectory />
    </div>
  );
};

export default Vendors;

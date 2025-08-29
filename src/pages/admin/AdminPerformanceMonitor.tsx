import { PerformanceMonitor } from '@/components/admin/PerformanceMonitor';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

export default function AdminPerformanceMonitor() {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          {t('admin.performanceMonitor')}
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          {t('admin.performanceMonitorDescription')}
        </p>
      </div>
      <PerformanceMonitor />
    </div>
  );
}
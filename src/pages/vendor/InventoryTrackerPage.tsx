import { BasicInventoryTracker } from '@/components/vendor/BasicInventoryTracker';
import { useLanguage } from '@/contexts/LanguageContext';

export const InventoryTrackerPage = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {isRTL ? 'إدارة المخزون' : 'Inventory Management'}
        </h1>
        <p className="text-muted-foreground">
          {isRTL
            ? 'تتبع وإدارة مخزون منتجاتك بسهولة'
            : 'Track and manage your product inventory easily'}
        </p>
      </div>

      <BasicInventoryTracker />
    </div>
  );
};

export default InventoryTrackerPage;

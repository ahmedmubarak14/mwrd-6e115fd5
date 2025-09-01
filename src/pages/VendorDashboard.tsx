import { EnhancedVendorLayout } from "@/components/vendor/EnhancedVendorLayout";
import { ProductionVendorDashboard } from "@/components/vendor/ProductionVendorDashboard";

export const VendorDashboard = () => {
  return (
    <EnhancedVendorLayout>
      <ProductionVendorDashboard />
    </EnhancedVendorLayout>
  );
};
import { VendorLayout } from "@/components/vendor/VendorLayout";
import { ProductionVendorDashboard } from "@/components/vendor/ProductionVendorDashboard";
import { OptimizedVendorDashboard } from "@/components/vendor/OptimizedVendorDashboard";

export const VendorDashboard = () => {
  return (
    <VendorLayout>
      <OptimizedVendorDashboard />
    </VendorLayout>
  );
};
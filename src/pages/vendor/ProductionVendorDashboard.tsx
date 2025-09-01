import { OptimizedVendorLayout } from "@/components/vendor/OptimizedVendorLayout";
import { ProductionVendorDashboard } from "@/components/vendor/ProductionVendorDashboard";

export const VendorDashboard = () => {
  return (
    <OptimizedVendorLayout>
      <ProductionVendorDashboard />
    </OptimizedVendorLayout>
  );
};
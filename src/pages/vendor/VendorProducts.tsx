import { VendorLayout } from "@/components/vendor/VendorLayout";
import { OptimizedVendorProductCatalog } from "@/components/vendor/OptimizedVendorProductCatalog";

export const VendorProducts = () => {
  return (
    <VendorLayout backgroundClassName="bg-[#f7fafc]">
      <OptimizedVendorProductCatalog />
    </VendorLayout>
  );
};
import { VendorLayout } from "@/components/vendor/VendorLayout";
import { InvoiceList } from "@/components/finance/InvoiceList";

export const VendorInvoices = () => {
  return (
    <VendorLayout>
      <InvoiceList userRole="vendor" />
    </VendorLayout>
  );
};

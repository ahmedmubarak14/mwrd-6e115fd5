import { ClientLayout } from "@/components/layout/ClientLayout";
import { InvoiceList } from "@/components/finance/InvoiceList";

export const ClientInvoices = () => {
  return (
    <ClientLayout>
      <InvoiceList userRole="client" />
    </ClientLayout>
  );
};

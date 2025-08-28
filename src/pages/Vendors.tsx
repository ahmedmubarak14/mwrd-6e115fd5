
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { VendorDirectory } from "@/components/vendors/VendorDirectory";

const Vendors = () => {
  return (
    <ClientPageContainer
      title="Vendor Directory"
      description="Browse and connect with qualified vendors"
    >
      <VendorDirectory />
    </ClientPageContainer>
  );
};

export default Vendors;

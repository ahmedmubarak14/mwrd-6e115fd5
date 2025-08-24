
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EnhancedRequestForm } from "@/components/forms/EnhancedRequestForm";
import { VerificationGuard } from "@/components/verification/VerificationGuard";

const CreateRequest = () => {
  return (
    <DashboardLayout>
      <VerificationGuard requireVerification={true}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Create New Request</h1>
            <p className="text-muted-foreground">
              Create a new service request to connect with qualified suppliers
            </p>
          </div>
          <EnhancedRequestForm onSubmit={() => {}} />
        </div>
      </VerificationGuard>
    </DashboardLayout>
  );
};

export default CreateRequest;

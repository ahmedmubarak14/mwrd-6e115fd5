
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EnhancedRequestForm } from "@/components/forms/EnhancedRequestForm";
import { VerificationGuard } from "@/components/verification/VerificationGuard";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      // Here you would normally submit the data to your backend
      console.log('Creating request with data:', data);
      
      toast({
        title: "Success",
        description: "Request created successfully!",
      });
      
      // Navigate back to requests page
      navigate('/requests');
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "Error",
        description: "Failed to create request. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <EnhancedRequestForm onSubmit={handleSubmit} />
        </div>
      </VerificationGuard>
    </DashboardLayout>
  );
};

export default CreateRequest;

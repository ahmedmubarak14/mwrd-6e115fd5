
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EnhancedRequestForm } from "@/components/forms/EnhancedRequestForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRequests } from "@/hooks/useRequests";
import { useToast } from "@/hooks/use-toast";

const CreateRequest = () => {
  const navigate = useNavigate();
  const { createRequest } = useRequests();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await createRequest(data);
      toast({
        title: "Success",
        description: "Request created successfully",
      });
      navigate('/requests');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create request",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/requests')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </Button>
        </div>
        
        <div className="flex justify-center">
          <EnhancedRequestForm
            onSubmit={handleSubmit}
            submitButtonText="Create Service Request"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateRequest;


import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProcurementRequestForm } from "@/components/procurement/ProcurementRequestForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateProcurementRequest = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="container mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/procurement-requests')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Procurement Requests
          </Button>
        </div>
        
        <div className="flex justify-center">
          <ProcurementRequestForm />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateProcurementRequest;

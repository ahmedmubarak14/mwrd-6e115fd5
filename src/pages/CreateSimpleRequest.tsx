import { SimpleRequestForm } from "@/components/forms/SimpleRequestForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateSimpleRequest() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/client/requests")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Requests
        </Button>
        <div className="h-6 w-px bg-border" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 leading-tight">
            Create New Request
          </h1>
          <p className="text-foreground opacity-75 text-sm sm:text-base">
            Submit a new procurement request to find qualified vendors
          </p>
        </div>
      </div>

      <SimpleRequestForm />
    </div>
  );
}
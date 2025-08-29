import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { CreateRFQForm } from "@/components/rfq/CreateRFQForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";

export default function CreateRFQ() {
  const navigate = useNavigate();
  const languageContext = useOptionalLanguage();
  const language = languageContext?.language || 'en';

  return (
    <ClientPageContainer>
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/requests")}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === 'ar' ? 'العودة إلى الطلبات' : 'Back to Requests'}
        </Button>
      </div>
      
      <CreateRFQForm />
    </ClientPageContainer>
  );
}
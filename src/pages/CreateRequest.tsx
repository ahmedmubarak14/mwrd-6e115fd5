import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { ProcurementRequestForm } from "@/components/procurement/ProcurementRequestForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CreateRequest() {
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();

  return (
    <ClientPageContainer className="max-w-none">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-start md:space-y-0 mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/requests")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {isRTL ? 'العودة إلى الطلبات' : 'Back to Requests'}
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 leading-tight">
              {isRTL ? 'إنشاء طلبات توريد جديدة' : 'Create New Procurement Requests'}
            </h1>
            <p className="text-foreground opacity-75 text-sm sm:text-base">
              {isRTL ? 'أرسل طلبات توريد جديدة للعثور على الموردين في صفحة الموردين' : 'Submit new procurement requests to find vendors on the vendor page'}
            </p>
          </div>
        </div>
      </div>

      {/* Procurement Request Form */}
      <div className="flex justify-center">
        <ProcurementRequestForm />
      </div>
    </ClientPageContainer>
  );
}
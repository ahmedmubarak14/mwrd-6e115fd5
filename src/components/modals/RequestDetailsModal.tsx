import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, MapPin, DollarSign, Clock, Eye } from "lucide-react";
import { useOffers } from "@/hooks/useOffers";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useState } from "react";
import { RequestOffersModal } from "./RequestOffersModal";
import { CreateOfferModal } from "./CreateOfferModal";

interface RequestDetailsModalProps {
  children: React.ReactNode;
  request: {
    id: string;
    title: string;
    description: string;
    category: string;
    budget_min?: number;
    budget_max?: number;
    currency: string;
    location?: string;
    deadline?: string;
    urgency: string;
    status: string;
    created_at: string;
    user_id: string;
  };
  userRole?: 'client' | 'vendor' | 'admin';
}

export const RequestDetailsModal = ({ children, request, userRole = 'client' }: RequestDetailsModalProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [open, setOpen] = useState(false);

  const formatBudget = () => {
    if (!request.budget_min && !request.budget_max) return 'Budget not specified';
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()} ${request.currency}`;
    }
    if (request.budget_min) return `From ${request.budget_min.toLocaleString()} ${request.currency}`;
    if (request.budget_max) return `Up to ${request.budget_max.toLocaleString()} ${request.currency}`;
    return 'Budget not specified';
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      open: { label: isRTL ? "مفتوح" : "Open", variant: "default" as const },
      pending: { label: isRTL ? "في الانتظار" : "Pending", variant: "secondary" as const },
      in_progress: { label: isRTL ? "قيد التنفيذ" : "In Progress", variant: "secondary" as const },
      completed: { label: isRTL ? "مكتمل" : "Completed", variant: "outline" as const },
      cancelled: { label: isRTL ? "ملغي" : "Cancelled", variant: "destructive" as const }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.open;
  };

  const statusInfo = getStatusBadge(request.status);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right" : "text-left"}>
            {request.title}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : "text-left"}>
            {userRole === 'vendor' 
              ? (isRTL ? "تفاصيل طلب العميل" : "Client Request Details")
              : userRole === 'admin'
              ? (isRTL ? "عرض إداري للطلب" : "Administrative Request View")
              : (isRTL ? "تفاصيل الطلب" : "Request Details")
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-medium">{isRTL ? "الحالة:" : "Status:"}</span>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>

          {/* Description */}
          <div>
            <h4 className={`font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? "الوصف" : "Description"}
            </h4>
            <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {request.description}
            </p>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{isRTL ? "الموعد النهائي:" : "Deadline:"}</strong> {request.deadline ? new Date(request.deadline).toLocaleDateString() : 'Not specified'}
              </span>
            </div>

            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{isRTL ? "الموقع:" : "Location:"}</strong> {request.location || 'Not specified'}
              </span>
            </div>

            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{isRTL ? "الميزانية:" : "Budget:"}</strong> {formatBudget()}
              </span>
            </div>

            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{isRTL ? "الأولوية:" : "Urgency:"}</strong> {request.urgency}
              </span>
            </div>
          </div>

          {/* Category */}
          <div>
            <h4 className={`font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? "الفئة" : "Category"}
            </h4>
            <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {request.category}
            </p>
          </div>

          {/* Creation Date */}
          <div>
            <h4 className={`font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? "تاريخ الإنشاء" : "Created On"}
            </h4>
            <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} gap-2 pt-4`}>
          {userRole === 'vendor' ? (
            <CreateOfferModal requestId={request.id}>
              <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
                {isRTL ? "إرسال عرض" : "Submit Offer"}
              </Button>
            </CreateOfferModal>
          ) : userRole === 'client' ? (
            <RequestOffersModal requestId={request.id}>
              <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
                <Eye className="h-4 w-4 mr-2" />
                {isRTL ? "عرض العروض" : "View Offers"}
              </Button>
            </RequestOffersModal>
          ) : (
            <Button variant="outline" className="flex-1">
              {isRTL ? "إجراءات إدارية" : "Admin Actions"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
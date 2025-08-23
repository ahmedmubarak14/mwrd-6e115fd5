import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, MapPin, DollarSign, Clock, User, Star } from "lucide-react";

interface ViewDetailsModalProps {
  children: React.ReactNode;
  request?: {
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
  // Legacy fallback for non-request items
  item?: {
    id: number;
    title: string;
    description?: string;
    value: string;
    status: string;
    currency?: boolean;
  };
  userRole?: 'client' | 'vendor' | 'admin';
}

export const ViewDetailsModal = ({ children, request, item, userRole = 'client' }: ViewDetailsModalProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // If neither request nor item data is provided
  if (!request && !item) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Data Available</DialogTitle>
            <DialogDescription>Information is not available.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // Legacy fallback for non-request items
  if (!request && item) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{item.title}</DialogTitle>
            <DialogDescription>Item Details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge variant="secondary">{item.status}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Value:</span>
              <span>{item.value}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formatBudget = () => {
    if (!request.budget_min && !request.budget_max) return 'Budget not specified';
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()} ${request.currency}`;
    }
    if (request.budget_min) return `From ${request.budget_min.toLocaleString()} ${request.currency}`;
    if (request.budget_max) return `Up to ${request.budget_max.toLocaleString()} ${request.currency}`;
    return 'Budget not specified';
  };

  // Use real request data
  const getRequestDetails = () => {
    return {
      title: request.title,
      description: request.description,
      category: request.category,
      location: request.location || 'Not specified',
      deadline: request.deadline ? new Date(request.deadline).toLocaleDateString() : 'Not specified',
      budget: formatBudget(),
      urgency: request.urgency,
      status: request.status,
      createdDate: new Date(request.created_at).toLocaleDateString()
    };
  };

  const details = getRequestDetails();

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: isRTL ? "في الانتظار" : "Pending", variant: "secondary" as const },
      active: { label: isRTL ? "نشط" : "Active", variant: "default" as const },
      accepted: { label: isRTL ? "مقبول" : "Accepted", variant: "default" as const },
      completed: { label: isRTL ? "مكتمل" : "Completed", variant: "outline" as const },
      in_progress: { label: isRTL ? "قيد التنفيذ" : "In Progress", variant: "secondary" as const }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const statusInfo = getStatusBadge(request.status);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right" : "text-left"}>
            {request.title}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : "text-left"}>
            {userRole === 'vendor' 
              ? (isRTL ? "تفاصيل طلب العميل" : "Client Request Details")
              : userRole === 'admin'
              ? (isRTL ? "عرض إداري للطلب" : "Administrative Request View")
              : (isRTL ? "تفاصيل الطلب والعروض" : "Request Details and Offers")
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
              {details.description}
            </p>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{isRTL ? "الموعد النهائي:" : "Deadline:"}</strong> {details.deadline}
              </span>
            </div>

            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{isRTL ? "الموقع:" : "Location:"}</strong> {details.location}
              </span>
            </div>

            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{isRTL ? "الميزانية:" : "Budget:"}</strong> {details.budget}
              </span>
            </div>

            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{isRTL ? "الأولوية:" : "Urgency:"}</strong> {details.urgency}
              </span>
            </div>
          </div>

          {/* Category Information */}
          <div>
            <h4 className={`font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? "الفئة" : "Category"}
            </h4>
            <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {details.category}
            </p>
          </div>

          {/* Creation Date */}
          <div>
            <h4 className={`font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? "تاريخ الإنشاء" : "Created On"}
            </h4>
            <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {details.createdDate}
            </p>
          </div>
        </div>

        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} gap-2 pt-4`}>
          {userRole === 'vendor' ? (
            <>
              <Button variant="outline" className="flex-1">
                {isRTL ? "حفظ" : "Save"}
              </Button>
              <Button className="flex-1">
                {isRTL ? "إرسال عرض" : "Submit Offer"}
              </Button>
            </>
          ) : userRole === 'admin' ? (
            <>
              <Button variant="outline" className="flex-1">
                {isRTL ? "تعديل" : "Edit"}
              </Button>
              <Button className="flex-1">
                {isRTL ? "إجراءات إدارية" : "Admin Actions"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex-1">
                {isRTL ? "تعديل الطلب" : "Edit Request"}
              </Button>
              <Button className="flex-1">
                {isRTL ? "مقارنة العروض" : "Compare Offers"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
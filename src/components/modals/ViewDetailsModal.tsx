import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, MapPin, DollarSign, Clock, User, Star } from "lucide-react";

interface ViewDetailsModalProps {
  children: React.ReactNode;
  item: {
    id: number;
    title: string;
    description?: string;
    value: string;
    status: string;
    currency?: boolean;
  };
  userRole?: 'client' | 'supplier';
}

export const ViewDetailsModal = ({ children, item, userRole = 'client' }: ViewDetailsModalProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // Generate dummy detailed data based on the item
  const generateDetailedData = () => {
    if (userRole === 'supplier') {
      return {
        client: item.description || "Happy Events Co.",
        description: "Complete audio and lighting setup for corporate conference with 200+ attendees. Includes microphones, speakers, projectors, and stage lighting.",
        requirements: [
          "Professional sound system",
          "Stage lighting (LED)",
          "Projection equipment",
          "Wireless microphones",
          "Audio mixing console"
        ],
        location: "Riyadh International Convention Center",
        eventDate: "March 25, 2024",
        budget: item.value,
        clientRating: "4.8",
        responseDeadline: "March 10, 2024"
      };
    } else {
      return {
        description: "Professional audio and visual equipment rental for corporate conference",
        offers: [
          { supplier: "TechAudio Pro", price: "12,500", rating: "4.9", delivery: "2 days" },
          { supplier: "Event Solutions", price: "11,800", rating: "4.7", delivery: "3 days" },
          { supplier: "AudioMax", price: "13,200", rating: "4.8", delivery: "1 day" }
        ],
        location: "Riyadh International Convention Center",
        eventDate: "March 25, 2024",
        category: "Audio, Visual & Lighting",
        urgency: "Medium",
        createdDate: "March 5, 2024"
      };
    }
  };

  const details = generateDetailedData();

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

  const statusInfo = getStatusBadge(item.status);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right" : "text-left"}>
            {item.title}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : "text-left"}>
            {userRole === 'supplier' 
              ? (isRTL ? "تفاصيل طلب العميل" : "Client Request Details")
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
            {'eventDate' in details && (
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{isRTL ? "تاريخ الفعالية:" : "Event Date:"}</strong> {details.eventDate}
                </span>
              </div>
            )}

            {'location' in details && (
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{isRTL ? "الموقع:" : "Location:"}</strong> {details.location}
                </span>
              </div>
            )}

            {userRole === 'supplier' && 'budget' in details && (
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{isRTL ? "الميزانية:" : "Budget:"}</strong> {details.budget} SAR
                </span>
              </div>
            )}

            {userRole === 'supplier' && 'responseDeadline' in details && (
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{isRTL ? "موعد الرد:" : "Response Deadline:"}</strong> {details.responseDeadline}
                </span>
              </div>
            )}
          </div>

          {/* Requirements for Suppliers */}
          {userRole === 'supplier' && 'requirements' in details && (
            <div>
              <h4 className={`font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? "المتطلبات" : "Requirements"}
              </h4>
              <ul className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {details.requirements.map((req, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Offers for Clients */}
          {userRole === 'client' && 'offers' in details && (
            <div>
              <h4 className={`font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? "العروض المتاحة" : "Available Offers"}
              </h4>
              <div className="space-y-3">
                {details.offers.map((offer, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h5 className="font-medium">{offer.supplier}</h5>
                        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{offer.rating}</span>
                        </div>
                      </div>
                      <div className={`text-lg font-bold text-primary ${isRTL ? 'text-left' : 'text-right'}`}>
                        {offer.price} SAR
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="h-3 w-3" />
                      <span>{isRTL ? "التسليم:" : "Delivery:"} {offer.delivery}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Client Rating for Suppliers */}
          {userRole === 'supplier' && 'clientRating' in details && (
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>{isRTL ? "تقييم العميل:" : "Client Rating:"}</strong>
              </span>
              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{details.clientRating}</span>
              </div>
            </div>
          )}
        </div>

        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} gap-2 pt-4`}>
          {userRole === 'supplier' ? (
            <>
              <Button variant="outline" className="flex-1">
                {isRTL ? "حفظ" : "Save"}
              </Button>
              <Button className="flex-1">
                {isRTL ? "إرسال عرض" : "Submit Offer"}
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
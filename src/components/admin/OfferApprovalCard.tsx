import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { CheckCircle, XCircle, Clock, DollarSign, Truck, User } from "lucide-react";
import { format } from "date-fns";

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time_days: number;
  client_approval_status: 'pending' | 'approved' | 'rejected';
  client_approval_notes?: string;
  client_approval_date?: string;
  created_at: string;
  supplier_id: string;
  request_id: string;
  request?: {
    title: string;
    user_id: string;
  };
}

interface OfferApprovalCardProps {
  offer: Offer;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
  userRole?: 'client' | 'supplier' | 'admin';
}

export const OfferApprovalCard = ({ offer, onApprove, onReject, userRole }: OfferApprovalCardProps) => {
  const { language } = useLanguage();
  const [notes, setNotes] = useState(offer.client_approval_notes || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const isRTL = language === 'ar';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      en: { approved: 'Approved', rejected: 'Rejected', pending: 'Pending' },
      ar: { approved: 'موافق عليه', rejected: 'مرفوض', pending: 'قيد المراجعة' }
    };
    return statusLabels[language as keyof typeof statusLabels]?.[status as keyof typeof statusLabels.en] || status;
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(offer.id, notes);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(offer.id, notes);
    setIsProcessing(false);
  };

  const canModifyOffer = userRole === 'client' || userRole === 'admin';

  return (
    <Card className="w-full">
      <CardHeader>
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <CardTitle className="text-lg mb-2">{offer.title}</CardTitle>
            <CardDescription className="text-sm">
              {offer.description}
            </CardDescription>
            {offer.request && (
              <div className="mt-2 text-xs text-muted-foreground">
                {isRTL ? 'للطلب:' : 'For request:'} {offer.request.title}
              </div>
            )}
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant={getStatusColor(offer.client_approval_status)}>
              {getStatusLabel(offer.client_approval_status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Offer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {offer.price.toLocaleString()} {offer.currency}
            </span>
          </div>
          
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {offer.delivery_time_days} {isRTL ? 'أيام' : 'days'}
            </span>
          </div>
        </div>

        {/* Created Date */}
        <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Clock className="h-3 w-3" />
          <span>
            {isRTL ? 'تم الإنشاء:' : 'Created:'} {format(new Date(offer.created_at), 'MMM dd, yyyy HH:mm')}
          </span>
        </div>

        {/* Approval Notes */}
        {canModifyOffer && (
          <div className="space-y-2">
            <Label htmlFor={`notes-${offer.id}`} className={isRTL ? 'text-right' : ''}>
              {isRTL ? 'ملاحظات الموافقة' : 'Approval Notes'}
            </Label>
            <Textarea
              id={`notes-${offer.id}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isRTL ? 'أضف ملاحظات حول قرار الموافقة...' : 'Add notes about the approval decision...'}
              className={`min-h-20 ${isRTL ? 'text-right' : ''}`}
              disabled={offer.client_approval_status !== 'pending'}
            />
          </div>
        )}

        {/* Action Buttons */}
        {canModifyOffer && offer.client_approval_status === 'pending' && (
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex-1"
              variant="default"
            >
              <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'قبول العرض' : 'Accept Offer'}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1"
              variant="destructive"
            >
              <XCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'رفض العرض' : 'Reject Offer'}
            </Button>
          </div>
        )}

        {/* Show approval details if already processed */}
        {offer.client_approval_status !== 'pending' && offer.client_approval_date && (
          <div className={`p-3 rounded-lg bg-muted/50 ${isRTL ? 'text-right' : ''}`}>
            <div className="text-sm font-medium mb-1">
              {isRTL ? 'تمت المعالجة في:' : 'Processed on:'} {format(new Date(offer.client_approval_date), 'MMM dd, yyyy HH:mm')}
            </div>
            {offer.client_approval_notes && (
              <div className="text-xs text-muted-foreground">
                {isRTL ? 'الملاحظات:' : 'Notes:'} {offer.client_approval_notes}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
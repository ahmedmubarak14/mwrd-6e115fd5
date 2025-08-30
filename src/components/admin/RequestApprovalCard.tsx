import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useState } from "react";
import { CheckCircle, XCircle, Clock, User, MapPin, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  currency: string;
  location?: string;
  deadline?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  admin_approval_status: 'pending' | 'approved' | 'rejected';
  admin_approval_notes?: string;
  admin_approval_date?: string;
  created_at: string;
  user_id: string;
}

interface RequestApprovalCardProps {
  request: Request;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
}

export const RequestApprovalCard = ({ request, onApprove, onReject }: RequestApprovalCardProps) => {
  const languageContext = useOptionalLanguage();
  const { language } = languageContext || { 
    language: 'en' as const
  };
  const [notes, setNotes] = useState(request.admin_approval_notes || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const isRTL = language === 'ar';

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    const urgencyLabels = {
      en: { urgent: 'Urgent', high: 'High', medium: 'Medium', low: 'Low' },
      ar: { urgent: 'عاجل', high: 'عالي', medium: 'متوسط', low: 'منخفض' }
    };
    return urgencyLabels[language as keyof typeof urgencyLabels]?.[urgency as keyof typeof urgencyLabels.en] || urgency;
  };

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
    await onApprove(request.id, notes);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(request.id, notes);
    setIsProcessing(false);
  };

  const formatBudget = () => {
    const notSpecified = languageContext?.t('common.notSpecified') || 'Not specified';
    if (!request.budget_min && !request.budget_max) return notSpecified;
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()} ${request.currency}`;
    }
    if (request.budget_min) return `${languageContext?.t('common.from') || 'From'} ${request.budget_min.toLocaleString()} ${request.currency}`;
    if (request.budget_max) return `${languageContext?.t('common.upTo') || 'Up to'} ${request.budget_max.toLocaleString()} ${request.currency}`;
    return notSpecified;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
            <CardDescription className="text-sm">
              {request.description}
            </CardDescription>
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant={getUrgencyColor(request.urgency)}>
              {getUrgencyLabel(request.urgency)}
            </Badge>
            <Badge variant={getStatusColor(request.admin_approval_status)}>
              {getStatusLabel(request.admin_approval_status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Request Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{isRTL ? 'الفئة:' : 'Category:'} {request.category}</span>
          </div>
          
          {request.location && (
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{isRTL ? 'الموقع:' : 'Location:'} {request.location}</span>
            </div>
          )}
          
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{isRTL ? 'الميزانية:' : 'Budget:'} {formatBudget()}</span>
          </div>
          
          {request.deadline && (
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {isRTL ? 'الموعد النهائي:' : 'Deadline:'} {format(new Date(request.deadline), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
        </div>

        {/* Created Date */}
        <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Clock className="h-3 w-3" />
          <span>
            {isRTL ? 'تم الإنشاء:' : 'Created:'} {format(new Date(request.created_at), 'MMM dd, yyyy HH:mm')}
          </span>
        </div>

        {/* Approval Notes */}
        <div className="space-y-2">
          <Label htmlFor={`notes-${request.id}`} className={isRTL ? 'text-right' : ''}>
            {languageContext?.t('admin.approvals.approvalNotes') || 'Approval Notes'}
          </Label>
          <Textarea
            id={`notes-${request.id}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={isRTL ? 'أضف ملاحظات حول قرار الموافقة...' : 'Add notes about the approval decision...'}
            className={`min-h-20 ${isRTL ? 'text-right' : ''}`}
            disabled={request.admin_approval_status !== 'pending'}
          />
        </div>

        {/* Action Buttons */}
        {request.admin_approval_status === 'pending' && (
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex-1"
              variant="default"
            >
              <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'موافقة' : 'Approve'}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1"
              variant="destructive"
            >
              <XCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'رفض' : 'Reject'}
            </Button>
          </div>
        )}

        {/* Show approval details if already processed */}
        {request.admin_approval_status !== 'pending' && request.admin_approval_date && (
          <div className={`p-3 rounded-lg bg-muted/50 ${isRTL ? 'text-right' : ''}`}>
            <div className="text-sm font-medium mb-1">
              {isRTL ? 'تمت المعالجة في:' : 'Processed on:'} {format(new Date(request.admin_approval_date), 'MMM dd, yyyy HH:mm')}
            </div>
            {request.admin_approval_notes && (
              <div className="text-xs text-muted-foreground">
                {isRTL ? 'الملاحظات:' : 'Notes:'} {request.admin_approval_notes}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, Clock, Package, Users, FileText } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreateBidModal } from "@/components/modals/CreateBidModal";

interface RFQ {
  id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  currency: string;
  delivery_location?: string;
  submission_deadline: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_public: boolean;
  requirements?: any;
  created_at: string;
  client_id: string;
  product_id?: string;
}

interface RFQCardProps {
  rfq: RFQ;
  showBidButton?: boolean;
  showActions?: boolean;
  onEdit?: () => void;
  onView?: () => void;
}

export const RFQCard: React.FC<RFQCardProps> = ({ rfq, showBidButton = true }) => {
  const { language, isRTL } = useLanguage();
  const isArabic = language === 'ar';

  const formatPrice = (price: number) => {
    return isRTL ? `${price.toLocaleString()} ${rfq.currency}` : `${rfq.currency} ${price.toLocaleString()}`;
  };

  const getDaysUntilDeadline = () => {
    const deadline = new Date(rfq.submission_deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline();
  const isExpired = daysLeft < 0;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{rfq.title}</CardTitle>
          <Badge variant={isExpired ? 'destructive' : 'default'}>
            {isExpired ? (isArabic ? 'منتهي' : 'Expired') : (isArabic ? `${daysLeft} أيام` : `${daysLeft} days`)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-3">{rfq.description}</p>

        {(rfq.budget_min || rfq.budget_max) && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{isArabic ? 'الميزانية:' : 'Budget:'}</span>
            <span>{rfq.budget_min && rfq.budget_max ? `${formatPrice(rfq.budget_min)} - ${formatPrice(rfq.budget_max)}` : formatPrice(rfq.budget_max || rfq.budget_min || 0)}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{isArabic ? 'الموعد النهائي:' : 'Deadline:'}</span>
          <span>{format(new Date(rfq.submission_deadline), 'MMM dd, yyyy')}</span>
        </div>

        {showBidButton && !isExpired && (
          <CreateBidModal rfq={rfq}>
            <Button className="w-full" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              {isArabic ? 'إرسال عرض' : 'Submit Bid'}
            </Button>
          </CreateBidModal>
        )}
      </CardContent>
    </Card>
  );
};
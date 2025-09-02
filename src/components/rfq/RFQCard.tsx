import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  FileText,
  Eye,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { RFQ } from '@/hooks/useRFQs';

interface RFQCardProps {
  rfq: RFQ;
  onView?: (rfq: RFQ) => void;
  onEdit?: (rfq: RFQ) => void;
  onDelete?: (rfq: RFQ) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const RFQCard = ({ 
  rfq, 
  onView, 
  onEdit, 
  onDelete, 
  showActions = true, 
  compact = false 
}: RFQCardProps) => {
  const { language } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'published': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'evaluation': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'awarded': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'urgent': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'draft': language === 'ar' ? 'مسودة' : 'Draft',
      'published': language === 'ar' ? 'منشور' : 'Published', 
      'in_progress': language === 'ar' ? 'قيد التنفيذ' : 'In Progress',
      'evaluation': language === 'ar' ? 'تحت التقييم' : 'Evaluation',
      'awarded': language === 'ar' ? 'تم الترسية' : 'Awarded',
      'cancelled': language === 'ar' ? 'ملغي' : 'Cancelled',
      'completed': language === 'ar' ? 'مكتمل' : 'Completed'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap = {
      'low': language === 'ar' ? 'منخفضة' : 'Low',
      'medium': language === 'ar' ? 'متوسطة' : 'Medium',
      'high': language === 'ar' ? 'عالية' : 'High',
      'urgent': language === 'ar' ? 'عاجل' : 'Urgent'
    };
    return priorityMap[priority as keyof typeof priorityMap] || priority;
  };

  const formatBudget = () => {
    if (!rfq.budget_min && !rfq.budget_max) {
      return language === 'ar' ? 'قابل للتفاوض' : 'Negotiable';
    }
    if (rfq.budget_min && rfq.budget_max) {
      return `${rfq.budget_min.toLocaleString()} - ${rfq.budget_max.toLocaleString()} ${rfq.currency}`;
    }
    if (rfq.budget_min) {
      return `${language === 'ar' ? 'من' : 'From'} ${rfq.budget_min.toLocaleString()} ${rfq.currency}`;
    }
    if (rfq.budget_max) {
      return `${language === 'ar' ? 'حتى' : 'Up to'} ${rfq.budget_max.toLocaleString()} ${rfq.currency}`;
    }
    return language === 'ar' ? 'قابل للتفاوض' : 'Negotiable';
  };

  const isDeadlineApproaching = () => {
    const deadline = new Date(rfq.submission_deadline);
    const now = new Date();
    const diffInDays = (deadline.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 3 && diffInDays > 0;
  };

  const isDeadlinePassed = () => {
    const deadline = new Date(rfq.submission_deadline);
    const now = new Date();
    return deadline < now;
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView?.(rfq)}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg truncate flex-1 mr-2">{rfq.title}</h3>
            <div className="flex gap-2">
              <Badge className={`text-xs px-2 py-1 ${getStatusColor(rfq.status)}`}>
                {getStatusText(rfq.status)}
              </Badge>
              <Badge className={`text-xs px-2 py-1 ${getPriorityColor(rfq.priority)}`}>
                {getPriorityText(rfq.priority)}
              </Badge>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {rfq.description}
          </p>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(rfq.submission_deadline), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>{formatBudget()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 flex items-center gap-2">
              {rfq.title}
              {!rfq.is_public && (
                <Badge variant="outline" className="text-xs">
                  {language === 'ar' ? 'خاص' : 'Private'}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {rfq.description}
            </CardDescription>
          </div>
          
          <div className="flex flex-col gap-2 ml-4">
            <Badge className={`text-xs px-2 py-1 ${getStatusColor(rfq.status)}`}>
              {getStatusText(rfq.status)}
            </Badge>
            <Badge className={`text-xs px-2 py-1 ${getPriorityColor(rfq.priority)}`}>
              {getPriorityText(rfq.priority)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="p-2 bg-background rounded-md">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {language === 'ar' ? 'الميزانية' : 'Budget'}
              </p>
              <p className="font-semibold text-sm">{formatBudget()}</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            isDeadlinePassed() ? 'bg-red-50 border border-red-200' : 
            isDeadlineApproaching() ? 'bg-amber-50 border border-amber-200' : 
            'bg-muted/50'
          }`}>
            <div className="p-2 bg-background rounded-md">
              {isDeadlinePassed() ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <Calendar className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {language === 'ar' ? 'الموعد النهائي' : 'Deadline'}
              </p>
              <p className={`font-semibold text-sm ${
                isDeadlinePassed() ? 'text-red-600' : 
                isDeadlineApproaching() ? 'text-amber-600' : ''
              }`}>
                {format(new Date(rfq.submission_deadline), 'PPP')}
                {isDeadlinePassed() && (
                  <span className="ml-1 text-xs">
                    ({language === 'ar' ? 'منتهي' : 'Expired'})
                  </span>
                )}
              </p>
            </div>
          </div>

          {rfq.delivery_location && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-background rounded-md">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {language === 'ar' ? 'موقع التسليم' : 'Delivery Location'}
                </p>
                <p className="font-semibold text-sm">{rfq.delivery_location}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="p-2 bg-background rounded-md">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {language === 'ar' ? 'تاريخ الإنشاء' : 'Created'}
              </p>
              <p className="font-semibold text-sm">
                {format(new Date(rfq.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Project Timeline */}
        {(rfq.project_start_date || rfq.project_end_date) && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {language === 'ar' ? 'الجدول الزمني للمشروع' : 'Project Timeline'}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {rfq.project_start_date && (
                <div>
                  <span className="text-muted-foreground">
                    {language === 'ar' ? 'البداية:' : 'Start:'}
                  </span>
                  <span className="ml-1 font-medium">
                    {format(new Date(rfq.project_start_date), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
              {rfq.project_end_date && (
                <div>
                  <span className="text-muted-foreground">
                    {language === 'ar' ? 'النهاية:' : 'End:'}
                  </span>
                  <span className="ml-1 font-medium">
                    {format(new Date(rfq.project_end_date), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView?.(rfq)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'عرض' : 'View'}
            </Button>
            
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(rfq)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'تعديل' : 'Edit'}
              </Button>
            )}
            
            {onDelete && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDelete(rfq)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'حذف' : 'Delete'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
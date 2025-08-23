
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProcurementRequestForm } from "@/components/procurement/ProcurementRequestForm";
import { useRequests } from "@/hooks/useRequests";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Clock, DollarSign, MapPin, AlertCircle } from "lucide-react";

const ProcurementRequests: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { requests, loading } = useRequests();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'disputed': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      new: isRTL ? 'جديد' : 'New',
      in_progress: isRTL ? 'قيد التنفيذ' : 'In Progress',
      completed: isRTL ? 'مكتمل' : 'Completed',
      disputed: isRTL ? 'متنازع عليه' : 'Disputed',
      cancelled: isRTL ? 'ملغي' : 'Cancelled'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'urgent': return 'bg-red-100 text-red-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels = {
      low: isRTL ? 'منخفض' : 'Low',
      medium: isRTL ? 'متوسط' : 'Medium',
      high: isRTL ? 'عالي' : 'High',
      urgent: isRTL ? 'عاجل' : 'Urgent'
    };
    return labels[urgency as keyof typeof labels] || urgency;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-4/5"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isRTL ? 'طلبات الشراء' : 'Procurement Requests'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 
              'إدارة طلبات الشراء والمناقصات الخاصة بك' :
              'Manage your procurement requests and tenders'
            }
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {isRTL ? 'طلب شراء جديد' : 'New Procurement Request'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <ProcurementRequestForm />
          </DialogContent>
        </Dialog>
      </div>

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 line-clamp-2">
                      {request.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {getUrgencyLabel(request.urgency)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {request.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {request.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  {/* Budget Range */}
                  {(request.budget_min || request.budget_max) && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {isRTL ? 'الميزانية:' : 'Budget:'}
                      </span>
                      <span className="font-medium">
                        {request.budget_min && request.budget_max ? 
                          `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()} SAR` :
                          request.budget_min ? 
                            `${request.budget_min.toLocaleString()}+ SAR` :
                            `${request.budget_max?.toLocaleString()} SAR`
                        }
                      </span>
                    </div>
                  )}
                  
                  {/* Location */}
                  {request.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {isRTL ? 'الموقع:' : 'Location:'}
                      </span>
                      <span className="font-medium">{request.location}</span>
                    </div>
                  )}
                  
                  {/* Deadline */}
                  {request.deadline && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {isRTL ? 'الموعد النهائي:' : 'Deadline:'}
                      </span>
                      <span className="font-medium">
                        {new Date(request.deadline).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                  )}
                  
                  {/* Category */}
                  {request.category && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {isRTL ? 'الفئة:' : 'Category:'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {request.category}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    {isRTL ? 'عرض التفاصيل' : 'View Details'}
                  </Button>
                  <Button size="sm" className="flex-1" disabled={request.status !== 'new'}>
                    {isRTL ? 'عرض العروض' : 'View Offers'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {isRTL ? 'لا توجد طلبات شراء بعد' : 'No procurement requests yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isRTL ? 
                'ابدأ بإنشاء طلب شراء جديد للحصول على عروض من الموردين المعتمدين' :
                'Start by creating a new procurement request to get offers from verified vendors'
              }
            </p>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {isRTL ? 'إنشاء طلب شراء' : 'Create Procurement Request'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                <ProcurementRequestForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProcurementRequests;

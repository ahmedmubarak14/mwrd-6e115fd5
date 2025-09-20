import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, Clock, Truck, Package, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface RFQ {
  id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  currency: string;
  delivery_location?: string;
  submission_deadline: string;
  requirements?: any;
  client_id: string;
  product_id?: string;
  created_at: string;
}

interface CreateBidModalProps {
  rfq: RFQ;
  children: React.ReactNode;
}

export const CreateBidModal: React.FC<CreateBidModalProps> = ({ rfq, children }) => {
  const { language, isRTL } = useLanguage();
  const isArabic = language === 'ar';
  const { user } = useAuth();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    totalPrice: '',
    deliveryTimelineDays: '7',
    proposal: '',
    paymentTerms: '',
    warrantyMonths: '',
    technicalSpecs: ''
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.totalPrice || !formData.deliveryTimelineDays || !formData.proposal) {
      toast({
        title: isArabic ? 'بيانات مفقودة' : 'Missing Information',
        description: isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (!user) {
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please log in first',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      // Get vendor profile
      const { data: vendorProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, role, status, verification_status')
        .eq('user_id', user.id)
        .single();

      if (profileError || !vendorProfile) {
        throw new Error('Vendor profile not found');
      }

      if (vendorProfile.role !== 'vendor' || vendorProfile.status !== 'approved') {
        throw new Error('Only approved vendors can submit bids');
      }

      // Create the bid
      const { error: bidError } = await supabase
        .from('bids')
        .insert([{
          rfq_id: rfq.id,
          vendor_id: vendorProfile.id,
          total_price: parseFloat(formData.totalPrice),
          delivery_timeline_days: parseInt(formData.deliveryTimelineDays),
          proposal: formData.proposal,
          payment_terms: formData.paymentTerms || undefined,
          warranty_period_months: formData.warrantyMonths ? parseInt(formData.warrantyMonths) : undefined,
          technical_specifications: formData.technicalSpecs ? { description: formData.technicalSpecs } : {},
          currency: rfq.currency,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        }]);

      if (bidError) {
        console.error('Error creating bid:', bidError);
        throw bidError;
      }

      toast({
        title: isArabic ? 'تم إرسال العرض' : 'Bid Submitted',
        description: isArabic 
          ? 'تم إرسال عرضك بنجاح وسيتم إشعار العميل'
          : 'Your bid has been submitted successfully and the client will be notified'
      });

      setOpen(false);
      // Reset form
      setFormData({
        totalPrice: '',
        deliveryTimelineDays: '7',
        proposal: '',
        paymentTerms: '',
        warrantyMonths: '',
        technicalSpecs: ''
      });
    } catch (error: any) {
      console.error('Error submitting bid:', error);
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: error.message || (isArabic 
          ? 'حدث خطأ أثناء إرسال العرض'
          : 'An error occurred while submitting the bid'),
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return isRTL ? `${price} ${rfq.currency}` : `${rfq.currency} ${price}`;
  };

  const getDaysUntilDeadline = () => {
    const deadline = new Date(rfq.submission_deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isArabic ? 'إرسال عرض' : 'Submit Bid'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RFQ Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {isArabic ? 'تفاصيل الطلب' : 'RFQ Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm">{rfq.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                    {rfq.description}
                  </p>
                </div>

                {(rfq.budget_min || rfq.budget_max) && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium">{isArabic ? 'الميزانية:' : 'Budget:'}</span>
                    <div className="text-xs text-muted-foreground">
                      {rfq.budget_min && rfq.budget_max ? 
                        `${formatPrice(rfq.budget_min)} - ${formatPrice(rfq.budget_max)}` :
                        rfq.budget_max ? 
                          `${isArabic ? 'حتى' : 'Up to'} ${formatPrice(rfq.budget_max)}` :
                          `${isArabic ? 'من' : 'From'} ${formatPrice(rfq.budget_min || 0)}`
                      }
                    </div>
                  </div>
                )}

                {rfq.delivery_location && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium">{isArabic ? 'موقع التسليم:' : 'Delivery Location:'}</span>
                    <div className="text-xs text-muted-foreground">{rfq.delivery_location}</div>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-xs font-medium">{isArabic ? 'الموعد النهائي:' : 'Deadline:'}</span>
                  <div className="text-xs">
                    <Badge variant={daysLeft < 3 ? 'destructive' : daysLeft < 7 ? 'secondary' : 'default'}>
                      {daysLeft > 0 ? 
                        (isArabic ? `${daysLeft} أيام متبقية` : `${daysLeft} days left`) :
                        (isArabic ? 'انتهت المهلة' : 'Deadline passed')
                      }
                    </Badge>
                  </div>
                </div>

                {rfq.requirements && typeof rfq.requirements === 'object' && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium">{isArabic ? 'المتطلبات:' : 'Requirements:'}</span>
                    <div className="text-xs text-muted-foreground">
                      {rfq.requirements.description || 
                       (rfq.requirements.productName && `Product: ${rfq.requirements.productName}`) ||
                       (isArabic ? 'لا توجد متطلبات إضافية' : 'No additional requirements')
                      }
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bid Form */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalPrice" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {isArabic ? 'السعر الإجمالي' : 'Total Price'}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalPrice}
                    onChange={(e) => updateFormData('totalPrice', e.target.value)}
                    placeholder={isArabic ? `السعر بالـ${rfq.currency}` : `Price in ${rfq.currency}`}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryTimelineDays" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {isArabic ? 'مدة التسليم (أيام)' : 'Delivery Timeline (days)'}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="deliveryTimelineDays"
                    type="number"
                    min="1"
                    value={formData.deliveryTimelineDays}
                    onChange={(e) => updateFormData('deliveryTimelineDays', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="proposal" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {isArabic ? 'تفاصيل العرض' : 'Proposal Details'}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="proposal"
                  value={formData.proposal}
                  onChange={(e) => updateFormData('proposal', e.target.value)}
                  placeholder={isArabic 
                    ? 'اشرح كيف ستقوم بتنفيذ هذا المشروع، ما تشمله خدماتك، والقيمة المضافة التي تقدمها'
                    : 'Explain how you will execute this project, what your services include, and the value you bring'}
                  className="mt-1 min-h-32"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="warrantyMonths" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    {isArabic ? 'فترة الضمان (شهر)' : 'Warranty Period (months)'}
                  </Label>
                  <Input
                    id="warrantyMonths"
                    type="number"
                    min="0"
                    value={formData.warrantyMonths}
                    onChange={(e) => updateFormData('warrantyMonths', e.target.value)}
                    placeholder={isArabic ? 'مثل: 12' : 'e.g., 12'}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="paymentTerms">
                    {isArabic ? 'شروط الدفع' : 'Payment Terms'}
                  </Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => updateFormData('paymentTerms', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={isArabic ? 'اختر شروط الدفع' : 'Select payment terms'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_advance">{isArabic ? 'دفع كامل مقدماً' : 'Full payment in advance'}</SelectItem>
                      <SelectItem value="50_50">{isArabic ? '50% مقدم و 50% عند التسليم' : '50% advance, 50% on delivery'}</SelectItem>
                      <SelectItem value="net_30">{isArabic ? 'الدفع خلال 30 يوم' : 'Net 30 days'}</SelectItem>
                      <SelectItem value="milestone">{isArabic ? 'دفع على مراحل' : 'Milestone-based payments'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="technicalSpecs">
                  {isArabic ? 'المواصفات الفنية' : 'Technical Specifications'}
                </Label>
                <Textarea
                  id="technicalSpecs"
                  value={formData.technicalSpecs}
                  onChange={(e) => updateFormData('technicalSpecs', e.target.value)}
                  placeholder={isArabic 
                    ? 'أضف أي مواصفات فنية، شروط خاصة، أو تفاصيل إضافية'
                    : 'Add any technical specifications, special conditions, or additional details'}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !formData.totalPrice || !formData.deliveryTimelineDays || !formData.proposal || daysLeft < 0}
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {isArabic ? 'جاري الإرسال...' : 'Submitting...'}
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                {isArabic ? 'إرسال العرض' : 'Submit Bid'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
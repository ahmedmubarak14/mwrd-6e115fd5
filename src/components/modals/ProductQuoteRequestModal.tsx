import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Info, Package } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { VendorProduct } from "@/hooks/useVendorProducts";
import { useRFQs, CreateRFQData } from "@/hooks/useRFQs";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProductQuoteRequestModalProps {
  product: VendorProduct;
  vendorName: string;
  children: React.ReactNode;
}

export const ProductQuoteRequestModal: React.FC<ProductQuoteRequestModalProps> = ({
  product,
  vendorName,
  children
}) => {
  const { language, isRTL } = useLanguage();
  const isArabic = language === 'ar';
  const { createRFQ } = useRFQs();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    quantity: product.min_order_quantity.toString(),
    deliveryLocation: '',
    deadline: undefined as Date | undefined,
    specialRequirements: '',
    projectDescription: ''
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.quantity || !formData.deadline) {
      toast({
        title: isArabic ? 'بيانات مفقودة' : 'Missing Information',
        description: isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const rfqData: CreateRFQData = {
        title: isArabic 
          ? `طلب عرض سعر لـ ${product.name}`
          : `Quote Request for ${product.name}`,
        description: formData.projectDescription || (isArabic
          ? `طلب عرض سعر لكمية ${formData.quantity} من ${product.name} من ${vendorName}`
          : `Requesting quote for ${formData.quantity} units of ${product.name} from ${vendorName}`),
        submission_deadline: formData.deadline!.toISOString(),
        delivery_location: formData.deliveryLocation,
        requirements: {
          productId: product.id,
          productName: product.name,
          quantity: parseInt(formData.quantity),
          unit: product.unit,
          vendorName: vendorName,
          specialRequirements: formData.specialRequirements,
          originalPrice: product.price,
          originalCurrency: product.currency
        },
        evaluation_criteria: {
          description: isArabic
            ? 'سيتم تقييم العروض بناءً على السعر، جودة المنتج، وسرعة التسليم'
            : 'Offers will be evaluated based on price, product quality, and delivery time'
        },
        currency: product.currency,
        priority: 'medium',
        is_public: false,
        invited_vendors: [product.vendor_id]
      };

      const result = await createRFQ(rfqData);
      if (result) {
        toast({
          title: isArabic ? 'تم إرسال الطلب' : 'Quote Request Sent',
          description: isArabic 
            ? 'تم إرسال طلب عرض السعر بنجاح إلى المورد'
            : 'Your quote request has been sent successfully to the vendor'
        });
        setOpen(false);
        // Reset form
        setFormData({
          quantity: product.min_order_quantity.toString(),
          deliveryLocation: '',
          deadline: undefined,
          specialRequirements: '',
          projectDescription: ''
        });
      }
    } catch (error) {
      console.error('Error creating quote request:', error);
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: isArabic 
          ? 'حدث خطأ أثناء إرسال الطلب'
          : 'An error occurred while sending the request',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return isRTL ? `${price} ${currency}` : `${currency} ${price}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isArabic ? 'طلب عرض سعر' : 'Request Quote'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">{product.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{isArabic ? 'السعر:' : 'Price:'}</span>
                <span className="ml-2 font-medium">{formatPrice(product.price, product.currency)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{isArabic ? 'الوحدة:' : 'Unit:'}</span>
                <span className="ml-2">{product.unit}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{isArabic ? 'الحد الأدنى:' : 'Min Order:'}</span>
                <span className="ml-2">{product.min_order_quantity} {product.unit}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{isArabic ? 'المورد:' : 'Vendor:'}</span>
                <span className="ml-2">{vendorName}</span>
              </div>
            </div>
          </div>

          {/* Quote Request Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity" className="flex items-center gap-2">
                  {isArabic ? 'الكمية المطلوبة' : 'Required Quantity'}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min={product.min_order_quantity}
                  value={formData.quantity}
                  onChange={(e) => updateFormData('quantity', e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {isArabic ? `الحد الأدنى: ${product.min_order_quantity}` : `Minimum: ${product.min_order_quantity}`}
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  {isArabic ? 'الموعد النهائي' : 'Required By'}
                  <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !formData.deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.deadline 
                        ? format(formData.deadline, "PPP") 
                        : (isArabic ? 'اختر التاريخ' : 'Select date')
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(date) => updateFormData('deadline', date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="deliveryLocation">
                {isArabic ? 'موقع التسليم' : 'Delivery Location'}
              </Label>
              <Input
                id="deliveryLocation"
                value={formData.deliveryLocation}
                onChange={(e) => updateFormData('deliveryLocation', e.target.value)}
                placeholder={isArabic ? 'أدخل موقع التسليم المطلوب' : 'Enter delivery location'}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="projectDescription">
                {isArabic ? 'وصف المشروع' : 'Project Description'}
              </Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => updateFormData('projectDescription', e.target.value)}
                placeholder={isArabic 
                  ? 'اشرح كيف ستستخدم هذا المنتج أو أي تفاصيل إضافية'
                  : 'Explain how you will use this product or any additional details'}
                className="mt-1 min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="specialRequirements">
                {isArabic ? 'متطلبات خاصة' : 'Special Requirements'}
              </Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => updateFormData('specialRequirements', e.target.value)}
                placeholder={isArabic 
                  ? 'أي متطلبات خاصة، تخصيصات، أو شروط إضافية'
                  : 'Any special requirements, customizations, or additional terms'}
                className="mt-1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !formData.quantity || !formData.deadline}
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {isArabic ? 'جاري الإرسال...' : 'Sending...'}
                </>
              ) : (
                <>
                  <Info className="h-4 w-4 mr-2" />
                  {isArabic ? 'إرسال الطلب' : 'Send Request'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
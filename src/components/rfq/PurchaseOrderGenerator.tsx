import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RFQ } from '@/hooks/useRFQs';
import { Bid } from '@/hooks/useBids';
import { 
  FileText, 
  Download, 
  Send, 
  Calendar,
  DollarSign,
  User,
  Building,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';
import { format, addDays } from 'date-fns';

interface PurchaseOrderGeneratorProps {
  rfq: RFQ;
  winningBid: Bid;
  onOrderCreated?: (orderId: string) => void;
}

interface PurchaseOrder {
  po_number: string;
  rfq_id: string;
  bid_id: string;
  client_id: string;
  vendor_id: string;
  total_amount: number;
  currency: string;
  delivery_date: string;
  payment_terms: string;
  shipping_address: string;
  special_instructions: string;
  status: 'draft' | 'sent' | 'acknowledged' | 'in_progress' | 'completed' | 'cancelled';
}

export const PurchaseOrderGenerator = ({ rfq, winningBid, onOrderCreated }: PurchaseOrderGeneratorProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [showGenerator, setShowGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    po_number: `PO-${Date.now()}`,
    delivery_date: format(addDays(new Date(), winningBid.delivery_timeline_days), 'yyyy-MM-dd'),
    payment_terms: winningBid.payment_terms || '30 days',
    shipping_address: rfq.delivery_location || '',
    special_instructions: ''
  });

  const generatePO = async () => {
    if (!user) return;

    try {
      setGenerating(true);

      // Create the purchase order record
      const poData = {
        po_number: formData.po_number,
        rfq_id: rfq.id,
        bid_id: winningBid.id,
        client_id: user.id,
        vendor_id: winningBid.vendor_id,
        total_amount: winningBid.total_price,
        currency: winningBid.currency,
        delivery_date: formData.delivery_date,
        payment_terms: formData.payment_terms,
        shipping_address: formData.shipping_address,
        special_instructions: formData.special_instructions,
        status: 'draft' as const,
        terms_and_conditions: rfq.terms_and_conditions,
        technical_specifications: winningBid.technical_specifications,
        warranty_period_months: winningBid.warranty_period_months,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Create purchase order table entry (we'll need to add this table)
      const { data: poResult, error: poError } = await supabase
        .from('purchase_orders')
        .insert([poData])
        .select()
        .single();

      if (poError) {
        console.error('PO creation error:', poError);
        // If the table doesn't exist, create an order instead
        const orderData = {
          id: crypto.randomUUID(),
          title: `PO: ${rfq.title}`,
          description: `Purchase order generated from RFQ: ${rfq.title}`,
          client_id: user.id,
          vendor_id: winningBid.vendor_id,
          request_id: rfq.id,
          amount: winningBid.total_price,
          currency: winningBid.currency,
          status: 'pending' as const,
          delivery_date: formData.delivery_date,
          notes: `PO Number: ${formData.po_number}\nPayment Terms: ${formData.payment_terms}\nSpecial Instructions: ${formData.special_instructions}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: orderResult, error: orderError } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single();

        if (orderError) throw orderError;

        toast({
          title: language === 'ar' ? 'تم إنشاء أمر الشراء' : 'Purchase Order Created',
          description: language === 'ar' ? 'تم إنشاء أمر الشراء بنجاح كأمر في النظام' : 'Purchase order has been successfully created as an order',
        });

        onOrderCreated?.(orderResult.id);
      } else {
        toast({
          title: language === 'ar' ? 'تم إنشاء أمر الشراء' : 'Purchase Order Created',
          description: language === 'ar' ? 'تم إنشاء أمر الشراء بنجاح' : 'Purchase order has been successfully created',
        });

        onOrderCreated?.(poResult.id);
      }

      setShowGenerator(false);
    } catch (error) {
      console.error('Error generating PO:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في إنشاء أمر الشراء' : 'Failed to create purchase order',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadPOTemplate = () => {
    // Generate a simple PO template text file
    const poContent = `
PURCHASE ORDER
${formData.po_number}

Date: ${format(new Date(), 'PPP')}
RFQ Reference: ${rfq.title}

VENDOR INFORMATION:
Vendor ID: ${winningBid.vendor_id}

CLIENT INFORMATION:
Client ID: ${user?.id}

ORDER DETAILS:
Description: ${rfq.description}
Total Amount: ${winningBid.total_price.toLocaleString()} ${winningBid.currency}
Delivery Timeline: ${winningBid.delivery_timeline_days} days
Expected Delivery: ${format(new Date(formData.delivery_date), 'PPP')}

PAYMENT TERMS: ${formData.payment_terms}

DELIVERY ADDRESS:
${formData.shipping_address}

SPECIAL INSTRUCTIONS:
${formData.special_instructions}

TECHNICAL SPECIFICATIONS:
${JSON.stringify(winningBid.technical_specifications, null, 2)}

WARRANTY: ${winningBid.warranty_period_months} months

TERMS AND CONDITIONS:
${rfq.terms_and_conditions}
    `;

    const blob = new Blob([poContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.po_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {language === 'ar' ? 'إنشاء أمر الشراء' : 'Purchase Order Generation'}
        </CardTitle>
        <CardDescription>
          {language === 'ar' ? 'قم بإنشاء أمر الشراء للعرض الفائز' : 'Generate a purchase order for the winning bid'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Winning Bid Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-800">
                {language === 'ar' ? 'العرض الفائز' : 'Winning Bid'}
              </h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}</p>
                <p className="font-semibold">{winningBid.total_price.toLocaleString()} {winningBid.currency}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{language === 'ar' ? 'مدة التسليم' : 'Delivery Time'}</p>
                <p className="font-semibold">{winningBid.delivery_timeline_days} {language === 'ar' ? 'يوم' : 'days'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{language === 'ar' ? 'شروط الدفع' : 'Payment Terms'}</p>
                <p className="font-semibold">{winningBid.payment_terms || 'Net 30'}</p>
              </div>
              {winningBid.warranty_period_months && (
                <div>
                  <p className="text-muted-foreground">{language === 'ar' ? 'الضمان' : 'Warranty'}</p>
                  <p className="font-semibold">{winningBid.warranty_period_months} {language === 'ar' ? 'شهر' : 'months'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Dialog open={showGenerator} onOpenChange={setShowGenerator}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <FileText className="h-4 w-4" />
                  {language === 'ar' ? 'إنشاء أمر الشراء' : 'Generate Purchase Order'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {language === 'ar' ? 'إنشاء أمر الشراء' : 'Generate Purchase Order'}
                  </DialogTitle>
                  <DialogDescription>
                    {language === 'ar' ? 'أكمل تفاصيل أمر الشراء' : 'Complete the purchase order details'}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="po_number">{language === 'ar' ? 'رقم أمر الشراء' : 'PO Number'}</Label>
                      <Input
                        id="po_number"
                        value={formData.po_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, po_number: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="delivery_date">{language === 'ar' ? 'تاريخ التسليم المتوقع' : 'Expected Delivery Date'}</Label>
                      <Input
                        id="delivery_date"
                        type="date"
                        value={formData.delivery_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, delivery_date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payment_terms">{language === 'ar' ? 'شروط الدفع' : 'Payment Terms'}</Label>
                    <Select 
                      value={formData.payment_terms}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, payment_terms: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">{language === 'ar' ? 'فوري' : 'Immediate'}</SelectItem>
                        <SelectItem value="15 days">{language === 'ar' ? '15 يوم' : 'Net 15'}</SelectItem>
                        <SelectItem value="30 days">{language === 'ar' ? '30 يوم' : 'Net 30'}</SelectItem>
                        <SelectItem value="45 days">{language === 'ar' ? '45 يوم' : 'Net 45'}</SelectItem>
                        <SelectItem value="60 days">{language === 'ar' ? '60 يوم' : 'Net 60'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="shipping_address">{language === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}</Label>
                    <Textarea
                      id="shipping_address"
                      value={formData.shipping_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, shipping_address: e.target.value }))}
                      placeholder={language === 'ar' ? 'أدخل عنوان الشحن الكامل' : 'Enter complete shipping address'}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="special_instructions">{language === 'ar' ? 'تعليمات خاصة' : 'Special Instructions'}</Label>
                    <Textarea
                      id="special_instructions"
                      value={formData.special_instructions}
                      onChange={(e) => setFormData(prev => ({ ...prev, special_instructions: e.target.value }))}
                      placeholder={language === 'ar' ? 'أضف أي تعليمات خاصة للمورد' : 'Add any special instructions for the vendor'}
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowGenerator(false)}>
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button onClick={downloadPOTemplate} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    {language === 'ar' ? 'تحميل النموذج' : 'Download Template'}
                  </Button>
                  <Button onClick={generatePO} disabled={generating} className="gap-2">
                    {generating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {language === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {language === 'ar' ? 'إنشاء وإرسال' : 'Generate & Send'}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={downloadPOTemplate} className="gap-2">
              <Download className="h-4 w-4" />
              {language === 'ar' ? 'تحميل النموذج' : 'Download Template'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
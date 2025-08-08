import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface CreateOfferModalProps {
  children: React.ReactNode;
  requestId?: string;
}

export const CreateOfferModal = ({ children, requestId }: CreateOfferModalProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === 'ar';

  const [formData, setFormData] = useState({
    title: "",
    requestId: requestId || "",
    description: "",
    price: "",
    deliveryTime: ""
  });

  // Fetch available requests when modal opens
  useEffect(() => {
    if (open && !requestId) {
      fetchAvailableRequests();
    }
  }, [open, requestId]);

  const fetchAvailableRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('id, title, description, category')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يجب تسجيل الدخول أولاً" : "Please log in to create an offer",
        variant: "destructive"
      });
      return;
    }

    if (!formData.requestId) {
      toast({
        title: isRTL ? "خطأ" : "Error", 
        description: isRTL ? "يرجى اختيار طلب العميل" : "Please select a client request",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('offers')
        .insert({
          request_id: formData.requestId,
          supplier_id: user.id,
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price),
          delivery_time_days: parseInt(formData.deliveryTime)
        });

      if (error) throw error;

      toast({
        title: isRTL ? "تم إنشاء العرض بنجاح" : "Offer Created Successfully",
        description: isRTL ? "تم إرسال عرضك وسيتم إشعار العميل" : "Your offer has been submitted and the client will be notified",
      });
      
      setOpen(false);
      setFormData({
        title: "",
        requestId: requestId || "",
        description: "",
        price: "",
        deliveryTime: ""
      });
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في إنشاء العرض" : "Error Creating Offer",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isRTL ? "إنشاء عرض جديد" : "Create New Offer"}</DialogTitle>
          <DialogDescription>
            {isRTL ? "املأ تفاصيل عرضك للعميل" : "Fill in your offer details for the client"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!requestId && (
            <div className="space-y-2">
              <Label htmlFor="requestId">{isRTL ? "طلب العميل" : "Client Request"}</Label>
              <Select value={formData.requestId} onValueChange={(value) => setFormData({...formData, requestId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? "اختر طلب العميل" : "Select Client Request"} />
                </SelectTrigger>
                <SelectContent>
                  {requests.map((request) => (
                    <SelectItem key={request.id} value={request.id}>
                      {request.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">{isRTL ? "عنوان العرض" : "Offer Title"}</Label>
            <Input
              id="title"
              placeholder={isRTL ? "مثل: حلول صوتية شاملة للمؤتمر" : "e.g., Complete Audio Solutions for Conference"}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="description">{isRTL ? "تفاصيل العرض" : "Offer Details"}</Label>
            <Textarea
              id="description"
              placeholder={isRTL ? "اوصف خدماتك ومنتجاتك بالتفصيل..." : "Describe your services and products in detail..."}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{isRTL ? "السعر (ريال)" : "Price (SAR)"}</Label>
              <Input
                id="price"
                type="number"
                placeholder={isRTL ? "مثل: 8500" : "e.g., 8500"}
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryTime">{isRTL ? "مدة التسليم (أيام)" : "Delivery Time (days)"}</Label>
              <Input
                id="deliveryTime"
                type="number"
                placeholder={isRTL ? "مثل: 3" : "e.g., 3"}
                value={formData.deliveryTime}
                onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (isRTL ? "جارٍ الإرسال..." : "Submitting...") : (isRTL ? "إرسال العرض" : "Submit Offer")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface CreateOfferModalProps {
  children: React.ReactNode;
}

export const CreateOfferModal = ({ children }: CreateOfferModalProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const [formData, setFormData] = useState({
    title: "",
    clientRequest: "",
    description: "",
    price: "",
    deliveryTime: "",
    category: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: isRTL ? "تم إنشاء العرض بنجاح" : "Offer Created Successfully",
        description: isRTL ? "تم إرسال عرضك وسيتم إشعار العميل" : "Your offer has been submitted and the client will be notified",
      });
      setOpen(false);
      setFormData({
        title: "",
        clientRequest: "",
        description: "",
        price: "",
        deliveryTime: "",
        category: ""
      });
    }, 1000);
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
          <div className="space-y-2">
            <Label htmlFor="clientRequest">{isRTL ? "طلب العميل" : "Client Request"}</Label>
            <Select value={formData.clientRequest} onValueChange={(value) => setFormData({...formData, clientRequest: value})}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? "اختر طلب العميل" : "Select Client Request"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="req1">{isRTL ? "معدات صوت للمؤتمر - شركة التقنيات" : "Audio Equipment for Conference - Tech Solutions"}</SelectItem>
                <SelectItem value="req2">{isRTL ? "خدمات طعام للحفل - الفعاليات السعيدة" : "Catering Services for Event - Happy Events"}</SelectItem>
                <SelectItem value="req3">{isRTL ? "أثاث للمعرض - المعارض العالمية" : "Furniture for Exhibition - Global Exhibitions"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="category">{isRTL ? "الفئة" : "Category"}</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? "اختر الفئة" : "Select Category"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avl">{isRTL ? "الصوت والإضاءة والمرئيات" : "Audio, Visual & Lighting"}</SelectItem>
                <SelectItem value="catering">{isRTL ? "خدمات الطعام" : "Catering Services"}</SelectItem>
                <SelectItem value="decoration">{isRTL ? "الديكور والتزيين" : "Decoration & Design"}</SelectItem>
                <SelectItem value="furniture">{isRTL ? "الأثاث" : "Furniture"}</SelectItem>
                <SelectItem value="security">{isRTL ? "الأمن" : "Security"}</SelectItem>
                <SelectItem value="transportation">{isRTL ? "النقل" : "Transportation"}</SelectItem>
              </SelectContent>
            </Select>
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
            <Button type="submit">
              {isRTL ? "إرسال العرض" : "Submit Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
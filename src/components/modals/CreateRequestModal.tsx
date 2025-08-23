import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES } from "@/constants/categories";

interface CreateRequestModalProps {
  children: React.ReactNode;
}

export const CreateRequestModal = ({ children }: CreateRequestModalProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === 'ar';

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    location: "",
    urgency: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يجب تسجيل الدخول أولاً" : "Please log in to create a request",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('requests')
        .insert({
          client_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget_min: formData.budgetMin ? parseInt(formData.budgetMin) : null,
          budget_max: formData.budgetMax ? parseInt(formData.budgetMax) : null,
          location: formData.location,
          deadline: date ? date.toISOString().split('T')[0] : null,
          urgency: formData.urgency || 'medium'
        });

      if (error) throw error;

      toast({
        title: isRTL ? "تم إنشاء الطلب بنجاح" : "Request Created Successfully",
        description: isRTL ? "تم إرسال طلبك وسيتم مراجعته قريباً" : "Your request has been submitted and will be reviewed soon",
      });
      
      setOpen(false);
      setFormData({
        title: "",
        category: "",
        description: "",
        budgetMin: "",
        budgetMax: "",
        location: "",
        urgency: ""
      });
      setDate(undefined);
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في إنشاء الطلب" : "Error Creating Request",
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
          <DialogTitle>{isRTL ? "إنشاء طلب جديد" : "Create New Request"}</DialogTitle>
          <DialogDescription>
            {isRTL ? "املأ تفاصيل طلبك للحصول على عروض من الموردين" : "Fill in your request details to get offers from suppliers"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{isRTL ? "عنوان الطلب" : "Request Title"}</Label>
            <Input
              id="title"
              placeholder={isRTL ? "مثل: معدات الصوت والإضاءة للمؤتمر" : "e.g., Audio & Lighting Equipment for Conference"}
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
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {isRTL ? cat.labelAr : cat.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{isRTL ? "تفاصيل الطلب" : "Request Details"}</Label>
            <Textarea
              id="description"
              placeholder={isRTL ? "اوصف احتياجاتك بالتفصيل..." : "Describe your requirements in detail..."}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">{isRTL ? "الحد الأدنى للميزانية (ريال)" : "Min Budget (SAR)"}</Label>
              <Input
                id="budgetMin"
                type="number"
                placeholder={isRTL ? "مثل: 3000" : "e.g., 3000"}
                value={formData.budgetMin}
                onChange={(e) => setFormData({...formData, budgetMin: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budgetMax">{isRTL ? "الحد الأقصى للميزانية (ريال)" : "Max Budget (SAR)"}</Label>
              <Input
                id="budgetMax"
                type="number"
                placeholder={isRTL ? "مثل: 8000" : "e.g., 8000"}
                value={formData.budgetMax}
                onChange={(e) => setFormData({...formData, budgetMax: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isRTL ? "تاريخ التسليم" : "Delivery Date"}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>{isRTL ? "اختر التاريخ" : "Pick date"}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{isRTL ? "الموقع" : "Location"}</Label>
            <Input
              id="location"
              placeholder={isRTL ? "مثل: الرياض، المملكة العربية السعودية" : "e.g., Riyadh, Saudi Arabia"}
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">{isRTL ? "الأولوية" : "Urgency"}</Label>
            <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? "اختر الأولوية" : "Select Urgency"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{isRTL ? "منخفضة" : "Low"}</SelectItem>
                <SelectItem value="medium">{isRTL ? "متوسطة" : "Medium"}</SelectItem>
                <SelectItem value="high">{isRTL ? "عالية" : "High"}</SelectItem>
                <SelectItem value="urgent">{isRTL ? "عاجل" : "Urgent"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (isRTL ? "جارٍ الإنشاء..." : "Creating...") : (isRTL ? "إنشاء الطلب" : "Create Request")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
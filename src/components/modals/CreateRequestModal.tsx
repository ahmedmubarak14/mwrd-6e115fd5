import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateRequestModalProps {
  children: React.ReactNode;
}

export const CreateRequestModal = ({ children }: CreateRequestModalProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    location: "",
    eventDate: date,
    urgency: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: isRTL ? "تم إنشاء الطلب بنجاح" : "Request Created Successfully",
        description: isRTL ? "تم إرسال طلبك وسيتم مراجعته قريباً" : "Your request has been submitted and will be reviewed soon",
      });
      setOpen(false);
      setFormData({
        title: "",
        category: "",
        description: "",
        budget: "",
        location: "",
        eventDate: undefined,
        urgency: ""
      });
      setDate(undefined);
    }, 1000);
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
              <Label htmlFor="budget">{isRTL ? "الميزانية (ريال)" : "Budget (SAR)"}</Label>
              <Input
                id="budget"
                type="number"
                placeholder={isRTL ? "مثل: 5000" : "e.g., 5000"}
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>{isRTL ? "تاريخ الفعالية" : "Event Date"}</Label>
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
            <Button type="submit">
              {isRTL ? "إنشاء الطلب" : "Create Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
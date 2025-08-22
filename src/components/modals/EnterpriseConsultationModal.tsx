import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EnterpriseConsultationModalProps {
  children: React.ReactNode;
}

export const EnterpriseConsultationModal = ({ children }: EnterpriseConsultationModalProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    estimatedUsers: "",
    requirements: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Require authentication for security
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to submit a consultation request.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('expert_consultations')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          company_name: formData.companyName,
          procurement_type: 'Enterprise Consultation',
          budget_range: formData.estimatedUsers,
          message: formData.message + (formData.requirements ? `\n\nSpecific Requirements: ${formData.requirements}` : ''),
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: isRTL ? "تم إرسال طلبك بنجاح" : "Request Submitted Successfully",
        description: isRTL ? "سنتواصل معك خلال 24 ساعة" : "We'll contact you within 24 hours",
      });

      setFormData({
        fullName: "",
        email: "",
        companyName: "",
        estimatedUsers: "",
        requirements: "",
        message: ""
      });
      setOpen(false);
    } catch (error: any) {
      console.error('Error submitting consultation request:', error);
      toast({
        title: isRTL ? "خطأ في الإرسال" : "Submission Error",
        description: isRTL ? "حدث خطأ أثناء إرسال طلبك" : "There was an error submitting your request",
        variant: "destructive",
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isRTL ? 'استشارة المؤسسات' : 'Enterprise Consultation'}
          </DialogTitle>
          <DialogDescription>
            {isRTL ? 'احصل على استشارة مخصصة لاحتياجات مؤسستك' : 'Get a personalized consultation for your enterprise needs'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                {isRTL ? 'الاسم الكامل' : 'Full Name'}
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {isRTL ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">
              {isRTL ? 'اسم الشركة' : 'Company Name'}
            </Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder={isRTL ? 'أدخل اسم شركتك' : 'Enter your company name'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedUsers">
              {isRTL ? 'العدد المتوقع للمستخدمين' : 'Estimated Number of Users'}
            </Label>
            <Select onValueChange={(value) => handleSelectChange('estimatedUsers', value)}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'اختر عدد المستخدمين' : 'Select number of users'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50-100">50-100 {isRTL ? 'مستخدم' : 'users'}</SelectItem>
                <SelectItem value="100-500">100-500 {isRTL ? 'مستخدم' : 'users'}</SelectItem>
                <SelectItem value="500-1000">500-1000 {isRTL ? 'مستخدم' : 'users'}</SelectItem>
                <SelectItem value="1000+">1000+ {isRTL ? 'مستخدم' : 'users'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">
              {isRTL ? 'المتطلبات الخاصة' : 'Specific Requirements'}
            </Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder={isRTL ? 'أخبرنا عن متطلباتك الخاصة' : 'Tell us about your specific requirements'}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              {isRTL ? 'تفاصيل إضافية' : 'Additional Details'}
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={isRTL ? 'أي تفاصيل إضافية تود مشاركتها' : 'Any additional details you would like to share'}
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (isRTL ? 'جاري الإرسال...' : 'Submitting...') : (isRTL ? 'إرسال الطلب' : 'Submit Request')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
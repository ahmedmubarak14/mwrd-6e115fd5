import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";

interface ContactSalesFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactSalesForm = ({ isOpen, onClose }: ContactSalesFormProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    companySize: "",
    message: ""
  });

  const isArabic = language === 'ar';

  const companySizes = [
    { value: "1-10", label: isArabic ? "1-10 موظفين" : "1-10 employees" },
    { value: "11-50", label: isArabic ? "11-50 موظف" : "11-50 employees" },
    { value: "51-200", label: isArabic ? "51-200 موظف" : "51-200 employees" },
    { value: "201-1000", label: isArabic ? "201-1000 موظف" : "201-1000 employees" },
    { value: "1000+", label: isArabic ? "أكثر من 1000 موظف" : "1000+ employees" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('expert_consultations')
        .insert([{
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.company,
          event_type: 'Enterprise Consultation',
          event_date: new Date().toISOString().split('T')[0],
          budget_range: formData.companySize,
          message: `Position: ${formData.position}\nCompany Size: ${formData.companySize}\n\n${formData.message}`
        }]);

      if (error) throw error;

      toast({
        title: isArabic ? "تم إرسال طلبك بنجاح" : "Request submitted successfully",
        description: isArabic 
          ? "سيتواصل معك فريق المبيعات خلال 24 ساعة" 
          : "Our sales team will contact you within 24 hours",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        companySize: "",
        message: ""
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: isArabic ? "خطأ في الإرسال" : "Submission error",
        description: isArabic 
          ? "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى." 
          : "An error occurred while submitting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {isArabic ? "تواصل مع فريق المبيعات" : "Contact Sales Team"}
            </CardTitle>
            <CardDescription>
              {isArabic 
                ? "أخبرنا عن احتياجاتك وسنقوم بتخصيص حل مناسب لشركتك"
                : "Tell us about your needs and we'll customize a solution for your company"
              }
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {isArabic ? "الاسم الكامل" : "Full Name"} *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={isArabic ? "أدخل اسمك الكامل" : "Enter your full name"}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">
                  {isArabic ? "البريد الإلكتروني" : "Email"} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  {isArabic ? "رقم الهاتف" : "Phone Number"} *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={isArabic ? "أدخل رقم هاتفك" : "Enter your phone number"}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">
                  {isArabic ? "اسم الشركة" : "Company Name"} *
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder={isArabic ? "أدخل اسم الشركة" : "Enter company name"}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">
                  {isArabic ? "المنصب الوظيفي" : "Job Position"}
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder={isArabic ? "أدخل منصبك الوظيفي" : "Enter your job position"}
                />
              </div>
              
              <div className="space-y-2">
                <Label>
                  {isArabic ? "حجم الشركة" : "Company Size"}
                </Label>
                <Select onValueChange={(value) => handleInputChange('companySize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? "اختر حجم الشركة" : "Select company size"} />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                {isArabic ? "رسالة إضافية" : "Additional Message"}
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder={isArabic 
                  ? "أخبرنا عن احتياجاتك وكيف يمكننا مساعدتك"
                  : "Tell us about your needs and how we can help you"
                }
                rows={4}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isArabic ? "جاري الإرسال..." : "Sending..."}
                  </>
                ) : (
                  isArabic ? "إرسال الطلب" : "Send Request"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSalesForm;
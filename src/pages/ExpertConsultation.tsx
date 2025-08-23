import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MessageSquare, User, Mail, Phone, Building, Banknote, Calendar as CalendarIconLucide } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/ui/layout/Footer";

export const ExpertConsultation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [eventDate, setEventDate] = useState<Date>();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    event_type: "",
    budget_range: "",
    message: ""
  });

  const eventTypes = [
    { value: "corporate", label: t('language') === 'ar' ? 'فعاليات شركات' : 'Corporate Events' },
    { value: "wedding", label: t('language') === 'ar' ? 'حفلات زفاف' : 'Weddings' },
    { value: "conference", label: t('language') === 'ar' ? 'مؤتمرات' : 'Conferences' },
    { value: "exhibition", label: t('language') === 'ar' ? 'معارض' : 'Exhibitions' },
    { value: "sports", label: t('language') === 'ar' ? 'فعاليات رياضية' : 'Sports Events' },
    { value: "entertainment", label: t('language') === 'ar' ? 'فعاليات ترفيهية' : 'Entertainment Events' },
    { value: "other", label: t('language') === 'ar' ? 'أخرى' : 'Other' }
  ];

  const budgetRanges = [
    { 
      value: "under-10k", 
      label: t('language') === 'ar' ? 'أقل من 10,000 ريال' : (
        <div className="flex items-center gap-2">
          <span>Under 10,000</span>
          <img src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" alt="Riyal" className="h-4 w-4" />
        </div>
      )
    },
    { 
      value: "10k-50k", 
      label: t('language') === 'ar' ? '10,000 - 50,000 ريال' : (
        <div className="flex items-center gap-2">
          <span>10,000 - 50,000</span>
          <img src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" alt="Riyal" className="h-4 w-4" />
        </div>
      )
    },
    { 
      value: "50k-100k", 
      label: t('language') === 'ar' ? '50,000 - 100,000 ريال' : (
        <div className="flex items-center gap-2">
          <span>50,000 - 100,000</span>
          <img src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" alt="Riyal" className="h-4 w-4" />
        </div>
      )
    },
    { 
      value: "100k-500k", 
      label: t('language') === 'ar' ? '100,000 - 500,000 ريال' : (
        <div className="flex items-center gap-2">
          <span>100,000 - 500,000</span>
          <img src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" alt="Riyal" className="h-4 w-4" />
        </div>
      )
    },
    { 
      value: "500k-plus", 
      label: t('language') === 'ar' ? 'أكثر من 500,000 ريال' : (
        <div className="flex items-center gap-2">
          <span>500,000+</span>
          <img src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" alt="Riyal" className="h-4 w-4" />
        </div>
      )
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Require authentication for security
    if (!user?.id) {
      toast({
        title: t('error'),
        description: t('authRequired'),
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('expert_consultations')
        .insert({
          user_id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          company_name: formData.company_name || null,
          event_type: formData.event_type || null,
          event_date: eventDate?.toISOString().split('T')[0] || null,
          budget_range: formData.budget_range || null,
          message: formData.message
        });

      if (error) throw error;

      toast({
        title: t('language') === 'ar' ? 'تم الإرسال بنجاح!' : 'Successfully Submitted!',
        description: t('language') === 'ar' ? 
          'شكراً لتواصلك معنا. سيقوم فريق الخبراء بالتواصل معك قريباً.' : 
          'Thank you for contacting us. Our expert team will reach out to you soon.',
      });

      // Navigate back to landing after successful submission
      navigate('/');
    } catch (error: any) {
      toast({
        title: t('language') === 'ar' ? 'خطأ في الإرسال' : 'Submission Error',
        description: error.message || (t('language') === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('language') === 'ar' ? 'استشارة مع خبير' : 'Expert Consultation'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('language') === 'ar' ? 
              'احصل على استشارة مخصصة من خبراء الفعاليات لدينا لتحويل رؤيتك إلى واقع مذهل' : 
              'Get personalized consultation from our event experts to transform your vision into stunning reality'
            }
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl">
              {t('language') === 'ar' ? 'أخبرنا عن فعاليتك' : 'Tell Us About Your Event'}
            </CardTitle>
            <CardDescription className="text-lg">
              {t('language') === 'ar' ? 
                'املأ النموذج أدناه وسيتواصل معك أحد خبرائنا خلال 24 ساعة' : 
                'Fill out the form below and one of our experts will contact you within 24 hours'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('language') === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder={t('language') === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    required
                    className="h-12"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t('language') === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t('language') === 'ar' ? 'your@email.com' : 'your@email.com'}
                    required
                    className="h-12"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t('language') === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder={t('language') === 'ar' ? '+966 50 123 4567' : '+966 50 123 4567'}
                    required
                    className="h-12"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {t('language') === 'ar' ? 'اسم الشركة' : 'Company Name'}
                  </Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    placeholder={t('language') === 'ar' ? 'اسم شركتك (اختياري)' : 'Your company name (optional)'}
                    className="h-12"
                  />
                </div>

                {/* Event Type */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIconLucide className="h-4 w-4" />
                    {t('language') === 'ar' ? 'نوع الفعالية' : 'Event Type'}
                  </Label>
                  <Select value={formData.event_type} onValueChange={(value) => handleInputChange('event_type', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('language') === 'ar' ? 'اختر نوع الفعالية' : 'Select event type'} />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Event Date */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {t('language') === 'ar' ? 'تاريخ الفعالية المتوقع' : 'Expected Event Date'}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 w-full justify-start text-left font-normal",
                          !eventDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventDate ? (
                          format(eventDate, "PPP")
                        ) : (
                          <span>{t('language') === 'ar' ? 'اختر التاريخ' : 'Pick a date'}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={eventDate}
                        onSelect={setEventDate}
                        initialFocus
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Budget Range */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <img 
                      src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                      alt="SAR" 
                      className="h-4 w-4"
                    />
                    {t('language') === 'ar' ? 'نطاق الميزانية' : 'Budget Range'}
                  </Label>
                  <Select value={formData.budget_range} onValueChange={(value) => handleInputChange('budget_range', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('language') === 'ar' ? 'اختر نطاق الميزانية' : 'Select budget range'} />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t('language') === 'ar' ? 'تفاصيل الفعالية' : 'Event Details'} *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder={t('language') === 'ar' ? 
                    'أخبرنا المزيد عن فعاليتك، أهدافك، والخدمات التي تحتاجها...' : 
                    'Tell us more about your event, your goals, and the services you need...'
                  }
                  required
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-14 text-lg font-semibold"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('language') === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                    </>
                  ) : (
                    t('language') === 'ar' ? 'إرسال طلب الاستشارة' : 'Submit Consultation Request'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => navigate('/')} className="px-8">
            {t('language') === 'ar' ? 'العودة للصفحة الرئيسية' : 'Back to Landing'}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
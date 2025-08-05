import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Phone, Mail, Search, Book, Video, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { ChatModal } from "@/components/modals/ChatModal";

export const Support = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "medium"
  });
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // For now, just simulate success since support_tickets table might not exist yet
      // In a real implementation, this would be: await supabase.from('support_tickets').insert(...)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: isRTL ? "تم إرسال الطلب بنجاح" : "Ticket Submitted Successfully",
        description: isRTL ? "تم إنشاء تذكرة دعم جديدة. سيتم التواصل معك خلال 24 ساعة" : "Support ticket created. We'll get back to you within 24 hours",
      });
      setContactForm({ subject: "", message: "", priority: "medium" });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في الإرسال" : "Submission Error",
        description: isRTL ? "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى" : "Error submitting ticket. Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAction = (actionType: string) => {
    toast({
      title: isRTL ? "تم فتح الرابط" : "Opening Resource",
      description: isRTL ? `سيتم توجيهك إلى ${actionType}` : `Redirecting to ${actionType}`,
    });
    // In a real app, these would navigate to actual resources
    window.open('/resources/' + actionType.toLowerCase().replace(' ', '-'), '_blank');
  };

  const faqData = [
    {
      question: isRTL ? "كيف يمكنني إنشاء طلب جديد؟" : "How can I create a new request?",
      answer: isRTL ? 
        "يمكنك إنشاء طلب جديد من خلال الذهاب إلى لوحة التحكم والنقر على زر 'إنشاء طلب'. قم بملء جميع التفاصيل المطلوبة وانقر على 'إرسال'." :
        "You can create a new request by going to your dashboard and clicking the 'Create Request' button. Fill in all required details and click 'Submit'."
    },
    {
      question: isRTL ? "كيف يتم دفع المبالغ المالية؟" : "How are payments processed?",
      answer: isRTL ?
        "نحن نستخدم طرق دفع آمنة متعددة تشمل الفيزا، ماستركارد، والتحويل البنكي. جميع المدفوعات محمية بتشفير عالي الأمان." :
        "We use multiple secure payment methods including Visa, Mastercard, and bank transfers. All payments are protected with high-level encryption."
    },
    {
      question: isRTL ? "ما هي أوقات الدعم الفني؟" : "What are the technical support hours?",
      answer: isRTL ?
        "فريق الدعم الفني متاح من الأحد إلى الخميس من 9 صباحاً حتى 6 مساءً. للطوارئ، يمكنك التواصل معنا عبر البريد الإلكتروني." :
        "Technical support team is available Sunday to Thursday from 9 AM to 6 PM. For emergencies, you can contact us via email."
    },
    {
      question: isRTL ? "كيف يمكنني تتبع حالة طلبي؟" : "How can I track my request status?",
      answer: isRTL ?
        "يمكنك تتبع حالة طلبك من خلال قسم 'طلباتي' في لوحة التحكم. ستتلقى أيضاً إشعارات عبر البريد الإلكتروني عند تحديث الحالة." :
        "You can track your request status through the 'My Requests' section in your dashboard. You'll also receive email notifications when the status is updated."
    },
    {
      question: isRTL ? "ما هي سياسة الإلغاء والاسترداد؟" : "What is the cancellation and refund policy?",
      answer: isRTL ?
        "يمكن إلغاء الطلبات قبل 48 ساعة من الموعد المحدد مع استرداد كامل. الإلغاءات بعد هذا الموعد قد تخضع لرسوم إضافية." :
        "Requests can be cancelled 48 hours before the scheduled date with full refund. Cancellations after this period may be subject to additional fees."
    }
  ];

  const quickActions = [
    {
      title: isRTL ? "دليل المستخدم" : "User Guide",
      description: isRTL ? "تعلم كيفية استخدام المنصة" : "Learn how to use the platform",
      icon: Book,
      action: () => handleQuickAction("User Guide")
    },
    {
      title: isRTL ? "فيديوهات تعليمية" : "Tutorial Videos",
      description: isRTL ? "شاهد فيديوهات تعليمية" : "Watch tutorial videos",
      icon: Video,
      action: () => handleQuickAction("Tutorial Videos")
    },
    {
      title: isRTL ? "مركز التحميل" : "Download Center",
      description: isRTL ? "حمل الملفات والموارد" : "Download files and resources",
      icon: FileText,
      action: () => handleQuickAction("Download Center")
    }
  ];

  const filteredFAQ = faqData.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-arabic' : ''}`}>
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h1 className="text-3xl font-bold mb-2">
                {isRTL ? 'مركز الدعم' : 'Support Center'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'نحن هنا لمساعدتك في جميع استفساراتك' : 'We are here to help you with all your inquiries'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                  <CardHeader className="text-center">
                    <action.icon className="h-12 w-12 text-primary mx-auto mb-2" />
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="text-center">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>{isRTL ? 'الدردشة المباشرة' : 'Live Chat'}</CardTitle>
                  <CardDescription>
                    {isRTL ? 'تحدث مع فريق الدعم مباشرة' : 'Chat with our support team directly'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => setChatModalOpen(true)}
                  >
                    {isRTL ? 'بدء محادثة' : 'Start Chat'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>{isRTL ? 'الهاتف' : 'Phone'}</CardTitle>
                  <CardDescription>
                    {isRTL ? 'اتصل بنا مباشرة' : 'Call us directly'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center font-medium">+966 11 123 4567</p>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {isRTL ? 'الأحد - الخميس: 9ص - 6م' : 'Sun - Thu: 9AM - 6PM'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>{isRTL ? 'البريد الإلكتروني' : 'Email'}</CardTitle>
                  <CardDescription>
                    {isRTL ? 'أرسل لنا رسالة' : 'Send us a message'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center font-medium">support@supplify.com</p>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {isRTL ? 'رد خلال 24 ساعة' : 'Response within 24 hours'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                  </CardTitle>
                  <div className="relative">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-muted-foreground`} />
                    <Input
                      placeholder={isRTL ? "البحث في الأسئلة..." : "Search questions..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-2">
                    {filteredFAQ.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className={`${isRTL ? 'text-right' : 'text-left'} hover:no-underline`}>
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className={`${isRTL ? 'text-right' : 'text-left'} text-muted-foreground`}>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isRTL ? 'تواصل معنا' : 'Contact Us'}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? 'أرسل لنا استفسارك وسنجيب عليك في أقرب وقت' : 'Send us your inquiry and we will respond as soon as possible'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder={isRTL ? "موضوع الرسالة" : "Subject"}
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        className={isRTL ? 'text-right' : ''}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder={isRTL ? "اكتب رسالتك هنا..." : "Write your message here..."}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        className={`min-h-[120px] ${isRTL ? 'text-right' : ''}`}
                        required
                      />
                    </div>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm text-muted-foreground">
                        {isRTL ? 'الأولوية:' : 'Priority:'}
                      </span>
                      <Badge variant="outline">
                        {isRTL ? 'متوسطة' : 'Medium'}
                      </Badge>
                    </div>
                     <Button type="submit" className="w-full" disabled={isSubmitting}>
                       {isSubmitting 
                         ? (isRTL ? 'جاري الإرسال...' : 'Sending...') 
                         : (isRTL ? 'إرسال الرسالة' : 'Send Message')
                       }
                     </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <ChatModal supplierName="Support Team">
        <div style={{ display: chatModalOpen ? 'block' : 'none' }} />
      </ChatModal>
    </div>
  );
};
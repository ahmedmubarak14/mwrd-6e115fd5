import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Menu, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ContactSalesForm from "@/components/ContactSalesForm";
import { SmartLogoLink } from "@/components/SmartLogoLink";

const Pricing = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<'client' | 'supplier'>('client');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isContactSalesOpen, setIsContactSalesOpen] = useState(false);
  
  const isArabic = language === 'ar';

  const handlePayment = async (planName: string, amount: number) => {
    if (!user) {
      toast({
        title: isArabic ? "يجب تسجيل الدخول أولاً" : "Please log in first",
        description: isArabic ? "يجب تسجيل الدخول للاشتراك في الخطط" : "You need to log in to subscribe to plans",
        variant: "destructive"
      });
      return;
    }

    setLoadingPlan(planName);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { planName, amount }
      });

      if (error) throw error;

      if (data.skipPayment) {
        toast({
          title: isArabic ? "تم تفعيل الخطة المجانية" : "Free plan activated",
          description: isArabic ? "يمكنك الآن الاستفادة من الخطة المجانية" : "You can now enjoy the free plan features"
        });
      } else {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: isArabic ? "خطأ في الدفع" : "Payment error",
        description: isArabic ? "حدث خطأ أثناء معالجة الدفع" : "An error occurred while processing payment",
        variant: "destructive"
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  // Client pricing plans
  const clientPricingPlans = [
    {
      name: isArabic ? "استكشاف مجاني" : "Explore Free",
      price: isArabic ? "0 ر.س" : "0 SAR",
      amount: 0,
      popular: false,
      features: [
        isArabic ? "تصفح مقدمي الخدمات" : "Browse service providers",
        isArabic ? "مشاهدة المعارض" : "View portfolios",
        isArabic ? "الدعم الأساسي" : "Basic support"
      ]
    },
    {
      name: isArabic ? "نمو الأعمال" : "Business Growth", 
      price: isArabic ? "299 ر.س" : "299 SAR",
      amount: 299,
      popular: true,
      features: [
        isArabic ? "جميع مميزات الخطة المجانية" : "All free plan features",
        isArabic ? "إرسال 5 طلبات شهرياً" : "Send 5 requests per month",
        isArabic ? "الدعم ذو الأولوية" : "Priority support",
        isArabic ? "تحليلات متقدمة" : "Advanced analytics"
      ]
    },
    {
      name: isArabic ? "التميز المهني" : "Professional Excellence",
      price: isArabic ? "799 ر.س" : "799 SAR",
      amount: 799,
      popular: false,
      features: [
        isArabic ? "جميع مميزات خطة نمو الأعمال" : "All Business Growth features",
        isArabic ? "طلبات غير محدودة" : "Unlimited requests",
        isArabic ? "مدير حساب مخصص" : "Dedicated account manager",
        isArabic ? "تقارير مخصصة" : "Custom reports",
        isArabic ? "دعم على مدار الساعة" : "24/7 support"
      ]
    },
    {
      name: isArabic ? "المؤسسات" : "Enterprise",
      price: isArabic ? "خطة مخصصة" : "Custom Plan",
      amount: 0,
      popular: false,
      isEnterprise: true,
      features: [
        isArabic ? "جميع مميزات الخطط السابقة" : "All previous plan features",
        isArabic ? "حلول مخصصة حسب الطلب" : "Custom solutions on demand",
        isArabic ? "دعم مخصص على مدار الساعة" : "Dedicated 24/7 support",
        isArabic ? "تدريب الفريق" : "Team training",
        isArabic ? "تكامل مخصص مع الأنظمة" : "Custom system integrations",
        isArabic ? "مدير نجاح العملاء" : "Customer success manager"
      ]
    }
  ];

  // Supplier pricing plans
  const supplierPricingPlans = [
    {
      name: isArabic ? "استكشاف مجاني" : "Explore Free",
      price: isArabic ? "0 ر.س" : "0 SAR",
      amount: 0,
      popular: false,
      features: [
        isArabic ? "إنشاء ملف تعريفي أساسي" : "Create basic profile",
        isArabic ? "عرض 3 خدمات" : "Display 3 services",
        isArabic ? "الدعم الأساسي" : "Basic support"
      ]
    },
    {
      name: isArabic ? "نمو الأعمال" : "Business Growth",
      price: isArabic ? "299 ر.س" : "299 SAR",
      amount: 299,
      popular: true,
      features: [
        isArabic ? "جميع مميزات الخطة المجانية" : "All free plan features",
        isArabic ? "عرض خدمات غير محدودة" : "Unlimited service listings",
        isArabic ? "أدوات التسويق" : "Marketing tools",
        isArabic ? "تحليلات الأداء" : "Performance analytics"
      ]
    },
    {
      name: isArabic ? "التميز المهني" : "Professional Excellence",
      price: isArabic ? "799 ر.س" : "799 SAR",
      amount: 799,
      popular: false,
      features: [
        isArabic ? "جميع مميزات خطة نمو الأعمال" : "All Business Growth features",
        isArabic ? "ترتيب أولوية في البحث" : "Priority search ranking",
        isArabic ? "شارة التحقق" : "Verified badge",
        isArabic ? "دعم مخصص" : "Dedicated support",
        isArabic ? "إعلانات مميزة" : "Featured listings"
      ]
    },
    {
      name: isArabic ? "المؤسسات" : "Enterprise",
      price: isArabic ? "خطة مخصصة" : "Custom Plan",
      amount: 0,
      popular: false,
      isEnterprise: true,
      features: [
        isArabic ? "جميع مميزات الخطط السابقة" : "All previous plan features",
        isArabic ? "حلول مخصصة حسب الطلب" : "Custom solutions on demand",
        isArabic ? "دعم مخصص على مدار الساعة" : "Dedicated 24/7 support",
        isArabic ? "تدريب الفريق" : "Team training",
        isArabic ? "تكامل مخصص مع الأنظمة" : "Custom system integrations",
        isArabic ? "مدير نجاح العملاء" : "Customer success manager"
      ]
    }
  ];

  const currentPricingPlans = selectedRole === 'client' ? clientPricingPlans : supplierPricingPlans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <SmartLogoLink className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/supplify-logo-white-bg.png" 
              alt="Supplify"
              className="h-8 w-auto"
            />
          </SmartLogoLink>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <Link to="/home" className="hidden md:block">
              <Button variant="ghost" size="sm">
                {isArabic ? 'تسجيل الدخول' : 'Login'}
              </Button>
            </Link>
            <Link to="/home" className="hidden md:block">
              <Button size="sm">
                {isArabic ? 'إنشاء حساب' : 'Sign Up'}
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-card/95 backdrop-blur-md p-4 space-y-3">
            <LanguageSwitcher />
            <Link to="/home" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                {isArabic ? 'تسجيل الدخول' : 'Login'}
              </Button>
            </Link>
            <Link to="/home" className="block">
              <Button size="sm" className="w-full">
                {isArabic ? 'إنشاء حساب' : 'Sign Up'}
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {isArabic ? 'خطط مرنة لكل احتياجاتك' : 'Flexible Plans for Every Need'}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {isArabic 
              ? 'اختر الخطة المناسبة لك واستمتع بمميزات لا محدودة'
              : 'Choose the plan that fits your needs and enjoy unlimited features'
            }
          </p>
          
          {/* Role Selection */}
          <div className="flex justify-center items-center gap-6 mb-12">
            <Button
              variant={selectedRole === 'client' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('client')}
              className="px-8 py-3"
            >
              {isArabic ? 'العملاء' : 'Clients'}
            </Button>
            <Button
              variant={selectedRole === 'supplier' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('supplier')}
              className="px-8 py-3"
            >
              {isArabic ? 'مقدمي الخدمات' : 'Suppliers'}
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {currentPricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'ring-2 ring-primary scale-105 shadow-xl' : 'shadow-lg'} transition-all duration-300 hover:shadow-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                      {isArabic ? 'الأكثر شعبية' : 'Most Popular'}
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold mb-4">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary mb-4">{plan.price}</div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    size="lg" 
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => (plan as any).isEnterprise ? setIsContactSalesOpen(true) : handlePayment(plan.name, plan.amount)}
                    disabled={loadingPlan === plan.name}
                  >
                    {loadingPlan === plan.name ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isArabic ? "جاري المعالجة..." : "Processing..."}
                      </>
                    ) : (plan as any).isEnterprise ? (
                      isArabic ? "تواصل مع المبيعات" : "Contact Sales"
                    ) : (
                      isArabic ? "ابدأ الآن" : "Get Started"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {isArabic ? 'هل لديك أسئلة؟' : 'Have Questions?'}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {isArabic 
              ? 'فريقنا جاهز لمساعدتك في اختيار الخطة المناسبة'
              : 'Our team is ready to help you choose the right plan'
            }
          </p>
          <Link to="/expert-consultation">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              {isArabic ? 'تواصل معنا' : 'Contact Us'}
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Sales Form */}
      <ContactSalesForm 
        isOpen={isContactSalesOpen} 
        onClose={() => setIsContactSalesOpen(false)} 
      />
    </div>
  );
};

export default Pricing;
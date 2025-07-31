import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Menu, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { SmartLogoLink } from "@/components/SmartLogoLink";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ContactSalesForm from "@/components/ContactSalesForm";

const Pricing = () => {
  const { language } = useLanguage();
  const { user, userProfile } = useAuth();
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

  // Client pricing plans matching the reference website exactly
  const clientPricingPlans = [
    {
      name: isArabic ? "استكشاف مجاني" : "Explore Free",
      price: "0",
      amount: 0,
      badge: isArabic ? "مجاني" : "Free",
      badgeColor: "bg-blue-500",
      description: isArabic ? "ابدأ رحلتك معنا واستكشف إمكانيات لا محدودة" : "Start your journey with us and explore unlimited possibilities",
      features: [
        isArabic ? "طلب خدمة واحد شهرياً" : "1 service request per month",
        isArabic ? "تصفح مقدمي الخدمات" : "Browse service providers", 
        isArabic ? "دعم المجتمع" : "Community support",
        isArabic ? "موارد تعليمية أساسية" : "Basic educational resources"
      ]
    },
    {
      name: isArabic ? "نمو الأعمال" : "Business Growth",
      price: "299",
      amount: 299,
      badge: isArabic ? "أفضل قيمة" : "Best Value", 
      badgeColor: "bg-teal-500",
      description: isArabic ? "حلول متكاملة للشركات النامية وطموحاتها" : "Integrated solutions for growing businesses and their ambitions",
      features: [
        isArabic ? "حتى 8 طلبات خدمة شهرياً" : "Up to 8 service requests per month",
        isArabic ? "ربط ذكي ذو أولوية" : "Priority smart matching",
        isArabic ? "دعم تقني متخصص" : "Specialist technical support",
        isArabic ? "تقارير أداء ربع سنوية" : "Quarterly Performance Reports",
        isArabic ? "رؤى تحليلية للنمو" : "Growth analytical insights",
        isArabic ? "ورش تطوير" : "Development workshops"
      ]
    },
    {
      name: isArabic ? "التميز المهني" : "Professional Excellence",
      price: "799",
      amount: 799,
      badge: isArabic ? "الأكثر شعبية" : "Most Popular",
      badgeColor: "bg-teal-600",
      popular: true,
      description: isArabic ? "للشركات الرائدة التي تسعى للتميز والابتكار" : "For leading companies pursuing excellence and innovation",
      features: [
        isArabic ? "حتى 30 طلب خدمة شهرياً" : "Up to 30 service requests per month",
        isArabic ? "ربط ذكي متطور بالذكاء الاصطناعي" : "Advanced AI-powered smart matching",
        isArabic ? "فريق دعم مخصص" : "Dedicated support team",
        isArabic ? "تقارير أداء ربع سنوية متقدمة" : "Advanced quarterly performance reports",
        isArabic ? "استشارات استراتيجية" : "Strategic consultations",
        isArabic ? "علامة تجارية مخصصة" : "Custom branding",
        isArabic ? "تدريب متخصص" : "Specialized training"
      ]
    },
    {
      name: isArabic ? "قيادة المؤسسات" : "Enterprise",
      price: isArabic ? "مخصص" : "Custom",
      amount: 0,
      badge: isArabic ? "المؤسسات" : "Enterprise",
      badgeColor: "bg-blue-600",
      isEnterprise: true,
      description: isArabic ? "حلول مؤسسية شاملة لقادة الصناعة" : "Complete enterprise solutions for industry leaders",
      features: [
        isArabic ? "طلبات خدمة غير محدودة" : "Unlimited service requests",
        isArabic ? "منصة بعلامة تجارية بيضاء" : "White-label platform",
        isArabic ? "فريق إدارة حساب مخصص" : "Dedicated account management team",
        isArabic ? "تقارير أداء شهرية متقدمة" : "Advanced monthly performance reports",
        isArabic ? "مدير حساب مخصص" : "Dedicated account manager",
        isArabic ? "تكاملات تقنية مخصصة" : "Custom technical integrations",
        isArabic ? "ضمانات SLA مميزة" : "Premium SLA guarantees",
        isArabic ? "استشارات التحول الرقمي" : "Digital transformation consultancy"
      ]
    }
  ];

  // Supplier plans with commission system as per reference website
  const supplierPricingPlans = [
    {
      name: isArabic ? "البداية" : "Starter",
      price: "0",
      amount: 0,
      commission: "15%",
      badge: isArabic ? "مجاني" : "Free",
      badgeColor: "bg-blue-600",
      description: isArabic ? "ابدأ رحلتك معنا واستكشف إمكانيات لا محدودة" : "Start your journey with us and explore unlimited possibilities",
      features: [
        isArabic ? "عمولة 15% على كل عملية بيع" : "15% commission on each sale",
        isArabic ? "ملف تعريفي أساسي" : "Basic profile",
        isArabic ? "عرض 3 خدمات" : "Display 3 services",
        isArabic ? "دعم المجتمع" : "Community support",
        isArabic ? "موارد تعليمية أساسية" : "Basic educational resources"
      ]
    },
    {
      name: isArabic ? "الاحتراف" : "Professional",
      price: "299",
      amount: 299,
      commission: "10%",
      badge: isArabic ? "أفضل قيمة" : "Best Value",
      badgeColor: "bg-teal-600",
      description: isArabic ? "حلول متكاملة للشركات النامية وطموحاتها" : "Integrated solutions for growing businesses and their ambitions",
      features: [
        isArabic ? "عمولة 10% على كل عملية بيع" : "10% commission on each sale",
        isArabic ? "خدمات غير محدودة" : "Unlimited services",
        isArabic ? "أدوات تسويق" : "Marketing tools",
        isArabic ? "دعم تقني متخصص" : "Specialist technical support",
        isArabic ? "تقارير أداء ربع سنوية" : "Quarterly Performance Reports",
        isArabic ? "رؤى تحليلية للنمو" : "Growth analytical insights"
      ]
    },
    {
      name: isArabic ? "المتميز" : "Premium",
      price: "799",
      amount: 799,
      commission: "5%",
      badge: isArabic ? "الأكثر شعبية" : "Most Popular",
      badgeColor: "bg-emerald-700",
      popular: true,
      description: isArabic ? "للشركات الرائدة التي تسعى للتميز والابتكار" : "For leading companies pursuing excellence and innovation",
      features: [
        isArabic ? "عمولة 5% على كل عملية بيع" : "5% commission on each sale",
        isArabic ? "ترتيب أولوية في البحث" : "Priority search ranking",
        isArabic ? "شارة التحقق" : "Verified badge",
        isArabic ? "فريق دعم مخصص" : "Dedicated support team",
        isArabic ? "تقارير أداء ربع سنوية متقدمة" : "Advanced quarterly performance reports",
        isArabic ? "استشارات استراتيجية" : "Strategic consultations",
        isArabic ? "علامة تجارية مخصصة" : "Custom branding"
      ]
    },
    {
      name: isArabic ? "المؤسسات" : "Enterprise",
      price: isArabic ? "مخصص" : "Custom",
      amount: 0,
      commission: isArabic ? "مخصص" : "Custom",
      badge: isArabic ? "المؤسسات" : "Enterprise",
      badgeColor: "bg-blue-600",
      isEnterprise: true,
      description: isArabic ? "حلول مؤسسية شاملة لقادة الصناعة" : "Complete enterprise solutions for industry leaders",
      features: [
        isArabic ? "عمولة مخصصة حسب الحجم" : "Custom commission based on volume",
        isArabic ? "حلول مؤسسية شاملة" : "Complete enterprise solutions",
        isArabic ? "منصة بعلامة تجارية بيضاء" : "White-label platform",
        isArabic ? "فريق إدارة حساب مخصص" : "Dedicated account management team",
        isArabic ? "تقارير أداء شهرية متقدمة" : "Advanced monthly performance reports",
        isArabic ? "مدير حساب مخصص" : "Dedicated account manager",
        isArabic ? "تكاملات تقنية مخصصة" : "Custom technical integrations"
      ]
    }
  ];

  const currentPricingPlans = selectedRole === 'client' ? clientPricingPlans : supplierPricingPlans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <SmartLogoLink className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/842b99cc-446d-41b5-8de7-b9c12faa1ed9.png" 
              alt="Supplify"
              className="h-12 w-auto"
            />
          </SmartLogoLink>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            
            {user && userProfile ? (
              // Show user info when logged in
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {userProfile.full_name || userProfile.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userProfile.role} {userProfile.company_name && `• ${userProfile.company_name}`}
                  </p>
                </div>
                <Link to="/dashboard">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                  </Button>
                </Link>
              </div>
            ) : (
              // Show login/signup when not logged in
              <>
                <Link to="/home" className="hidden md:block">
                  <Button variant="ghost" size="sm">
                    {isArabic ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </Link>
                <Link to="/home" className="hidden md:block">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    {isArabic ? 'ابدأ مجاناً' : 'Start Free'}
                  </Button>
                </Link>
              </>
            )}
            
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

        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md p-4 space-y-3">
            <LanguageSwitcher />
            {user && userProfile ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile.full_name || userProfile.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userProfile.role} {userProfile.company_name && `• ${userProfile.company_name}`}
                </p>
                <Link to="/dashboard" className="block">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/home" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    {isArabic ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </Link>
                <Link to="/home" className="block">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    {isArabic ? 'ابدأ مجاناً' : 'Start Free'}
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 text-center bg-white">
        <div className="container mx-auto max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 rounded-full px-4 py-2 mb-8 text-sm font-medium">
            <span>✨</span>
            {isArabic ? 'حلول مرنة' : 'Flexible Solutions'}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            {isArabic ? 'استثمر في نجاح فعالياتك' : 'Invest in Your Events Success'}
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            {isArabic 
              ? 'حزم مصممة بعناية لتناسب رحلتك في عالم الفعاليات، من البدايات المتواضعة إلى القمم العالية'
              : 'Carefully designed packages to suit your journey in the events world, from humble beginnings to great heights'
            }
          </p>
          
          {/* Role Toggle */}
          <div className="flex justify-center items-center gap-1 mb-16 bg-gray-100 rounded-full p-1 max-w-xs mx-auto">
            <button
              onClick={() => setSelectedRole('client')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedRole === 'client' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isArabic ? 'العملاء' : 'Clients'}
            </button>
            <button
              onClick={() => setSelectedRole('supplier')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedRole === 'supplier' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isArabic ? 'المقدمين' : 'Suppliers'}
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {currentPricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative bg-white border transition-all duration-300 ${
                  plan.popular ? 'border-2 border-green-500 shadow-xl' : 'border-gray-200 shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Badge */}
                <div className={`${plan.badgeColor} text-white px-3 py-1 rounded-full text-xs font-medium absolute -top-3 left-1/2 transform -translate-x-1/2`}>
                  {plan.badge}
                </div>
                
                <CardHeader className="text-center pb-6 pt-12">
                  <CardTitle className="text-lg font-semibold mb-6 text-gray-900">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-5xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      {plan.price !== (isArabic ? "مخصص" : "Custom") && (
                        <img 
                          src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                          alt="Riyal" 
                          className="w-8 h-8 ml-1"
                        />
                      )}
                    </div>
                    {plan.price !== (isArabic ? "مخصص" : "Custom") && (
                      <p className="text-gray-500 text-sm mt-1">/{isArabic ? 'شهر' : 'month'}</p>
                    )}
                  </div>
                  
                  {selectedRole === 'supplier' && (plan as any).commission && (
                    <div className="mb-4">
                      <span className="text-lg font-semibold text-green-600">
                        {isArabic ? 'عمولة: ' : 'Commission: '}{(plan as any).commission}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent className="px-6 pb-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    size="lg" 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={() => (plan as any).isEnterprise ? setIsContactSalesOpen(true) : handlePayment(plan.name, plan.amount)}
                    disabled={loadingPlan === plan.name}
                  >
                    {loadingPlan === plan.name ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isArabic ? "جاري المعالجة..." : "Processing..."}
                      </>
                    ) : (plan as any).isEnterprise ? (
                      isArabic ? "تواصل للاستفسار" : "Contact for Inquiry"
                    ) : (
                      isArabic ? "ابدأ الآن" : "Start Now"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50 text-gray-900">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {isArabic ? 'هل أنت جاهز لتحويل فعالياتك؟' : 'Are You Ready to Transform Your Events?'}
          </h2>
          <p className="text-xl mb-8 text-gray-600">
            {isArabic 
              ? 'انضم لآلاف الشركات الرائدة التي اختارت سبلفاي لتحقيق أحلامها في عالم الفعاليات'
              : 'Join thousands of leading companies that chose Supplify to achieve their dreams in the events world'
            }
          </p>
          <Link to="/home">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
              {isArabic ? 'ابدأ تجربتك المجانية الآن' : 'Start Your Free Trial Now'}
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
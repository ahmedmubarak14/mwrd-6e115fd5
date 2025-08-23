import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptionalAuth } from "@/contexts/useOptionalAuth";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Check, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";

export const Pricing = () => {
  const { t, language } = useLanguage();
  const authData = useOptionalAuth();
  const [selectedRole, setSelectedRole] = useState<'client' | 'supplier'>('client');
  const isRTL = language === 'ar';

  // Show loading spinner if auth is loading
  if (authData?.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] flex items-center justify-center">
        <LoadingSpinner size="lg" text={isRTL ? "جارٍ التحميل..." : "Loading..."} />
      </div>
    );
  }

  const clientPricingPlans = [
    {
      name: "استكشف مجاناً",
      englishName: "Explore Free",
      price: "0",
      currency: "",
      period: "/شهر",
      englishPeriod: "/month",
      description: "ابدأ رحلتك معنا واستكشف إمكانيات لا محدودة",
      englishDescription: "Start your journey with us and explore unlimited possibilities",
      features: [
        "طلب خدمة واحد شهرياً",
        "تصفح مقدمي الخدمات",
        "دعم مجتمعي",
        "موارد تعليمية أساسية"
      ],
      englishFeatures: [
        "1 service request per month",
        "Browse service providers",
        "Community support",
        "Basic educational resources"
      ],
      popular: false,
      badge: "مجاني",
      englishBadge: "Free"
    },
    {
      name: "نمو الأعمال",
      englishName: "Business Growth", 
      price: "299",
      currency: "",
      period: "/شهر",
      englishPeriod: "/month",
      description: "حلول متكاملة للشركات النامية وطموحاتها",
      englishDescription: "Integrated solutions for growing businesses and their ambitions",
      features: [
        "حتى 8 طلبات خدمة شهرياً",
        "أولوية في المطابقة الذكية",
        "دعم فني متخصص",
        "تقارير أداء ربع سنوية",
        "رؤى تحليلية للنمو",
        "ورش عمل تطويرية"
      ],
      englishFeatures: [
        "Up to 8 service requests per month",
        "Priority smart matching",
        "Specialist technical support",
        "Quarterly Performance Reports",
        "Growth analytical insights",
        "Development workshops"
      ],
      popular: false,
      badge: "أكثر قيمة",
      englishBadge: "Best Value"
    },
    {
      name: "التميز المهني",
      englishName: "Professional Excellence",
      price: "799",
      currency: "",
      period: "/شهر",
      englishPeriod: "/month",
      description: "للشركات الرائدة التي تسعى للتفوق والابتكار",
      englishDescription: "For leading companies pursuing excellence and innovation",
      features: [
        "حتى 30 طلب خدمة شهرياً",
        "مطابقة ذكية متقدمة بالذكاء الاصطناعي",
        "فريق دعم مخصص",
        "تقارير أداء ربع سنوية متقدمة",
        "استشارات استراتيجية",
        "علامة تجارية مخصصة",
        "تدريبات متخصصة"
      ],
      englishFeatures: [
        "Up to 30 service requests per month",
        "Advanced AI-powered smart matching",
        "Dedicated support team",
        "Advanced quarterly performance reports",
        "Strategic consultations",
        "Custom branding",
        "Specialized training"
      ],
      popular: true,
      badge: "الأكثر شعبية",
      englishBadge: "Most Popular"
    },
    {
      name: "قيادة المؤسسات",
      englishName: "Enterprise Leadership",
      price: "حسب الطلب",
      englishPrice: "Custom",
      currency: "",
      period: "",
      englishPeriod: "",
      description: "حلول مؤسسية متكاملة لقادة الصناعة",
      englishDescription: "Complete enterprise solutions for industry leaders",
      features: [
        "طلبات خدمة غير محدودة",
        "منصة بعلامة تجارية خاصة",
        "فريق إدارة حسابات مخصص",
        "تقارير أداء شهرية متطورة",
        "مدير حساب مخصص",
        "تكاملات تقنية مخصصة",
        "ضمانات مستوى خدمة متميز",
        "استشارات تحول رقمي"
      ],
      englishFeatures: [
        "Unlimited service requests",
        "White-label platform",
        "Dedicated account management team",
        "Advanced monthly performance reports",
        "Dedicated account manager",
        "Custom technical integrations",
        "Premium SLA guarantees",
        "Digital transformation consultancy"
      ],
      popular: false,
      badge: "حلول مؤسسية",
      englishBadge: "Enterprise"
    }
  ];

  const supplierPricingPlans = [
    {
      name: "مقدم خدمة مبتدئ",
      englishName: "Starter Provider",
      price: "0",
      currency: "",
      period: "/شهر",
      englishPeriod: "/month",
      description: "ابدأ كمقدم خدمة وانضم لشبكتنا",
      englishDescription: "Start as a service provider and join our network",
      features: [
        "ملف شخصي أساسي",
        "استقبال حتى 3 طلبات شهرياً",
        "عمولة 8% على كل صفقة",
        "دعم مجتمعي"
      ],
      englishFeatures: [
        "Basic profile setup",
        "Receive up to 3 requests monthly",
        "8% commission per deal",
        "Community support"
      ],
      popular: false,
      badge: "مجاني",
      englishBadge: "Free"
    },
    {
      name: "مقدم خدمة محترف",
      englishName: "Professional Provider",
      price: "199",
      currency: "",
      period: "/شهر",
      englishPeriod: "/month",
      description: "حلول متقدمة للمقدمين المحترفين",
      englishDescription: "Advanced solutions for professional providers",
      features: [
        "ملف شخصي متقدم مع معرض أعمال",
        "استقبال حتى 15 طلب شهرياً",
        "عمولة 5% على كل صفقة",
        "أولوية في نتائج البحث",
        "تقارير أداء شهرية",
        "دعم فني متخصص"
      ],
      englishFeatures: [
        "Advanced profile with portfolio gallery",
        "Receive up to 15 requests monthly",
        "5% commission per deal",
        "Priority in search results",
        "Monthly performance reports",
        "Specialist technical support"
      ],
      popular: true,
      badge: "الأكثر شعبية",
      englishBadge: "Most Popular"
    },
    {
      name: "مقدم خدمة متميز",
      englishName: "Premium Provider",
      price: "399",
      currency: "",
      period: "/شهر",
      englishPeriod: "/month",
      description: "للمقدمين الرائدين في السوق",
      englishDescription: "For leading providers in the market",
      features: [
        "ملف شخصي مخصص بالكامل",
        "طلبات غير محدودة",
        "عمولة 3% على كل صفقة",
        "شارة 'مقدم متميز'",
        "إدارة حساب مخصصة",
        "تقارير تحليلية متقدمة",
        "دعم أولوية على مدار الساعة"
      ],
      englishFeatures: [
        "Fully customized profile",
        "Unlimited requests",
        "3% commission per deal",
        "'Premium Provider' badge",
        "Dedicated account management",
        "Advanced analytics reports",
        "24/7 priority support"
      ],
      popular: false,
      badge: "متميز",
      englishBadge: "Premium"
    },
    {
      name: "شريك مؤسسي",
      englishName: "Enterprise Partner",
      price: "حسب الطلب",
      englishPrice: "Custom",
      currency: "",
      period: "",
      englishPeriod: "",
      description: "شراكة استراتيجية للمؤسسات الكبرى",
      englishDescription: "Strategic partnership for large enterprises",
      features: [
        "حلول مخصصة بالكامل",
        "عمولة تفاوضية",
        "فريق دعم مخصص",
        "تكاملات تقنية خاصة",
        "تدريب وتطوير الفريق",
        "اتفاقيات مستوى خدمة مخصصة",
        "استشارات نمو الأعمال"
      ],
      englishFeatures: [
        "Fully customized solutions",
        "Negotiable commission rates",
        "Dedicated support team",
        "Custom technical integrations",
        "Team training and development",
        "Custom SLA agreements",
        "Business growth consultancy"
      ],
      popular: false,
      badge: "شراكة",
      englishBadge: "Partnership"
    }
  ];

  const currentPricingPlans = selectedRole === 'client' ? clientPricingPlans : supplierPricingPlans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C]">
      {/* Navigation Header */}
      <header className="h-20 sm:h-24 lg:h-28 border-b backdrop-blur-sm sticky top-0 z-50" style={{ background: 'var(--gradient-header)' }}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center justify-between">
          
          {/* Logo - positioned based on language */}
          <div className="rtl-order-1 flex items-center gap-2 sm:gap-4">
            <Link 
              to="/landing" 
              className="flex items-center group"
            >
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo"
                className="h-12 sm:h-20 lg:h-24 w-auto hover:scale-105 transition-transform"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation Links - centered */}
          <div className="rtl-order-2 hidden lg:flex items-center gap-8">
            <Link 
              to="/why-start-with-mwrd" 
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              {isRTL ? "لماذا تبدأ معنا" : "Why Start with Us"}
            </Link>
            <Link 
              to="/what-makes-us-unique" 
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              {isRTL ? "ما يميزنا" : "What Makes Us Unique"}
            </Link>
            <Link 
              to="/why-move-to-mwrd" 
              className="text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              {isRTL ? "لماذا الانتقال إلينا" : "Why Move to Us"}
            </Link>
            <span className="text-white text-sm font-medium">
              {isRTL ? "الأسعار" : "Pricing"}
            </span>
          </div>
          
          {/* Actions - positioned based on language */}
          <div className="rtl-order-3 rtl-flex items-center gap-1 sm:gap-2 lg:gap-4">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            
            <MobileNavigation />
            
            {authData?.user ? (
              <Link to="/dashboard">
                <Button className="bg-white/10 text-white border border-white/20 hover:bg-white/20 px-3 sm:px-4 lg:px-6 text-sm">
                  {isRTL ? "لوحة التحكم" : "Dashboard"}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-white hover:bg-white/10 px-3 sm:px-4 text-sm">
                    {isRTL ? "تسجيل الدخول" : "Login"}
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-white/10 text-white border border-white/20 hover:bg-white/20 px-3 sm:px-4 lg:px-6 text-sm">
                    {isRTL ? "ابدأ مجاناً" : "Get Started"}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/30 backdrop-blur-20 rounded-full px-6 py-2 mb-6">
            <Star className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              {t('language') === 'ar' ? 'حلول مرنة' : 'Flexible Solutions'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">
            {t('language') === 'ar' ? 'استثمر في نجاح أعمالك' : 'Invest in Your Business Success'}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12">
            {t('language') === 'ar' ? 
              'باقات مصممة بعناية لتناسب رحلتك في عالم المشتريات، من البداية المتواضعة إلى القمم العالية' : 
              'Carefully designed packages to suit your journey in the procurement world, from humble beginnings to great heights'
            }
          </p>
          
          {/* Role Selection Toggle */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <div className={`flex items-center gap-4 ${t('language') === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span className={`text-lg font-medium transition-colors text-white ${selectedRole === 'client' ? 'opacity-100' : 'opacity-70'}`}>
                {t('language') === 'ar' ? 'العملاء' : 'Clients'}
              </span>
              
              <Switch
                id="roleToggle"
                checked={selectedRole === 'supplier'}
                onCheckedChange={(checked) => setSelectedRole(checked ? 'supplier' : 'client')}
                className="scale-125"
              />
              
              <span className={`text-lg font-medium transition-colors text-white ${selectedRole === 'supplier' ? 'opacity-100' : 'opacity-70'}`}>
                {t('language') === 'ar' ? 'مقدمي الخدمات' : 'Vendors'}
              </span>
              
              {selectedRole === 'supplier' && (
                <div className="bg-gradient-to-r from-accent to-primary text-white px-4 py-1.5 rounded-full text-sm font-medium animate-fade-in">
                  {t('language') === 'ar' ? 'نظام عمولات مرن' : 'Flexible Commission System'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {currentPricingPlans.map((plan, index) => (
              <Card key={index} className={`relative group ${plan.popular ? 'ring-2 ring-primary scale-105 shadow-2xl bg-white/5 border border-white/20 backdrop-blur-20' : 'hover:shadow-xl bg-white/5 border border-white/20 backdrop-blur-20'} transition-all duration-500`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`${plan.popular ? 'bg-gradient-to-r from-primary to-accent' : 'bg-accent'} text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg`}>
                      {t('language') === 'ar' ? plan.badge : plan.englishBadge}
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6 pt-8">
                  <CardTitle className="text-xl font-black mb-4 text-white">
                    {t('language') === 'ar' ? plan.name : plan.englishName}
                  </CardTitle>
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t('language') === 'ar' ? plan.price : (plan.englishPrice || plan.price)}
                      </span>
                      {plan.price !== 'حسب الطلب' && plan.price !== 'Custom' && (
                        <img 
                          src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                          alt="Riyal" 
                          className="h-6 w-6 opacity-80"
                        />
                      )}
                    </div>
                    {plan.period && (
                      <span className="text-white/70 text-sm">
                        {t('language') === 'ar' ? plan.period : plan.englishPeriod}
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-sm leading-relaxed text-white/80">
                    {t('language') === 'ar' ? plan.description : plan.englishDescription}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {(t('language') === 'ar' ? plan.features : plan.englishFeatures).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-lime shrink-0 mt-1" />
                        <span className="text-sm leading-relaxed text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/home">
                    <Button 
                      className={`w-full py-3 hover-scale ${plan.popular ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.price === 'حسب الطلب' || plan.price === 'Custom' ? 
                        (t('language') === 'ar' ? 'تواصل للاستفسار' : 'Contact for Inquiry') : 
                        (t('language') === 'ar' ? 'ابدأ الآن' : 'Start Now')
                      }
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blackChasm/50"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto p-12 bg-white/5 border border-white/20 backdrop-blur-20 rounded-3xl">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
              {t('language') === 'ar' ? 'هل أنت مستعد لتحويل مشترياتك؟' : 'Are You Ready to Transform Your Procurement?'}
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
              {t('language') === 'ar' ? 
                'انضم إلى آلاف الشركات الرائدة التي اختارت MWRD لتحقيق أحلامها في عالم المشتريات' : 
                'Join thousands of leading companies that chose MWRD to achieve their dreams in the procurement world'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/home">
                <Button size="lg" className="bg-white text-blackChasm hover:bg-white/90 font-semibold px-10 py-5 text-lg shadow-2xl hover-scale">
                  {t('language') === 'ar' ? 'ابدأ تجربتك المجانية الآن' : 'Start Your Free Trial Now'} 
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
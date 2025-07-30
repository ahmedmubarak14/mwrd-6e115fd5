import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

export const Pricing = () => {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<'client' | 'supplier'>('client');

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/dbfa227c-ea00-42f4-9f7e-544c2b0bde60.png" 
              alt="Saudi Riyal Logo"
              className="h-16 w-auto hover:scale-105 transition-transform"
            />
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <Link to="/home" className="hidden md:block">
              <Button variant="ghost" size="sm" className="hover-scale">
                {t('language') === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Button>
            </Link>
            <Link to="/home" className="hidden md:block">
              <Button size="sm" className="hover-scale bg-gradient-to-r from-primary to-accent">
                {t('language') === 'ar' ? 'ابدأ مجاناً' : 'Start Free'}
              </Button>
            </Link>
            <MobileNavigation />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-lime/10 rounded-full px-6 py-2 mb-6">
            <Star className="h-4 w-4 text-lime" />
            <span className="text-sm font-medium text-lime">
              {t('language') === 'ar' ? 'حلول مرنة' : 'Flexible Solutions'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('language') === 'ar' ? 'استثمر في نجاح فعالياتك' : 'Invest in Your Events Success'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
            {t('language') === 'ar' ? 
              'باقات مصممة بعناية لتناسب رحلتك في عالم الفعاليات، من البداية المتواضعة إلى القمم العالية' : 
              'Carefully designed packages to suit your journey in the events world, from humble beginnings to great heights'
            }
          </p>
          
          {/* Role Selection Toggle */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <div className="flex items-center gap-4">
              <span className={`text-lg font-medium transition-colors ${selectedRole === 'client' ? 'text-foreground' : 'text-muted-foreground'}`}>
                {t('language') === 'ar' ? 'العملاء' : 'Clients'}
              </span>
              
              <div className="relative">
                <input
                  type="checkbox"
                  id="roleToggle"
                  checked={selectedRole === 'supplier'}
                  onChange={(e) => setSelectedRole(e.target.checked ? 'supplier' : 'client')}
                  className="sr-only"
                />
                <label
                  htmlFor="roleToggle"
                  className="block w-14 h-7 bg-primary rounded-full cursor-pointer relative transition-all duration-300 hover:bg-primary/90"
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                      selectedRole === 'supplier' ? 'translate-x-7' : 'translate-x-0.5'
                    }`}
                  />
                </label>
              </div>
              
              <span className={`text-lg font-medium transition-colors ${selectedRole === 'supplier' ? 'text-foreground' : 'text-muted-foreground'}`}>
                {t('language') === 'ar' ? 'مقدمي الخدمات' : 'Suppliers'}
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
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {currentPricingPlans.map((plan, index) => (
              <Card key={index} className={`relative group ${plan.popular ? 'ring-2 ring-primary scale-105 shadow-2xl bg-gradient-to-b from-card to-primary/5' : 'hover:shadow-xl bg-card/70'} transition-all duration-500 border-0 backdrop-blur-sm hover-scale`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`${plan.popular ? 'bg-gradient-to-r from-primary to-accent' : 'bg-accent'} text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg`}>
                      {t('language') === 'ar' ? plan.badge : plan.englishBadge}
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6 pt-8">
                  <CardTitle className="text-xl font-bold mb-4">
                    {t('language') === 'ar' ? plan.name : plan.englishName}
                  </CardTitle>
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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
                      <span className="text-muted-foreground text-sm">
                        {t('language') === 'ar' ? plan.period : plan.englishPeriod}
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {t('language') === 'ar' ? plan.description : plan.englishDescription}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {(t('language') === 'ar' ? plan.features : plan.englishFeatures).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-lime shrink-0 mt-1" />
                        <span className="text-sm leading-relaxed">{feature}</span>
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
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-lime"></div>
        <div className="container mx-auto text-center relative z-10 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('language') === 'ar' ? 'هل أنت مستعد لتحويل فعالياتك؟' : 'Are You Ready to Transform Your Events?'}
            </h2>
            <p className="text-xl md:text-2xl opacity-90 mb-12 leading-relaxed">
              {t('language') === 'ar' ? 
                'انضم إلى آلاف الشركات الرائدة التي اختارت سبلفاي لتحقيق أحلامها في عالم الفعاليات' : 
                'Join thousands of leading companies that chose Supplify to achieve their dreams in the events world'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/home">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-10 py-5 text-lg shadow-2xl hover-scale">
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
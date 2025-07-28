import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, ArrowRight, Users, Shield, Zap, Award, TrendingUp, Clock, Star, Play } from "lucide-react";
import { Link } from "react-router-dom";

export const Landing = () => {
  const { t } = useLanguage();

  const stats = [
    { number: "500+", label: "مقدم خدمة معتمد", englishLabel: "Certified Providers" },
    { number: "10,000+", label: "فعالية ناجحة", englishLabel: "Successful Events" },
    { number: "13", label: "منطقة في المملكة", englishLabel: "Regions in KSA" },
    { number: "98%", label: "رضا العملاء", englishLabel: "Client Satisfaction" }
  ];

  const features = [
    { 
      icon: Users, 
      title: "مقدمو خدمات معتمدون", 
      description: "الوصول إلى مقدمي خدمات محترفين ومعتمدين في المملكة العربية السعودية",
      englishTitle: "Vetted Service Providers",
      englishDescription: "Access to professional and certified service providers across Saudi Arabia"
    },
    { 
      icon: Shield, 
      title: "منصة آمنة", 
      description: "معاملات آمنة مع حماية مدمجة ومتوافقة مع معايير الأمان السعودية",
      englishTitle: "Secure Platform",
      englishDescription: "Safe transactions with built-in protection compliant with Saudi security standards"
    },
    { 
      icon: Zap, 
      title: "ربط سريع", 
      description: "احصل على عروض من مقدمي الخدمات في دقائق، وليس أيام",
      englishTitle: "Fast Matching",
      englishDescription: "Get matched with service providers in minutes, not days"
    },
    { 
      icon: Award, 
      title: "ضمان الجودة", 
      description: "مقدمو خدمات معتمدون مع تقييمات موثقة من عملاء سابقين",
      englishTitle: "Quality Assurance",
      englishDescription: "Certified suppliers with verified reviews from previous clients"
    }
  ];

  const plans = [
    {
      name: "الباقة الأساسية",
      englishName: "Basic Package",
      price: "299",
      currency: "ر.س",
      period: "/شهر",
      englishPeriod: "/month",
      description: "مثالية للمنشآت الصغيرة والفعاليات المحدودة",
      englishDescription: "Perfect for small businesses and limited events",
      features: [
        "حتى 5 طلبات خدمة شهرياً",
        "ربط أساسي مع مقدمي الخدمات",
        "دعم فني عبر البريد الإلكتروني",
        "تقارير أساسية"
      ],
      englishFeatures: [
        "Up to 5 service requests per month",
        "Basic supplier matching",
        "Email support",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "الباقة المتقدمة",
      englishName: "Professional Package", 
      price: "799",
      currency: "ر.س",
      period: "/شهر",
      englishPeriod: "/month",
      description: "مناسبة للشركات النامية والفعاليات المتوسطة",
      englishDescription: "Ideal for growing businesses and medium events",
      features: [
        "حتى 25 طلب خدمة شهرياً",
        "ربط متقدم مع مقدمي الخدمات",
        "دعم فني ذو أولوية",
        "تحليلات متقدمة",
        "علامة تجارية مخصصة",
        "مدير حساب مخصص"
      ],
      englishFeatures: [
        "Up to 25 service requests per month",
        "Advanced supplier matching",
        "Priority support",
        "Advanced analytics",
        "Custom branding",
        "Dedicated account manager"
      ],
      popular: true
    },
    {
      name: "باقة المؤسسات",
      englishName: "Enterprise Package",
      price: "مخصص",
      englishPrice: "Custom",
      currency: "",
      period: "",
      englishPeriod: "",
      description: "للمؤسسات الكبيرة والفعاليات الضخمة",
      englishDescription: "For large organizations and mega events",
      features: [
        "طلبات خدمة غير محدودة",
        "حل بعلامة تجارية خاصة",
        "دعم مخصص على مدار الساعة",
        "تكاملات مخصصة",
        "تقارير متقدمة",
        "ضمانات مستوى الخدمة"
      ],
      englishFeatures: [
        "Unlimited service requests",
        "White-label solution",
        "24/7 dedicated support",
        "Custom integrations",
        "Advanced reporting",
        "SLA guarantees"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/dbfa227c-ea00-42f4-9f7e-544c2b0bde60.png" 
              alt="Supplify Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-primary">سبلايفي</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              {t('language') === 'ar' ? 'الميزات' : 'Features'}
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              {t('language') === 'ar' ? 'الأسعار' : 'Pricing'}
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              {t('language') === 'ar' ? 'عن سبلايفي' : 'About'}
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/home">
              <Button variant="ghost" size="sm">
                {t('language') === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Button>
            </Link>
            <Link to="/home">
              <Button size="sm">
                {t('language') === 'ar' ? 'ابدأ مجاناً' : 'Get Started'}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                {t('language') === 'ar' ? 
                  'المنصة الموثوقة لتجارة الفعاليات' : 
                  'The Trusted Platform for Event Commerce'
                }
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {t('language') === 'ar' ? 
                'تواصل مع مقدمي الخدمات المعتمدين في المملكة العربية السعودية واحصل على أفضل العروض لفعالياتك' :
                'Connect with certified service providers across Saudi Arabia and get the best offers for your events'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/home">
                <Button size="lg" className="px-8 py-4 text-lg font-semibold shadow-lg">
                  {t('language') === 'ar' ? 'ابدأ مجاناً' : 'Start Free Trial'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2">
                <Play className="mr-2 h-5 w-5" />
                {t('language') === 'ar' ? 'شاهد العرض' : 'Watch Demo'}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('language') === 'ar' ? stat.label : stat.englishLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('language') === 'ar' ? 'لماذا تختار سبلايفي؟' : 'Why Choose Supplify?'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('language') === 'ar' ? 
                'نقدم حلولاً متكاملة تجعل تنظيم فعالياتك أسهل وأكثر احترافية' : 
                'We provide integrated solutions to make organizing your events easier and more professional'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    {t('language') === 'ar' ? feature.title : feature.englishTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {t('language') === 'ar' ? feature.description : feature.englishDescription}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('language') === 'ar' ? 'اختر الباقة المناسبة لك' : 'Choose Your Perfect Plan'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('language') === 'ar' ? 
                'باقات مرنة تناسب جميع أحجام الأعمال في المملكة العربية السعودية' : 
                'Flexible packages suitable for all business sizes in Saudi Arabia'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative group ${plan.popular ? 'ring-2 ring-primary scale-105 shadow-xl' : 'hover:shadow-lg'} transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      {t('language') === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-xl font-bold mb-4">
                    {t('language') === 'ar' ? plan.name : plan.englishName}
                  </CardTitle>
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-primary">
                        {t('language') === 'ar' ? plan.price : (plan.englishPrice || plan.price)}
                      </span>
                      <span className="text-muted-foreground text-lg">{plan.currency}</span>
                    </div>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        {t('language') === 'ar' ? plan.period : plan.englishPeriod}
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-base">
                    {t('language') === 'ar' ? plan.description : plan.englishDescription}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {(t('language') === 'ar' ? plan.features : plan.englishFeatures).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-lime shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/home">
                    <Button 
                      className={`w-full py-3 ${plan.popular ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.price === 'مخصص' || plan.price === 'Custom' ? 
                        (t('language') === 'ar' ? 'تواصل معنا' : 'Contact Sales') : 
                        (t('language') === 'ar' ? 'ابدأ الآن' : 'Get Started')
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
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-accent"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('language') === 'ar' ? 'جاهز لتطوير فعالياتك؟' : 'Ready to Transform Your Events?'}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {t('language') === 'ar' ? 
              'انضم إلى آلاف الشركات التي تستخدم سبلايفي في المملكة العربية السعودية' : 
              'Join thousands of companies already using Supplify in Saudi Arabia'
            }
          </p>
          <Link to="/home">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg shadow-xl">
              {t('language') === 'ar' ? 'ابدأ تجربتك المجانية' : 'Start Your Free Trial'} 
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-card border-t py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/lovable-uploads/dbfa227c-ea00-42f4-9f7e-544c2b0bde60.png" 
                  alt="Supplify Logo" 
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold text-primary">سبلايفي</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md leading-relaxed">
                {t('language') === 'ar' ? 
                  'المنصة الرائدة في المملكة العربية السعودية لربط منظمي الفعاليات مع مقدمي الخدمات المعتمدين.' : 
                  'The leading platform in Saudi Arabia connecting event organizers with certified service providers.'
                }
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-foreground">
                {t('language') === 'ar' ? 'الشركة' : 'Company'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">
                  {t('language') === 'ar' ? 'عن سبلايفي' : 'About Supplify'}
                </a></li>
                <li><a href="#" className="hover:text-primary transition-colors">
                  {t('language') === 'ar' ? 'الوظائف' : 'Careers'}
                </a></li>
                <li><a href="#" className="hover:text-primary transition-colors">
                  {t('language') === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                </a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-foreground">
                {t('language') === 'ar' ? 'الدعم' : 'Support'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">
                  {t('language') === 'ar' ? 'مركز المساعدة' : 'Help Center'}
                </a></li>
                <li><a href="#" className="hover:text-primary transition-colors">
                  {t('language') === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                </a></li>
                <li><a href="#" className="hover:text-primary transition-colors">
                  {t('language') === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center text-muted-foreground">
            <p>
              {t('language') === 'ar' ? 
                '© ٢٠٢٤ سبلايفي. جميع الحقوق محفوظة. | المملكة العربية السعودية' : 
                '© 2024 Supplify. All rights reserved. | Saudi Arabia'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, ArrowRight, Users, Shield, Zap, Award, TrendingUp, Clock, Star, Play, ChevronDown, Building2, Calendar, CheckCircle, BarChart3, HeartHandshake, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Landing = () => {
  const { t, language } = useLanguage();

  const impactStats = [
    { 
      number: "500+", 
      label: "مقدم خدمة معتمد", 
      englishLabel: "Certified Providers",
      icon: Shield,
      description: "محترفون معتمدون",
      englishDescription: "Verified professionals"
    },
    { 
      number: "10,000+", 
      label: "فعالية ناجحة", 
      englishLabel: "Successful Events",
      icon: Calendar,
      description: "فعاليات منجزة بتميز",
      englishDescription: "Events delivered with excellence"
    },
    { 
      number: "13", 
      label: "منطقة في المملكة", 
      englishLabel: "Regions in KSA",
      icon: Building2,
      description: "تغطية شاملة",
      englishDescription: "Complete coverage"
    },
    { 
      number: "98%", 
      label: "رضا العملاء", 
      englishLabel: "Client Satisfaction",
      icon: HeartHandshake,
      description: "تقييمات استثنائية",
      englishDescription: "Exceptional ratings"
    }
  ];

  const platformAdvantages = [
    { 
      icon: Zap, 
      title: "ربط فوري ذكي", 
      description: "خوارزمية متطورة تربطك بأفضل مقدمي الخدمات في دقائق بناءً على احتياجاتك ومتطلبات فعاليتك",
      englishTitle: "Instant Smart Matching",
      englishDescription: "Advanced algorithm connects you with the best service providers in minutes based on your event needs and requirements",
      metric: "أقل من 5 دقائق",
      englishMetric: "Under 5 minutes"
    },
    { 
      icon: Shield, 
      title: "ضمان الجودة والأمان", 
      description: "جميع مقدمي الخدمات مُتحققون ومعتمدون مع ضمانات مالية وقانونية شاملة لحماية استثمارك",
      englishTitle: "Quality & Security Guarantee",
      englishDescription: "All service providers are verified and certified with comprehensive financial and legal guarantees to protect your investment",
      metric: "100% مضمون",
      englishMetric: "100% Guaranteed"
    },
    { 
      icon: BarChart3, 
      title: "تحليلات وأداء متقدم", 
      description: "رؤى تحليلية عميقة وتقارير أداء تساعدك في اتخاذ قرارات مدروسة وتحسين نتائج فعالياتك القادمة",
      englishTitle: "Advanced Analytics & Performance",
      englishDescription: "Deep analytical insights and performance reports help you make informed decisions and improve your future events",
      metric: "رؤى حقيقية",
      englishMetric: "Real insights"
    },
    { 
      icon: Award, 
      title: "شبكة نخبة متخصصة", 
      description: "وصول حصري لشبكة من أفضل المتخصصين في صناعة الفعاليات مع خبرات مثبتة وسجل حافل بالنجاحات",
      englishTitle: "Elite Specialist Network",
      englishDescription: "Exclusive access to a network of top event industry specialists with proven expertise and successful track records",
      metric: "نخبة مُتخصصة",
      englishMetric: "Elite specialists"
    }
  ];

  const pricingPlans = [
    {
      name: "استكشف مجاناً",
      englishName: "Explore Free",
      price: "0",
      currency: "ر.س",
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
      currency: "ر.س",
      period: "/شهر",
      englishPeriod: "/month",
      description: "حلول متكاملة للشركات النامية وطموحاتها",
      englishDescription: "Integrated solutions for growing businesses and their ambitions",
      features: [
        "حتى 8 طلبات خدمة شهرياً",
        "أولوية في المطابقة الذكية",
        "دعم فني متخصص",
        "تقارير أداء ربع سنوية (QPR)",
        "رؤى تحليلية للنمو",
        "ورش عمل تطويرية"
      ],
      englishFeatures: [
        "Up to 8 service requests per month",
        "Priority smart matching",
        "Specialist technical support",
        "Quarterly Performance Report (QPR)",
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
      currency: "ر.س",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Navigation */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/b443f385-9fd2-4ecc-8763-b6ed9bd406f8.png" 
              alt="Supplify Logo" 
              className="h-12 w-auto"
            />
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#platform" className="text-muted-foreground hover:text-primary transition-colors story-link">
              {t('language') === 'ar' ? 'المنصة' : 'Platform'}
            </a>
            <a href="#solutions" className="text-muted-foreground hover:text-primary transition-colors story-link">
              {t('language') === 'ar' ? 'الحلول' : 'Solutions'}
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors story-link">
              {t('language') === 'ar' ? 'الأسعار' : 'Pricing'}
            </a>
            <a href="#impact" className="text-muted-foreground hover:text-primary transition-colors story-link">
              {t('language') === 'ar' ? 'التأثير' : 'Impact'}
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/home">
              <Button variant="ghost" size="sm" className="hover-scale">
                {t('language') === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Button>
            </Link>
            <Link to="/home">
              <Button size="sm" className="hover-scale bg-gradient-to-r from-primary to-accent">
                {t('language') === 'ar' ? 'ابدأ مجاناً' : 'Start Free'}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Revolutionary Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-lime/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {language === 'ar' ? 'ثورة في عالم تنظيم الفعاليات' : 'Revolutionizing Event Organization'}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-primary via-accent to-lime bg-clip-text text-transparent">
                {language === 'ar' ? 'مستقبل تجارة الفعاليات' : 'The Future of Event Commerce'}
              </span>
              <br />
              <span className="text-foreground/80 text-3xl md:text-4xl font-normal">
                {language === 'ar' ? 'يبدأ هنا' : 'Starts Here'}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-200">
              {language === 'ar' ? 
                'منصة ذكية تعيد تعريف كيفية ربط منظمي الفعاليات بمقدمي الخدمات المتميزين في المملكة العربية السعودية' :
                'An intelligent platform redefining how event organizers connect with exceptional service providers across Saudi Arabia'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in delay-300">
              <Link to="/home">
                <Button size="lg" className="px-10 py-5 text-lg font-semibold shadow-xl hover-scale bg-gradient-to-r from-primary to-accent">
                  {t('language') === 'ar' ? 'ابدأ رحلتك مجاناً' : 'Start Your Journey Free'}
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-10 py-5 text-lg border-2 hover-scale">
                <Play className="mr-2 h-6 w-6" />
                {t('language') === 'ar' ? 'شاهد التجربة' : 'Watch Experience'}
              </Button>
            </div>

            {/* Enhanced Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in delay-500">
              {impactStats.map((stat, index) => (
                <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover-scale">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-sm font-medium text-foreground mb-1">
                      {t('language') === 'ar' ? stat.label : stat.englishLabel}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('language') === 'ar' ? stat.description : stat.englishDescription}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Advantages Section */}
      <section id="platform" className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-6 py-2 mb-6">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {t('language') === 'ar' ? 'تقنية متطورة' : 'Advanced Technology'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('language') === 'ar' ? 'لماذا سبلايفي هو الخيار الأذكى؟' : 'Why is Supplify the Smartest Choice?'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('language') === 'ar' ? 
                'نجمع بين الذكاء الاصطناعي والخبرة البشرية لنقدم تجربة استثنائية تحول رؤيتك لفعاليتك إلى واقع مذهل' : 
                'We combine artificial intelligence with human expertise to deliver an exceptional experience that transforms your event vision into stunning reality'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {platformAdvantages.map((advantage, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                      <advantage.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {t('language') === 'ar' ? advantage.title : advantage.englishTitle}
                      </CardTitle>
                      <div className="inline-flex items-center gap-2 bg-lime/10 rounded-full px-3 py-1">
                        <CheckCircle className="h-3 w-3 text-lime" />
                        <span className="text-xs font-medium text-lime">
                          {t('language') === 'ar' ? advantage.metric : advantage.englishMetric}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {t('language') === 'ar' ? advantage.description : advantage.englishDescription}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-lime/10 rounded-full px-6 py-2 mb-6">
              <Star className="h-4 w-4 text-lime" />
              <span className="text-sm font-medium text-lime">
                {t('language') === 'ar' ? 'حلول مرنة' : 'Flexible Solutions'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('language') === 'ar' ? 'استثمر في نجاح فعالياتك' : 'Invest in Your Events Success'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('language') === 'ar' ? 
                'باقات مصممة بعناية لتناسب رحلتك في عالم الفعاليات، من البداية المتواضعة إلى القمم العالية' : 
                'Carefully designed packages to suit your journey in the events world, from humble beginnings to great heights'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
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
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t('language') === 'ar' ? plan.price : (plan.englishPrice || plan.price)}
                      </span>
                      <span className="text-muted-foreground text-lg">{plan.currency}</span>
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

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-lime"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('language') === 'ar' ? 'هل أنت مستعد لتحويل فعالياتك؟' : 'Are You Ready to Transform Your Events?'}
            </h2>
            <p className="text-xl md:text-2xl opacity-90 mb-12 leading-relaxed">
              {t('language') === 'ar' ? 
                'انضم إلى آلاف الشركات الرائدة التي اختارت سبلايفي لتحقيق أحلامها في عالم الفعاليات' : 
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
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10 py-5 text-lg hover-scale">
                {t('language') === 'ar' ? 'تحدث مع خبير' : 'Talk to Expert'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer id="impact" className="bg-card border-t py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/lovable-uploads/b443f385-9fd2-4ecc-8763-b6ed9bd406f8.png" 
                  alt="Supplify Logo" 
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-muted-foreground mb-6 max-w-md leading-relaxed text-lg">
                {t('language') === 'ar' ? 
                  'نعيد تشكيل مستقبل صناعة الفعاليات في المملكة العربية السعودية من خلال تقنيات مبتكرة وشراكات استراتيجية.' : 
                  'Reshaping the future of the events industry in Saudi Arabia through innovative technologies and strategic partnerships.'
                }
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="hover-scale">
                  {t('language') === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </Button>
                <Button variant="ghost" size="sm" className="hover-scale">
                  {t('language') === 'ar' ? 'المدونة' : 'Blog'}
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-lg">
                {t('language') === 'ar' ? 'الحلول' : 'Solutions'}
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors story-link">{t('language') === 'ar' ? 'للشركات' : 'For Businesses'}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors story-link">{t('language') === 'ar' ? 'لمقدمي الخدمات' : 'For Providers'}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors story-link">{t('language') === 'ar' ? 'للمؤسسات' : 'For Enterprises'}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-lg">
                {t('language') === 'ar' ? 'الدعم' : 'Support'}
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors story-link">{t('language') === 'ar' ? 'مركز المساعدة' : 'Help Center'}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors story-link">{t('language') === 'ar' ? 'الوثائق' : 'Documentation'}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors story-link">{t('language') === 'ar' ? 'حالة النظام' : 'System Status'}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {t('language') === 'ar' ? 
                '© 2024 سبلايفي. جميع الحقوق محفوظة.' : 
                '© 2024 Supplify. All rights reserved.'
              }
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">{t('language') === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
              <a href="#" className="hover:text-primary transition-colors">{t('language') === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, ArrowRight, Users, Shield, Zap, Award, TrendingUp, Clock, Star, Play, ChevronDown, Building2, Calendar, CheckCircle, BarChart3, HeartHandshake, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

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


  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Navigation */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/b443f385-9fd2-4ecc-8763-b6ed9bd406f8.png" 
              alt="Supplify Logo" 
              className="h-16 w-auto hover:scale-105 transition-transform"
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#platform" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors story-link">
              <Zap className="h-4 w-4" />
              {t('language') === 'ar' ? 'المنصة' : 'Platform'}
            </a>
            <a href="#benefits" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors story-link">
              <TrendingUp className="h-4 w-4" />
              {t('language') === 'ar' ? 'المزايا' : 'Benefits'}
            </a>
            <a href="#services" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors story-link">
              <Building2 className="h-4 w-4" />
              {t('language') === 'ar' ? 'خدماتنا' : 'Our Services'}
            </a>
            <a href="#uvp" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors story-link">
              <Sparkles className="h-4 w-4" />
              {t('language') === 'ar' ? 'ما يميزنا' : 'What Makes Us Unique'}
            </a>
            <Link to="/pricing" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors story-link">
              <Star className="h-4 w-4" />
              {t('language') === 'ar' ? 'الأسعار' : 'Pricing'}
            </Link>
          </nav>
          
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

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-lime/10 rounded-full px-6 py-2 mb-6">
              <Star className="h-4 w-4 text-lime" />
              <span className="text-sm font-medium text-lime">
                {t('language') === 'ar' ? 'المزايا والفوائد' : 'Benefits & Advantages'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('language') === 'ar' ? 'لماذا تختار سبلايفي؟' : 'Why Choose Supplify?'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('language') === 'ar' ? 
                'منصة شاملة تلبي احتياجات الإدارة والمشتريات بكفاءة عالية' : 
                'A comprehensive platform that efficiently meets management and procurement needs'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Management Benefits */}
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">
                  {t('language') === 'ar' ? 'للإدارة' : 'For Management'}
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'الرؤية الواضحة' : 'Visibility'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'رؤية شاملة لجميع العمليات والمشاريع' : 'Complete visibility of all operations and projects'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'رؤى تحليلية' : 'Insights'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'تحليلات متقدمة لاتخاذ قرارات مدروسة' : 'Advanced analytics for informed decision making'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-lime/10 p-3 rounded-lg">
                    <Award className="h-6 w-6 text-lime" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'الأداء المتميز' : 'Performance'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'مراقبة الأداء وتحسين النتائج' : 'Performance monitoring and result optimization'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'المشتريات القابلة للتتبع' : 'Trackable Procurement'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'تتبع كامل لعمليات الشراء والتوريد' : 'Complete tracking of purchasing and supply operations'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'إدارة المخاطر' : 'Risk Management'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'تقييم وإدارة المخاطر بشكل استباقي' : 'Proactive risk assessment and management'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-lime/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-lime" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'تعاون الفرق' : 'Team Collaboration'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'تحسين التعاون والتواصل بين الفرق' : 'Enhanced team collaboration and communication'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'إدارة الوقت' : 'Time Management'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'تحسين إدارة الوقت والجدولة' : 'Improved time management and scheduling'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Procurement Benefits */}
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">
                  {t('language') === 'ar' ? 'للمشتريات' : 'For Procurement'}
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'الكفاءة' : 'Efficiency'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'تبسيط العمليات وتوفير الوقت' : 'Streamlined processes and time savings'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'الامتثال' : 'Compliance'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'ضمان الامتثال للمعايير والقوانين' : 'Ensuring compliance with standards and regulations'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-lime/10 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-lime" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'التحكم' : 'Control'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'سيطرة كاملة على عمليات الشراء' : 'Complete control over purchasing operations'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <Star className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'أخطاء أقل' : 'Less Errors'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'تقليل الأخطاء وزيادة الدقة' : 'Reduced errors and increased accuracy'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'التوريد السريع' : 'Fast Supply'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'توريد سريع وموثوق' : 'Fast and reliable supply'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-lime/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-lime" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'قاعدة موردين ضخمة' : 'Huge Suppliers Database'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'وصول لآلاف الموردين المعتمدين' : 'Access to thousands of certified suppliers'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-card/70 hover:bg-card transition-colors">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t('language') === 'ar' ? 'أفضل سعر في السوق' : 'Best Price in Market'}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('language') === 'ar' ? 'الحصول على أفضل الأسعار التنافسية' : 'Get the best competitive prices'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Cover Section */}
      <section id="services" className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t('language') === 'ar' ? 'خدماتنا' : 'Our Services'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('language') === 'ar' ? 'ما نغطيه' : 'What We Cover'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('language') === 'ar' ? 
                'خدمات شاملة تغطي جميع احتياجات الفعاليات والعلاقات العامة' : 
                'Comprehensive services covering all event and public relations needs'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'اللوجستيات', english: 'Logistics', icon: '🚚' },
              { name: 'العمالة', english: 'Manpower', icon: '👥' },
              { name: 'الطباعة', english: 'Printing', icon: '🖨️' },
              { name: 'الأثاث', english: 'Furniture', icon: '🪑' },
              { name: 'أجنحة المعارض', english: 'Booth Stands', icon: '🏢' },
              { name: 'المعدات', english: 'Equipment', icon: '⚙️' },
              { name: 'الهدايا التذكارية', english: 'Giveaways', icon: '🎁' },
              { name: 'التموين', english: 'Catering', icon: '🍽️' },
            ].map((service, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 hover-scale bg-card/70">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-semibold mb-2">
                  {t('language') === 'ar' ? service.name : service.english}
                </h3>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground">
              {t('language') === 'ar' ? 
                'وكل ما يتعلق بالعلاقات العامة وإدارة الفعاليات وأكثر' : 
                'And everything related to PR and Event management and more'
              }
            </p>
          </div>
        </div>
      </section>

      {/* UVP Section */}
      <section id="uvp" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-6 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {t('language') === 'ar' ? 'مقترحات القيمة الفريدة' : 'Unique Value Propositions'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('language') === 'ar' ? 'ما يميزنا' : 'What Makes Us Unique'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('language') === 'ar' ? 
                'مقترحات قيمة فريدة تجعلنا الخيار الأول في صناعة الفعاليات' : 
                'Unique value propositions that make us the first choice in the events industry'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {t('language') === 'ar' ? 'سوق مركزي' : 'Centralized Marketplace'}
              </h3>
              <p className="text-muted-foreground">
                {t('language') === 'ar' ? 
                  'منصة موحدة تجمع جميع مقدمي الخدمات في مكان واحد' : 
                  'Unified platform bringing all service providers together in one place'
                }
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-br from-accent/5 to-lime/5">
              <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {t('language') === 'ar' ? 'تحسين التكاليف' : 'Cost Optimization'}
              </h3>
              <p className="text-muted-foreground">
                {t('language') === 'ar' ? 
                  'حلول ذكية لتقليل التكاليف وزيادة العائد على الاستثمار' : 
                  'Smart solutions to reduce costs and increase return on investment'
                }
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-br from-lime/5 to-primary/5">
              <div className="bg-lime/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-8 w-8 text-lime" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {t('language') === 'ar' ? 'شفافية المشتريات' : 'Procurement Transparency'}
              </h3>
              <p className="text-muted-foreground">
                {t('language') === 'ar' ? 
                  'شفافية كاملة في جميع عمليات الشراء والتوريد' : 
                  'Complete transparency in all purchasing and supply operations'
                }
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {t('language') === 'ar' ? 'موردون موثوقون' : 'Trusted Suppliers'}
              </h3>
              <p className="text-muted-foreground">
                {t('language') === 'ar' ? 
                  'شبكة من الموردين المعتمدين والموثوقين' : 
                  'Network of certified and trusted suppliers'
                }
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-br from-accent/5 to-lime/5">
              <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {t('language') === 'ar' ? 'توفير الوقت' : 'Time Savings'}
              </h3>
              <p className="text-muted-foreground">
                {t('language') === 'ar' ? 
                  'تقليل الوقت المطلوب لإنجاز المشاريع بشكل كبير' : 
                  'Significantly reduce time required for project completion'
                }
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-br from-lime/5 to-primary/5">
              <div className="bg-lime/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-lime" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {t('language') === 'ar' ? 'والمزيد' : 'And More'}
              </h3>
              <p className="text-muted-foreground">
                {t('language') === 'ar' ? 
                  'ميزات ومقترحات قيمة إضافية نكتشفها معاً' : 
                  'Additional features and value propositions we discover together'
                }
              </p>
            </Card>
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
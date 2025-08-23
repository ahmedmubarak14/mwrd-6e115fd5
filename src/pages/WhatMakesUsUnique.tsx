import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptionalAuth } from "@/contexts/useOptionalAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Brain, Shield, Zap, Users, TrendingUp, Award, CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { DemoButton } from "@/components/demo/DemoButton";

export const WhatMakesUsUnique = () => {
  const { t, language } = useLanguage();
  const authContext = useOptionalAuth();
  const user = authContext?.user;
  const userProfile = authContext?.userProfile;
  const loading = authContext?.loading;
  const isRTL = language === 'ar';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] flex items-center justify-center">
        <LoadingSpinner size="lg" text={language === 'ar' ? 'جاري التحميل...' : 'Loading...'} />
      </div>
    );
  }

  const uniqueFeatures = [
    {
      icon: Brain,
      titleEn: "AI-Powered Smart Matching",
      titleAr: "مطابقة ذكية بالذكاء الاصطناعي",
      descEn: "Our advanced AI algorithm analyzes requirements and matches you with the perfect vendors instantly.",
      descAr: "خوارزمية الذكاء الاصطناعي المتقدمة تحلل المتطلبات وتطابقك مع الموردين المثاليين فوراً."
    },
    {
      icon: Shield,
      titleEn: "MENA-First Security",
      titleAr: "أمان يركز على منطقة الشرق الأوسط",
      descEn: "Built specifically for MENA regulations with enterprise-grade security and local compliance.",
      descAr: "مصمم خصيصاً للوائح الشرق الأوسط مع أمان على مستوى المؤسسات والامتثال المحلي."
    },
    {
      icon: Zap,
      titleEn: "Lightning-Fast RFQ System",
      titleAr: "نظام طلب عروض الأسعار فائق السرعة",
      descEn: "From request to quotation in minutes, not weeks. Our streamlined process accelerates procurement.",
      descAr: "من الطلب إلى عرض السعر في دقائق وليس أسابيع. عمليتنا المبسطة تُسرّع المشتريات."
    },
    {
      icon: Users,
      titleEn: "Verified Vendor Network",
      titleAr: "شبكة موردين معتمدة",
      descEn: "Every vendor undergoes strict verification - financial, legal, and quality checks before joining.",
      descAr: "كل مورد يخضع لتحقق صارم - فحوصات مالية وقانونية وجودة قبل الانضمام."
    },
    {
      icon: TrendingUp,
      titleEn: "Real-Time Analytics & Insights",
      titleAr: "تحليلات ورؤى في الوقت الفعلي",
      descEn: "Advanced dashboards with predictive analytics to optimize your procurement strategy.",
      descAr: "لوحات تحكم متقدمة مع تحليلات تنبؤية لتحسين استراتيجية المشتريات."
    },
    {
      icon: Award,
      titleEn: "Industry-Specific Solutions",
      titleAr: "حلول خاصة بكل صناعة",
      descEn: "Tailored workflows and features for construction, manufacturing, healthcare, and more.",
      descAr: "سير عمل وميزات مخصصة للبناء والتصنيع والرعاية الصحية وأكثر."
    }
  ];

  const differentiators = [
    {
      titleEn: "15-Minute Onboarding",
      titleAr: "إعداد في 15 دقيقة",
      descEn: "While competitors take weeks, we get you operational in just 15 minutes.",
      descAr: "بينما يحتاج المنافسون أسابيع، نجعلك تعمل في 15 دقيقة فقط."
    },
    {
      titleEn: "Arabic-First Design",
      titleAr: "تصميم يضع العربية أولاً",
      descEn: "Native RTL support with Arabic being the primary language, not an afterthought.",
      descAr: "دعم أصلي للكتابة من اليمين لليسار مع كون العربية اللغة الأساسية وليس مجرد إضافة."
    },
    {
      titleEn: "Local Payment Integration",
      titleAr: "تكامل مدفوعات محلية",
      descEn: "Seamless integration with SADAD, mada, and other regional payment systems.",
      descAr: "تكامل سلس مع سداد وماداَ وأنظمة الدفع الإقليمية الأخرى."
    },
    {
      titleEn: "Cultural Understanding",
      titleAr: "فهم ثقافي",
      descEn: "Built by locals who understand MENA business culture and practices.",
      descAr: "مبني من قبل أشخاص محليين يفهمون ثقافة وممارسات الأعمال في الشرق الأوسط."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C]">
      {/* Ultra-Modern Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-filter backdrop-blur-xl border-b border-white/10 bg-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className={`${language === 'ar' ? 'order-3' : 'order-1'}`}>
            <Link to={user && userProfile ? "/dashboard" : "/"} className="flex items-center gap-3 group">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo" 
                className="h-14 w-auto transition-all duration-500 group-hover:scale-110 drop-shadow-2xl" 
              />
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className={`hidden lg:flex items-center gap-6 ${language === 'ar' ? 'order-1' : 'order-2'}`}>
            <Link to="/why-start-with-mwrd" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
              {language === 'ar' ? 'لماذا نبدأ معنا' : 'Why Start with Us'}
            </Link>
            <span className="text-white transition-colors text-sm font-bold">
              {language === 'ar' ? 'ما يميزنا' : 'What Makes Us Unique'}
            </span>
            <Link to="/why-move-to-mwrd" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
              {language === 'ar' ? 'لماذا الانتقال إلينا' : 'Why Move to Us'}
            </Link>
            <Link to="/pricing" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
              {language === 'ar' ? 'الأسعار' : 'Pricing'}
            </Link>
          </nav>
          
          <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse order-2' : 'order-3'}`}>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            {user && userProfile ? (
              <Link to="/dashboard" className="hidden md:block">
                <Button size="lg" className="px-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/10 border border-white/30 text-white backdrop-blur-20">
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" className="hidden md:block">
                  <Button variant="ghost" size="lg" className="px-6 bg-white/5 border border-white/20 text-white transition-all duration-300 backdrop-blur-15">
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </Link>
                <Link to="/auth" className="hidden md:block">
                  <Button size="lg" className="px-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/10 border border-white/30 text-white backdrop-blur-20">
                    {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                  </Button>
                </Link>
              </>
            )}
            <MobileNavigation />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, #004F54 2px, transparent 2px)`, backgroundSize: '50px 50px' }}></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/30 backdrop-blur-20 rounded-full px-6 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                {isRTL ? 'مبتكر ومختلف' : 'Innovative & Different'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white">
              {isRTL ? 'ما يجعل مورد منصة فريدة ومتميزة' : 'What Makes MWRD Uniquely Powerful'}
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              {isRTL ? 
                'ليس مجرد منصة أخرى للمشتريات. مورد حل مبتكر مصمم خصيصاً لتحديات وفرص السوق في منطقة الشرق الأوسط.' :
                'Not just another procurement platform. MWRD is an innovative solution designed specifically for the challenges and opportunities of the Middle East market.'
              }
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link to="/home">
                <Button size="lg" className="px-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/10 border border-white/30 text-white backdrop-blur-20">
                  {isRTL ? 'اكتشف الفرق' : 'Discover the Difference'}
                </Button>
              </Link>
              <DemoButton 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 bg-white/5 border border-white/20 text-white backdrop-blur-15"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                {isRTL ? 'ميزات فريدة تجعلنا الخيار الأول' : 'Unique Features That Make Us #1'}
              </h2>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
                {isRTL ? 
                  'تقنيات متطورة وحلول مبتكرة مصممة خصيصاً لتلبية احتياجات السوق المحلية.' :
                  'Advanced technologies and innovative solutions designed specifically to meet local market needs.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {uniqueFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white/5 border border-white/20 backdrop-blur-20">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-15 mb-4 group-hover:bg-white/20 transition-colors">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white">
                      {isRTL ? feature.titleAr : feature.titleEn}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {isRTL ? feature.descAr : feature.descEn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                {isRTL ? 'لماذا نتفوق على المنافسين' : 'Why We Outperform Competitors'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {differentiators.map((diff, index) => (
                <div key={index} className="flex items-start gap-4 p-6 rounded-xl bg-white/5 border border-white/20 backdrop-blur-20 hover:shadow-lg transition-all duration-300">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-white">
                      {isRTL ? diff.titleAr : diff.titleEn}
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {isRTL ? diff.descAr : diff.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Showcase */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-cols-2' : ''}`}>
              <div className={isRTL ? 'lg:order-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  {isRTL ? 'تقنية رائدة للمستقبل' : 'Leading Technology for the Future'}
                </h2>
                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  {isRTL ? 
                    'نستخدم أحدث التقنيات لنقدم لك تجربة مشتريات لا مثيل لها، مع التركيز على السرعة والدقة والأمان.' :
                    'We use cutting-edge technology to deliver an unparalleled procurement experience, focusing on speed, accuracy, and security.'
                  }
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-white">{isRTL ? 'معالجة ذكية للطلبات بالذكاء الاصطناعي' : 'AI-powered intelligent request processing'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-white">{isRTL ? 'تحليلات تنبؤية للأسعار' : 'Predictive pricing analytics'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-white">{isRTL ? 'أتمتة كاملة لسير العمل' : 'Complete workflow automation'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-white">{isRTL ? 'تكاملات مخصصة مع أنظمة ERP' : 'Custom ERP system integrations'}</span>
                  </div>
                </div>
              </div>
              
              <div className={isRTL ? 'lg:order-1' : ''}>
                  <div className="relative">
                    <div className="bg-white/5 border border-white/20 backdrop-blur-20 rounded-2xl p-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/20 backdrop-blur-20 rounded-lg p-4 text-center">
                          <Brain className="h-8 w-8 text-white mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white">95%</div>
                          <div className="text-sm text-white/70">
                            {isRTL ? 'دقة المطابقة' : 'Match Accuracy'}
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/20 backdrop-blur-20 rounded-lg p-4 text-center">
                          <Zap className="h-8 w-8 text-white mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white">15min</div>
                          <div className="text-sm text-white/70">
                            {isRTL ? 'وقت الاستجابة' : 'Response Time'}
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/20 backdrop-blur-20 rounded-lg p-4 text-center">
                          <Shield className="h-8 w-8 text-white mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white">99.9%</div>
                          <div className="text-sm text-white/70">
                            {isRTL ? 'وقت التشغيل' : 'Uptime'}
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/20 backdrop-blur-20 rounded-lg p-4 text-center">
                          <Users className="h-8 w-8 text-white mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white">5000+</div>
                          <div className="text-sm text-white/70">
                            {isRTL ? 'مورد معتمد' : 'Verified Vendors'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden bg-blackChasm/50">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, #004F54 2px, transparent 2px)`, backgroundSize: '50px 50px' }}></div>
        </div>
        <div className="container mx-auto text-center relative z-10 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {isRTL ? 'اكتشف الفرق بنفسك' : 'Experience the Difference Yourself'}
            </h2>
            <p className="text-xl mb-8 leading-relaxed text-white/90">
              {isRTL ? 
                'انضم إلى آلاف الشركات التي اختارت مورد لتحويل عمليات المشتريات لديها.' :
                'Join thousands of companies that chose MWRD to transform their procurement operations.'
              }
            </p>
            <Link to="/home">
              <Button size="lg" className="px-8 py-3 bg-white/10 border border-white/30 text-white backdrop-blur-20 hover:bg-white/20 transition-all duration-300">
                {isRTL ? 'ابدأ التجربة المجانية' : 'Start Free Trial'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
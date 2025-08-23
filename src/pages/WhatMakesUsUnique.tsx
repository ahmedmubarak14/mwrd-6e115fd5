import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Brain, Shield, Zap, Users, TrendingUp, Award, CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { DemoButton } from "@/components/demo/DemoButton";

export const WhatMakesUsUnique = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const uniqueFeatures = [
    {
      icon: Brain,
      titleEn: "AI-Powered Smart Matching",
      titleAr: "مطابقة ذكية بالذكاء الاصطناعي",
      descEn: "Our advanced AI algorithm analyzes requirements and matches you with the perfect suppliers instantly.",
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
      titleEn: "Verified Supplier Network",
      titleAr: "شبكة موردين معتمدة",
      descEn: "Every supplier undergoes strict verification - financial, legal, and quality checks before joining.",
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo - positioned based on language */}
          <div className={`${isRTL ? 'order-2' : 'order-1'}`}>
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo"
                className="h-16 w-auto hover:scale-105 transition-transform"
              />
            </Link>
          </div>
          
          {/* Actions - positioned based on language */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse order-1' : 'order-2'}`}>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <Link to="/home" className="hidden md:block">
              <Button variant="ghost" size="sm" className="hover-scale">
                {isRTL ? 'تسجيل الدخول' : 'Login'}
              </Button>
            </Link>
            <Link to="/home" className="hidden md:block">
              <Button size="sm" className="hover-scale bg-gradient-to-r from-primary to-accent">
                {isRTL ? 'ابدأ مجاناً' : 'Start Free'}
              </Button>
            </Link>
            <MobileNavigation />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime/10 via-primary/5 to-accent/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-lime/10 rounded-full px-6 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-lime" />
              <span className="text-sm font-medium text-lime">
                {isRTL ? 'مبتكر ومختلف' : 'Innovative & Different'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {isRTL ? 'ما يجعل مورد منصة فريدة ومتميزة' : 'What Makes MWRD Uniquely Powerful'}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              {isRTL ? 
                'ليس مجرد منصة أخرى للمشتريات. مورد حل مبتكر مصمم خصيصاً لتحديات وفرص السوق في منطقة الشرق الأوسط.' :
                'Not just another procurement platform. MWRD is an innovative solution designed specifically for the challenges and opportunities of the Middle East market.'
              }
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link to="/home">
                <Button size="lg" className="bg-gradient-to-r from-lime to-primary hover:from-lime/90 hover:to-primary/90 text-white px-8 py-3 hover-scale">
                  {isRTL ? 'اكتشف الفرق' : 'Discover the Difference'}
                </Button>
              </Link>
              <DemoButton 
                variant="outline" 
                size="lg" 
                className="px-8 py-3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isRTL ? 'ميزات فريدة تجعلنا الخيار الأول' : 'Unique Features That Make Us #1'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {isRTL ? 
                  'تقنيات متطورة وحلول مبتكرة مصممة خصيصاً لتلبية احتياجات السوق المحلية.' :
                  'Advanced technologies and innovative solutions designed specifically to meet local market needs.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {uniqueFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover-scale">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary/10 to-lime/10 mb-4 group-hover:from-primary/20 group-hover:to-lime/20 transition-colors">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">
                      {isRTL ? feature.titleAr : feature.titleEn}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
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
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isRTL ? 'لماذا نتفوق على المنافسين' : 'Why We Outperform Competitors'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {differentiators.map((diff, index) => (
                <div key={index} className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-card to-accent/5 hover:shadow-lg transition-all duration-300">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-lime" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {isRTL ? diff.titleAr : diff.titleEn}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
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
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-cols-2' : ''}`}>
              <div className={isRTL ? 'lg:order-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {isRTL ? 'تقنية رائدة للمستقبل' : 'Leading Technology for the Future'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {isRTL ? 
                    'نستخدم أحدث التقنيات لنقدم لك تجربة مشتريات لا مثيل لها، مع التركيز على السرعة والدقة والأمان.' :
                    'We use cutting-edge technology to deliver an unparalleled procurement experience, focusing on speed, accuracy, and security.'
                  }
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{isRTL ? 'معالجة ذكية للطلبات بالذكاء الاصطناعي' : 'AI-powered intelligent request processing'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{isRTL ? 'تحليلات تنبؤية للأسعار' : 'Predictive pricing analytics'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{isRTL ? 'أتمتة كاملة لسير العمل' : 'Complete workflow automation'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{isRTL ? 'تكاملات مخصصة مع أنظمة ERP' : 'Custom ERP system integrations'}</span>
                  </div>
                </div>
              </div>
              
              <div className={isRTL ? 'lg:order-1' : ''}>
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/10 to-lime/10 rounded-2xl p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-card/80 rounded-lg p-4 text-center backdrop-blur-sm">
                        <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-primary">95%</div>
                        <div className="text-sm text-muted-foreground">
                          {isRTL ? 'دقة المطابقة' : 'Match Accuracy'}
                        </div>
                      </div>
                      <div className="bg-card/80 rounded-lg p-4 text-center backdrop-blur-sm">
                        <Zap className="h-8 w-8 text-accent mx-auto mb-2" />
                        <div className="text-2xl font-bold text-accent">15min</div>
                        <div className="text-sm text-muted-foreground">
                          {isRTL ? 'وقت الاستجابة' : 'Response Time'}
                        </div>
                      </div>
                      <div className="bg-card/80 rounded-lg p-4 text-center backdrop-blur-sm">
                        <Shield className="h-8 w-8 text-lime mx-auto mb-2" />
                        <div className="text-2xl font-bold text-lime">99.9%</div>
                        <div className="text-sm text-muted-foreground">
                          {isRTL ? 'وقت التشغيل' : 'Uptime'}
                        </div>
                      </div>
                      <div className="bg-card/80 rounded-lg p-4 text-center backdrop-blur-sm">
                        <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-primary">5000+</div>
                        <div className="text-sm text-muted-foreground">
                          {isRTL ? 'مورد معتمد' : 'Verified Suppliers'}
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
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-lime via-primary to-accent"></div>
        <div className="container mx-auto text-center relative z-10 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {isRTL ? 'اكتشف الفرق بنفسك' : 'Experience the Difference Yourself'}
            </h2>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              {isRTL ? 
                'انضم إلى آلاف الشركات التي اختارت مورد لتحويل عمليات المشتريات لديها.' :
                'Join thousands of companies that chose MWRD to transform their procurement operations.'
              }
            </p>
            <Link to="/home">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-primary hover:bg-white/90 hover-scale">
                {isRTL ? 'ابدأ التجربة المجانية' : 'Start Free Trial'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
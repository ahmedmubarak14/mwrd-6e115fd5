import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingCart, FileCheck, Handshake, Shield, CheckCircle, Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { DemoButton } from "@/components/demo/DemoButton";

export const WhyStartWithMWRD = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const benefits = [
    {
      icon: ShoppingCart,
      titleEn: "Centralized Purchasing",
      titleAr: "مشتريات مركزية", 
      descEn: "Manage everything in one place.",
      descAr: "إدارة كل شيء في مكان واحد."
    },
    {
      icon: FileCheck,
      titleEn: "Automated Approvals",
      titleAr: "موافقات آلية",
      descEn: "Faster, error-free approvals.",
      descAr: "موافقات أسرع وبدون أخطاء."
    },
    {
      icon: Handshake,
      titleEn: "Vendor Management", 
      titleAr: "إدارة الموردين",
      descEn: "Find and manage suppliers easily.",
      descAr: "العثور على الموردين وإدارتهم بسهولة."
    },
    {
      icon: Shield,
      titleEn: "Secure & Compliant",
      titleAr: "آمن ومتوافق",
      descEn: "Built for Saudi businesses.",
      descAr: "مصمم للشركات السعودية."
    }
  ];

  const testimonials = [
    {
      nameEn: "Ahmed Al-Rashid",
      nameAr: "أحمد الراشد",
      companyEn: "Tech Solutions Co.",
      companyAr: "شركة الحلول التقنية",
      textEn: "Supplify transformed our procurement process completely. We save 40% of our time now.",
      textAr: "غيّرت Supplify عملية المشتريات لدينا بالكامل. نوفر الآن 40% من وقتنا."
    },
    {
      nameEn: "Fatima Al-Zahra",
      nameAr: "فاطمة الزهراء", 
      companyEn: "Construction Plus",
      companyAr: "البناء بلس",
      textEn: "The automated approvals feature alone saved us thousands of hours annually.",
      textAr: "ميزة الموافقات الآلية وحدها وفرت علينا آلاف الساعات سنوياً."
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
                src="/lovable-uploads/842b99cc-446d-41b5-8de7-b9c12faa1ed9.png" 
                alt="Supplify Logo"
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-lime/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {isRTL ? 'حل ذكي للمشتريات' : 'Smart Procurement Solution'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {isRTL ? 'تبسيط المشتريات – ابدأ بذكاء مع Supplify' : 'Procurement Made Simple – Start Smart with Supplify'}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              {isRTL ? 
                'تحكم في عمليات الشراء في شركتك من خلال منصة واحدة تُسهّل إدارة الموردين والموافقات وتتبع الطلبات.' :
                'Take control of your company\'s purchasing process with one platform that simplifies supplier management, approvals, and tracking.'
              }
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link to="/home">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3 hover-scale">
                  {isRTL ? 'ابدأ مع Supplify' : 'Start with Supplify'}
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

      {/* Problem Statement Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-cols-2' : ''}`}>
              <div className={isRTL ? 'lg:order-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {isRTL ? 'المشتريات التقليدية بطيئة ومعقدة' : 'Traditional Procurement is Slow and Complex'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {isRTL ? 
                    'الموافقات اليدوية والتواصل المبعثر مع الموردين والأعمال الورقية تضيع وقتك وأموالك.' :
                    'Manual approvals, scattered supplier communication, and paperwork waste your time and money.'
                  }
                </p>
              </div>
              
              <div className={isRTL ? 'lg:order-1' : ''}>
                <div className="relative">
                  <div className="bg-gradient-to-br from-destructive/10 to-orange-500/10 rounded-2xl p-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-destructive">
                        <Clock className="h-5 w-5" />
                        <span>{isRTL ? 'موافقات تستغرق أسابيع' : 'Approvals take weeks'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-destructive">
                        <FileCheck className="h-5 w-5" />
                        <span>{isRTL ? 'أوراق متناثرة ومفقودة' : 'Scattered and lost paperwork'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-destructive">
                        <Users className="h-5 w-5" />
                        <span>{isRTL ? 'تواصل مبعثر مع الموردين' : 'Scattered supplier communication'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-cols-2' : ''}`}>
              <div className={isRTL ? 'lg:order-1' : ''}>
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-primary">
                        <CheckCircle className="h-5 w-5" />
                        <span>{isRTL ? 'مشتريات مركزية' : 'Centralized purchasing'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-primary">
                        <CheckCircle className="h-5 w-5" />
                        <span>{isRTL ? 'موافقات آلية' : 'Automated approvals'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-primary">
                        <CheckCircle className="h-5 w-5" />
                        <span>{isRTL ? 'إدارة الموردين' : 'Vendor management'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-primary">
                        <CheckCircle className="h-5 w-5" />
                        <span>{isRTL ? 'آمن ومتوافق مع اللوائح' : 'Secure & compliant'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={isRTL ? 'lg:order-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {isRTL ? 'طريقة ذكية ومركزية لإدارة المشتريات' : 'A Smarter, Centralized Way to Manage Procurement'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {isRTL ? 
                    'منصة شاملة تجمع جميع عمليات المشتريات في مكان واحد مع أتمتة ذكية للموافقات وإدارة متقدمة للموردين.' :
                    'A comprehensive platform that brings all procurement processes together with smart automation for approvals and advanced vendor management.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isRTL ? 'لماذا تبدأ الشركات مع Supplify' : 'Why Companies Start with Supplify'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover-scale">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                      <benefit.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">
                      {isRTL ? benefit.titleAr : benefit.titleEn}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {isRTL ? benefit.descAr : benefit.descEn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/home">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3 hover-scale">
                  {isRTL ? 'ابدأ رحلة المشتريات الذكية اليوم' : 'Start Your Procurement Journey Today'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isRTL ? 'موثوق من الشركات في جميع أنحاء المملكة' : 'Trusted by Businesses Across Saudi Arabia'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-lg mb-6 leading-relaxed">
                      "{isRTL ? testimonial.textAr : testimonial.textEn}"
                    </p>
                    <div>
                      <div className="font-semibold">
                        {isRTL ? testimonial.nameAr : testimonial.nameEn}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? testimonial.companyAr : testimonial.companyEn}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-lime"></div>
        <div className="container mx-auto text-center relative z-10 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {isRTL ? 'هل أنت مستعد لتبسيط المشتريات لديك؟' : 'Ready to Simplify Your Procurement?'}
            </h2>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              {isRTL ? 
                'انضم إلى مئات الشركات التي تحولت إلى إدارة مشتريات أكثر ذكاءً وفعالية.' :
                'Join hundreds of companies that have transformed to smarter, more efficient procurement management.'
              }
            </p>
            <Link to="/home">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-primary hover:bg-white/90 hover-scale">
                {isRTL ? 'ابدأ مع Supplify' : 'Get Started with Supplify'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
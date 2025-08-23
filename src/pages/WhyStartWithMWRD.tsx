import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingCart, FileCheck, Handshake, Shield, CheckCircle, Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { DemoButton } from "@/components/demo/DemoButton";
import { Footer } from "@/components/ui/layout/Footer";

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
      textEn: "MWRD transformed our procurement process completely. We save 40% of our time now.",
      textAr: "غيّرت مورد عملية المشتريات لدينا بالكامل. نوفر الآن 40% من وقتنا."
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
    <div className="min-h-screen bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C]">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-filter backdrop-blur-xl border-b border-white/10 bg-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className={`${language === 'ar' ? 'order-3' : 'order-1'}`}>
            <Link to="/" className="flex items-center gap-3 group">
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
            <Link to="/what-makes-us-unique" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
              {language === 'ar' ? 'ما يميزنا' : 'What Makes Us Unique'}
            </Link>
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
              <CheckCircle className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                {isRTL ? 'حل ذكي للمشتريات' : 'Smart Procurement Solution'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white">
              {isRTL ? 'تبسيط المشتريات – ابدأ بذكاء مع مورد' : 'Procurement Made Simple – Start Smart with MWRD'}
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              {isRTL ? 
                'تحكم في عمليات الشراء في شركتك من خلال منصة واحدة تُسهّل إدارة الموردين والموافقات وتتبع الطلبات.' :
                'Take control of your company\'s purchasing process with one platform that simplifies supplier management, approvals, and tracking.'
              }
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link to="/home">
                <Button size="lg" className="px-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/10 border border-white/30 text-white backdrop-blur-20">
                  {isRTL ? 'ابدأ مع مورد' : 'Start with MWRD'}
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

      {/* Problem Statement Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-cols-2' : ''}`}>
              <div className={isRTL ? 'lg:order-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  {isRTL ? 'المشتريات التقليدية بطيئة ومعقدة' : 'Traditional Procurement is Slow and Complex'}
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  {isRTL ? 
                    'الموافقات اليدوية والتواصل المبعثر مع الموردين والأعمال الورقية تضيع وقتك وأموالك.' :
                    'Manual approvals, scattered supplier communication, and paperwork waste your time and money.'
                  }
                </p>
              </div>
              
              <div className={isRTL ? 'lg:order-1' : ''}>
                <div className="relative">
                  <div className="bg-white/5 border border-white/20 backdrop-blur-20 rounded-2xl p-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-white">
                        <Clock className="h-5 w-5" />
                        <span>{isRTL ? 'موافقات تستغرق أسابيع' : 'Approvals take weeks'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <FileCheck className="h-5 w-5" />
                        <span>{isRTL ? 'أوراق متناثرة ومفقودة' : 'Scattered and lost paperwork'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <Users className="h-5 w-5" />
                        <span>{isRTL ? 'تواصل مبعثر مع الموردين' : 'Scattered vendor communication'}</span>
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
      <section className="py-32 px-6 bg-blackChasm/50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-cols-2' : ''}`}>
              <div className={isRTL ? 'lg:order-1' : ''}>
                <div className="relative">
                  <div className="bg-white/5 border border-white/20 backdrop-blur-20 rounded-2xl p-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-white">
                        <CheckCircle className="h-5 w-5" />
                        <span>{isRTL ? 'مشتريات مركزية' : 'Centralized purchasing'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <CheckCircle className="h-5 w-5" />
                        <span>{isRTL ? 'موافقات آلية' : 'Automated approvals'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <CheckCircle className="h-5 w-5" />
                        <span>{isRTL ? 'إدارة الموردين' : 'Vendor management'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <CheckCircle className="h-5 w-5" />
                        <span>{isRTL ? 'آمن ومتوافق مع اللوائح' : 'Secure & compliant'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={isRTL ? 'lg:order-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  {isRTL ? 'طريقة ذكية ومركزية لإدارة المشتريات' : 'A Smarter, Centralized Way to Manage Procurement'}
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
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
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                {isRTL ? 'لماذا تبدأ الشركات مع مورد' : 'Why Companies Start with MWRD'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white/5 border border-white/20 backdrop-blur-20">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-15 mb-4 group-hover:bg-white/20 transition-colors">
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white">
                      {isRTL ? benefit.titleAr : benefit.titleEn}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
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
      <section className="py-32 px-6 bg-blackChasm/50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                {isRTL ? 'موثوق من الشركات في جميع أنحاء المملكة' : 'Trusted by Businesses Across Saudi Arabia'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/5 border border-white/20 backdrop-blur-20 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-lg mb-6 leading-relaxed text-white">
                      "{isRTL ? testimonial.textAr : testimonial.textEn}"
                    </p>
                    <div>
                      <div className="font-semibold text-white">
                        {isRTL ? testimonial.nameAr : testimonial.nameEn}
                      </div>
                      <div className="text-sm text-white/70">
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
      <section className="py-32 px-6 relative overflow-hidden bg-blackChasm/50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, #004F54 2px, transparent 2px)`, backgroundSize: '50px 50px' }}></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
              {isRTL ? 'هل أنت مستعد لتبسيط المشتريات لديك؟' : 'Ready to Simplify Your Procurement?'}
            </h2>
            <p className="text-xl mb-8 leading-relaxed text-white/90">
              {isRTL ? 
                'انضم إلى مئات الشركات التي تحولت إلى إدارة مشتريات أكثر ذكاءً وفعالية.' :
                'Join hundreds of companies that have transformed to smarter, more efficient procurement management.'
              }
            </p>
            <Link to="/home">
              <Button size="lg" className="px-8 py-3 bg-white/10 border border-white/30 text-white backdrop-blur-20 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                {isRTL ? 'ابدأ مع مورد' : 'Get Started with MWRD'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
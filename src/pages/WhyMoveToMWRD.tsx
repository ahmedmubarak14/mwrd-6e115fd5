import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptionalAuth } from "@/contexts/useOptionalAuth";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ArrowRight, Clock, AlertTriangle, FileText, Database, GraduationCap, PiggyBank, CheckCircle, X, Users, Headphones, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export const WhyMoveToMWRD = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const auth = useOptionalAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (auth === undefined) {
    return <LoadingSpinner size="lg" className="min-h-screen flex items-center justify-center" />;
  }

  const painPoints = [
    {
      icon: Clock,
      titleEn: "Slow Approvals",
      titleAr: "موافقات بطيئة",
      descEn: "Waiting weeks for simple purchases",
      descAr: "انتظار أسابيع للمشتريات البسيطة"
    },
    {
      icon: AlertTriangle,
      titleEn: "Frequent Errors", 
      titleAr: "أخطاء متكررة",
      descEn: "Manual processes lead to mistakes",
      descAr: "العمليات اليدوية تؤدي إلى أخطاء"
    },
    {
      icon: FileText,
      titleEn: "Scattered Communication",
      titleAr: "تواصل مبعثر",
      descEn: "Emails and calls everywhere",
      descAr: "إيميلات ومكالمات في كل مكان"
    }
  ];

  const migrationSteps = [
    {
      icon: Database,
      titleEn: "Import Data Automatically",
      titleAr: "استيراد بياناتك تلقائياً",
      descEn: "We'll migrate your suppliers and purchase history seamlessly.",
      descAr: "سننقل مورديك وتاريخ مشترياتك بسلاسة."
    },
    {
      icon: GraduationCap,
      titleEn: "Onboard Your Team in Days",
      titleAr: "إعداد فريقك في أيام قليلة",
      descEn: "Quick training sessions to get everyone up to speed.",
      descAr: "جلسات تدريب سريعة لإعداد الجميع."
    },
    {
      icon: PiggyBank,
      titleEn: "Start Saving Costs Instantly",
      titleAr: "ابدأ بتوفير التكاليف فورًا",
      descEn: "See immediate ROI from day one of implementation.",
      descAr: "اربح عائد استثمار فوري من اليوم الأول."
    }
  ];

  const comparisonFeatures = [
    {
      feature: isRTL ? "الأتمتة" : "Automation",
      traditional: false,
      mwrd: true
    },
    {
      feature: isRTL ? "توفير التكاليف" : "Cost Savings", 
      traditional: false,
      mwrd: true
    },
    {
      feature: isRTL ? "التوافق مع اللوائح" : "Compliance",
      traditional: false,
      mwrd: true
    },
    {
      feature: isRTL ? "التقارير الآلية" : "Automated Reports",
      traditional: false,
      mwrd: true
    },
    {
      feature: isRTL ? "إدارة الموردين" : "Vendor Management",
      traditional: false,
      mwrd: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C]">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-filter backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20 px-6">
            {/* Logo and Desktop Navigation */}
            <div className={`flex items-center gap-12 ${isRTL ? 'order-3' : 'order-1'}`}>
              <Link to="/" className="flex items-center transition-transform hover:scale-105">
                <img 
                  src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                  alt="MWRD Logo"
                  className="h-14 w-auto"
                />
              </Link>
              
              <nav className="hidden lg:flex items-center gap-8">
                <Link to="/what-makes-us-unique" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
                  {isRTL ? 'ما يميزنا' : 'What Makes Us Unique'}
                </Link>
                <Link to="/why-start-with-us" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
                  {isRTL ? 'لماذا تبدأ معنا' : 'Why Start with Us'}
                </Link>
                <Link to="/pricing" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
                  {isRTL ? 'الأسعار' : 'Pricing'}
                </Link>
                <Link to="/why-move-to-mwrd" className="text-white hover:text-white text-sm font-medium transition-colors border-b border-white/50">
                  {isRTL ? 'لماذا الانتقال إلى مورد' : 'Why Move to MWRD'}
                </Link>
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <div className={`lg:hidden ${isRTL ? 'order-1' : 'order-3'}`}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            {/* Right Side - Language, Theme, Auth */}
            <div className={`flex items-center gap-4 ${isRTL ? 'order-2' : 'order-2'}`}>
              <LanguageSwitcher />
              
              {auth?.user ? (
                <Link to="/dashboard">
                  <Button className="bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-20">
                    {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/auth">
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                      {isRTL ? 'تسجيل الدخول' : 'Sign in'}
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-20">
                      {isRTL ? 'ابدأ الآن' : 'Get Started'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, #004F54 2px, transparent 2px)`, backgroundSize: '50px 50px' }}></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/30 backdrop-blur-20 rounded-full px-6 py-2 mb-6">
              <ArrowRight className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                {isRTL ? 'انتقال سريع وآمن' : 'Quick & Secure Migration'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white">
              {isRTL ? 'انتقل إلى إدارة مشتريات أذكى – اختر مورد' : 'Switch to Smarter Procurement – Move to MWRD'}
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              {isRTL ? 
                'انتقل من الأدوات اليدوية إلى حل حديث يوفر الوقت ويخفض التكاليف ويؤتمت جميع عمليات المشتريات.' :
                'Upgrade from manual tools to a modern solution that saves time, cuts costs, and automates your entire purchasing process.'
              }
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link to="/home">
                <Button size="lg" className="px-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/10 border border-white/30 text-white backdrop-blur-20">
                  {isRTL ? 'انتقل إلى مورد' : 'Move to MWRD'}
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="px-8 py-3 bg-white/5 border border-white/20 text-white backdrop-blur-15">
                  {isRTL ? 'انتقال في أيام وليس أسابيع' : 'Migrate in Days, Not Weeks'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                {isRTL ? 'لماذا تبقى عالقًا مع العمليات اليدوية؟' : 'Why Stay Stuck with Manual Processes?'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {painPoints.map((point, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white/5 border border-white/20 backdrop-blur-20">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                      <point.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white">
                      {isRTL ? point.titleAr : point.titleEn}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {isRTL ? point.descAr : point.descEn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Migration Advantages Section */}
      <section className="py-32 px-6 bg-blackChasm/50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                {isRTL ? 'الانتقال إلى مورد سريع وسهل' : 'Moving to MWRD is Quick and Easy'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {migrationSteps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="group hover:shadow-xl transition-all duration-300 bg-white/5 border border-white/20 backdrop-blur-20">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-15 mb-4 group-hover:bg-white/20 transition-colors">
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-3 text-white">
                        {isRTL ? step.titleAr : step.titleEn}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {isRTL ? step.descAr : step.descEn}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {index < migrationSteps.length - 1 && (
                    <div className={`hidden md:block absolute top-1/2 ${isRTL ? '-right-4' : '-left-4'} transform -translate-y-1/2 ${isRTL ? 'rotate-180' : ''}`}>
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                {isRTL ? 'الأدوات التقليدية مقابل مورد' : 'Traditional Tools vs. MWRD'}
              </h2>
            </div>
            
            <Card className="overflow-hidden bg-white/5 border border-white/20 backdrop-blur-20 shadow-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/10">
                        <th className={`p-4 text-left font-semibold text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                          {isRTL ? 'الميزة' : 'Feature'}
                        </th>
                        <th className="p-4 text-center font-semibold text-white">
                          {isRTL ? 'الأدوات التقليدية' : 'Traditional Tools'}
                        </th>
                        <th className="p-4 text-center font-semibold text-white">
                          مورد
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFeatures.map((item, index) => (
                        <tr key={index} className="border-t border-white/10">
                          <td className={`p-4 font-medium text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                            {item.feature}
                          </td>
                          <td className="p-4 text-center">
                            <X className="h-5 w-5 text-destructive mx-auto" />
                          </td>
                          <td className="p-4 text-center">
                            <CheckCircle className="h-5 w-5 text-primary mx-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Onboarding & Support Section */}
      <section className="py-32 px-6 bg-blackChasm/50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-cols-2' : ''}`}>
              <div className={isRTL ? 'lg:order-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  {isRTL ? 'نحن معك في كل خطوة' : 'We\'re With You Every Step of the Way'}
                </h2>
                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  {isRTL ? 
                    'فريقنا يوفر لك دعمًا كاملاً في الإعداد والتدريب والانتقال لجعل تجربتك سلسة.' :
                    'Our team provides full onboarding, training, and migration support to make your switch seamless.'
                  }
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-lime" />
                    <span className="text-white">{isRTL ? 'دعم مخصص للانتقال' : 'Dedicated migration support'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-lime" />
                    <span className="text-white">{isRTL ? 'تدريب شامل للفريق' : 'Comprehensive team training'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-lime" />
                    <span className="text-white">{isRTL ? 'دعم فني على مدار الساعة' : '24/7 technical support'}</span>
                  </div>
                </div>
              </div>
              
              <div className={isRTL ? 'lg:order-1' : ''}>
                <Card className="bg-white/5 border border-white/20 backdrop-blur-20">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Headphones className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {isRTL ? 'فريق الدعم المتخصص' : 'Dedicated Support Team'}
                        </h3>
                        <p className="text-sm text-white/70">
                          {isRTL ? 'خبراء معتمدون لمساعدتك' : 'Certified experts to help you'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {isRTL ? 'تدريب متكامل' : 'Complete Training'}
                        </h3>
                        <p className="text-sm text-white/70">
                          {isRTL ? 'ورش عمل عملية وتطبيقية' : 'Practical workshops & implementation'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-lime/10 flex items-center justify-center">
                        <Database className="h-6 w-6 text-lime" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {isRTL ? 'نقل البيانات الآمن' : 'Secure Data Migration'}
                        </h3>
                        <p className="text-sm text-white/70">
                          {isRTL ? 'انتقال آمن وسريع للبيانات' : 'Safe & fast data transfer'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden bg-blackChasm/50">
        <div className="absolute inset-0 opacity-5"></div>
        <div className="container mx-auto text-center relative z-10 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {isRTL ? 'انتقل إلى مورد وغيّر إدارة مشترياتك اليوم' : 'Move to MWRD and Transform Your Procurement Today'}
            </h2>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              {isRTL ? 
                'انضم إلى الشركات التي وثقت بنا لتحسين عمليات المشتريات وتوفير التكاليف.' :
                'Join companies that trusted us to improve their procurement processes and save costs.'
              }
            </p>
            <Link to="/home">
              <Button size="lg" className="px-8 py-3 bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-20">
                {isRTL ? 'ابدأ الانتقال الآن' : 'Start Migration Now'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
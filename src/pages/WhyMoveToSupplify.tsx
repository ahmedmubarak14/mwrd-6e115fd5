import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Clock, AlertTriangle, FileText, Database, GraduationCap, PiggyBank, CheckCircle, X, Users, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

export const WhyMoveToSupplify = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

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
      supplify: true
    },
    {
      feature: isRTL ? "توفير التكاليف" : "Cost Savings", 
      traditional: false,
      supplify: true
    },
    {
      feature: isRTL ? "التوافق مع اللوائح" : "Compliance",
      traditional: false,
      supplify: true
    },
    {
      feature: isRTL ? "التقارير الآلية" : "Automated Reports",
      traditional: false,
      supplify: true
    },
    {
      feature: isRTL ? "إدارة الموردين" : "Vendor Management",
      traditional: false,
      supplify: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/842b99cc-446d-41b5-8de7-b9c12faa1ed9.png" 
              alt="Supplify Logo"
              className="h-16 w-auto hover:scale-105 transition-transform"
            />
          </Link>
          
          <div className="flex items-center gap-3">
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
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-lime/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-6 py-2 mb-6">
              <ArrowRight className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {isRTL ? 'انتقال سريع وآمن' : 'Quick & Secure Migration'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {isRTL ? 'انتقل إلى إدارة مشتريات أذكى – اختر Supplify' : 'Switch to Smarter Procurement – Move to Supplify'}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              {isRTL ? 
                'انتقل من الأدوات اليدوية إلى حل حديث يوفر الوقت ويخفض التكاليف ويؤتمت جميع عمليات المشتريات.' :
                'Upgrade from manual tools to a modern solution that saves time, cuts costs, and automates your entire purchasing process.'
              }
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link to="/home">
                <Button size="lg" className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white px-8 py-3 hover-scale">
                  {isRTL ? 'انتقل إلى Supplify' : 'Move to Supplify'}
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="px-8 py-3 hover-scale">
                  {isRTL ? 'انتقال في أيام وليس أسابيع' : 'Migrate in Days, Not Weeks'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isRTL ? 'لماذا تبقى عالقًا مع العمليات اليدوية؟' : 'Why Stay Stuck with Manual Processes?'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {painPoints.map((point, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-destructive/5 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                      <point.icon className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-destructive">
                      {isRTL ? point.titleAr : point.titleEn}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
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
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isRTL ? 'الانتقال إلى Supplify سريع وسهل' : 'Moving to Supplify is Quick and Easy'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {migrationSteps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-card backdrop-blur-sm hover-scale">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">
                        {isRTL ? step.titleAr : step.titleEn}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
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
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isRTL ? 'الأدوات التقليدية مقابل Supplify' : 'Traditional Tools vs. Supplify'}
              </h2>
            </div>
            
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className={`p-4 text-left font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                          {isRTL ? 'الميزة' : 'Feature'}
                        </th>
                        <th className="p-4 text-center font-semibold">
                          {isRTL ? 'الأدوات التقليدية' : 'Traditional Tools'}
                        </th>
                        <th className="p-4 text-center font-semibold text-primary">
                          Supplify
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFeatures.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className={`p-4 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
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
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-cols-2' : ''}`}>
              <div className={isRTL ? 'lg:order-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {isRTL ? 'نحن معك في كل خطوة' : 'We\'re With You Every Step of the Way'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {isRTL ? 
                    'فريقنا يوفر لك دعمًا كاملاً في الإعداد والتدريب والانتقال لجعل تجربتك سلسة.' :
                    'Our team provides full onboarding, training, and migration support to make your switch seamless.'
                  }
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{isRTL ? 'دعم مخصص للانتقال' : 'Dedicated migration support'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{isRTL ? 'تدريب شامل للفريق' : 'Comprehensive team training'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{isRTL ? 'دعم فني على مدار الساعة' : '24/7 technical support'}</span>
                  </div>
                </div>
              </div>
              
              <div className={isRTL ? 'lg:order-1' : ''}>
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-0">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Headphones className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isRTL ? 'فريق الدعم المتخصص' : 'Dedicated Support Team'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'خبراء معتمدون لمساعدتك' : 'Certified experts to help you'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isRTL ? 'تدريب متكامل' : 'Complete Training'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'ورش عمل عملية وتطبيقية' : 'Practical workshops & implementation'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-lime/10 flex items-center justify-center">
                        <Database className="h-6 w-6 text-lime" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isRTL ? 'نقل البيانات الآمن' : 'Secure Data Migration'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
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
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-lime"></div>
        <div className="container mx-auto text-center relative z-10 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {isRTL ? 'انتقل إلى Supplify وغيّر إدارة مشترياتك اليوم' : 'Move to Supplify and Transform Your Procurement Today'}
            </h2>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              {isRTL ? 
                'انضم إلى الشركات التي وثقت بنا لتحسين عمليات المشتريات وتوفير التكاليف.' :
                'Join companies that trusted us to improve their procurement processes and save costs.'
              }
            </p>
            <Link to="/home">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-primary hover:bg-white/90 hover-scale">
                {isRTL ? 'ابدأ الانتقال الآن' : 'Start Migration Now'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
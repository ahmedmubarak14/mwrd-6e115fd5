import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { InteractiveDemo } from '@/components/demo/InteractiveDemo';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Target,
  Clock,
  Award,
  MessageSquare,
  BarChart3,
  Handshake,
  FileText,
  CreditCard
} from 'lucide-react';
import { useOptionalAuth } from '@/contexts/useOptionalAuth';

export const Landing = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const auth = useOptionalAuth();
  const isRTL = language === 'ar';

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (auth?.user) {
      navigate('/dashboard');
    }
  }, [auth?.user, navigate]);

  const [demoOpen, setDemoOpen] = useState(false);

  const handleDemoClose = () => {
    setDemoOpen(false);
  };

  const features = [
    {
      title: language === 'ar' ? 'منصة متكاملة' : 'All-in-One Platform',
      description: language === 'ar'
        ? 'إدارة الموردين، الطلبات، المشاريع، والمدفوعات في مكان واحد.'
        : 'Manage suppliers, requests, projects, and payments in one place.',
      icon: Globe,
    },
    {
      title: language === 'ar' ? 'أتمتة العمليات' : 'Automated Workflows',
      description: language === 'ar'
        ? 'تبسيط العمليات وتقليل الجهد اليدوي.'
        : 'Streamline processes and reduce manual effort.',
      icon: Zap,
    },
    {
      title: language === 'ar' ? 'تحليلات متقدمة' : 'Advanced Analytics',
      description: language === 'ar'
        ? 'احصل على رؤى قيمة لتحسين الأداء واتخاذ قرارات مستنيرة.'
        : 'Gain valuable insights to improve performance and make informed decisions.',
      icon: BarChart3,
    },
    {
      title: language === 'ar' ? 'تعاون سلس' : 'Seamless Collaboration',
      description: language === 'ar'
        ? 'تواصل وتعاون مع الموردين والعملاء بكفاءة.'
        : 'Communicate and collaborate with suppliers and clients efficiently.',
      icon: Handshake,
    },
  ];

  const services = [
    {
      title: language === 'ar' ? 'إدارة الموردين' : 'Supplier Management',
      description: language === 'ar'
        ? 'ابحث عن أفضل الموردين وقم بإدارتهم بكفاءة.'
        : 'Find and manage top suppliers efficiently.',
      icon: Users,
    },
    {
      title: language === 'ar' ? 'إدارة الطلبات' : 'Request Management',
      description: language === 'ar'
        ? 'إنشاء وإدارة الطلبات بسهولة.'
        : 'Create and manage requests with ease.',
      icon: FileText,
    },
    {
      title: language === 'ar' ? 'إدارة المشاريع' : 'Project Management',
      description: language === 'ar'
        ? 'تتبع المشاريع وضمان التسليم في الوقت المحدد.'
        : 'Track projects and ensure on-time delivery.',
      icon: Building2,
    },
    {
      title: language === 'ar' ? 'إدارة المدفوعات' : 'Payment Management',
      description: language === 'ar'
        ? 'إدارة المدفوعات بشكل آمن وفعال.'
        : 'Manage payments securely and efficiently.',
      icon: CreditCard,
    },
  ];

  const benefits = [
    {
      title: language === 'ar' ? 'توفير التكاليف' : 'Cost Savings',
      description: language === 'ar'
        ? 'تقليل التكاليف التشغيلية وزيادة الكفاءة.'
        : 'Reduce operational costs and increase efficiency.',
      icon: Target,
    },
    {
      title: language === 'ar' ? 'توفير الوقت' : 'Time Savings',
      description: language === 'ar'
        ? 'تبسيط العمليات وتوفير الوقت الثمين.'
        : 'Streamline processes and save valuable time.',
      icon: Clock,
    },
    {
      title: language === 'ar' ? 'زيادة الإنتاجية' : 'Increased Productivity',
      description: language === 'ar'
        ? 'زيادة إنتاجية فريقك وتحسين الأداء.'
        : 'Increase your team\'s productivity and improve performance.',
      icon: Award,
    },
    {
      title: language === 'ar' ? 'تحسين العلاقات' : 'Improved Relationships',
      description: language === 'ar'
        ? 'تعزيز العلاقات مع الموردين والعملاء.'
        : 'Enhance relationships with suppliers and clients.',
      icon: Handshake,
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/landing" className="flex items-center space-x-2 rtl:space-x-reverse">
            <img 
              src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
              alt="MWRD Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <Link to="/landing#platform" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('nav.platform')}
            </Link>
            <Link to="/why-start-with-mwrd" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('nav.whyStartWithUs')}
            </Link>
            <Link to="/what-makes-us-unique" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('nav.whatMakesUsUnique')}
            </Link>
            <Link to="/why-move-to-mwrd" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('nav.whyMoveToUs')}
            </Link>
            <Link to="/landing#services" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('nav.services')}
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('nav.pricing')}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />
            <Link to="/auth">
              <Button variant="ghost">{t('auth.login')}</Button>
            </Link>
            <Link to="/auth">
              <Button>{t('auth.startFree')}</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <MobileNavigation />
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm animate-fade-in">
              🚀 {language === 'ar' ? 'منصة المشتريات الذكية' : 'Smart Procurement Platform'}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent animate-fade-in">
              {language === 'ar' ? 'مورد' : 'MWRD'}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed animate-fade-in">
              {language === 'ar' 
                ? 'منصة ذكية تربط الشركات بأفضل الموردين في المملكة العربية السعودية'
                : 'Smart platform connecting businesses with top suppliers in Saudi Arabia'
              }
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <Sparkles className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t('auth.startFree')}
                  <ArrowRight className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto hover:bg-primary/10 transition-all duration-300 hover:scale-105">
                <Play className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                {language === 'ar' ? 'شاهد العرض التوضيحي' : 'Watch Demo'}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground animate-fade-in">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                {language === 'ar' ? 'آمن ومعتمد' : 'Secure & Certified'}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                {language === 'ar' ? '+1000 مورد' : '1000+ Suppliers'}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                {language === 'ar' ? '+500 شركة' : '500+ Companies'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="platform" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'منصتنا الذكية' : 'Our Smart Platform'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {language === 'ar'
                ? 'كل ما تحتاجه لإدارة المشتريات بكفاءة.'
                : 'Everything you need to manage procurement efficiently.'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <feature.icon className="w-6 h-6 text-primary mb-4" />
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">
                {language === 'ar' ? 'جرب العرض التوضيحي' : 'Interactive Demo'}
              </h2>
              <p className="text-muted-foreground text-lg">
                {language === 'ar'
                  ? 'استكشف ميزات منصتنا من خلال عرض توضيحي تفاعلي.'
                  : 'Explore our platform features with an interactive demo.'
                }
              </p>
              <Button onClick={() => setDemoOpen(true)}>
                {language === 'ar' ? 'ابدأ العرض التوضيحي' : 'Start Demo'}
              </Button>
            </div>
            <div className="relative">
              <img
                src="/placeholder-demo.png"
                alt="Interactive Demo"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'خدماتنا' : 'Our Services'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {language === 'ar'
                ? 'نقدم مجموعة واسعة من الخدمات لتلبية احتياجات عملك.'
                : 'We offer a wide range of services to meet your business needs.'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <service.icon className="w-6 h-6 text-primary mb-4" />
                  <CardTitle className="text-lg font-semibold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'فوائد استخدام منصتنا' : 'Benefits of Using Our Platform'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {language === 'ar'
                ? 'اكتشف كيف يمكن لمنصتنا أن تساعدك على تحقيق أهداف عملك.'
                : 'Discover how our platform can help you achieve your business goals.'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <benefit.icon className="w-6 h-6 text-primary mb-4" />
                  <CardTitle className="text-lg font-semibold">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'آراء عملائنا' : 'What Our Clients Say'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {language === 'ar'
                ? 'اكتشف كيف ساعدنا الشركات الأخرى على النجاح.'
                : 'Discover how we\'ve helped other businesses succeed.'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial Cards */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <img
                    src="/placeholder-avatar.png"
                    alt="Client Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {language === 'ar' ? 'اسم العميل' : 'Client Name'}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'مسمى وظيفي' : 'Job Title'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar'
                    ? 'هذا النص هو مثال لنص شهادة العميل. يمكن استخدامه لعرض آراء العملاء حول منتجك أو خدمتك.'
                    : 'This text is an example of a client testimonial. It can be used to showcase client feedback about your product or service.'
                  }
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <img
                    src="/placeholder-avatar.png"
                    alt="Client Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {language === 'ar' ? 'اسم العميل' : 'Client Name'}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'مسمى وظيفي' : 'Job Title'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar'
                    ? 'هذا النص هو مثال لنص شهادة العميل. يمكن استخدامه لعرض آراء العملاء حول منتجك أو خدمتك.'
                    : 'This text is an example of a client testimonial. It can be used to showcase client feedback about your product or service.'
                  }
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <img
                    src="/placeholder-avatar.png"
                    alt="Client Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {language === 'ar' ? 'اسم العميل' : 'Client Name'}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'مسمى وظيفي' : 'Job Title'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar'
                    ? 'هذا النص هو مثال لنص شهادة العميل. يمكن استخدامه لعرض آراء العملاء حول منتجك أو خدمتك.'
                    : 'This text is an example of a client testimonial. It can be used to showcase client feedback about your product or service.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">
            {language === 'ar' ? 'ابدأ اليوم' : 'Start Today'}
          </h2>
          <p className="text-xl mb-12">
            {language === 'ar'
              ? 'انضم إلى منصتنا وابدأ في إدارة مشترياتك بكفاءة.'
              : 'Join our platform and start managing your procurement efficiently.'
            }
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-accent text-primary hover:bg-accent-foreground hover:text-accent">
              {language === 'ar' ? 'ابدأ مجاناً' : 'Get Started for Free'}
            </Button>
          </Link>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo"
                className="h-12 w-auto"
              />
              <p className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? 'منصة ذكية تربط الشركات بأفضل الموردين'
                  : 'Smart platform connecting businesses with top suppliers'
                }
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">{language === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h3>
              <div className="space-y-2 text-sm">
                <Link to="/why-start-with-mwrd" className="block text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.whyStartWithUs')}
                </Link>
                <Link to="/what-makes-us-unique" className="block text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.whatMakesUsUnique')}
                </Link>
                <Link to="/pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.pricing')}
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">{language === 'ar' ? 'الدعم' : 'Support'}</h3>
              <div className="space-y-2 text-sm">
                <Link to="/support" className="block text-muted-foreground hover:text-foreground transition-colors">
                  {language === 'ar' ? 'مركز المساعدة' : 'Help Center'}
                </Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                  {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                </Link>
              </div>
            </div>

            {/* Get Started */}
            <div className="space-y-4">
              <h3 className="font-semibold">{language === 'ar' ? 'ابدأ الآن' : 'Get Started'}</h3>
              <Link to="/auth">
                <Button className="w-full">
                  {t('auth.startFree')}
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MWRD. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>

      {/* Interactive Demo Modal */}
      <InteractiveDemo isOpen={demoOpen} onClose={handleDemoClose} />
    </div>
  );
};

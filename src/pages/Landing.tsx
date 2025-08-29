import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useOptionalAuth } from "@/contexts/useOptionalAuth";
import { useState } from "react";
import { StaggeredList } from "@/components/ui/animations/MicroInteractions";
import { 
  ArrowRight, 
  Users, 
  Shield, 
  Zap, 
  TrendingUp, 
  Star, 
  Building2, 
  CheckCircle, 
  BarChart3, 
  HeartHandshake, 
  Sparkles, 
  Search,
  Handshake,
  CreditCard,
  Target,
  Rocket,
  Globe,
  Award,
  FileText,
  MessageSquare,
  Package,
  ThumbsUp,
  Briefcase,
  Eye,
  DollarSign,
  Clock,
  UserPlus,
  Menu,
  Settings,
  Database,
  Workflow,
  PieChart,
  Users2
} from "lucide-react";
import { Link } from "react-router-dom";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { BackToTop } from "@/components/ui/BackToTop";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Footer } from "@/components/ui/layout/Footer";
import { cn } from "@/lib/utils";

export const Landing = () => {
  const languageContext = useOptionalLanguage();
  const t = languageContext?.t || ((key: string) => key.split('.').pop() || key);
  const language = languageContext?.language || 'en';
  const auth = useOptionalAuth();
  const user = auth?.user;
  const userProfile = auth?.userProfile;
  const loading = auth?.loading;
  
  const isRTL = language === 'ar';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner 
          size="lg" 
          text={language === 'ar' ? 'جاري التحميل...' : 'Loading...'} 
          className="animate-fade-in" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] overflow-hidden">
      <SmoothScroll />
      
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
            {user && userProfile ? (
              <Link to="/dashboard" className="hidden md:block">
                <Button size="lg" animation="lift" className="px-8 hover:shadow-2xl transition-all duration-500 bg-white/10 border border-white/30 text-white backdrop-blur-20">
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/enhanced-login" className="hidden md:block">
                  <Button variant="ghost" size="lg" animation="scale" className="px-6 bg-white/5 border border-white/20 text-white transition-all duration-300 backdrop-blur-15">
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </Link>
                <Link to="/enhanced-register" className="hidden md:block">
                  <Button size="lg" animation="lift" className="px-8 hover:shadow-2xl transition-all duration-500 bg-white/10 border border-white/30 text-white backdrop-blur-20">
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
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-6 pt-20 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            
            {/* Left Content */}
            <div className={`${language === 'ar' ? 'lg:order-2 text-right' : 'lg:order-1'} space-y-8`}>
              
              {/* Badge */}
              <div className="inline-block">
                <div className="px-4 py-2 text-sm text-white rounded-full bg-white/10 border border-white/30 backdrop-blur-20">
                  {language === 'ar' ? '🚀 منصة المشتريات الذكية' : '🚀 Smart Procurement Platform'}
                </div>
              </div>

              {/* Main Brand */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black">
                  <span className="text-white">MWRD</span>
                  <span className="text-white"> | {language === 'ar' ? 'مورد' : 'مورد'}</span>
                </h1>
                <p className="text-base text-white font-medium">
                  {language === 'ar' ? 'منصة ذكية تربط الشركات بأفضل الموردين في المملكة العربية السعودية' : 'Smart platform connecting businesses with top suppliers in Saudi Arabia'}
                </p>
              </div>

              {/* Hero Headline */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {language === 'ar' ? 'تواصل. مصدر. وريد.' : 'Connect. Source. Supply.'}
                </h2>
                <p className="text-base text-white leading-relaxed max-w-2xl">
                  {language === 'ar' 
                    ? 'منصة B2B مهنية تربط العملاء بالموردين المؤهلين من خلال نظام طلب عروض الأسعار الذكي. احصل على عروض أسعار تنافسية، وقارن المقترحات، وأدر سلسلة التوريد الخاصة بك بكفاءة.'
                    : 'A professional B2B marketplace connecting clients with qualified vendors through our smart RFQ system. Get competitive quotes, compare proposals, and manage your supply chain efficiently.'}
                </p>
              </div>

              {/* Action Button */}
              <div className="flex justify-center sm:justify-start">
                <Link to="/enhanced-register" className="group">
                  <Button size="lg" animation="spring" className="px-8 py-3 text-base font-semibold transition-all duration-300 bg-white/10 border border-white/30 text-white backdrop-blur-20">
                    {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                  </Button>
                </Link>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                {[
                  { text: language === 'ar' ? 'أرسل طلبات عروض الأسعار واحصل على عروض تنافسية' : 'Submit RFQs and receive competitive bids' },
                  { text: language === 'ar' ? 'تواصل مع موردين معتمدين في قطاعك' : 'Connect with verified vendors in your sector' },
                  { text: language === 'ar' ? 'معاملات آمنة وتتبع الطلبات' : 'Secure transactions and order tracking' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-white">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="pt-8">
                <p className="text-white text-sm mb-2">
                  {language === 'ar' ? 'موثوق من قبل أكثر من 500+ شركة' : 'Trusted by 500+ businesses'}
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Stats Cards */}
            <div className={`${language === 'ar' ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
              <StaggeredList staggerDelay={0.15}>
                {[
                  { 
                    icon: FileText, 
                    title: language === 'ar' ? 'نظام طلب التسعير' : 'RFQ System',
                    subtitle: language === 'ar' ? 'عروض ذكية' : 'Smart bidding',
                    count: "24", 
                    label: language === 'ar' ? 'طلبات نشطة' : 'Active RFQs', 
                    color: '#8B5CF6',
                    progress: 60
                  },
                  { 
                    icon: Users, 
                    title: language === 'ar' ? 'الموردون' : 'Vendors',
                    subtitle: language === 'ar' ? 'موردون موثقون' : 'Verified vendors',
                    count: "1,247", 
                    label: language === 'ar' ? 'موردون نشطون' : 'Active vendors', 
                    color: '#3B82F6',
                    progress: 85
                  },
                  { 
                    icon: Shield, 
                    title: language === 'ar' ? 'آمان' : 'Secure',
                    subtitle: language === 'ar' ? 'معاملات موثقة' : 'Verified transactions',
                    count: "99.9%", 
                    label: language === 'ar' ? 'معدل النجاح' : 'Success rate', 
                    color: '#10B981',
                    progress: 99
                  },
                  { 
                    icon: Clock, 
                    title: language === 'ar' ? 'سريع' : 'Fast',
                    subtitle: language === 'ar' ? 'متوسط الاستجابة' : 'Average response',
                    count: "4.2h", 
                    label: language === 'ar' ? 'وقت استجابة العرض' : 'Bid response time', 
                    color: '#F59E0B',
                    progress: 70
                  }
                ].map((stat, index) => (
                  <Card key={index} hoverEffect="lift" className="p-3 transition-all duration-300 animate-fade-in bg-white/5 border border-white/20 backdrop-blur-20">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20 backdrop-blur-15" style={{ backgroundColor: `${stat.color}20`, border: `1px solid ${stat.color}40` }}>
                        <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-white text-sm">{stat.title}</h3>
                        </div>
                        <p className="text-xs text-white mb-1">{stat.subtitle}</p>
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-lg font-black text-white mb-1">{stat.count}</div>
                            <div className="text-xs text-white">{stat.label}</div>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                          <div 
                            className="h-1 rounded-full transition-all duration-1000" 
                            style={{ 
                              backgroundColor: stat.color, 
                              width: `${stat.progress}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </StaggeredList>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Workflow Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, #004F54 2px, transparent 2px)`, backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
              {language === 'ar' ? 'كيف نعيد تشكيل المشتريات التجارية؟' : 'How We\'re Reshaping B2B Procurement'}
            </h2>
            <p className="text-lg max-w-3xl mx-auto font-light text-white">
              {language === 'ar' 
                ? 'نظام ثوري يدمج الذكاء الاصطناعي مع سوق المشتريات التجارية لتقديم تجربة لا مثيل لها'
                : 'A revolutionary system that merges AI with B2B procurement marketplace to deliver an unmatched experience'}
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Revolutionary Step System */}
            <div className="relative">
              {/* Animated Connection Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-[#102C33] via-[#004F54] to-[#765A3F] transform -translate-x-1/2 hidden lg:block rounded-full shadow-2xl"></div>

              {/* Step 1: AI-Powered Discovery */}
              <div className="relative mb-32 group">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="lg:w-1/2 lg:pr-16">
                     <Card className="p-4 hover:shadow-2xl transition-all duration-700 rounded-2xl bg-white/5 border border-white/20 backdrop-blur-20" hoverEffect="tilt">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#102C33] to-[#004F54] rounded-2xl flex items-center justify-center shadow-xl border border-white/20 backdrop-blur-20">
                          <Search className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-white">01</span>
                          <h3 className="text-xl font-bold text-white">
                            {language === 'ar' ? 'اكتشاف ذكي' : 'AI-Powered Discovery'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-base leading-relaxed font-medium text-white">
                        {language === 'ar' 
                          ? 'تقنية الذكاء الاصطناعي تحلل احتياجاتك وتوصلك بأفضل الموردين في ثوانٍ. اكتشف فرصاً لم تتخيلها من قبل'
                          : 'AI technology analyzes your needs and connects you with the best vendors in seconds. Discover opportunities you never imagined'}
                      </p>
                    </Card>
                  </div>
                  <div className="lg:w-1/2 lg:pl-16">
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { icon: Target, label: language === 'ar' ? 'دقة 99%' : '99% Accuracy', color: '#102C33' },
                        { icon: Zap, label: language === 'ar' ? 'استجابة فورية' : 'Instant Response', color: '#004F54' },
                        { icon: Eye, label: language === 'ar' ? 'رؤى متقدمة' : 'Advanced Insights', color: '#765A3F' },
                        { icon: TrendingUp, label: language === 'ar' ? 'نمو مضمون' : 'Guaranteed Growth', color: '#102C33' }
                       ].map((feature, index) => (
                        <Card key={index} hoverEffect="glow" className="p-3 hover:shadow-2xl transition-all duration-500 rounded-xl bg-white/5 border border-white/20 backdrop-blur-15">
                          <feature.icon className="h-5 w-5 mb-2" style={{ color: feature.color }} />
                          <div className="text-sm font-bold text-white">{feature.label}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Seamless Negotiation */}
              <div className="relative mb-32 group">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                  <div className="lg:w-1/2 lg:pl-16">
                    <Card className="p-4 hover:shadow-2xl transition-all duration-700 rounded-2xl bg-white/5 border border-white/20 backdrop-blur-20" hoverEffect="tilt">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#102C33] to-[#004F54] rounded-2xl flex items-center justify-center shadow-xl border border-white/20 backdrop-blur-20">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-white">02</span>
                          <h3 className="text-xl font-bold text-white">
                            {language === 'ar' ? 'تفاوض سلس' : 'Seamless Negotiation'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-base leading-relaxed font-medium text-white">
                        {language === 'ar' 
                          ? 'أدوات تفاوض متطورة تسهل التواصل المباشر مع الموردين وتضمن أفضل الصفقات'
                          : 'Advanced negotiation tools facilitate direct communication with vendors and ensure the best deals'}
                      </p>
                    </Card>
                  </div>
                  <div className="lg:w-1/2 lg:pr-16">
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { icon: MessageSquare, label: language === 'ar' ? 'دردشة مباشرة' : 'Real-time Chat', color: '#102C33' },
                        { icon: FileText, label: language === 'ar' ? 'مشاركة المستندات' : 'Document Sharing', color: '#004F54' },
                        { icon: BarChart3, label: language === 'ar' ? 'مقارنة الأسعار' : 'Price Comparison', color: '#765A3F' },
                        { icon: Handshake, label: language === 'ar' ? 'اتفاقيات آمنة' : 'Secure Agreements', color: '#102C33' }
                      ].map((feature, index) => (
                        <Card key={index} hoverEffect="glow" className="p-3 hover:shadow-2xl transition-all duration-500 rounded-xl bg-white/5 border border-white/20 backdrop-blur-15">
                          <feature.icon className="h-5 w-5 mb-2" style={{ color: feature.color }} />
                          <div className="text-sm font-bold text-white">{feature.label}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Secure Completion */}
              <div className="relative mb-16 group">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="lg:w-1/2 lg:pr-16">
                    <Card className="p-4 hover:shadow-2xl transition-all duration-700 rounded-2xl bg-white/5 border border-white/20 backdrop-blur-20" hoverEffect="tilt">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#102C33] to-[#004F54] rounded-2xl flex items-center justify-center shadow-xl border border-white/20 backdrop-blur-20">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-white">03</span>
                          <h3 className="text-xl font-bold text-white">
                            {language === 'ar' ? 'إنجاز آمن' : 'Secure Completion'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-base leading-relaxed font-medium text-white">
                        {language === 'ar' 
                          ? 'نظام دفع آمن وتتبع الطلبات يضمن وصول منتجاتك في الوقت المحدد بأعلى جودة'
                          : 'Secure payment system and order tracking ensures your products arrive on time with the highest quality'}
                      </p>
                    </Card>
                  </div>
                  <div className="lg:w-1/2 lg:pl-16">
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { icon: CreditCard, label: language === 'ar' ? 'حماية الدفع' : 'Payment Protection', color: '#102C33' },
                        { icon: Award, label: language === 'ar' ? 'ضمان الجودة' : 'Quality Assurance', color: '#004F54' },
                        { icon: Package, label: language === 'ar' ? 'تتبع التسليم' : 'Delivery Tracking', color: '#765A3F' },
                        { icon: ThumbsUp, label: language === 'ar' ? 'رضا مضمون' : 'Guaranteed Satisfaction', color: '#102C33' }
                      ].map((feature, index) => (
                        <Card key={index} hoverEffect="glow" className="p-3 hover:shadow-2xl transition-all duration-500 rounded-xl bg-white/5 border border-white/20 backdrop-blur-15">
                          <feature.icon className="h-5 w-5 mb-2" style={{ color: feature.color }} />
                          <div className="text-sm font-bold text-white">{feature.label}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Smart Platform Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
              {language === 'ar' ? 'منصتنا الذكية' : 'Our Smart Platform'}
            </h2>
            <p className="text-lg max-w-3xl mx-auto font-light text-white">
              {language === 'ar' 
                ? 'كل ما تحتاجه لإدارة المشتريات بكفاءة'
                : 'Everything you need to manage procurement efficiently.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Database,
                title: language === 'ar' ? 'منصة شاملة' : 'All-in-One Platform',
                desc: language === 'ar' ? 'إدارة الموردين والطلبات والمشاريع والمدفوعات في مكان واحد' : 'Manage suppliers, requests, projects, and payments in one place.',
                color: '#102C33'
              },
              {
                icon: Workflow,
                title: language === 'ar' ? 'سير عمل آلي' : 'Automated Workflows',
                desc: language === 'ar' ? 'تبسيط العمليات وتقليل الجهد اليدوي' : 'Streamline processes and reduce manual effort.',
                color: '#004F54'
              },
              {
                icon: PieChart,
                title: language === 'ar' ? 'تحليلات متقدمة' : 'Advanced Analytics',
                desc: language === 'ar' ? 'احصل على رؤى قيمة لتحسين الأداء واتخاذ قرارات مدروسة' : 'Gain valuable insights to improve performance and make informed decisions.',
                color: '#765A3F'
              },
              {
                icon: Users2,
                title: language === 'ar' ? 'تعاون سلس' : 'Seamless Collaboration',
                desc: language === 'ar' ? 'تواصل وتعاون مع الموردين والعملاء بكفاءة' : 'Communicate and collaborate with suppliers and clients efficiently.',
                color: '#102C33'
              }
            ].map((feature, index) => (
              <Card key={index} hoverEffect="scale" className="p-6 hover:shadow-2xl transition-all duration-500 bg-white/5 border border-white/20 backdrop-blur-20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-15" style={{ backgroundColor: `${feature.color}30` }}>
                    <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-white font-light leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services & Benefits Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
              {language === 'ar' ? 'خدماتنا ومزايانا' : 'Our Services & Benefits'}
            </h2>
            <p className="text-lg max-w-3xl mx-auto font-light text-white">
              {language === 'ar' 
                ? 'نقدم مجموعة واسعة من الخدمات لتلبية احتياجات أعمالك'
                : 'We offer a wide range of services to meet your business needs'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-7xl mx-auto">
            {/* Our Services */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-black mb-4 text-white">
                  {language === 'ar' ? 'خدماتنا' : 'Our Services'}
                </h3>
                <p className="text-white font-light">
                  {language === 'ar' ? 'نقدم مجموعة واسعة من الخدمات لتلبية احتياجات أعمالك' : 'We offer a wide range of services to meet your business needs.'}
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Users,
                    title: language === 'ar' ? 'إدارة الموردين' : 'Supplier Management',
                    desc: language === 'ar' ? 'ابحث وأدر أفضل الموردين بكفاءة' : 'Find and manage top suppliers efficiently.',
                    color: '#102C33'
                  },
                  {
                    icon: FileText,
                    title: language === 'ar' ? 'إدارة الطلبات' : 'Request Management',
                    desc: language === 'ar' ? 'أنشئ وأدر الطلبات بسهولة' : 'Create and manage requests with ease.',
                    color: '#004F54'
                  },
                  {
                    icon: Briefcase,
                    title: language === 'ar' ? 'إدارة المشاريع' : 'Project Management',
                    desc: language === 'ar' ? 'تتبع المشاريع واضمن التسليم في الوقت المحدد' : 'Track projects and ensure on-time delivery.',
                    color: '#765A3F'
                  },
                  {
                    icon: CreditCard,
                    title: language === 'ar' ? 'إدارة المدفوعات' : 'Payment Management',
                    desc: language === 'ar' ? 'أدر المدفوعات بأمان وكفاءة' : 'Manage payments securely and efficiently.',
                    color: '#102C33'
                  }
                ].map((service, index) => (
                  <Card key={index} hoverEffect="lift" className="p-6 hover:shadow-2xl transition-all duration-500 bg-white/5 border border-white/20 backdrop-blur-20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20 backdrop-blur-15" style={{ backgroundColor: `${service.color}30` }}>
                        <service.icon className="h-6 w-6" style={{ color: service.color }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-2 text-white">{service.title}</h4>
                        <p className="text-white font-light">{service.desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-black mb-4 text-white">
                  {language === 'ar' ? 'مزايا استخدام منصتنا' : 'Benefits of Using Our Platform'}
                </h3>
                <p className="text-white font-light">
                  {language === 'ar' ? 'اكتشف كيف يمكن لمنصتنا مساعدتك في تحقيق أهداف عملك' : 'Discover how our platform can help you achieve your business goals.'}
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    icon: DollarSign,
                    title: language === 'ar' ? 'توفير التكاليف' : 'Cost Savings',
                    desc: language === 'ar' ? 'قلل من التكاليف التشغيلية وزد من الكفاءة' : 'Reduce operational costs and increase efficiency.',
                    color: '#102C33'
                  },
                  {
                    icon: Clock,
                    title: language === 'ar' ? 'توفير الوقت' : 'Time Savings',
                    desc: language === 'ar' ? 'بسّط العمليات واحفظ وقتاً ثميناً' : 'Streamline processes and save valuable time.',
                    color: '#004F54'
                  },
                  {
                    icon: TrendingUp,
                    title: language === 'ar' ? 'زيادة الإنتاجية' : 'Increased Productivity',
                    desc: language === 'ar' ? 'زد من إنتاجية فريقك وحسّن الأداء' : 'Increase your team\'s productivity and improve performance.',
                    color: '#765A3F'
                  },
                  {
                    icon: HeartHandshake,
                    title: language === 'ar' ? 'تحسين العلاقات' : 'Improved Relationships',
                    desc: language === 'ar' ? 'عزز العلاقات مع الموردين والعملاء' : 'Enhance relationships with suppliers and clients.',
                    color: '#102C33'
                  }
                ].map((benefit, index) => (
                  <Card key={index} hoverEffect="lift" className="p-6 hover:shadow-2xl transition-all duration-500 bg-white/5 border border-white/20 backdrop-blur-20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20 backdrop-blur-15" style={{ backgroundColor: `${benefit.color}30` }}>
                        <benefit.icon className="h-6 w-6" style={{ color: benefit.color }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-2 text-white">{benefit.title}</h4>
                        <p className="text-white font-light">{benefit.desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-white">
              {language === 'ar' ? 'انضم إلى الثورة' : 'Join the Revolution'}
            </h2>
            <p className="text-lg text-white font-light max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'كن جزءاً من مستقبل التجارة الإلكترونية B2B وابدأ رحلتك معنا اليوم'
                : 'Be part of the future of B2B e-commerce and start your journey with us today'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/enhanced-register">
                <Button size="lg" animation="spring" className="px-8 py-3 bg-gradient-to-r from-primary to-accent transition-transform text-lg text-white">
                  {language === 'ar' ? 'ابدأ رحلتك' : 'Start Your Journey'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <BackToTop />
    </div>
  );
};

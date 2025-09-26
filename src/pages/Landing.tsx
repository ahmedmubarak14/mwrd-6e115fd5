import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { language, setLanguage, t, isRTL } = useLanguage();
  const auth = useOptionalAuth();
  const user = auth?.user;
  const userProfile = auth?.userProfile;
  const loading = auth?.loading;
  const [activeAudience, setActiveAudience] = useState<'buyers' | 'vendors'>('buyers');

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      <SmoothScroll />
      
      {/* Ultra-Modern Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-filter backdrop-blur-xl border-b border-gray-200/30 bg-white/90 shadow-sm">
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
            <Link to="/why-start-with-mwrd" className="text-gray-700 hover:text-[#004F54] transition-colors text-sm font-medium">
              {language === 'ar' ? 'لماذا نبدأ معنا' : 'Why Start with Us'}
            </Link>
            <Link to="/what-makes-us-unique" className="text-gray-700 hover:text-[#004F54] transition-colors text-sm font-medium">
              {language === 'ar' ? 'ما يميزنا' : 'What Makes Us Unique'}
            </Link>
            <Link to="/why-move-to-mwrd" className="text-gray-700 hover:text-[#004F54] transition-colors text-sm font-medium">
              {language === 'ar' ? 'لماذا الانتقال إلينا' : 'Why Move to Us'}
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-[#004F54] transition-colors text-sm font-medium">
              {language === 'ar' ? 'الأسعار' : 'Pricing'}
            </Link>
          </nav>
          
          <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse order-2' : 'order-3'}`}>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            {user && userProfile ? (
              <Link to="/dashboard" className="hidden md:block">
                <Button size="lg" animation="lift" className="px-8 hover:shadow-2xl transition-all duration-500 bg-[#004F54] hover:bg-[#004F54]/90 border border-[#004F54] text-white">
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden md:block">
                  <Button variant="ghost" size="lg" animation="scale" className="px-6 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 transition-all duration-300">
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </Link>
                <Link to="/register" className="hidden md:block">
                  <Button size="lg" animation="lift" className="px-8 hover:shadow-2xl transition-all duration-500 bg-[#004F54] hover:bg-[#004F54]/90 border border-[#004F54] text-white">
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
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-purple-50 to-gray-50">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#66023C]/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-[#004F54]/20 to-blue-400/20 rounded-full blur-2xl"></div>
        </div>
        <div className="container mx-auto px-6 pt-20 pb-16 relative z-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Main Headline */}
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-block mb-6">
                <div className="px-6 py-3 text-sm text-[#66023C] rounded-full bg-gradient-to-r from-[#66023C]/10 to-purple-100 border border-[#66023C]/20 shadow-sm">
                  {language === 'ar' ? '🚀 منصة المشتريات الذكية الرائدة في المملكة' : '🚀 Saudi Arabia\'s Leading Smart Procurement Platform'}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-8">
                <span className="text-gray-800">
                  {language === 'ar' ? 'نربط' : 'Connecting'}
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#004F54] via-[#66023C] to-[#004F54] bg-clip-text text-transparent">
                  {language === 'ar' ? 'الشركات بالموردين' : 'Businesses & Suppliers'}
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto font-medium mb-12">
                {language === 'ar' 
                  ? 'منصة واحدة تجمع الشركات الباحثة عن موردين والموردين الباحثين عن فرص جديدة - بطريقة ذكية وآمنة ومضمونة'
                  : 'One intelligent platform bringing together companies seeking suppliers and suppliers seeking new opportunities - smart, secure, and guaranteed'}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-16">
                <div className="text-center">
                  <div className="text-3xl font-black text-[#004F54] mb-1">500+</div>
                  <div className="text-sm text-gray-600">{language === 'ar' ? 'شركة نشطة' : 'Active Companies'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-[#66023C] mb-1">1,200+</div>
                  <div className="text-sm text-gray-600">{language === 'ar' ? 'مورد مؤهل' : 'Qualified Suppliers'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-[#004F54] mb-1">SAR 50M+</div>
                  <div className="text-sm text-gray-600">{language === 'ar' ? 'قيمة الصفقات' : 'Deals Value'}</div>
                </div>
              </div>
            </div>

            {/* Dual Hero Cards with Photos */}
            <div className="grid lg:grid-cols-2 gap-8 mb-20">
              
              {/* For Buyers/Companies */}
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-700 animate-fade-in hover-scale">
                {/* Hero Image */}
                <div className="relative h-64 bg-gradient-to-br from-[#004F54] to-[#66023C] overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Building2 className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{language === 'ar' ? 'للشركات والمؤسسات' : 'For Companies'}</h3>
                      <p className="text-white/90">{language === 'ar' ? 'تبحث عن موردين موثوقين؟' : 'Looking for reliable suppliers?'}</p>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full"></div>
                </div>

                <div className="p-8">
                  <div className="space-y-6 mb-8">
                    {[
                      { 
                        icon: Search, 
                        title: language === 'ar' ? 'بحث ذكي' : 'Smart Search',
                        text: language === 'ar' ? 'ابحث في آلاف الموردين المؤهلين' : 'Search thousands of qualified suppliers'
                      },
                      { 
                        icon: Clock, 
                        title: language === 'ar' ? 'استجابة سريعة' : 'Quick Response',
                        text: language === 'ar' ? 'احصل على عروض أسعار في دقائق' : 'Get quotes in minutes, not weeks'
                      },
                      { 
                        icon: DollarSign, 
                        title: language === 'ar' ? 'توفير مضمون' : 'Guaranteed Savings',
                        text: language === 'ar' ? 'وفر 15-30% من تكاليف المشتريات' : 'Save 15-30% on procurement costs'
                      }
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-[#004F54]/5 to-[#66023C]/5 border border-[#004F54]/10 hover:from-[#004F54]/10 hover:to-[#66023C]/10 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004F54] to-[#66023C] flex items-center justify-center flex-shrink-0 shadow-md">
                          <benefit.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Link to="/register" className="block">
                      <Button size="lg" className="w-full bg-gradient-to-r from-[#004F54] to-[#66023C] hover:from-[#004F54]/90 hover:to-[#66023C]/90 text-white font-bold py-4 shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <Building2 className="mr-2 h-5 w-5" />
                        {language === 'ar' ? 'ابدأ الشراء مجاناً' : 'Start Buying Free'}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <p className="text-center text-xs text-gray-500">
                      {language === 'ar' ? 'مجاني تماماً • لا توجد رسوم خفية • إلغاء في أي وقت' : 'Completely free • No hidden fees • Cancel anytime'}
                    </p>
                  </div>
                </div>
              </div>

              {/* For Vendors/Suppliers */}
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-700 animate-fade-in hover-scale" style={{ animationDelay: '0.2s' }}>
                {/* Hero Image */}
                <div className="relative h-64 bg-gradient-to-br from-[#66023C] to-[#004F54] overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Briefcase className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{language === 'ar' ? 'للموردين والتجار' : 'For Suppliers'}</h3>
                      <p className="text-white/90">{language === 'ar' ? 'تريد الوصول لعملاء جدد؟' : 'Want to reach new customers?'}</p>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/10 rounded-full"></div>
                </div>

                <div className="p-8">
                  <div className="space-y-6 mb-8">
                    {[
                      { 
                        icon: Users, 
                        title: language === 'ar' ? 'شبكة واسعة' : 'Wide Network',
                        text: language === 'ar' ? 'اوصل لأكثر من 500+ شركة نشطة' : 'Reach 500+ active companies'
                      },
                      { 
                        icon: TrendingUp, 
                        title: language === 'ar' ? 'نمو مضمون' : 'Guaranteed Growth',
                        text: language === 'ar' ? 'زد مبيعاتك بـ 40% في المتوسط' : 'Increase sales by 40% on average'
                      },
                      { 
                        icon: Target, 
                        title: language === 'ar' ? 'فرص مؤهلة' : 'Qualified Leads',
                        text: language === 'ar' ? 'احصل على طلبات مؤهلة ومناسبة' : 'Get qualified and relevant requests'
                      }
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-[#66023C]/5 to-[#004F54]/5 border border-[#66023C]/10 hover:from-[#66023C]/10 hover:to-[#004F54]/10 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#66023C] to-[#004F54] flex items-center justify-center flex-shrink-0 shadow-md">
                          <benefit.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Link to="/vendor/register" className="block">
                      <Button size="lg" className="w-full bg-gradient-to-r from-[#66023C] to-[#004F54] hover:from-[#66023C]/90 hover:to-[#004F54]/90 text-white font-bold py-4 shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <Briefcase className="mr-2 h-5 w-5" />
                        {language === 'ar' ? 'انضم كمورد' : 'Join as Supplier'}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <p className="text-center text-xs text-gray-500">
                      {language === 'ar' ? 'اشتراك مجاني • عمولة عند النجاح فقط • دعم مستمر' : 'Free signup • Success-based commission • Ongoing support'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  {language === 'ar' ? 'موثوق من قبل أفضل الشركات في المملكة' : 'Trusted by Leading Companies in Saudi Arabia'}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#66023C] text-[#66023C]" />
                      ))}
                    </div>
                    <p className="text-2xl font-bold text-gray-800">4.9/5</p>
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'تقييم المستخدمين' : 'User Rating'}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">99.9%</p>
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'معدل الأمان' : 'Security Rate'}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">&lt; 2h</p>
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'متوسط الاستجابة' : 'Avg Response'}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">100%</p>
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'موردون معتمدون' : 'Verified Suppliers'}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/pricing">
                    <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold border-2 border-[#004F54] text-[#004F54] hover:bg-[#004F54] hover:text-white transition-all duration-300">
                      {language === 'ar' ? 'شاهد خطط الأسعار' : 'View Pricing Plans'}
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="ghost" size="lg" className="px-8 py-3 text-lg font-semibold text-gray-700 hover:text-[#66023C] transition-all duration-300">
                      {language === 'ar' ? 'تعرف على المنصة' : 'Learn More'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Workflow Section */}
      <section className="py-32 px-6 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, #004F54 2px, transparent 2px)`, backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">
              {language === 'ar' ? 'كيف نعيد تشكيل المشتريات التجارية؟' : 'How We\'re Reshaping B2B Procurement'}
            </h2>
            <p className="text-lg max-w-3xl mx-auto font-light text-gray-600">
              {language === 'ar' 
                ? 'نظام ثوري يدمج الذكاء الاصطناعي مع سوق المشتريات التجارية لتقديم تجربة لا مثيل لها'
                : 'A revolutionary system that merges AI with B2B procurement marketplace to deliver an unmatched experience'}
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Revolutionary Step System */}
            <div className="relative">
              {/* Animated Connection Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-[#004F54] via-[#102C33] to-[#765A3F] transform -translate-x-1/2 hidden lg:block rounded-full shadow-lg"></div>

              {/* Step 1: AI-Powered Discovery */}
              <div className="relative mb-32 group">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="lg:w-1/2 lg:pr-16">
                     <Card className="p-4 hover:shadow-2xl transition-all duration-700 rounded-2xl bg-white border border-gray-200 shadow-sm" hoverEffect="tilt">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#004F54] to-[#102C33] rounded-2xl flex items-center justify-center shadow-lg">
                          <Search className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-[#004F54]">01</span>
                          <h3 className="text-xl font-bold text-gray-800">
                            {language === 'ar' ? 'اكتشاف ذكي' : 'AI-Powered Discovery'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-base leading-relaxed font-medium text-gray-600">
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
                        <Card key={index} hoverEffect="glow" className="p-3 hover:shadow-lg transition-all duration-500 rounded-xl bg-white border border-gray-200 shadow-sm">
                          <feature.icon className="h-5 w-5 mb-2" style={{ color: feature.color }} />
                          <div className="text-sm font-bold text-gray-800">{feature.label}</div>
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
                     <Card className="p-4 hover:shadow-2xl transition-all duration-700 rounded-2xl bg-white border border-gray-200 shadow-sm" hoverEffect="tilt">
                       <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 bg-gradient-to-br from-[#66023C] to-[#004F54] rounded-2xl flex items-center justify-center shadow-lg">
                           <MessageSquare className="h-6 w-6 text-white" />
                         </div>
                         <div>
                           <span className="text-2xl font-black text-[#66023C]">02</span>
                           <h3 className="text-xl font-bold text-gray-800">
                             {language === 'ar' ? 'تفاوض سلس' : 'Seamless Negotiation'}
                           </h3>
                         </div>
                       </div>
                       <p className="text-base leading-relaxed font-medium text-gray-600">
                         {language === 'ar' 
                           ? 'أدوات تفاوض متطورة تسهل التواصل المباشر مع الموردين وتضمن أفضل الصفقات'
                           : 'Advanced negotiation tools facilitate direct communication with vendors and ensure the best deals'}
                       </p>
                     </Card>
                   </div>
                   <div className="lg:w-1/2 lg:pr-16">
                     <div className="grid grid-cols-2 gap-6">
                       {[
                         { icon: MessageSquare, label: language === 'ar' ? 'دردشة مباشرة' : 'Real-time Chat', color: '#66023C' },
                         { icon: FileText, label: language === 'ar' ? 'مشاركة المستندات' : 'Document Sharing', color: '#004F54' },
                         { icon: BarChart3, label: language === 'ar' ? 'مقارنة الأسعار' : 'Price Comparison', color: '#765A3F' },
                         { icon: Handshake, label: language === 'ar' ? 'اتفاقيات آمنة' : 'Secure Agreements', color: '#66023C' }
                       ].map((feature, index) => (
                         <Card key={index} hoverEffect="glow" className="p-3 hover:shadow-lg transition-all duration-500 rounded-xl bg-white border border-gray-200 shadow-sm">
                           <feature.icon className="h-5 w-5 mb-2" style={{ color: feature.color }} />
                           <div className="text-sm font-bold text-gray-800">{feature.label}</div>
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
                     <Card className="p-4 hover:shadow-2xl transition-all duration-700 rounded-2xl bg-white border border-gray-200 shadow-sm" hoverEffect="tilt">
                       <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 bg-gradient-to-br from-[#004F54] to-[#66023C] rounded-2xl flex items-center justify-center shadow-lg">
                           <Shield className="h-6 w-6 text-white" />
                         </div>
                         <div>
                           <span className="text-2xl font-black text-[#004F54]">03</span>
                           <h3 className="text-xl font-bold text-gray-800">
                             {language === 'ar' ? 'إنجاز آمن' : 'Secure Completion'}
                           </h3>
                         </div>
                       </div>
                       <p className="text-base leading-relaxed font-medium text-gray-600">
                         {language === 'ar' 
                           ? 'نظام دفع آمن وتتبع الطلبات يضمن وصول منتجاتك في الوقت المحدد بأعلى جودة'
                           : 'Secure payment system and order tracking ensures your products arrive on time with the highest quality'}
                       </p>
                     </Card>
                   </div>
                   <div className="lg:w-1/2 lg:pl-16">
                     <div className="grid grid-cols-2 gap-6">
                       {[
                         { icon: CreditCard, label: language === 'ar' ? 'حماية الدفع' : 'Payment Protection', color: '#004F54' },
                         { icon: Award, label: language === 'ar' ? 'ضمان الجودة' : 'Quality Assurance', color: '#66023C' },
                         { icon: Package, label: language === 'ar' ? 'تتبع التسليم' : 'Delivery Tracking', color: '#765A3F' },
                         { icon: ThumbsUp, label: language === 'ar' ? 'رضا مضمون' : 'Guaranteed Satisfaction', color: '#004F54' }
                       ].map((feature, index) => (
                         <Card key={index} hoverEffect="glow" className="p-3 hover:shadow-lg transition-all duration-500 rounded-xl bg-white border border-gray-200 shadow-sm">
                           <feature.icon className="h-5 w-5 mb-2" style={{ color: feature.color }} />
                           <div className="text-sm font-bold text-gray-800">{feature.label}</div>
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
      <section className="py-32 px-6 relative overflow-hidden bg-white">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">
              {language === 'ar' ? 'منصتنا الذكية' : 'Our Smart Platform'}
            </h2>
            <p className="text-lg max-w-3xl mx-auto font-light text-gray-600">
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
                color: '#66023C'
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
                color: '#66023C'
              }
            ].map((feature, index) => (
              <Card key={index} hoverEffect="scale" className="p-6 hover:shadow-2xl transition-all duration-500 bg-white border border-gray-200 shadow-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-gray-200" style={{ backgroundColor: `${feature.color}10` }}>
                    <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 font-light leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services & Benefits Section */}
      <section className="py-32 px-6 relative overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-gray-800">
              {language === 'ar' ? 'خدماتنا ومزايانا' : 'Our Services & Benefits'}
            </h2>
            <p className="text-lg max-w-3xl mx-auto font-light text-gray-600">
              {language === 'ar' 
                ? 'نقدم مجموعة واسعة من الخدمات لتلبية احتياجات أعمالك'
                : 'We offer a wide range of services to meet your business needs'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-7xl mx-auto">
            {/* Our Services */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-black mb-4 text-gray-800">
                  {language === 'ar' ? 'خدماتنا' : 'Our Services'}
                </h3>
                <p className="text-gray-600 font-light">
                  {language === 'ar' ? 'نقدم مجموعة واسعة من الخدمات لتلبية احتياجات أعمالك' : 'We offer a wide range of services to meet your business needs.'}
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Users,
                    title: language === 'ar' ? 'إدارة الموردين' : 'Supplier Management',
                    desc: language === 'ar' ? 'ابحث وأدر أفضل الموردين بكفاءة' : 'Find and manage top suppliers efficiently.',
                    color: '#66023C'
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
                    color: '#66023C'
                  }
                ].map((service, index) => (
                  <Card key={index} hoverEffect="lift" className="p-6 hover:shadow-2xl transition-all duration-500 bg-white border border-gray-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200" style={{ backgroundColor: `${service.color}10` }}>
                        <service.icon className="h-6 w-6" style={{ color: service.color }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-2 text-gray-800">{service.title}</h4>
                        <p className="text-gray-600 font-light">{service.desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-black mb-4 text-gray-800">
                  {language === 'ar' ? 'مزايا استخدام منصتنا' : 'Benefits of Using Our Platform'}
                </h3>
                <p className="text-gray-600 font-light">
                  {language === 'ar' ? 'اكتشف كيف يمكن لمنصتنا مساعدتك في تحقيق أهداف عملك' : 'Discover how our platform can help you achieve your business goals.'}
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    icon: DollarSign,
                    title: language === 'ar' ? 'توفير التكاليف' : 'Cost Savings',
                    desc: language === 'ar' ? 'قلل من التكاليف التشغيلية وزد من الكفاءة' : 'Reduce operational costs and increase efficiency.',
                    color: '#004F54'
                  },
                  {
                    icon: Clock,
                    title: language === 'ar' ? 'توفير الوقت' : 'Time Savings',
                    desc: language === 'ar' ? 'بسّط العمليات واحفظ وقتاً ثميناً' : 'Streamline processes and save valuable time.',
                    color: '#66023C'
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
                    color: '#004F54'
                  }
                ].map((benefit, index) => (
                  <Card key={index} hoverEffect="lift" className="p-6 hover:shadow-2xl transition-all duration-500 bg-white border border-gray-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200" style={{ backgroundColor: `${benefit.color}10` }}>
                        <benefit.icon className="h-6 w-6" style={{ color: benefit.color }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-2 text-gray-800">{benefit.title}</h4>
                        <p className="text-gray-600 font-light">{benefit.desc}</p>
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
      <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-r from-[#004F54] via-[#102C33] to-[#66023C]">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-white">
              {language === 'ar' ? 'انضم إلى الثورة' : 'Join the Revolution'}
            </h2>
            <p className="text-lg text-white/80 font-light max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'كن جزءاً من مستقبل التجارة الإلكترونية B2B وابدأ رحلتك معنا اليوم'
                : 'Be part of the future of B2B e-commerce and start your journey with us today'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" animation="spring" className="px-8 py-3 bg-white text-[#004F54] hover:bg-gray-100 transition-all duration-300 text-lg font-semibold shadow-xl hover:shadow-2xl">
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

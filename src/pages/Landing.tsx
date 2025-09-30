import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import mwrdLogo from "@/assets/mwrd-logo.png";
import { useOptionalAuth } from "@/contexts/useOptionalAuth";
import { useState, useEffect } from "react";
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

  // Auto-switch between cards every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAudience(prev => prev === 'buyers' ? 'vendors' : 'buyers');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
        <div className="container mx-auto px-6 h-20 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          
          {/* Logo - Right side in RTL, Left side in LTR */}
          <div className={`flex items-center ${isRTL ? 'col-start-3 justify-end' : 'col-start-1 justify-start'}`}>
            <Link to={user && userProfile ? "/dashboard" : "/"} className="flex items-center gap-3 group">
              <img 
                src={mwrdLogo} 
                alt="MWRD Logo" 
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
              />
            </Link>
          </div>

          {/* Desktop Navigation Menu - Always Centered */}
          <nav className="hidden lg:flex items-center gap-6 col-start-2 justify-center">
            <Link to="/why-start-with-mwrd" className="text-gray-700 hover:text-[#004F54] transition-colors text-sm font-medium">
              {language === 'ar' ? 'لماذا نبدأ معنا' : 'Why Start with Us'}
            </Link>
            <Link to="/why-entrepreneurship" className="text-gray-700 hover:text-[#004F54] transition-colors text-sm font-medium">
              {language === 'ar' ? 'لماذا ريادة الأعمال' : 'Why Entrepreneurship'}
            </Link>
            <Link to="/our-services" className="text-gray-700 hover:text-[#004F54] transition-colors text-sm font-medium">
              {language === 'ar' ? 'خدماتنا' : 'Our Services'}
            </Link>
            <Link to="/contact-us" className="text-gray-700 hover:text-[#004F54] transition-colors text-sm font-medium">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </nav>
          
          {/* Auth Buttons + Language Switcher - Left side in RTL, Right side in LTR */}
          <div className={`flex items-center gap-4 ${isRTL ? 'col-start-1 justify-end' : 'col-start-3 justify-end'}`}>
            {user && userProfile ? (
              <Link to="/dashboard" className="hidden md:block">
                <Button size="lg" animation="lift" className="px-8 hover:shadow-2xl transition-all duration-500 bg-[#004F54] hover:bg-[#004F54]/90 border border-[#004F54] text-white">
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register" className="hidden md:block">
                  <Button size="lg" animation="lift" className="px-8 hover:shadow-2xl transition-all duration-500 bg-[#004F54] hover:bg-[#004F54]/90 border border-[#004F54] text-white">
                    {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                  </Button>
                </Link>
                <Link to="/login" className="hidden md:block">
                  <Button variant="ghost" size="lg" animation="scale" className="px-6 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 transition-all duration-300">
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </Link>
              </>
            )}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <div className="md:hidden">
              <MobileNavigation />
            </div>
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

            {/* Stunning Hero Card */}
            <div className="max-w-6xl mx-auto mb-20">
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.4)] transition-all duration-700 animate-fade-in border border-gray-100">
                
                {/* Elegant Toggle Buttons */}
                <div className="absolute top-6 left-6 z-30 flex gap-2">
                  <button
                    onClick={() => setActiveAudience('buyers')}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border",
                      activeAudience === 'buyers'
                        ? "bg-[#004F54] text-white shadow-lg border-[#004F54] scale-105"
                        : "bg-white/90 text-gray-700 hover:bg-gray-50 border-gray-200 hover:scale-102"
                    )}
                  >
                    <Building2 className="w-4 h-4 inline-block mr-2" />
                    {language === 'ar' ? 'للشركات' : 'Companies'}
                  </button>
                  <button
                    onClick={() => setActiveAudience('vendors')}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border",
                      activeAudience === 'vendors'
                        ? "bg-[#66023C] text-white shadow-lg border-[#66023C] scale-105"
                        : "bg-white/90 text-gray-700 hover:bg-gray-50 border-gray-200 hover:scale-102"
                    )}
                  >
                    <Briefcase className="w-4 h-4 inline-block mr-2" />
                    {language === 'ar' ? 'للموردين' : 'Suppliers'}
                  </button>
                </div>

                {/* Clean Progress Dots */}
                <div className="absolute top-6 right-6 z-30">
                  <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      activeAudience === 'buyers' ? "bg-[#004F54] scale-125" : "bg-gray-300"
                    )}></div>
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      activeAudience === 'vendors' ? "bg-[#66023C] scale-125" : "bg-gray-300"
                    )}></div>
                  </div>
                </div>

                {/* Content Container */}
                <div className="relative">
                  {/* Buyers Content */}
                  <div className={cn(
                    "transition-all duration-700 ease-out",
                    activeAudience === 'buyers' 
                      ? "opacity-100 translate-x-0" 
                      : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
                  )}>
                    {/* Hero Section with Clear Contrast */}
                    <div className="relative h-80 bg-gradient-to-br from-[#004F54] to-[#003A40] overflow-hidden">
                      <div className="absolute inset-0 bg-black/40"></div>
                      
                      {/* Subtle Background Elements */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
                      </div>
                      
                      <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="text-center text-white p-8">
                          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30 shadow-xl">
                            <Building2 className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white drop-shadow-lg">
                            {language === 'ar' ? 'للشركات والمؤسسات' : 'For Companies & Enterprises'}
                          </h3>
                          <p className="text-lg text-white/95 font-medium drop-shadow">
                            {language === 'ar' ? 'تبحث عن موردين موثوقين؟' : 'Looking for reliable suppliers?'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Clean Content Section */}
                    <div className="p-8 md:p-12 bg-white">
                      <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-10">
                        {[
                          { 
                            icon: Search, 
                            title: language === 'ar' ? 'بحث ذكي' : 'AI-Powered Search',
                            text: language === 'ar' ? 'ابحث في آلاف الموردين المؤهلين' : 'Search thousands of qualified suppliers',
                            color: 'bg-blue-500'
                          },
                          { 
                            icon: Clock, 
                            title: language === 'ar' ? 'استجابة سريعة' : 'Lightning Response',
                            text: language === 'ar' ? 'احصل على عروض أسعار في دقائق' : 'Get quotes in minutes, not weeks',
                            color: 'bg-green-500'
                          },
                          { 
                            icon: DollarSign, 
                            title: language === 'ar' ? 'توفير مضمون' : 'Guaranteed Savings',
                            text: language === 'ar' ? 'وفر 15-30% من تكاليف المشتريات' : 'Save 15-30% on procurement costs',
                            color: 'bg-orange-500'
                          }
                        ].map((benefit, index) => (
                          <div key={index} className="text-center group">
                            <div className={cn(
                              "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110",
                              benefit.color
                            )}>
                              <benefit.icon className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 text-base">{benefit.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{benefit.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="text-center">
                        <Link to="/register" className="inline-block">
                          <Button size="lg" className="px-8 md:px-12 py-4 bg-gradient-to-r from-[#004F54] to-[#66023C] hover:from-[#003A40] hover:to-[#4A0229] text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 group text-base rounded-xl hover:scale-105">
                            <Building2 className="mr-3 h-5 w-5" />
                            {language === 'ar' ? 'ابدأ الشراء مجاناً' : 'Start Buying Free'}
                            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                        <p className="mt-4 text-sm text-gray-500">
                          {language === 'ar' ? 'مجاني تماماً • لا توجد رسوم خفية • إلغاء في أي وقت' : 'Completely free • No hidden fees • Cancel anytime'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vendors Content */}
                  <div className={cn(
                    "transition-all duration-700 ease-out",
                    activeAudience === 'vendors' 
                      ? "opacity-100 translate-x-0" 
                      : "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
                  )}>
                    {/* Hero Section with Clear Contrast */}
                    <div className="relative h-80 bg-gradient-to-br from-[#66023C] to-[#4A0229] overflow-hidden">
                      <div className="absolute inset-0 bg-black/40"></div>
                      
                      {/* Subtle Background Elements */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
                      </div>
                      
                      <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="text-center text-white p-8">
                          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30 shadow-xl">
                            <Briefcase className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white drop-shadow-lg">
                            {language === 'ar' ? 'للموردين والتجار' : 'For Suppliers & Vendors'}
                          </h3>
                          <p className="text-lg text-white/95 font-medium drop-shadow">
                            {language === 'ar' ? 'تريد الوصول لعملاء جدد؟' : 'Want to reach new customers?'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 md:p-12 bg-white">
                      <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-10">
                        {[
                          { 
                            icon: Users, 
                            title: language === 'ar' ? 'شبكة واسعة' : 'Extensive Network',
                            text: language === 'ar' ? 'اوصل لأكثر من 500+ شركة نشطة' : 'Reach 500+ active companies',
                            color: 'bg-purple-500'
                          },
                          { 
                            icon: TrendingUp, 
                            title: language === 'ar' ? 'نمو مضمون' : 'Guaranteed Growth',
                            text: language === 'ar' ? 'زد مبيعاتك بـ 40% في المتوسط' : 'Increase sales by 40% on average',
                            color: 'bg-emerald-500'
                          },
                          { 
                            icon: Target, 
                            title: language === 'ar' ? 'فرص مؤهلة' : 'Qualified Leads',
                            text: language === 'ar' ? 'احصل على طلبات مؤهلة ومناسبة' : 'Get qualified and relevant requests',
                            color: 'bg-red-500'
                          }
                        ].map((benefit, index) => (
                          <div key={index} className="text-center group">
                            <div className={cn(
                              "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110",
                              benefit.color
                            )}>
                              <benefit.icon className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 text-base">{benefit.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{benefit.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="text-center">
                        <Link to="/vendor/register" className="inline-block">
                          <Button size="lg" className="px-8 md:px-12 py-4 bg-gradient-to-r from-[#66023C] to-[#004F54] hover:from-[#4A0229] hover:to-[#003A40] text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 group text-base rounded-xl hover:scale-105">
                            <Briefcase className="mr-3 h-5 w-5" />
                            {language === 'ar' ? 'انضم كمورد' : 'Join as Supplier'}
                            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                        <p className="mt-4 text-sm text-gray-500">
                          {language === 'ar' ? 'اشتراك مجاني • عمولة عند النجاح فقط • دعم مستمر' : 'Free signup • Success-based commission • Ongoing support'}
                        </p>
                      </div>
                    </div>
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

      {/* Live Opportunities Visualization Section */}
      <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50">
        
        {/* New Opportunities Visualization */}
        <div className="container mx-auto relative z-10 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Content Section */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <div className="inline-block">
                  <div className="px-4 py-2 text-sm text-green-700 rounded-full bg-green-100 border border-green-200 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {language === 'ar' ? 'فرص جديدة هذا الأسبوع' : 'New Opportunities This Week'}
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight">
                  {language === 'ar' ? (
                    <>
                      اوصل لآلاف <br />
                      <span className="bg-gradient-to-r from-[#004F54] to-[#66023C] bg-clip-text text-transparent">
                        الأعمال
                      </span>
                    </>
                  ) : (
                    <>
                      Reach Thousands of <br />
                      <span className="bg-gradient-to-r from-[#004F54] to-[#66023C] bg-clip-text text-transparent">
                        Businesses
                      </span>
                    </>
                  )}
                </h2>
                
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  {language === 'ar' 
                    ? 'انضم إلى شبكة الموردين واحصل على طلبات مؤهلة من الشركات التي تبحث بنشاط عن خدماتك - بدون تكاليف تسويق عالية.'
                    : 'Join our supplier network and receive qualified requests from companies actively looking for your services - without high marketing costs.'}
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                {[
                  { 
                    icon: TrendingUp, 
                    text: language === 'ar' ? 'زيادة المبيعات بنسبة 60% في المتوسط' : 'Increase sales by 60% on average'
                  },
                  { 
                    icon: Users, 
                    text: language === 'ar' ? 'وصول لأكثر من 500+ شركة نشطة' : 'Access 500+ active companies'
                  },
                  { 
                    icon: DollarSign, 
                    text: language === 'ar' ? 'عمولة فقط عند نجاح الصفقة' : 'Commission only on successful deals'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-gray-200/50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <Link to="/vendor/register">
                <Button size="lg" className="bg-gradient-to-r from-[#004F54] to-[#66023C] hover:from-[#004F54]/90 hover:to-[#66023C]/90 text-white font-bold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Rocket className="mr-2 h-5 w-5" />
                  {language === 'ar' ? 'انضم كمورد' : 'Join as Vendor'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Live Opportunities Card */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {language === 'ar' ? 'فرص جديدة' : 'New Opportunities'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? 'هذا الأسبوع' : 'This week'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">
                        {language === 'ar' ? 'متوسط التوفير' : 'Avg. Commission'}
                      </div>
                      <div className="text-lg font-black text-green-700">8%</div>
                    </div>
                  </div>
                </div>

                {/* Opportunities List */}
                <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
                  {[
                    {
                      company: language === 'ar' ? 'شركة الإلكترونيات السعودية' : 'Saudi Electronics Co.',
                      category: language === 'ar' ? 'الإلكترونيات' : 'Electronics',
                      value: 'SAR 45,000',
                      urgent: true,
                      color: 'bg-green-100'
                    },
                    {
                      company: language === 'ar' ? 'شركة الرياض للإنشاءات' : 'Al-Riyadh Construction',
                      category: language === 'ar' ? 'الإنشاءات' : 'Construction', 
                      value: 'SAR 78,500',
                      urgent: false,
                      color: 'bg-blue-100'
                    },
                    {
                      company: language === 'ar' ? 'حلول المكاتب الحديثة' : 'Modern Office Solutions',
                      category: language === 'ar' ? 'لوازم المكاتب' : 'Office Supplies',
                      value: 'SAR 32,000',
                      urgent: true,
                      color: 'bg-purple-100'
                    },
                    {
                      company: language === 'ar' ? 'الشركة التقنية المتطورة' : 'Advanced Tech Corp',
                      category: language === 'ar' ? 'التقنية' : 'Technology',
                      value: 'SAR 155,500',
                      urgent: false,
                      color: 'bg-orange-100'
                    }
                  ].map((opportunity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${opportunity.color} flex items-center justify-center`}>
                          <Building2 className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800 text-sm">{opportunity.company}</h4>
                            {opportunity.urgent && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                                {language === 'ar' ? 'عاجل' : 'Urgent'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{opportunity.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800 text-sm">{opportunity.value}</div>
                        <div className="text-xs text-gray-500">
                          {language === 'ar' ? 'قيمة المشروع' : 'project value'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        {language === 'ar' ? 'وقت الموافقة' : 'Approval Time'}
                      </span>
                    </div>
                    <div className="font-bold text-blue-700">
                      {language === 'ar' ? '24 ساعة' : '24h'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RFQ Requests Visualization */}
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Live RFQ Requests Card - Left Side */}
            <div className="order-2 lg:order-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#66023C] to-purple-600 rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {language === 'ar' ? 'طلبات عروض الأسعار' : 'RFQ Request'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? 'قبل دقائق' : '4 minutes ago'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">
                        {language === 'ar' ? 'متوسط التوفير' : 'Avg. Savings'}
                      </div>
                      <div className="text-lg font-black text-green-700">23%</div>
                    </div>
                  </div>
                </div>

                {/* RFQ List */}
                <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
                  {[
                    {
                      company: language === 'ar' ? 'شركة الحلول التقنية' : 'Tech Solutions Co.',
                      rating: '4.9',
                      reviews: '+2k',
                      value: 'SAR 15,750',
                      category: language === 'ar' ? 'تطوير البرمجيات' : 'Software Development',
                      color: 'bg-blue-100'
                    },
                    {
                      company: language === 'ar' ? 'اللوازم المتميزة' : 'Premier Supplies',
                      rating: '4.8',
                      reviews: '+1k', 
                      value: 'SAR 16,200',
                      category: language === 'ar' ? 'اللوازم المكتبية' : 'Office Supplies',
                      color: 'bg-green-100'
                    },
                    {
                      company: language === 'ar' ? 'الشركاء العالميون' : 'Global Partners',
                      rating: '4.7',
                      reviews: '+30m',
                      value: 'SAR 14,990',
                      category: language === 'ar' ? 'الخدمات اللوجستية' : 'Logistics Services',
                      color: 'bg-purple-100'
                    }
                  ].map((rfq, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${rfq.color} flex items-center justify-center`}>
                          <Building2 className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800 text-sm">{rfq.company}</h4>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs font-medium text-gray-600">{rfq.rating}</span>
                              <span className="text-xs text-gray-400">{rfq.reviews}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">{rfq.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800 text-sm">{rfq.value}</div>
                        <div className="text-xs text-gray-500">
                          {language === 'ar' ? 'شامل الضريبة' : 'inc. VAT'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        {language === 'ar' ? 'وقت الاستجابة' : 'Response Time'}
                      </span>
                    </div>
                    <div className="font-bold text-blue-700">
                      {language === 'ar' ? '< ساعتان' : '< 2h'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section - Right Side */}
            <div className="order-1 lg:order-2 space-y-8 animate-fade-in">
              <div className="space-y-6">
                <div className="inline-block">
                  <div className="px-4 py-2 text-sm text-red-700 rounded-full bg-red-100 border border-red-200 shadow-sm flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {language === 'ar' ? 'صعوبة في العثور على موردين موثوقين؟' : 'Struggling to find reliable suppliers?'}
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight">
                  {language === 'ar' ? (
                    <>
                      تواصل مع أفضل <br />
                      <span className="bg-gradient-to-r from-[#66023C] to-[#004F54] bg-clip-text text-transparent">
                        الموردين في ثواني
                      </span>
                    </>
                  ) : (
                    <>
                      Connect with <br />
                      <span className="bg-gradient-to-r from-[#66023C] to-[#004F54] bg-clip-text text-transparent">
                        Top Suppliers in Seconds
                      </span>
                    </>
                  )}
                </h2>
                
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  {language === 'ar' 
                    ? 'أرسل طلباً واحداً واحصل على عروض أسعار تنافسية من موردين مؤهلين في دقائق - بدلاً من أسابيع من البحث والمفاوضات.'
                    : 'Send one request and get competitive quotes from qualified vendors in minutes - instead of weeks of searching and negotiations.'}
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                {[
                  { 
                    icon: Clock, 
                    text: language === 'ar' ? 'توفير 80% من وقت البحث عن الموردين' : 'Save 80% of supplier search time'
                  },
                  { 
                    icon: DollarSign, 
                    text: language === 'ar' ? 'احصل على أسعار أفضل بنسبة 15-30%' : 'Get 15-30% better prices'
                  },
                  { 
                    icon: Shield, 
                    text: language === 'ar' ? '100% موردون معتمدون ومؤهلون' : '100% verified & qualified suppliers'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-gray-200/50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#66023C] to-purple-600 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-[#66023C] to-[#004F54] hover:from-[#66023C]/90 hover:to-[#004F54]/90 text-white font-bold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Rocket className="mr-2 h-5 w-5" />
                  {language === 'ar' ? 'ابدأ الشراء مجاناً' : 'Start Buying Free'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
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
      <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 border-t border-gray-200/30">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2760%27%20height=%2760%27%20viewBox=%270%200%2060%2060%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%3E%3Cg%20fill=%27%23f1f5f9%27%20fill-opacity=%270.5%27%3E%3Ccircle%20cx=%277%27%20cy=%277%27%20r=%271%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Main CTA Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-12 md:p-16 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-100 to-primary-100 rounded-full blur-2xl opacity-50"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-6">
                  {language === 'ar' ? 'انضم إلى الثورة' : 'Join the Revolution'}
                </h2>
                <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                  {language === 'ar' 
                    ? 'كن جزءاً من مستقبل التجارة الإلكترونية B2B وابدأ رحلتك معنا اليوم'
                    : 'Be part of the future of B2B e-commerce and start your journey with us today'}
                </p>
                
                {/* Features row */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  {[
                    { 
                      icon: Rocket, 
                      title: language === 'ar' ? 'نمو سريع' : 'Rapid Growth',
                      desc: language === 'ar' ? 'نمو مؤكد' : 'Proven results'
                    },
                    { 
                      icon: Shield, 
                      title: language === 'ar' ? 'أمان تام' : 'Total Security',
                      desc: language === 'ar' ? 'حماية كاملة' : 'Full protection'
                    },
                    { 
                      icon: Users2, 
                      title: language === 'ar' ? 'شبكة واسعة' : 'Wide Network',
                      desc: language === 'ar' ? 'آلاف الشركات' : 'Thousands of companies'
                    }
                  ].map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <feature.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button size="lg" animation="spring" className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg rounded-2xl hover:scale-105">
                      <Rocket className="mr-3 h-5 w-5" />
                      {language === 'ar' ? 'ابدأ رحلتك' : 'Start Your Journey'}
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
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

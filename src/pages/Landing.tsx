import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptionalAuth } from "@/contexts/useOptionalAuth";
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
  UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { BackToTop } from "@/components/ui/BackToTop";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const Landing = () => {
  const { t, language } = useLanguage();
  const auth = useOptionalAuth();
  const user = auth?.user;
  const userProfile = auth?.userProfile;
  const loading = auth?.loading;

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
    <div className="min-h-screen bg-background overflow-hidden">
      <SmoothScroll />
      
      {/* Ultra-Modern Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-filter backdrop-blur-xl border-b border-white/10" style={{ background: 'var(--gradient-header)' }}>
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
          
          <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse order-1' : 'order-3'}`}>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            {user && userProfile ? (
              <Link to="/dashboard" className="hidden md:block">
                <Button size="lg" className="px-8 hover:shadow-2xl transition-all duration-500 hover:scale-105" style={{ background: 'var(--gradient-button-primary)' }}>
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" className="hidden md:block">
                  <Button variant="ghost" size="lg" className="px-6 hover:bg-white/10 transition-all duration-300">
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </Link>
                <Link to="/auth" className="hidden md:block">
                  <Button size="lg" className="px-8 hover:shadow-2xl transition-all duration-500 hover:scale-105" style={{ background: 'var(--gradient-button-secondary)' }}>
                    {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                  </Button>
                </Link>
              </>
            )}
            <MobileNavigation />
          </div>
        </div>
      </header>

      {/* Clean Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--gradient-hero-bg)' }}>
        
        <div className="container mx-auto px-6 text-center relative z-10 pt-20">
          <div className="max-w-6xl mx-auto">
            {/* Revolutionary Badge */}
            <div className="inline-flex items-center gap-3 killer-card rounded-full px-8 py-4 mb-12 animate-fade-in">
              <Sparkles className="h-5 w-5 text-[#FBA765]" />
              <span className="text-lg font-semibold gradient-text-accent">
                {language === 'ar' ? 'ثورة في عالم المشتريات التجارية' : 'The Future of B2B Procurement Marketplace Starts Here'}
              </span>
            </div>
            
            {/* Killer Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none animate-fade-in-up">
              <div className="gradient-text-hero font-black">
                {language === 'ar' ? 'اكتشف' : 'Discover'}
              </div>
              <div className="text-white/90 text-4xl md:text-5xl lg:text-6xl font-medium mt-4">
                {language === 'ar' ? 'تواصل • اربح • انمو' : 'Connect • Scale • Thrive'}
              </div>
            </h1>
            
            {/* Revolutionary Subtitle */}
            <p className="text-2xl md:text-3xl text-white/80 mb-16 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in-up">
              {language === 'ar' 
                ? 'انضم إلى النظام البيئي الأقوى لسوق المشتريات التجارية حيث تلتقي الابتكارات مع الفرص اللامحدودة'
                : 'Join the most powerful B2B procurement marketplace ecosystem where innovation meets unlimited opportunities'}
            </p>
            
            {/* Killer CTA Buttons */}
            <div className="flex flex-col lg:flex-row gap-8 justify-center mb-20 animate-scale-in">
              <Link to="/auth" className="group">
                <Button size="lg" className="px-16 py-8 text-xl font-bold hover:shadow-[0_0_50px_rgba(102,2,60,0.8)] transition-all duration-500 hover:scale-110 rounded-full" style={{ background: 'var(--gradient-button-primary)' }}>
                  <Rocket className={`h-7 w-7 ${language === 'ar' ? 'ml-3' : 'mr-3'} group-hover:rotate-12 transition-transform duration-500`} />
                  {language === 'ar' ? 'ابدأ رحلة النجاح' : 'Launch Your Success'}
                </Button>
              </Link>
              <Link to="/auth" className="group">
                <Button variant="outline" size="lg" className="px-16 py-8 text-xl font-bold glass-card border-2 text-white hover:bg-orange/20 hover:shadow-[0_0_50px_rgba(251,167,101,0.8)] transition-all duration-500 hover:scale-110 rounded-full" style={{ borderColor: 'var(--orange)' }}>
                  <Globe className={`h-7 w-7 ${language === 'ar' ? 'ml-3' : 'mr-3'} group-hover:rotate-180 transition-transform duration-700`} />
                  {language === 'ar' ? 'استكشف السوق' : 'Explore Marketplace'}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators - Matching Reference Design */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto animate-fade-in">
              {[
                { 
                  icon: FileText, 
                  title: language === 'ar' ? 'نظام طلب التسعير' : 'RFQ System',
                  subtitle: language === 'ar' ? 'عروض ذكية' : 'Smart bidding',
                  count: "24", 
                  label: language === 'ar' ? 'طلبات نشطة' : 'Active RFQs', 
                  color: '#8B5CF6'
                },
                { 
                  icon: Users, 
                  title: language === 'ar' ? 'الموردون' : 'Vendors',
                  subtitle: language === 'ar' ? 'موردون موثقون' : 'Verified suppliers',
                  count: "1,247", 
                  label: language === 'ar' ? 'موردون نشطون' : 'Active vendors', 
                  color: '#3B82F6'
                },
                { 
                  icon: Shield, 
                  title: language === 'ar' ? 'آمان' : 'Secure',
                  subtitle: language === 'ar' ? 'معاملات موثقة' : 'Verified transactions',
                  count: "99.9%", 
                  label: language === 'ar' ? 'معدل النجاح' : 'Success rate', 
                  color: '#10B981'
                },
                { 
                  icon: Clock, 
                  title: language === 'ar' ? 'سريع' : 'Fast',
                  subtitle: language === 'ar' ? 'متوسط الاستجابة' : 'Average response',
                  count: "4.2h", 
                  label: language === 'ar' ? 'وقت استجابة العرض' : 'Bid response time', 
                  color: '#F59E0B'
                }
              ].map((stat, index) => (
                <Card key={index} className="card-trust group hover:scale-105 transition-all duration-700 animate-fade-in p-4" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${stat.color}20`, border: `1px solid ${stat.color}50` }}>
                      <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-white leading-tight">{stat.title}</div>
                      <div className="text-xs text-white/60 leading-tight">{stat.subtitle}</div>
                    </div>
                  </div>
                  
                  <div className="text-2xl font-black text-white mb-1">{stat.count}</div>
                  <div className="text-xs text-white/70 font-medium leading-tight">{stat.label}</div>
                  
                  {/* Progress bar for visual consistency */}
                  <div className="w-full bg-white/10 rounded-full h-1 mt-3">
                    <div className="h-1 rounded-full" style={{ 
                      backgroundColor: stat.color, 
                      width: stat.count === '99.9%' ? '99%' : stat.count === '24' ? '60%' : stat.count === '1,247' ? '85%' : '70%' 
                    }}></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Revolutionary Workflow Section */}
      <section className="py-32 px-6 bg-section-2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, #FBA765 2px, transparent 2px)`, backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">
              {language === 'ar' ? 'كيف نعيد تشكيل المشتريات التجارية؟' : 'How We\'re Reshaping B2B Procurement'}
            </h2>
            <p className="text-2xl text-white/70 max-w-3xl mx-auto font-light">
              {language === 'ar' 
                ? 'نظام ثوري يدمج الذكاء الاصطناعي مع سوق المشتريات التجارية لتقديم تجربة لا مثيل لها'
                : 'A revolutionary system that merges AI with B2B procurement marketplace to deliver an unmatched experience'}
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Revolutionary Step System */}
            <div className="relative">
              {/* Animated Connection Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-[#FBA765] via-[#66023C] to-[#004F54] transform -translate-x-1/2 hidden lg:block rounded-full shadow-2xl"></div>

              {/* Step 1: AI-Powered Discovery */}
              <div className="relative mb-32 group">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="lg:w-1/2 lg:pr-16">
                     <Card className="p-12 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-[0_25px_80px_rgba(251,167,101,0.3)] transition-all duration-700 hover:scale-105 rounded-3xl">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#66023C] to-[#004F54] rounded-3xl flex items-center justify-center shadow-xl">
                          <Search className="h-10 w-10 text-white" />
                        </div>
                        <div>
                          <span className="text-4xl font-black text-[#FBA765]">01</span>
                          <h3 className="text-3xl font-bold text-white">
                            {language === 'ar' ? 'اكتشاف ذكي' : 'AI-Powered Discovery'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xl text-white/80 leading-relaxed font-medium">
                        {language === 'ar' 
                          ? 'تقنية الذكاء الاصطناعي تحلل احتياجاتك وتوصلك بأفضل الموردين في ثوانٍ. اكتشف فرصاً لم تتخيلها من قبل'
                          : 'AI technology analyzes your needs and connects you with the best suppliers in seconds. Discover opportunities you never imagined'}
                      </p>
                    </Card>
                  </div>
                  <div className="lg:w-1/2 lg:pl-16">
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { icon: Target, label: language === 'ar' ? 'دقة 99%' : '99% Accuracy', color: '#66023C' },
                        { icon: Zap, label: language === 'ar' ? 'استجابة فورية' : 'Instant Response', color: '#FBA765' },
                        { icon: Eye, label: language === 'ar' ? 'رؤى متقدمة' : 'Advanced Insights', color: '#004F54' },
                        { icon: TrendingUp, label: language === 'ar' ? 'نمو مضمون' : 'Guaranteed Growth', color: '#765A3F' }
                      ].map((feature, index) => (
                        <Card key={index} className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl">
                          <feature.icon className="h-8 w-8 mb-4" style={{ color: feature.color }} />
                          <div className="text-lg font-bold text-white">{feature.label}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 bottom-0 w-8 h-8 bg-gradient-to-br from-[#66023C] to-[#FBA765] rounded-full transform -translate-x-1/2 translate-y-4 hidden lg:block shadow-2xl"></div>
              </div>

              {/* Step 2: Seamless Negotiation */}
              <div className="relative mb-32 group">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                  <div className="lg:w-1/2 lg:pl-16">
                    <Card className="p-12 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-[0_25px_80px_rgba(251,167,101,0.3)] transition-all duration-700 hover:scale-105 rounded-3xl">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#FBA765] to-[#765A3F] rounded-3xl flex items-center justify-center shadow-xl">
                          <MessageSquare className="h-10 w-10 text-white" />
                        </div>
                        <div>
                          <span className="text-4xl font-black text-[#FBA765]">02</span>
                          <h3 className="text-3xl font-bold text-white">
                            {language === 'ar' ? 'تفاوض سلس' : 'Seamless Negotiation'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xl text-white/80 leading-relaxed font-medium">
                        {language === 'ar' 
                          ? 'منصة تفاوض متطورة مع ترجمة فورية وتحليل السوق الذكي. كل صفقة محمية بضمانات متعددة الطبقات'
                          : 'Advanced negotiation platform with real-time translation and smart market analysis. Every deal protected by multi-layered guarantees'}
                      </p>
                    </Card>
                  </div>
                  <div className="lg:w-1/2 lg:pr-16">
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { icon: Shield, label: language === 'ar' ? 'حماية كاملة' : 'Full Protection', color: '#FBA765' },
                        { icon: Globe, label: language === 'ar' ? 'ترجمة فورية' : 'Live Translation', color: '#004F54' },
                        { icon: BarChart3, label: language === 'ar' ? 'تحليل السوق' : 'Market Analysis', color: '#66023C' },
                        { icon: HeartHandshake, label: language === 'ar' ? 'ثقة متبادلة' : 'Mutual Trust', color: '#765A3F' }
                      ].map((feature, index) => (
                        <Card key={index} className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl">
                          <feature.icon className="h-8 w-8 mb-4" style={{ color: feature.color }} />
                          <div className="text-lg font-bold text-white">{feature.label}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 bottom-0 w-8 h-8 bg-gradient-to-br from-[#FBA765] to-[#004F54] rounded-full transform -translate-x-1/2 translate-y-4 hidden lg:block shadow-2xl"></div>
              </div>

              {/* Step 3: Secure Completion */}
              <div className="relative group">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="lg:w-1/2 lg:pr-16">
                    <Card className="p-12 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-[0_25px_80px_rgba(0,79,84,0.3)] transition-all duration-700 hover:scale-105 rounded-3xl">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#004F54] to-[#102C33] rounded-3xl flex items-center justify-center shadow-xl">
                          <CreditCard className="h-10 w-10 text-white" />
                        </div>
                        <div>
                          <span className="text-4xl font-black text-[#004F54]">03</span>
                          <h3 className="text-3xl font-bold text-white">
                            {language === 'ar' ? 'إنجاز آمن' : 'Secure Completion'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xl text-white/80 leading-relaxed font-medium">
                        {language === 'ar' 
                          ? 'نظام دفع متقدم مع تشفير عسكري وضمانات استرداد كاملة. تتبع الشحنات والجودة في الوقت الفعلي'
                          : 'Advanced payment system with military-grade encryption and full refund guarantees. Real-time shipment and quality tracking'}
                      </p>
                    </Card>
                  </div>
                  <div className="lg:w-1/2 lg:pl-16">
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { icon: CreditCard, label: language === 'ar' ? 'دفع آمن' : 'Secure Payment', color: '#004F54' },
                        { icon: Clock, label: language === 'ar' ? 'تتبع فوري' : 'Real-time Tracking', color: '#FBA765' },
                        { icon: CheckCircle, label: language === 'ar' ? 'ضمان الجودة' : 'Quality Assurance', color: '#66023C' },
                        { icon: Award, label: language === 'ar' ? 'خدمة مميزة' : 'Premium Service', color: '#765A3F' }
                      ].map((feature, index) => (
                        <Card key={index} className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl">
                          <feature.icon className="h-8 w-8 mb-4" style={{ color: feature.color }} />
                          <div className="text-lg font-bold text-white">{feature.label}</div>
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

      {/* Revolutionary Split Benefits Section */}
      <section className="py-32 px-6 bg-section-3 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] floating-orb opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] floating-orb-2 opacity-15"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">
              {language === 'ar' ? 'لماذا تختار منصتنا؟' : 'Why Choose Our Platform?'}
            </h2>
            <p className="text-2xl text-white/70 max-w-3xl mx-auto font-light">
              {language === 'ar' 
                ? 'حلول مخصصة لكل نوع من أنواع الأعمال مع نتائج مضمونة'
                : 'Tailored solutions for every type of business with guaranteed results'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Suppliers Panel */}
            <Card className="p-12 bg-white/10 backdrop-blur-xl border border-white/20 hover:shadow-[0_50px_100px_rgba(251,167,101,0.3)] transition-all duration-700 hover:scale-105 rounded-3xl group">
              <div className="text-center mb-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#FBA765] to-[#765A3F] rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <Package className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-[#FBA765] mb-4">
                  {language === 'ar' ? 'للموردين' : 'For Suppliers'}
                </h3>
                <p className="text-xl text-white/80 font-medium">
                  {language === 'ar' ? 'اعرض منتجاتك للعالم' : 'Showcase Your Products to the World'}
                </p>
              </div>

              <div className="space-y-8 mb-12">
                {[
                  { 
                    icon: Globe, 
                    title: language === 'ar' ? 'وصول عالمي' : 'Global Reach',
                    desc: language === 'ar' ? 'اوصل لملايين المشترين حول العالم' : 'Reach millions of buyers worldwide'
                  },
                  { 
                    icon: BarChart3, 
                    title: language === 'ar' ? 'تحليلات متقدمة' : 'Advanced Analytics',
                    desc: language === 'ar' ? 'رؤى عميقة لنمو أعمالك' : 'Deep insights for business growth'
                  },
                  { 
                    icon: DollarSign, 
                    title: language === 'ar' ? 'دفع مضمون' : 'Guaranteed Payment',
                    desc: language === 'ar' ? 'استلم أموالك بأمان وسرعة' : 'Receive payments securely and quickly'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-6 group/item">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FBA765]/20 to-[#765A3F]/10 rounded-2xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                      <benefit.icon className="h-8 w-8 text-[#FBA765]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                      <p className="text-white/70">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/auth" className="block">
                <Button size="lg" className="w-full py-6 text-xl font-bold hover:shadow-[0_20px_40px_rgba(251,167,101,0.6)] transition-all duration-500 hover:scale-105 rounded-2xl" style={{ background: 'var(--gradient-button-secondary)' }}>
                  <UserPlus className={`h-6 w-6 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                  {language === 'ar' ? 'انضم كمورد' : 'Join as Supplier'}
                </Button>
              </Link>
            </Card>

            {/* Buyers Panel */}
            <Card className="p-12 bg-white/10 backdrop-blur-xl border border-white/20 hover:shadow-[0_50px_100px_rgba(102,2,60,0.3)] transition-all duration-700 hover:scale-105 rounded-3xl group">
              <div className="text-center mb-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#66023C] to-[#004F54] rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <Briefcase className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-[#66023C] mb-4">
                  {language === 'ar' ? 'للمشترين' : 'For Buyers'}
                </h3>
                <p className="text-xl text-white/80 font-medium">
                  {language === 'ar' ? 'اعثر على أفضل المنتجات' : 'Find the Best Products'}
                </p>
              </div>

              <div className="space-y-8 mb-12">
                {[
                  { 
                    icon: Search, 
                    title: language === 'ar' ? 'بحث ذكي' : 'Smart Search',
                    desc: language === 'ar' ? 'اعثر على ما تحتاجه بدقة وسرعة' : 'Find exactly what you need quickly'
                  },
                  { 
                    icon: Shield, 
                    title: language === 'ar' ? 'موردون موثقون' : 'Verified Suppliers',
                    desc: language === 'ar' ? 'تعامل مع موردين معتمدين فقط' : 'Deal only with certified suppliers'
                  },
                  { 
                    icon: TrendingUp, 
                    title: language === 'ar' ? 'عروض تنافسية' : 'Competitive Offers',
                    desc: language === 'ar' ? 'احصل على أفضل الأسعار دائماً' : 'Always get the best prices'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-6 group/item">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#66023C]/20 to-[#004F54]/10 rounded-2xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                      <benefit.icon className="h-8 w-8 text-[#66023C]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                      <p className="text-white/70">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/auth" className="block">
                <Button size="lg" className="w-full py-6 text-xl font-bold hover:shadow-[0_20px_40px_rgba(102,2,60,0.6)] transition-all duration-500 hover:scale-105 rounded-2xl" style={{ background: 'var(--gradient-button-primary)' }}>
                  <Search className={`h-6 w-6 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                  {language === 'ar' ? 'ابدأ البحث' : 'Start Shopping'}
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Revolutionary Final CTA */}
      <section className="py-32 px-6 bg-section-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh-bg opacity-10"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-black mb-8 gradient-text-hero">
              {language === 'ar' ? 'انضم للثورة' : 'Join the Revolution'}
            </h2>
            <p className="text-2xl md:text-3xl gradient-text-subtle mb-16 font-light leading-relaxed">
              {language === 'ar' 
                ? 'كن جزءاً من مستقبل سوق المشتريات التجارية اليوم'
                : 'Be part of the future of B2B procurement marketplace today'}
            </p>
            
            <div className="flex flex-col lg:flex-row gap-8 justify-center">
              <Link to="/auth" className="group">
                <Button size="lg" className="px-20 py-8 text-2xl font-bold hover:shadow-[0_30px_60px_rgba(102,2,60,0.4)] transition-all duration-700 hover:scale-110 rounded-full animate-shimmer" style={{ background: 'var(--gradient-hero-bg)' }}>
                  <Sparkles className={`h-8 w-8 ${language === 'ar' ? 'ml-4' : 'mr-4'} animate-pulse`} />
                  {language === 'ar' ? 'ابدأ رحلتك الآن' : 'Start Your Journey Now'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 text-white/80" style={{ background: 'var(--gradient-header)' }}>
        <div className="container mx-auto text-center">
          <p className="text-lg">
            {language === 'ar' 
              ? '© 2024 MWRD. جميع الحقوق محفوظة. مستقبل سوق المشتريات التجارية يبدأ هنا.'
              : '© 2024 MWRD. All rights reserved. The future of B2B procurement marketplace starts here.'}
          </p>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
};
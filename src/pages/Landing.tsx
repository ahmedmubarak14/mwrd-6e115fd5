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
                <Button size="lg" className="glass-card px-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-transparent border border-white/30" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" className="hidden md:block">
                  <Button variant="ghost" size="lg" className="glass-card px-6 bg-transparent border border-white/20 text-white transition-all duration-300" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(15px)' }}>
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </Link>
                <Link to="/auth" className="hidden md:block">
                  <Button size="lg" className="glass-card px-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-transparent border border-white/30" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
                    {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                  </Button>
                </Link>
              </>
            )}
            <MobileNavigation />
          </div>
        </div>
      </header>

      {/* Hero Section - Exact Match to Reference */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'var(--gradient-hero-bg)' }}>
        <div className="container mx-auto px-6 pt-20 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            
            {/* Left Content */}
            <div className={`${language === 'ar' ? 'lg:order-2 text-right' : 'lg:order-1'} space-y-8`}>
              
              {/* Badge */}
              <div className="inline-block">
                <div className="glass-card px-4 py-2 text-sm text-white/80 rounded-full bg-transparent border border-white/30" style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)' }}>
                  {language === 'ar' ? 'سوق إمداد B2B يربط العملاء بالموردين المعتمدين عبر الشرق الأوسط وشمال أفريقيا' : 'B2B supply chain marketplace connecting clients with verified vendors across MENA'}
                </div>
              </div>

              {/* Main Brand */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black">
                  <span className="gradient-text-killer">MWRD</span>
                  <span className="text-white/90"> | {language === 'ar' ? 'مورد' : 'مورد'}</span>
                </h1>
                <p className="text-base text-white/70 font-medium">
                  {language === 'ar' ? 'سوق سلسلة التوريد B2B' : 'B2B Supply Chain Marketplace'}
                </p>
              </div>

              {/* Hero Headline */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {language === 'ar' ? 'تواصل. مصدر. وريد.' : 'Connect. Source. Supply.'}
                </h2>
                <p className="text-base text-white/80 leading-relaxed max-w-2xl">
                  {language === 'ar' 
                    ? 'منصة B2B مهنية تربط العملاء بالموردين المؤهلين من خلال نظام طلب عروض الأسعار الذكي. احصل على عروض أسعار تنافسية، وقارن المقترحات، وأدر سلسلة التوريد الخاصة بك بكفاءة.'
                    : 'A professional B2B marketplace connecting clients with qualified vendors through our smart RFQ system. Get competitive quotes, compare proposals, and manage your supply chain efficiently.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/auth" className="group">
                  <Button size="default" className="glass-card px-6 py-3 text-base font-semibold transition-all duration-300 hover:scale-105 bg-transparent border border-white/30 text-white" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
                    {language === 'ar' ? 'ابدأ البحث' : 'Start Sourcing'}
                  </Button>
                </Link>
                <Link to="/auth" className="group">
                  <Button variant="outline" size="default" className="glass-card px-6 py-3 text-base font-semibold border-2 border-white/30 text-white bg-transparent transition-all duration-300 hover:scale-105" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(15px)' }}>
                    {language === 'ar' ? 'انضم كمورد' : 'Join as Vendor'}
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
                    <span className="text-white/80">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="pt-8">
                <p className="text-white/60 text-sm mb-2">
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
                  subtitle: language === 'ar' ? 'موردون موثقون' : 'Verified suppliers',
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
                <Card key={index} className="glass-card p-3 hover:scale-105 transition-all duration-300 animate-fade-in bg-transparent border border-white/20" style={{ animationDelay: `${index * 0.1}s`, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 glass-card border border-white/20" style={{ backgroundColor: `${stat.color}20`, border: `1px solid ${stat.color}40`, background: `rgba(${stat.color === '#8B5CF6' ? '139, 92, 246' : stat.color === '#3B82F6' ? '59, 130, 246' : stat.color === '#10B981' ? '16, 185, 129' : '245, 158, 11'}, 0.1)`, backdropFilter: 'blur(15px)' }}>
                      <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white text-sm">{stat.title}</h3>
                      </div>
                      <p className="text-xs text-white/60 mb-1">{stat.subtitle}</p>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-lg font-black text-white mb-1">{stat.count}</div>
                          <div className="text-xs text-white/70">{stat.label}</div>
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
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Workflow Section */}
      <section className="py-32 px-6 bg-unified-page relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, #004F54 2px, transparent 2px)`, backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6" style={{ color: '#F1EFE8' }}>
              {language === 'ar' ? 'كيف نعيد تشكيل المشتريات التجارية؟' : 'How We\'re Reshaping B2B Procurement'}
            </h2>
            <p className="text-lg max-w-3xl mx-auto font-light" style={{ color: '#F1EFE8', opacity: 0.8 }}>
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
                     <Card className="glass-card p-4 hover:shadow-[0_25px_80px_rgba(251,167,101,0.3)] transition-all duration-700 hover:scale-105 rounded-2xl bg-transparent border border-white/20" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#102C33] to-[#004F54] rounded-2xl flex items-center justify-center shadow-xl glass-card border border-white/20" style={{ background: 'rgba(16, 44, 51, 0.3)', backdropFilter: 'blur(20px)' }}>
                          <Search className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-[#FBA765]">01</span>
                          <h3 className="text-xl font-bold" style={{ color: '#F1EFE8' }}>
                            {language === 'ar' ? 'اكتشاف ذكي' : 'AI-Powered Discovery'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-base leading-relaxed font-medium" style={{ color: '#F1EFE8', opacity: 0.9 }}>
                        {language === 'ar' 
                          ? 'تقنية الذكاء الاصطناعي تحلل احتياجاتك وتوصلك بأفضل الموردين في ثوانٍ. اكتشف فرصاً لم تتخيلها من قبل'
                          : 'AI technology analyzes your needs and connects you with the best suppliers in seconds. Discover opportunities you never imagined'}
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
                        <Card key={index} className="glass-card p-3 hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-xl bg-transparent border border-white/20" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(15px)' }}>
                          <feature.icon className="h-5 w-5 mb-2" style={{ color: feature.color }} />
                          <div className="text-sm font-bold" style={{ color: '#F1EFE8' }}>{feature.label}</div>
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
                    <Card className="glass-card p-4 hover:shadow-[0_25px_80px_rgba(251,167,101,0.3)] transition-all duration-700 hover:scale-105 rounded-2xl bg-transparent border border-white/20" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#004F54] to-[#765A3F] rounded-2xl flex items-center justify-center shadow-xl glass-card border border-white/20" style={{ background: 'rgba(0, 79, 84, 0.3)', backdropFilter: 'blur(20px)' }}>
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-[#004F54]">02</span>
                          <h3 className="text-xl font-bold" style={{ color: '#F1EFE8' }}>
                            {language === 'ar' ? 'تفاوض سلس' : 'Seamless Negotiation'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-base leading-relaxed font-medium" style={{ color: '#F1EFE8', opacity: 0.9 }}>
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
                        <Card key={index} className="glass-card p-3 hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-xl bg-transparent border border-white/20" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(15px)' }}>
                          <feature.icon className="h-5 w-5 mb-2" style={{ color: feature.color }} />
                        <div className="text-sm font-bold" style={{ color: '#F1EFE8' }}>{feature.label}</div>
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
                    <Card className="glass-card p-4 hover:shadow-[0_25px_80px_rgba(0,79,84,0.3)] transition-all duration-700 hover:scale-105 rounded-2xl bg-transparent border border-white/20" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#765A3F] to-[#102C33] rounded-2xl flex items-center justify-center shadow-xl glass-card border border-white/20" style={{ background: 'rgba(118, 90, 63, 0.3)', backdropFilter: 'blur(20px)' }}>
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl font-black text-[#765A3F]">03</span>
                          <h3 className="text-xl font-bold" style={{ color: '#F1EFE8' }}>
                            {language === 'ar' ? 'إنجاز آمن' : 'Secure Completion'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-base leading-relaxed font-medium" style={{ color: '#F1EFE8', opacity: 0.9 }}>
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
                        <Card key={index} className="glass-card p-3 hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-xl bg-transparent border border-white/20" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(15px)' }}>
                          <feature.icon className="h-5 w-5 mb-2" style={{ color: feature.color }} />
                          <div className="text-sm font-bold" style={{ color: '#F1EFE8' }}>{feature.label}</div>
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

      {/* Enhanced Benefits Section */}
      <section className="py-32 px-6 bg-unified-page relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] floating-orb opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] floating-orb-2 opacity-15"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6" style={{ color: '#F1EFE8' }}>
              {language === 'ar' ? 'لماذا تختار منصتنا؟' : 'Why Choose Our Platform?'}
            </h2>
            <p className="text-lg max-w-3xl mx-auto font-light" style={{ color: '#F1EFE8', opacity: 0.8 }}>
              {language === 'ar' 
                ? 'حلول مخصصة لكل نوع من أنواع الأعمال مع نتائج مضمونة'
                : 'Tailored solutions for every type of business with guaranteed results'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Suppliers Panel */}
            <Card className="glass-card p-6 hover:shadow-[0_50px_100px_rgba(251,167,101,0.3)] transition-all duration-700 hover:scale-105 rounded-2xl group bg-transparent border border-white/20" style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(25px)' }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FBA765] to-[#765A3F] rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 glass-card border border-white/30" style={{ background: 'rgba(251, 167, 101, 0.15)', backdropFilter: 'blur(25px)' }}>
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-[#FBA765] mb-3">
                  {language === 'ar' ? 'للموردين' : 'For Suppliers'}
                </h3>
                <p className="text-base font-medium" style={{ color: '#F1EFE8', opacity: 0.9 }}>
                  {language === 'ar' ? 'اعرض منتجاتك للعالم' : 'Showcase Your Products to the World'}
                </p>
              </div>

              <div className="space-y-6 mb-8">
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
                  <div key={index} className="flex items-start gap-4 group/item">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FBA765]/20 to-[#765A3F]/10 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 glass-card border border-[#FBA765]/30" style={{ background: 'rgba(251, 167, 101, 0.1)', backdropFilter: 'blur(15px)' }}>
                      <benefit.icon className="h-6 w-6 text-[#FBA765]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold mb-1" style={{ color: '#F1EFE8' }}>{benefit.title}</h4>
                      <p className="text-sm" style={{ color: '#F1EFE8', opacity: 0.8 }}>{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/auth" className="block">
                <Button size="default" className="glass-card w-full py-4 text-base font-bold hover:shadow-[0_20px_40px_rgba(251,167,101,0.6)] transition-all duration-500 hover:scale-105 rounded-xl bg-transparent border border-[#FBA765]/30" style={{ background: 'rgba(251, 167, 101, 0.1)', backdropFilter: 'blur(20px)', color: '#F1EFE8' }}>
                  <UserPlus className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {language === 'ar' ? 'انضم كمورد' : 'Join as Supplier'}
                </Button>
              </Link>
            </Card>

            {/* Buyers Panel */}
            <Card className="glass-card p-6 hover:shadow-[0_50px_100px_rgba(102,2,60,0.3)] transition-all duration-700 hover:scale-105 rounded-2xl group bg-transparent border border-white/20" style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(25px)' }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#66023C] to-[#004F54] rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 glass-card border border-white/30" style={{ background: 'rgba(102, 2, 60, 0.15)', backdropFilter: 'blur(25px)' }}>
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-[#66023C] mb-3">
                  {language === 'ar' ? 'للمشترين' : 'For Buyers'}
                </h3>
                <p className="text-base font-medium" style={{ color: '#F1EFE8', opacity: 0.9 }}>
                  {language === 'ar' ? 'اعثر على أفضل المنتجات' : 'Find the Best Products'}
                </p>
              </div>

              <div className="space-y-6 mb-8">
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
                  <div key={index} className="flex items-start gap-4 group/item">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#66023C]/20 to-[#004F54]/10 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 glass-card border border-[#66023C]/30" style={{ background: 'rgba(102, 2, 60, 0.1)', backdropFilter: 'blur(15px)' }}>
                      <benefit.icon className="h-6 w-6 text-[#66023C]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold mb-1" style={{ color: '#F1EFE8' }}>{benefit.title}</h4>
                      <p className="text-sm" style={{ color: '#F1EFE8', opacity: 0.8 }}>{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/auth" className="block">
                <Button size="default" className="glass-card w-full py-4 text-base font-bold hover:shadow-[0_20px_40px_rgba(102,2,60,0.6)] transition-all duration-500 hover:scale-105 rounded-xl bg-transparent border border-[#66023C]/30" style={{ background: 'rgba(102, 2, 60, 0.1)', backdropFilter: 'blur(20px)', color: '#F1EFE8' }}>
                  <Search className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {language === 'ar' ? 'ابدأ البحث' : 'Start Shopping'}
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 bg-unified-page relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh-bg opacity-10"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-6 gradient-text-hero">
              {language === 'ar' ? 'انضم للثورة' : 'Join the Revolution'}
            </h2>
            <p className="text-lg md:text-xl gradient-text-subtle mb-12 font-light leading-relaxed">
              {language === 'ar' 
                ? 'كن جزءاً من مستقبل سوق المشتريات التجارية اليوم'
                : 'Be part of the future of B2B procurement marketplace today'}
            </p>
            
            <div className="flex flex-col lg:flex-row gap-6 justify-center">
              <Link to="/auth" className="group">
                <Button size="lg" className="glass-card px-12 py-6 text-lg font-bold hover:shadow-[0_30px_60px_rgba(102,2,60,0.4)] transition-all duration-700 hover:scale-110 rounded-2xl animate-shimmer bg-transparent border border-white/30" style={{ background: 'rgba(102, 2, 60, 0.15)', backdropFilter: 'blur(25px)', color: '#F1EFE8' }}>
                  <Sparkles className={`h-6 w-6 ${language === 'ar' ? 'ml-3' : 'mr-3'} animate-pulse`} />
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
          <p className="text-lg" style={{ color: '#F1EFE8', opacity: 0.9 }}>
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
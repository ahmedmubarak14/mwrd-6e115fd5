import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Users,
  Building2,
  Globe,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Award,
  Star,
  FileText,
  Search,
  ShoppingCart,
  BarChart3,
  User,
  Mail,
  Briefcase,
  DollarSign,
  Sparkles,
  Rocket,
  Package
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToastFeedback } from "@/hooks/useToastFeedback";

export const Home = () => {
  const { user, userProfile, loading } = useAuth();
  const { t, language } = useLanguage();
  const { showSuccess } = useToastFeedback();
  const isRTL = language === 'ar';

  const handleAuthSuccess = (userData: { id: string; email: string; role: 'client' | 'supplier' }) => {
    showSuccess(isRTL ? 'مرحباً بك! تم تسجيل الدخول بنجاح' : 'Welcome! Successfully logged in');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-blackChasm to-darkGreen dark">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto animate-pulse">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-50 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">
              {isRTL ? 'جاري تحميل MWRD' : 'Loading MWRD'}
            </div>
            <div className="text-white/60">
              {isRTL ? 'منصة التوريد المتقدمة...' : 'Advanced Supply Chain Platform...'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated, show dashboard redirect
  if (user && userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-blackChasm to-darkGreen dark flex items-center justify-center">
        <div className="text-center space-y-8 max-w-2xl mx-auto px-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white">
              {isRTL ? `مرحباً، ${userProfile.full_name || 'المستخدم'}` : `Welcome back, ${userProfile.full_name || 'User'}`}
            </h1>
            <p className="text-xl text-white/70">
              {isRTL ? 'أنت مسجل دخول بالفعل. انتقل إلى لوحة التحكم للمتابعة.' : 'You are already logged in. Navigate to your dashboard to continue.'}
            </p>
          </div>

          <Link to="/dashboard">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold px-12 py-4 text-xl shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 border-0"
            >
              {isRTL ? 'انتقل إلى لوحة التحكم' : 'Go to Dashboard'}
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Main homepage for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-blackChasm to-darkGreen dark">
      {/* Navigation Header */}
      <nav className="border-b border-white/10 bg-blackChasm/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo"
                className="h-12 w-auto"
              />
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="#" className="text-white/80 hover:text-white font-medium transition-colors">
                {isRTL ? 'المنتج' : 'Product'}
              </Link>
              <Link to="#" className="text-white/80 hover:text-white font-medium transition-colors">
                {isRTL ? 'الأسعار' : 'Pricing'}
              </Link>
              <Link to="#" className="text-white/80 hover:text-white font-medium transition-colors">
                {isRTL ? 'الموارد' : 'Resources'}
              </Link>
              <Link to="#" className="text-white/80 hover:text-white font-medium transition-colors">
                {isRTL ? 'اتصل بنا' : 'Contact'}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-white/20 text-white/80 px-3 py-1">
              {isRTL ? 'عر' : 'EN'}
            </Badge>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              {isRTL ? 'تسجيل الدخول' : 'Sign in'}
            </Button>
            <Button className="bg-gradient-to-r from-primary to-accent text-white border-0 px-6">
              {isRTL ? 'ابدأ الآن' : 'Get Started'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float-slower"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Top Banner */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-full px-6 py-3 border border-white/10">
              <Globe className="h-4 w-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">
                {isRTL ? 'منصة سلسلة التوريد B2B تربط العملاء بالموردين المعتمدين عبر منطقة الشرق الأوسط وشمال أفريقيا' : 'B2B supply chain marketplace connecting clients with verified vendors across MENA'}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Brand Title */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-6xl md:text-7xl font-black">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      MWRD
                    </span>
                  </h1>
                  <span className="text-4xl md:text-5xl text-white/80 font-light">
                    {isRTL ? '| مورد' : '| مورد'}
                  </span>
                </div>
                
                <div className="text-sm text-white/60 font-medium">
                  {isRTL ? 'منصة سلسلة التوريد B2B' : 'B2B Supply Chain Marketplace'}
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
                  {isRTL ? 'اربط. وفّر. أمّن.' : 'Connect. Source. Supply.'}
                </h2>
                
                <p className="text-xl text-white/70 leading-relaxed max-w-2xl">
                  {isRTL ? 
                    'منصة مهنية B2B تربط العملاء بالموردين المؤهلين من خلال نظام RFQ الذكي. احصل على عروض أسعار تنافسية، قارن المقترحات، وأدر سلسلة التوريد بكفاءة.' :
                    'A professional B2B marketplace connecting clients with qualified vendors through our smart RFQ system. Get competitive quotes, compare proposals, and manage your supply chain efficiently.'
                  }
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold px-8 py-4 text-lg border-0 shadow-xl"
                >
                  {isRTL ? 'ابدأ التوريد' : 'Start Sourcing'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
                >
                  {isRTL ? 'انضم كمورد' : 'Join as Vendor'}
                </Button>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-lime" />
                  <span className="text-white/80">
                    {isRTL ? 'قدم طلبات RFQ واحصل على عروض تنافسية' : 'Submit RFQs and receive competitive bids'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-lime" />
                  <span className="text-white/80">
                    {isRTL ? 'تواصل مع موردين معتمدين في قطاعك' : 'Connect with verified vendors in your sector'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-lime" />
                  <span className="text-white/80">
                    {isRTL ? 'معاملات آمنة وتتبع الطلبات' : 'Secure transactions and order tracking'}
                  </span>
                </div>
              </div>

              {/* Trust Indicator */}
              <div className="flex items-center gap-3 text-white/60">
                <span className="font-medium">{isRTL ? 'موثوق من قبل أكثر من 500+ شركة' : 'Trusted by 500+ businesses'}</span>
              </div>
            </div>

            {/* Right Side - Statistics Dashboard */}
            <div className="space-y-8">
              {/* RFQ System Card */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-accent" />
                    <span className="text-white font-semibold">
                      {isRTL ? 'نظام RFQ' : 'RFQ System'}
                    </span>
                  </div>
                  <Badge className="bg-lime/20 text-lime border-lime/30">
                    {isRTL ? 'نشط' : 'Active'}
                  </Badge>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-accent to-primary h-2 rounded-full" style={{width: '74%'}}></div>
                </div>
                <div className="text-sm text-white/60">
                  {isRTL ? '24 طلب RFQ نشط' : '24 Active RFQs'}
                </div>
              </Card>

              {/* Vendors Card */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-white font-semibold">
                    {isRTL ? 'الموردين' : 'Vendors'}
                  </span>
                </div>
                <div className="text-4xl font-black text-white mb-2">1,247</div>
                <div className="text-sm text-white/60">
                  {isRTL ? 'موردين نشطين' : 'Active vendors'}
                </div>
              </Card>

              {/* Success Metrics */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-lime" />
                    <span className="text-white/80 text-sm font-medium">
                      {isRTL ? 'آمن' : 'Secure'}
                    </span>
                  </div>
                  <div className="text-white/60 text-xs mb-2">
                    {isRTL ? 'معاملات موثقة' : 'Verified transactions'}
                  </div>
                  <div className="text-2xl font-bold text-lime">99.9%</div>
                  <div className="text-xs text-white/50">
                    {isRTL ? 'معدل النجاح' : 'Success rate'}
                  </div>
                </Card>

                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-orange" />
                    <span className="text-white/80 text-sm font-medium">
                      {isRTL ? 'سريع' : 'Fast'}
                    </span>
                  </div>
                  <div className="text-white/60 text-xs mb-2">
                    {isRTL ? 'متوسط الاستجابة' : 'Average response'}
                  </div>
                  <div className="text-2xl font-bold text-orange">4.2h</div>
                  <div className="text-xs text-white/50">
                    {isRTL ? 'وقت الاستجابة' : 'Avg response time'}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-20 space-y-6">
            <div className="text-white/60 font-medium">
              {isRTL ? 'موثوق من قبل أكثر من 500+ شركة' : 'Trusted by 500+ businesses'}
            </div>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-blackChasm/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              {isRTL ? 'كيف يعمل النظام' : 'How it works'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {isRTL ? 'قدم طلب RFQ' : 'Submit RFQ'}
              </h3>
              <p className="text-white/70">
                {isRTL ? 'أنشئ طلب عرض سعر مفصل مع متطلباتك وخصائصك' : 'Create a detailed request for quote with your requirements and specifications'}
              </p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-accent/60 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {isRTL ? 'احصل على عروض' : 'Receive bids'}
              </h3>
              <p className="text-white/70">
                {isRTL ? 'استلم عروض تنافسية من موردين معتمدين في شبكتنا' : 'Get competitive proposals from verified vendors in our network'}
              </p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-lime to-lime/60 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-8 w-8 text-blackChasm" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {isRTL ? 'اختر واطلب' : 'Select & order'}
              </h3>
              <p className="text-white/70">
                {isRTL ? 'قارن العروض واختر الأفضل وأكمل طلبك بأمان' : 'Compare proposals, select the best offer, and complete your order securely'}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose MWRD Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              {isRTL ? 'لماذا تختار الشركات MWRD' : 'Why businesses choose MWRD'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {isRTL ? 'موثوق وآمن' : 'Trusted & Secure'}
              </h3>
              <p className="text-white/70">
                {isRTL ? 'موردين معتمدين ومعاملات آمنة' : 'Verified vendors and secure transactions'}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-accent/60 rounded-2xl flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {isRTL ? 'توفير في التكاليف' : 'Cost Savings'}
              </h3>
              <p className="text-white/70">
                {isRTL ? 'عروض تنافسية وأسعار أفضل' : 'Competitive bidding and better prices'}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-lime to-lime/60 rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-blackChasm" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {isRTL ? 'سريع وكفء' : 'Fast & Efficient'}
              </h3>
              <p className="text-white/70">
                {isRTL ? 'عملية توريد مبسطة وسريعة' : 'Streamlined procurement process'}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange to-orange/60 rounded-2xl flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-blackChasm" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {isRTL ? 'تحليلات ذكية' : 'Smart Analytics'}
              </h3>
              <p className="text-white/70">
                {isRTL ? 'رؤى ومراقبة الأداء' : 'Insights and performance tracking'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section className="py-24 px-6 bg-blackChasm/50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-white">
                {isRTL ? 'ابدأ رحلتك اليوم' : 'Start your journey today'}
              </h2>
              <p className="text-xl text-white/70">
                {isRTL ? 
                  'انضم إلى آلاف الشركات التي تثق بـ MWRD في إدارة سلسلة التوريد بكفاءة وأمان.' :
                  'Join thousands of businesses that trust MWRD for efficient and secure supply chain management.'
                }
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
              <AuthForm onAuthSuccess={handleAuthSuccess} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
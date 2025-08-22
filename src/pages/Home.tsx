import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Building2, 
  Shield, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  BarChart3,
  DollarSign,
  Package,
  Users,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Award,
  Target,
  Star,
  Rocket
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blackChasm via-darkGreen to-primary dark">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-lime to-accent rounded-2xl flex items-center justify-center mx-auto animate-pulse">
              <Rocket className="h-8 w-8 text-blackChasm" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-lime to-accent rounded-2xl blur-lg opacity-50 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">
              {isRTL ? 'جاري تحميل منصة المشتريات' : 'Loading Procurement Platform'}
            </div>
            <div className="text-white/60">
              {isRTL ? 'إعداد بيئة العمل المتقدمة...' : 'Preparing your advanced workspace...'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show redesigned homepage for authenticated users
  if (user && userProfile) {
    const roleTitle = userProfile.role === 'client' ? 
      (isRTL ? 'مدير المشتريات' : 'Procurement Director') : 
      userProfile.role === 'supplier' ? 
      (isRTL ? 'شريك التوريد المتميز' : 'Strategic Supply Partner') :
      (isRTL ? 'مدير النظام' : 'System Administrator');

    const firstName = userProfile.full_name?.split(' ')[0] || userProfile.email.split('@')[0];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blackChasm via-darkGreen to-primary dark relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
          
          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-3/4 right-1/3 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float-slower"></div>
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-lime/20 rounded-full blur-2xl animate-float-fast"></div>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-blackChasm/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-darkGreen/30 to-transparent"></div>
        </div>

        {/* Premium Navigation */}
        <nav className="relative z-50 border-b border-white/5 bg-blackChasm/80 backdrop-blur-2xl">
          <div className="container mx-auto px-8 h-24 flex items-center justify-between">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img 
                  src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                  alt="MWRD Logo"
                  className="h-16 w-auto transition-all duration-500 group-hover:scale-110 filter brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-lime/20 to-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              </div>
            </Link>
            
            <div className="flex items-center gap-8">
              <Badge variant="outline" className="bg-gradient-to-r from-primary/20 to-accent/20 border-white/20 text-white px-6 py-3 text-sm font-semibold">
                <Award className="h-4 w-4 mr-2" />
                {roleTitle}
              </Badge>
              
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-lime to-accent hover:from-lime/90 hover:to-accent/90 text-blackChasm font-bold px-8 py-4 text-base shadow-2xl hover:shadow-lime/20 transition-all duration-300 hover:scale-105 border-0"
                >
                  {isRTL ? 'مركز التحكم' : 'Command Center'}
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 pt-16 pb-24">
          <div className="container mx-auto px-8 max-w-7xl">
            
            {/* Welcome Section */}
            <div className="text-center mb-20 space-y-8">
              {/* Status Indicator */}
              <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl rounded-full px-8 py-4 border border-white/10 animate-fade-in">
                <div className="relative">
                  <div className="w-4 h-4 bg-lime rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-lime rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-white/90 font-semibold text-lg">
                  {isRTL ? 'متصل الآن - نظام المشتريات المتطور' : 'Online Now - Advanced Procurement System'}
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-7xl md:text-9xl font-black text-white leading-tight tracking-tight">
                  {isRTL ? 'أهلاً وسهلاً' : 'Welcome Back'}
                  <br />
                  <span className="bg-gradient-to-r from-lime via-accent to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                    {firstName}
                  </span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-white/70 max-w-4xl mx-auto leading-relaxed font-light">
                  {isRTL ? 
                    'تحكم في عمليات المشتريات الاستراتيجية وحقق النجاح المؤسسي من خلال منصتك المتطورة' : 
                    'Command strategic procurement operations and drive organizational success through your advanced platform'
                  }
                </p>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-16">
                <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-110 hover:border-lime/30">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-lime to-lime/60 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-8 w-8 text-blackChasm" />
                    </div>
                    <div className="text-4xl font-black text-white">34%</div>
                    <div className="text-white/60 font-medium">{isRTL ? 'توفير إجمالي' : 'Total Savings'}</div>
                  </div>
                </div>
                
                <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-110 hover:border-accent/30">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/60 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-black text-white">247</div>
                    <div className="text-white/60 font-medium">{isRTL ? 'طلبات مكتملة' : 'Completed Orders'}</div>
                  </div>
                </div>
                
                <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-110 hover:border-primary/30">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-black text-white">156</div>
                    <div className="text-white/60 font-medium">{isRTL ? 'شركاء موثوقين' : 'Trusted Partners'}</div>
                  </div>
                </div>
                
                <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-110 hover:border-orange/30">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange to-orange/60 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Star className="h-8 w-8 text-blackChasm" />
                    </div>
                    <div className="text-4xl font-black text-white">99.2%</div>
                    <div className="text-white/60 font-medium">{isRTL ? 'معدل النجاح' : 'Success Rate'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Preview Section */}
            <div className="grid lg:grid-cols-3 gap-8 mb-20">
              {/* Profile Card */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
                  <CardHeader className="pb-8">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-lime via-accent to-primary rounded-3xl flex items-center justify-center shadow-2xl">
                          <User className="h-10 w-10 text-blackChasm" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-lime rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-blackChasm" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-3xl font-black text-white mb-2">
                          {userProfile.full_name || firstName}
                        </CardTitle>
                        <CardDescription className="text-xl text-white/70">
                          {roleTitle} • {isRTL ? 'عضو مميز' : 'Premium Member'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Email */}
                    <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white/60 text-sm font-medium mb-1">{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</div>
                        <div className="text-white font-semibold">{userProfile.email}</div>
                      </div>
                    </div>
                    
                    {/* Company */}
                    {userProfile.company_name && (
                      <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white/60 text-sm font-medium mb-1">{isRTL ? 'المؤسسة' : 'Organization'}</div>
                          <div className="text-white font-semibold">{userProfile.company_name}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Activity */}
              <div className="space-y-8">
                {/* Quick Actions */}
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                      <Briefcase className="h-6 w-6 text-lime" />
                      {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white py-4 justify-start text-base font-semibold">
                      <Target className="h-5 w-5 mr-3" />
                      {isRTL ? 'طلب جديد' : 'New Request'}
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 py-4 justify-start text-base">
                      <BarChart3 className="h-5 w-5 mr-3" />
                      {isRTL ? 'التحليلات' : 'Analytics'}
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 py-4 justify-start text-base">
                      <Globe className="h-5 w-5 mr-3" />
                      {isRTL ? 'الموردين' : 'Suppliers'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                      <Clock className="h-5 w-5 text-accent" />
                      {isRTL ? 'آخر الأنشطة' : 'Recent Activity'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-lime flex-shrink-0" />
                      <div className="flex-1 text-white/80 text-sm">
                        {isRTL ? 'تمت الموافقة على الطلب #2847' : 'Request #2847 approved'}
                      </div>
                      <span className="text-white/50 text-xs">2h</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <DollarSign className="h-4 w-4 text-orange flex-shrink-0" />
                      <div className="flex-1 text-white/80 text-sm">
                        {isRTL ? 'توفير 12% في المعدات' : '12% saved on equipment'}
                      </div>
                      <span className="text-white/50 text-xs">5h</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Users className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="flex-1 text-white/80 text-sm">
                        {isRTL ? 'مورد جديد انضم' : 'New supplier onboarded'}
                      </div>
                      <span className="text-white/50 text-xs">1d</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-lime/20 via-accent/20 to-primary/20 rounded-full px-8 py-4 border border-white/10">
                <Sparkles className="h-6 w-6 text-lime animate-pulse" />
                <span className="text-white font-semibold text-lg">
                  {isRTL ? 'جاهز لإدارة عمليات المشتريات؟' : 'Ready to manage procurement operations?'}
                </span>
              </div>
              
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-lime via-accent to-primary hover:from-lime/90 hover:via-accent/90 hover:to-primary/90 text-blackChasm font-black px-16 py-6 text-2xl shadow-2xl hover:shadow-lime/20 transition-all duration-500 hover:scale-110 border-0"
                >
                  {isRTL ? 'ادخل مركز التحكم' : 'Enter Command Center'}
                  <Rocket className="ml-4 h-7 w-7" />
                </Button>
              </Link>
              
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                {isRTL ? 
                  'اكتشف قوة المشتريات الذكية مع أدوات متقدمة للتحليل والإدارة' : 
                  'Discover the power of intelligent procurement with advanced analytics and management tools'
                }
              </p>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // Show redesigned auth form for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blackChasm via-darkGreen to-primary dark flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float-slower"></div>
      </div>

      {/* Auth Form Container */}
      <div className="relative z-10 w-full max-w-md mx-auto p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-lime to-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Rocket className="h-10 w-10 text-blackChasm" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">
            {isRTL ? 'مرحباً بك في MWRD' : 'Welcome to MWRD'}
          </h1>
          <p className="text-white/70 text-lg">
            {isRTL ? 'منصة المشتريات المتطورة' : 'Advanced Procurement Platform'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    </div>
  );
};
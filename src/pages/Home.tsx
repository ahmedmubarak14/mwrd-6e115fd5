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
  Sparkles
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
        <LoadingSpinner 
          size="lg" 
          text={isRTL ? 'جاري تحميل حسابك...' : 'Loading your account...'}
          className="animate-fade-in text-white"
        />
      </div>
    );
  }

  // Show stunning dark homepage if logged in
  if (user && userProfile) {
    const roleTitle = userProfile.role === 'client' ? 
      (isRTL ? 'مدير المشتريات' : 'Procurement Manager') : 
      userProfile.role === 'supplier' ? 
      (isRTL ? 'شريك التوريد' : 'Supply Partner') :
      (isRTL ? 'مدير النظام' : 'System Administrator');

    return (
      <div className="min-h-screen bg-gradient-to-br from-blackChasm via-darkGreen to-primary dark overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-orb-1 absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="floating-orb-2 absolute top-3/4 right-1/3 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float-slower"></div>
          <div className="floating-orb-3 absolute bottom-1/4 left-1/2 w-64 h-64 bg-lime/20 rounded-full blur-2xl animate-float-fast"></div>
        </div>

        {/* Cinematic Header */}
        <header className="relative z-50 border-b border-white/10 bg-gradient-to-r from-blackChasm/90 via-darkGreen/90 to-primary/90 backdrop-blur-xl">
          <div className="container mx-auto px-6 h-24 flex items-center justify-between">
            <Link to="/" className="flex items-center group">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo"
                className="h-20 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-2xl"
              />
            </Link>
            
            <div className="flex items-center gap-6">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                {roleTitle}
              </Badge>
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white border-0 px-8 py-3 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-10">
          <section className="pt-20 pb-32 px-6">
            <div className="container mx-auto max-w-7xl">
              
              {/* Hero Content */}
              <div className="text-center mb-20 animate-fade-in-up">
                <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-full px-8 py-4 border border-white/10 mb-8 animate-scale-in">
                  <div className="w-3 h-3 bg-lime rounded-full animate-pulse"></div>
                  <span className="text-white/90 font-semibold">
                    {isRTL ? 'مرحباً بعودتك إلى منصة المشتريات' : 'Welcome Back to Your Procurement Command Center'}
                  </span>
                </div>

                <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
                  {isRTL ? 'مرحباً، ' : 'Hello, '}
                  <span className="gradient-text-hero bg-gradient-to-r from-lime via-white to-accent bg-clip-text text-transparent animate-shimmer">
                    {userProfile.full_name || userProfile.email.split('@')[0]}
                  </span>
                </h1>
                
                <p className="text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed font-medium mb-12">
                  {isRTL ? 
                    'تحكم في عمليات الشراء، وإدارة الموردين، وتحقيق وفورات استثنائية من خلال منصتك الذكية.' : 
                    'Command your procurement operations, manage suppliers, and drive exceptional savings through your intelligent platform.'
                  }
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <TrendingUp className="h-8 w-8 text-lime mb-3 mx-auto" />
                    <div className="text-3xl font-bold text-white mb-1">23%</div>
                    <div className="text-white/60 text-sm">{isRTL ? 'توفير' : 'Cost Savings'}</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <Package className="h-8 w-8 text-accent mb-3 mx-auto" />
                    <div className="text-3xl font-bold text-white mb-1">156</div>
                    <div className="text-white/60 text-sm">{isRTL ? 'طلبات نشطة' : 'Active Requests'}</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <Users className="h-8 w-8 text-primary mb-3 mx-auto" />
                    <div className="text-3xl font-bold text-white mb-1">89</div>
                    <div className="text-white/60 text-sm">{isRTL ? 'موردين موثوقين' : 'Trusted Suppliers'}</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <DollarSign className="h-8 w-8 text-orange mb-3 mx-auto" />
                    <div className="text-3xl font-bold text-white mb-1">$2.4M</div>
                    <div className="text-white/60 text-sm">{isRTL ? 'إجمالي المدخرات' : 'Total Savings'}</div>
                  </div>
                </div>
              </div>

              {/* Professional Dashboard Preview */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Account Information Glass Card */}
                <div className="animate-fade-in-left">
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary via-accent to-lime h-1"></div>
                    
                    <CardHeader className="text-center pb-8 pt-8">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary via-accent to-lime rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                        <User className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-4xl font-bold text-white mb-3">
                        {isRTL ? 'ملف تعريف المشتريات' : 'Procurement Profile'}
                      </CardTitle>
                      <CardDescription className="text-xl text-white/70">
                        {isRTL ? 'معلومات حسابك وإحصائيات الأداء' : 'Your account details and performance insights'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-8 px-8 pb-8">
                      {/* Email Section */}
                      <div className={`flex items-center gap-6 p-6 bg-primary/10 rounded-2xl border border-primary/20 transition-all hover:bg-primary/20 hover:scale-105 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                        <div className="flex-shrink-0 w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center">
                          <Mail className="h-7 w-7 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-2">
                            {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                          </p>
                          <p className="text-xl font-bold text-white">{userProfile.email}</p>
                        </div>
                      </div>
                      
                      {/* Company Section */}
                      {userProfile.company_name && (
                        <div className={`flex items-center gap-6 p-6 bg-accent/10 rounded-2xl border border-accent/20 transition-all hover:bg-accent/20 hover:scale-105 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                          <div className="flex-shrink-0 w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                            <Building2 className="h-7 w-7 text-accent" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-2">
                              {isRTL ? 'اسم الشركة' : 'Organization'}
                            </p>
                            <p className="text-xl font-bold text-white">{userProfile.company_name}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Account Type Section */}
                      <div className={`flex items-center gap-6 p-6 bg-lime/10 rounded-2xl border border-lime/20 transition-all hover:bg-lime/20 hover:scale-105 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                        <div className="flex-shrink-0 w-14 h-14 bg-lime/20 rounded-xl flex items-center justify-center">
                          <Shield className="h-7 w-7 text-lime" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-2">
                            {isRTL ? 'نوع الحساب' : 'Access Level'}
                          </p>
                          <p className="text-xl font-bold text-white capitalize">
                            {roleTitle}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions & Insights */}
                <div className="animate-fade-in-right space-y-8">
                  {/* Quick Actions */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                        <Briefcase className="h-6 w-6 text-lime" />
                        {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white border-0 py-4 text-lg font-semibold justify-start">
                        <Package className="h-5 w-5 mr-3" />
                        {isRTL ? 'إنشاء طلب جديد' : 'Create New Request'}
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 py-4 text-lg font-semibold justify-start">
                        <BarChart3 className="h-5 w-5 mr-3" />
                        {isRTL ? 'عرض التحليلات' : 'View Analytics'}
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 py-4 text-lg font-semibold justify-start">
                        <Users className="h-5 w-5 mr-3" />
                        {isRTL ? 'إدارة الموردين' : 'Manage Suppliers'}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                        <Clock className="h-6 w-6 text-accent" />
                        {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-lime" />
                        <div className="flex-1 text-white/80">
                          {isRTL ? 'تمت الموافقة على طلب المكاتب' : 'Office Supplies Request Approved'}
                        </div>
                        <span className="text-white/60 text-sm">2h</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <div className="flex-1 text-white/80">
                          {isRTL ? 'عرض جديد من مورد معتمد' : 'New Offer from Trusted Supplier'}
                        </div>
                        <span className="text-white/60 text-sm">4h</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                        <DollarSign className="h-5 w-5 text-orange" />
                        <div className="flex-1 text-white/80">
                          {isRTL ? 'توفير 15% في طلب IT' : '15% Savings on IT Equipment'}
                        </div>
                        <span className="text-white/60 text-sm">6h</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center mt-20 animate-fade-in-up">
                <Link to="/dashboard">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-lime via-accent to-primary hover:from-lime/80 hover:via-accent/80 hover:to-primary/80 text-blackChasm font-bold px-16 py-6 text-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 border-0"
                  >
                    {isRTL ? 'ادخل إلى مركز التحكم' : 'Enter Command Center'}
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <p className="text-white/60 mt-6 text-lg">
                  {isRTL ? 'إدارة عمليات الشراء بذكاء وكفاءة' : 'Manage procurement operations with intelligence and efficiency'}
                </p>
              </div>

            </div>
          </section>
        </main>
      </div>
    );
  }

  return <AuthForm onAuthSuccess={handleAuthSuccess} />;
};
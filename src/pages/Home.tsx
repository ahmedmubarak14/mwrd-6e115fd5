import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, Mail, Building2, Shield } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner 
          size="lg" 
          text={isRTL ? 'جاري تحميل حسابك...' : 'Loading your account...'}
          className="animate-fade-in"
        />
      </div>
    );
  }

  // Show user details if logged in
  if (user && userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        {/* Professional Header */}
        <header className="border-b border-white/10 bg-gradient-to-r from-primary via-accent to-primary backdrop-blur-sm sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo"
                className="h-16 w-auto hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover-scale font-semibold px-6">
                  {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section with Professional Layout */}
        <main className="relative">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 pointer-events-none" />
          
          <section className="relative py-20 px-6">
            <div className="container mx-auto max-w-4xl">
              
              {/* Welcome Badge */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                  <Shield className="h-5 w-5 text-lime" />
                  <span className="text-sm font-semibold text-white">
                    {isRTL ? 'مرحباً بك مرة أخرى' : 'Welcome Back'}
                  </span>
                </div>
              </div>

              {/* Main Heading */}
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {isRTL ? 'مرحباً، ' : 'Hello, '}
                  <span className="gradient-text bg-gradient-to-r from-lime to-white bg-clip-text text-transparent">
                    {userProfile.full_name || userProfile.email.split('@')[0]}
                  </span>
                </h1>
                <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
                  {isRTL ? 
                    'مرحباً بك في حسابك الشخصي. يمكنك إدارة جميع طلباتك والخدمات من خلال لوحة التحكم المخصصة لك.' : 
                    'Welcome to your personal account. Manage all your requests and services through your personalized dashboard.'
                  }
                </p>
              </div>

              {/* Professional Account Card */}
              <div className="mb-12 animate-fade-in-up">
                <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl hover-lift transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-accent h-2"></div>
                  
                  <CardHeader className="text-center pb-8 pt-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-foreground mb-2">
                      {isRTL ? 'تفاصيل الحساب' : 'Account Details'}
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                      {isRTL ? 'معلومات حسابك الشخصي والمهني' : 'Your personal and professional account information'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 px-8 pb-8">
                    {/* Email Section */}
                    <div className={`flex items-center gap-4 p-6 bg-primary/5 rounded-xl border border-primary/10 transition-colors hover:bg-primary/10 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                        </p>
                        <p className="text-lg font-semibold text-foreground">{userProfile.email}</p>
                      </div>
                    </div>
                    
                    {/* Company Section */}
                    {userProfile.company_name && (
                      <div className={`flex items-center gap-4 p-6 bg-accent/5 rounded-xl border border-accent/10 transition-colors hover:bg-accent/10 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                        <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                            {isRTL ? 'اسم الشركة' : 'Company Name'}
                          </p>
                          <p className="text-lg font-semibold text-foreground">{userProfile.company_name}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Account Type Section */}
                    <div className={`flex items-center gap-4 p-6 bg-lime/5 rounded-xl border border-lime/10 transition-colors hover:bg-lime/10 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                      <div className="flex-shrink-0 w-12 h-12 bg-lime/10 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-lime" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          {isRTL ? 'نوع الحساب' : 'Account Type'}
                        </p>
                        <p className="text-lg font-semibold text-foreground capitalize">
                          {userProfile.role === 'client' ? (isRTL ? 'عميل' : 'Client') : 
                           userProfile.role === 'supplier' ? (isRTL ? 'مقدم خدمة' : 'Supplier') :
                           userProfile.role === 'admin' ? (isRTL ? 'مدير' : 'Administrator') : userProfile.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Professional CTA Button */}
              <div className="text-center">
                <Link to="/dashboard">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-accent text-white font-bold px-12 py-4 text-lg hover-scale shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                  >
                    {isRTL ? 'انتقل إلى لوحة التحكم' : 'Access Dashboard'}
                  </Button>
                </Link>
              </div>

            </div>
          </section>
        </main>
      </div>
    );
  }

  return <AuthForm onAuthSuccess={handleAuthSuccess} />;
};
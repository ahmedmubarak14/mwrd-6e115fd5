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
      <div className="min-h-screen bg-background">
        {/* Header with logo */}
        <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/supplify-logo-white-bg.png" 
                alt="Supplify Logo"
                className="h-16 w-auto hover:scale-105 transition-transform"
              />
            </Link>
            
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button size="sm" className="hover-scale bg-gradient-to-r from-primary to-accent">
                  {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* User Profile Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-lime/10 rounded-full px-6 py-2 mb-6">
              <Shield className="h-4 w-4 text-lime" />
              <span className="text-sm font-medium text-lime">
                {isRTL ? 'مرحباً بك' : 'Welcome Back'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {isRTL ? 'مرحباً، ' : 'Hello, '}{userProfile.full_name || userProfile.email.split('@')[0]}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              {isRTL ? 
                'أهلاً بك في حسابك الشخصي. يمكنك إدارة طلباتك وتصفح الخدمات من هنا' : 
                'Welcome to your personal account. You can manage your requests and browse services from here'
              }
            </p>

            {/* User Details Card */}
            <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up">
              <Card className="bg-card/70 backdrop-blur-sm hover-lift transition-all duration-500 border-0 shadow-lg">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
                    <User className="h-6 w-6 text-primary" />
                    {isRTL ? 'تفاصيل الحساب' : 'Account Details'}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {isRTL ? 'معلومات حسابك الشخصي' : 'Your personal account information'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className={`flex items-center gap-3 p-4 bg-primary/5 rounded-lg ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <Mail className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'البريد الإلكتروني' : 'Email'}
                      </p>
                      <p className="font-medium">{userProfile.email}</p>
                    </div>
                  </div>
                  
                  {userProfile.company_name && (
                    <div className={`flex items-center gap-3 p-4 bg-accent/5 rounded-lg ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                      <Building2 className="h-5 w-5 text-accent" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'اسم الشركة' : 'Company Name'}
                        </p>
                        <p className="font-medium">{userProfile.company_name}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex items-center gap-3 p-4 bg-lime/5 rounded-lg ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <Shield className="h-5 w-5 text-lime" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'نوع الحساب' : 'Account Type'}
                      </p>
                      <p className="font-medium capitalize">
                        {userProfile.role === 'client' ? (isRTL ? 'عميل' : 'Client') : 
                         userProfile.role === 'supplier' ? (isRTL ? 'مقدم خدمة' : 'Supplier') :
                         userProfile.role === 'admin' ? (isRTL ? 'مدير' : 'Admin') : userProfile.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center">
              <Link to="/dashboard">
                <Button size="lg" className="hover-scale bg-gradient-to-r from-primary to-accent px-8">
                  {isRTL ? 'انتقل إلى لوحة التحكم' : 'Go to Dashboard'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return <AuthForm onAuthSuccess={handleAuthSuccess} />;
};
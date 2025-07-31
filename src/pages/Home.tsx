import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Menu, X, User, Crown, Building2 } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { SmartLogoLink } from "@/components/SmartLogoLink";
import { Link } from "react-router-dom";

export const Home = () => {
  const { user, userProfile, loading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isArabic = language === 'ar';

  const handleAuthSuccess = (userData: { id: string; email: string; role: 'client' | 'supplier' }) => {
    // User will now see the logged-in home page instead of being redirected
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not logged in, show auth form
  if (!user || !userProfile) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  // If user is logged in, show personalized home page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <SmartLogoLink className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/842b99cc-446d-41b5-8de7-b9c12faa1ed9.png" 
              alt="Supplify"
              className="h-12 w-auto"
            />
          </SmartLogoLink>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            
            {/* Show user info and dashboard button */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile.full_name || userProfile.email}
                </p>
                <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                  {userProfile.role === 'client' && <User className="h-3 w-3" />}
                  {userProfile.role === 'supplier' && <Crown className="h-3 w-3" />}
                  {userProfile.role === 'admin' && <Building2 className="h-3 w-3" />}
                  {userProfile.role} {userProfile.company_name && `• ${userProfile.company_name}`}
                </p>
              </div>
              <Link to="/dashboard">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </Link>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md p-4 space-y-3">
            <LanguageSwitcher />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {userProfile.full_name || userProfile.email}
              </p>
              <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                {userProfile.role === 'client' && <User className="h-3 w-3" />}
                {userProfile.role === 'supplier' && <Crown className="h-3 w-3" />}
                {userProfile.role === 'admin' && <Building2 className="h-3 w-3" />}
                {userProfile.role} {userProfile.company_name && `• ${userProfile.company_name}`}
              </p>
              <Link to="/dashboard" className="block">
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Welcome Section */}
      <section className="py-24 px-4 text-center bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-4 py-2 mb-8 text-sm font-medium">
            <Check className="h-4 w-4" />
            {isArabic ? 'مرحباً بك' : 'Welcome Back'}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            {isArabic ? `أهلاً بك، ${userProfile.full_name || userProfile.email}` : `Welcome back, ${userProfile.full_name || userProfile.email}`}
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            {isArabic 
              ? `نحن سعداء برؤيتك مرة أخرى! انتقل إلى لوحة التحكم الخاصة بك أو استكشف خططنا لترقية تجربتك`
              : `We're glad to see you again! Head to your dashboard or explore our plans to upgrade your experience`
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                {isArabic ? 'انتقل للوحة التحكم' : 'Go to Dashboard'}
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="px-8 py-3">
                {isArabic ? 'استكشف الخطط' : 'Explore Plans'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Current Plan Summary */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {isArabic ? 'ملخص حسابك' : 'Your Account Summary'}
          </h2>
          
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                {userProfile.role === 'client' && <User className="h-6 w-6 text-blue-600" />}
                {userProfile.role === 'supplier' && <Crown className="h-6 w-6 text-yellow-600" />}
                {userProfile.role === 'admin' && <Building2 className="h-6 w-6 text-purple-600" />}
                {isArabic ? 'حساب ' : ''}{userProfile.role === 'client' ? (isArabic ? 'العميل' : 'Client') : userProfile.role === 'supplier' ? (isArabic ? 'المقدم' : 'Supplier') : (isArabic ? 'المدير' : 'Admin')}{!isArabic ? ' Account' : ''}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    {isArabic ? 'معلومات الحساب' : 'Account Information'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">{isArabic ? 'الاسم:' : 'Name:'}</span> {userProfile.full_name || userProfile.email}</p>
                    <p><span className="font-medium">{isArabic ? 'البريد الإلكتروني:' : 'Email:'}</span> {userProfile.email}</p>
                    {userProfile.company_name && (
                      <p><span className="font-medium">{isArabic ? 'الشركة:' : 'Company:'}</span> {userProfile.company_name}</p>
                    )}
                    <p><span className="font-medium">{isArabic ? 'نوع الحساب:' : 'Account Type:'}</span> 
                      <span className="capitalize"> {userProfile.role === 'client' ? (isArabic ? 'عميل' : 'Client') : userProfile.role === 'supplier' ? (isArabic ? 'مقدم خدمة' : 'Supplier') : (isArabic ? 'مدير' : 'Admin')}</span>
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
                  </h3>
                  <div className="space-y-2">
                    <Link to="/dashboard" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        {isArabic ? 'عرض لوحة التحكم' : 'View Dashboard'}
                      </Button>
                    </Link>
                    <Link to="/pricing" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        {isArabic ? 'إدارة الاشتراك' : 'Manage Subscription'}
                      </Button>
                    </Link>
                    <Link to="/profile" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        {isArabic ? 'تحديث الملف الشخصي' : 'Update Profile'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
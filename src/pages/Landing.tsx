import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowRight, 
  Users, 
  Shield, 
  Zap, 
  TrendingUp, 
  Clock, 
  Star, 
  ChevronRight,
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
  UserPlus,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { BackToTop } from "@/components/ui/BackToTop";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const Landing = () => {
  const { t, language } = useLanguage();
  const { user, userProfile, loading } = useAuth();

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
    <div className="min-h-screen bg-background">
      <SmoothScroll />
      
      {/* Modern Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className={`${language === 'ar' ? 'order-3' : 'order-1'}`}>
            <Link to={user && userProfile ? "/dashboard" : "/"} className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo" 
                className="h-12 w-auto hover:scale-105 transition-transform" 
              />
            </Link>
          </div>
          
          <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse order-1' : 'order-3'}`}>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            {user && userProfile ? (
              <Link to="/dashboard" className="hidden md:block">
                <Button size="sm" className="hover-scale">
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" className="hidden md:block">
                  <Button variant="ghost" size="sm" className="hover-scale">
                    {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                </Link>
                <Link to="/auth" className="hidden md:block">
                  <Button size="sm" className="hover-scale">
                    {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                  </Button>
                </Link>
              </>
            )}
            <MobileNavigation />
          </div>
        </div>
      </header>

      {/* Hero Section with Marketplace Focus */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary-900))] via-[hsl(var(--bronze))] via-[hsl(var(--neutral-100))] via-[hsl(var(--darkGreen))] to-[hsl(var(--blackChasm))]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-slower"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-bronze/10 rounded-full blur-3xl animate-float-fast"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'منصة الأعمال الرائدة في المملكة' : 'Kingdom\'s Leading B2B Marketplace'}
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-bronze bg-clip-text text-transparent">
                {language === 'ar' ? 'اربط. ابحث. اشتر.' : 'Connect. Discover. Thrive.'}
              </span>
              <br />
              <span className="text-foreground/80 text-3xl md:text-4xl font-normal">
                {language === 'ar' ? 'في أكبر سوق تجاري' : 'In the Ultimate B2B Marketplace'}
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'منصة شاملة تجمع الموردين والعملاء في مكان واحد. اكتشف الفرص، اعرض منتجاتك، وانمِ أعمالك مع آلاف الشركات'
                : 'The comprehensive platform connecting suppliers and buyers in one ecosystem. Discover opportunities, showcase products, and grow your business with thousands of companies'}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/auth">
                <Button size="lg" className="px-12 py-6 text-lg font-semibold shadow-xl hover-scale bg-primary text-primary-foreground hover:bg-primary/90">
                  {language === 'ar' ? 'ابدأ البيع الآن' : 'Start Selling Now'}
                  <ArrowRight className={`h-6 w-6 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="px-12 py-6 text-lg border-2 hover-scale">
                  {language === 'ar' ? 'ابحث عن موردين' : 'Find Suppliers'}
                  <Search className={`h-6 w-6 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <Card className="text-center group hover:shadow-xl transition-all duration-500 hover-lift">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold mb-1">10,000+</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'شركة مسجلة' : 'Registered Companies'}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center group hover:shadow-xl transition-all duration-500 hover-lift">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-2xl font-bold mb-1">500K+</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'منتج متاح' : 'Available Products'}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center group hover:shadow-xl transition-all duration-500 hover-lift">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-bronze/10 rounded-xl flex items-center justify-center group-hover:bg-bronze/20 transition-all duration-300">
                    <Handshake className="h-6 w-6 text-bronze" />
                  </div>
                  <div className="text-2xl font-bold mb-1">50K+</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'صفقة ناجحة' : 'Successful Deals'}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center group hover:shadow-xl transition-all duration-500 hover-lift">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-all duration-300">
                    <ThumbsUp className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="text-2xl font-bold mb-1">98%</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'رضا العملاء' : 'Client Satisfaction'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor-Client Workflow Explainer */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {language === 'ar' ? 'كيف تعمل المنصة؟' : 'How It Works?'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'عملية بسيطة من ثلاث خطوات لربط الموردين بالعملاء وتحقيق صفقات ناجحة'
                : 'A simple three-step process to connect suppliers with buyers and achieve successful deals'}
            </p>
          </div>

          {/* Vertical Workflow Steps */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-bronze transform -translate-x-1/2 hidden md:block"></div>

              {/* Step 1: Discovery */}
              <div className="relative mb-16">
                <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="md:w-1/2 md:pr-12">
                    <Card className="p-8 hover:shadow-xl transition-all duration-500 hover-lift">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <Search className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <span className="text-3xl font-bold text-primary">01</span>
                          <h3 className="text-2xl font-bold">
                            {language === 'ar' ? 'اكتشف و ابحث' : 'Discovery & Search'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {language === 'ar' 
                          ? 'ابحث بين آلاف الموردين والمنتجات باستخدام فلاتر ذكية. اكتشف الفرص الجديدة واعرض احتياجاتك بسهولة'
                          : 'Search through thousands of suppliers and products using smart filters. Discover new opportunities and showcase your requirements effortlessly'}
                      </p>
                    </Card>
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <div className="relative p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card p-4 rounded-xl shadow-sm">
                          <Target className="h-6 w-6 text-primary mb-2" />
                          <div className="text-sm font-medium">{language === 'ar' ? 'بحث دقيق' : 'Precise Search'}</div>
                        </div>
                        <div className="bg-card p-4 rounded-xl shadow-sm">
                          <FileText className="h-6 w-6 text-accent mb-2" />
                          <div className="text-sm font-medium">{language === 'ar' ? 'عروض مخصصة' : 'Custom RFQs'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Step Connector */}
                <div className="absolute left-1/2 top-full w-6 h-6 bg-primary rounded-full transform -translate-x-1/2 hidden md:block border-4 border-background"></div>
              </div>

              {/* Step 2: Negotiation */}
              <div className="relative mb-16">
                <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                  <div className="md:w-1/2 md:pl-12">
                    <Card className="p-8 hover:shadow-xl transition-all duration-500 hover-lift">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                          <MessageSquare className="h-8 w-8 text-accent" />
                        </div>
                        <div>
                          <span className="text-3xl font-bold text-accent">02</span>
                          <h3 className="text-2xl font-bold">
                            {language === 'ar' ? 'تفاوض و تواصل' : 'Negotiate & Communicate'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {language === 'ar' 
                          ? 'تفاوض مباشرة مع الموردين، احصل على عروض مخصصة، وناقش التفاصيل في بيئة آمنة ومحمية'
                          : 'Negotiate directly with suppliers, receive custom quotes, and discuss details in a secure and protected environment'}
                      </p>
                    </Card>
                  </div>
                  <div className="md:w-1/2 md:pr-12">
                    <div className="relative p-8 bg-gradient-to-br from-accent/5 to-accent/10 rounded-3xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card p-4 rounded-xl shadow-sm">
                          <MessageSquare className="h-6 w-6 text-accent mb-2" />
                          <div className="text-sm font-medium">{language === 'ar' ? 'دردشة مباشرة' : 'Live Chat'}</div>
                        </div>
                        <div className="bg-card p-4 rounded-xl shadow-sm">
                          <Shield className="h-6 w-6 text-primary mb-2" />
                          <div className="text-sm font-medium">{language === 'ar' ? 'حماية كاملة' : 'Full Protection'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Step Connector */}
                <div className="absolute left-1/2 top-full w-6 h-6 bg-accent rounded-full transform -translate-x-1/2 hidden md:block border-4 border-background"></div>
              </div>

              {/* Step 3: Transaction */}
              <div className="relative">
                <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="md:w-1/2 md:pr-12">
                    <Card className="p-8 hover:shadow-xl transition-all duration-500 hover-lift">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-bronze/10 rounded-2xl flex items-center justify-center">
                          <CreditCard className="h-8 w-8 text-bronze" />
                        </div>
                        <div>
                          <span className="text-3xl font-bold text-bronze">03</span>
                          <h3 className="text-2xl font-bold">
                            {language === 'ar' ? 'أكمل و اشتر' : 'Complete & Purchase'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {language === 'ar' 
                          ? 'أكمل الصفقة بأمان مع نظام دفع متطور، وتتبع طلباتك، واستلم منتجاتك بضمان كامل'
                          : 'Complete deals securely with advanced payment system, track your orders, and receive products with full guarantee'}
                      </p>
                    </Card>
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <div className="relative p-8 bg-gradient-to-br from-bronze/5 to-bronze/10 rounded-3xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card p-4 rounded-xl shadow-sm">
                          <CreditCard className="h-6 w-6 text-bronze mb-2" />
                          <div className="text-sm font-medium">{language === 'ar' ? 'دفع آمن' : 'Secure Payment'}</div>
                        </div>
                        <div className="bg-card p-4 rounded-xl shadow-sm">
                          <CheckCircle className="h-6 w-6 text-secondary mb-2" />
                          <div className="text-sm font-medium">{language === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Final Step Indicator */}
                <div className="absolute left-1/2 top-full w-6 h-6 bg-bronze rounded-full transform -translate-x-1/2 hidden md:block border-4 border-background"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split Benefits Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {language === 'ar' ? 'مصمم لكلا الطرفين' : 'Built for Both Sides'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'سواء كنت مورد تريد توسيع نطاق عملك أو عميل تبحث عن أفضل الحلول، لدينا ما يناسبك'
                : 'Whether you\'re a supplier looking to expand your reach or a buyer seeking the best solutions, we have what you need'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Suppliers Panel */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5"></div>
              
              <CardHeader className="relative z-10 text-center pb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                  <Briefcase className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-primary mb-2">
                  {language === 'ar' ? 'للموردين' : 'For Suppliers'}
                </CardTitle>
                <CardDescription className="text-lg">
                  {language === 'ar' ? 'وسع نطاق أعمالك واصل لعملاء جدد' : 'Expand your business reach and connect with new clients'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Rocket className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        {language === 'ar' ? 'وصول لآلاف العملاء' : 'Access to Thousands of Buyers'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' 
                          ? 'اعرض منتجاتك لقاعدة عملاء واسعة وحقق مبيعات أكثر'
                          : 'Showcase your products to a wide customer base and achieve more sales'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        {language === 'ar' ? 'تحليلات متقدمة' : 'Advanced Analytics'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' 
                          ? 'تتبع أداء منتجاتك واحصل على رؤى قيمة لتطوير أعمالك'
                          : 'Track your product performance and gain valuable insights to grow your business'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        {language === 'ar' ? 'مدفوعات مضمونة' : 'Guaranteed Payments'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' 
                          ? 'نظام دفع آمن يضمن حصولك على أموالك في الوقت المحدد'
                          : 'Secure payment system ensures you receive your money on time'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <Link to="/auth" className="block">
                    <Button className="w-full py-6 text-lg font-semibold hover-scale bg-primary text-primary-foreground hover:bg-primary/90">
                      {language === 'ar' ? 'ابدأ البيع الآن' : 'Start Selling Now'}
                      <UserPlus className={`h-5 w-5 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Buyers Panel */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5"></div>
              
              <CardHeader className="relative z-10 text-center pb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300">
                  <Building2 className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-3xl font-bold text-accent mb-2">
                  {language === 'ar' ? 'للعملاء' : 'For Buyers'}
                </CardTitle>
                <CardDescription className="text-lg">
                  {language === 'ar' ? 'اعثر على أفضل الموردين واحصل على أفضل الأسعار' : 'Find the best suppliers and get the best prices'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Search className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        {language === 'ar' ? 'بحث ذكي ودقيق' : 'Smart & Precise Search'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' 
                          ? 'اعثر على ما تحتاجه بسرعة باستخدام فلاتر البحث المتقدمة'
                          : 'Find what you need quickly using advanced search filters'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        {language === 'ar' ? 'عروض تنافسية' : 'Competitive Offers'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' 
                          ? 'احصل على عروض متعددة من موردين مختلفين واختر الأفضل'
                          : 'Get multiple offers from different suppliers and choose the best'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        {language === 'ar' ? 'موردين معتمدين' : 'Verified Suppliers'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' 
                          ? 'جميع الموردين معتمدين ومُتحقق منهم لضمان أفضل تجربة'
                          : 'All suppliers are certified and verified for the best experience'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <Link to="/auth" className="block">
                    <Button className="w-full py-6 text-lg font-semibold hover-scale bg-accent text-accent-foreground hover:bg-accent/90">
                      {language === 'ar' ? 'ابحث عن موردين' : 'Find Suppliers'}
                      <Search className={`h-5 w-5 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary via-accent to-bronze">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {language === 'ar' ? 'ابدأ رحلتك اليوم' : 'Start Your Journey Today'}
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'انضم إلى آلاف الشركات التي تثق بنا وحقق نمو أعمالك مع أكبر منصة تجارية'
                : 'Join thousands of companies that trust us and achieve your business growth with the largest commercial platform'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="px-12 py-6 text-lg font-semibold shadow-xl hover-scale bg-white text-primary hover:bg-white/90">
                  {language === 'ar' ? 'انضم مجاناً الآن' : 'Join Free Now'}
                  <ChevronRight className={`h-6 w-6 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? '© 2024 مورد. جميع الحقوق محفوظة.'
              : '© 2024 MWRD. All rights reserved.'}
          </p>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
};
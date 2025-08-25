
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Building2, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/ui/layout/Footer";
import { MobileContainer } from "@/components/ui/MobileContainer";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingCTA } from "@/components/pricing/PricingCTA";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Pricing = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isRTL = language === 'ar';

  useEffect(() => {
    console.log("Pricing page loaded, user:", user?.id);
  }, [user]);

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!user) {
      toast({
        title: isRTL ? "المطلوب تسجيل الدخول" : "Authentication Required",
        description: isRTL ? "يرجى تسجيل الدخول أولاً" : "Please sign in to subscribe",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    console.log(`Subscribing to ${planName} with price ID: ${priceId}`);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          priceId,
          userId: user.id,
          userEmail: user.email 
        },
      });

      if (error) {
        console.error("Subscription error:", error);
        throw error;
      }

      console.log("Checkout session created:", data);

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Failed to create checkout session:", error);
      toast({
        title: isRTL ? "خطأ في الاشتراك" : "Subscription Error",
        description: isRTL ? "فشل في إنشاء جلسة الدفع" : "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: isRTL ? 'الأساسي' : 'Basic',
      price: isRTL ? '109 ريال' : '109 SAR',
      period: isRTL ? '/شهرياً' : '/month',
      description: isRTL ? 'مثالي للشركات الصغيرة' : 'Perfect for small businesses',
      priceId: 'price_basic_monthly',
      features: [
        isRTL ? 'حتى 10 طلبات شراء شهرياً' : 'Up to 10 RFQs per month',
        isRTL ? 'دعم أساسي عبر البريد الإلكتروني' : 'Basic email support',
        isRTL ? 'الوصول لقاعدة الموردين' : 'Supplier database access',
        isRTL ? 'إدارة الطلبات الأساسية' : 'Basic order management',
        isRTL ? 'تقارير شهرية' : 'Monthly reports',
      ],
      popular: false,
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'professional',
      name: isRTL ? 'المحترف' : 'Professional',
      price: isRTL ? '299 ريال' : '299 SAR',
      period: isRTL ? '/شهرياً' : '/month',
      description: isRTL ? 'للشركات المتنامية' : 'For growing businesses',
      priceId: 'price_professional_monthly',
      features: [
        isRTL ? 'طلبات شراء غير محدودة' : 'Unlimited RFQs',
        isRTL ? 'دعم هاتفي ذو أولوية' : 'Priority phone support',
        isRTL ? 'تحليلات متقدمة ولوحة تحكم' : 'Advanced analytics & dashboard',
        isRTL ? 'إدارة فرق متعددة' : 'Multi-team management',
        isRTL ? 'تكامل API متقدم' : 'Advanced API integration',
        isRTL ? 'مدير حساب مخصص' : 'Dedicated account manager',
      ],
      popular: true,
      icon: Building2,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'enterprise',
      name: isRTL ? 'المؤسسات' : 'Enterprise',
      price: isRTL ? 'مخصص' : 'Custom',
      period: '',
      description: isRTL ? 'للمؤسسات الكبيرة' : 'For large enterprises',
      priceId: 'enterprise_custom',
      features: [
        isRTL ? 'حلول مخصصة بالكامل' : 'Fully custom solutions',
        isRTL ? 'مدير حساب مخصص 24/7' : '24/7 dedicated account manager',
        isRTL ? 'SLA مضمون 99.9%' : 'Guaranteed 99.9% SLA',
        isRTL ? 'تدريب مخصص للفريق' : 'Custom team training',
        isRTL ? 'نشر محلي أو سحابي' : 'On-premise or cloud deployment',
        isRTL ? 'تكامل مع الأنظمة الحالية' : 'Legacy system integration',
      ],
      popular: false,
      icon: Crown,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--unified-page)' }}>
      {/* Exact same header as landing page with full navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ background: 'var(--gradient-header)' }}>
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/landing" className="flex items-center">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo"
                className="h-12 w-auto hover:scale-105 transition-transform cursor-pointer"
              />
            </a>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/why-start-with-mwrd" className="text-white/90 hover:text-white transition-colors">
              {isRTL ? 'لماذا نبدأ معنا' : 'Why Start with Us'}
            </a>
            <a href="/what-makes-us-unique" className="text-white/90 hover:text-white transition-colors">
              {isRTL ? 'ما يميزنا' : 'What Makes Us Unique'}
            </a>
            <a href="/why-move-to-mwrd" className="text-white/90 hover:text-white transition-colors">
              {isRTL ? 'لماذا الانتقال إلينا' : 'Why Move to Us'}
            </a>
            <a href="/pricing" className="text-white font-medium">
              {isRTL ? 'الأسعار' : 'Pricing'}
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            
            {user ? (
              <a 
                href="/dashboard" 
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-300"
              >
                {isRTL ? 'لوحة التحكم' : 'Dashboard'}
              </a>
            ) : (
              <>
                <a 
                  href="/login" 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  {isRTL ? 'تسجيل الدخول' : 'Login'}
                </a>
                <a 
                  href="/register" 
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-300"
                >
                  {isRTL ? 'ابدأ الآن' : 'Get Started'}
                </a>
              </>
            )}
          </div>
        </div>
      </header>
      
      <MobileContainer pageType="landing" className="pt-20">
        <main className="relative min-h-screen">
          {/* Background with same gradient as landing page */}
          <div className="absolute inset-0" style={{ background: 'var(--unified-page)' }} />
          
          <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
            <PricingHeader isRTL={isRTL} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <div 
                  key={plan.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PricingCard 
                    plan={plan}
                    onSubscribe={handleSubscribe}
                    loading={loading}
                    isRTL={isRTL}
                  />
                </div>
              ))}
            </div>

            <PricingCTA isRTL={isRTL} />
          </div>
        </main>
      </MobileContainer>
      
      <Footer />
    </div>
  );
};

export default Pricing;

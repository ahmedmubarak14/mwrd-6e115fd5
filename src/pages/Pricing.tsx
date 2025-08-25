
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Building2, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/layout/Header";
import { Footer } from "@/components/ui/layout/Footer";
import { MobileContainer } from "@/components/ui/MobileContainer";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingCTA } from "@/components/pricing/PricingCTA";

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
    <MobileContainer pageType="default" className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <PricingHeader isRTL={isRTL} />
        
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-20 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.id} className="animate-fade-in-up">
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
      </main>
      
      <Footer />
    </MobileContainer>
  );
};

export default Pricing;

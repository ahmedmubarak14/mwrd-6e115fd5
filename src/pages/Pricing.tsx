import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ArrowRight, Users, Building2, Crown, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Header } from "@/components/ui/layout/Header";
import { Footer } from "@/components/ui/layout/Footer";

const Pricing = () => {
  const [loading, setLoading] = useState(false);
  const { user, userProfile } = useAuth();
  const { t, language } = useLanguage();
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
      price: isRTL ? '99 ريال' : '$29',
      period: isRTL ? '/شهرياً' : '/month',
      description: isRTL ? 'مثالي للشركات الصغيرة' : 'Perfect for small businesses',
      priceId: 'price_basic_monthly',
      features: [
        isRTL ? 'حتى 10 طلبات شراء شهرياً' : 'Up to 10 RFQs per month',
        isRTL ? 'دعم أساسي عبر البريد الإلكتروني' : 'Basic email support',
        isRTL ? 'الوصول لقاعدة الموردين' : 'Supplier database access',
        isRTL ? 'إدارة الطلبات' : 'Order management',
      ],
      popular: false,
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'professional',
      name: isRTL ? 'المحترف' : 'Professional',
      price: isRTL ? '199 ريال' : '$79',
      period: isRTL ? '/شهرياً' : '/month',
      description: isRTL ? 'للشركات المتنامية' : 'For growing businesses',
      priceId: 'price_professional_monthly',
      features: [
        isRTL ? 'طلبات شراء غير محدودة' : 'Unlimited RFQs',
        isRTL ? 'دعم هاتفي ذو أولوية' : 'Priority phone support',
        isRTL ? 'تحليلات متقدمة' : 'Advanced analytics',
        isRTL ? 'إدارة فرق متعددة' : 'Multi-team management',
        isRTL ? 'تكامل API' : 'API integration',
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
        isRTL ? 'حلول مخصصة' : 'Custom solutions',
        isRTL ? 'مدير حساب مخصص' : 'Dedicated account manager',
        isRTL ? 'SLA مضمون' : 'Guaranteed SLA',
        isRTL ? 'تدريب مخصص' : 'Custom training',
        isRTL ? 'نشر محلي' : 'On-premise deployment',
      ],
      popular: false,
      icon: Crown,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            {isRTL ? 'خطط الاشتراك' : 'Subscription Plans'}
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            {isRTL ? 'اختر الخطة المناسبة لك' : 'Choose Your Perfect Plan'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {isRTL ? 'خطط مرنة تناسب جميع أحجام الشركات مع أفضل قيمة مقابل المال' : 'Flexible plans that scale with your business needs and deliver exceptional value'}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  plan.popular ? 'border-2 border-primary shadow-lg scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-accent text-primary-foreground text-center py-2 text-sm font-medium">
                    {isRTL ? 'الأكثر شعبية' : 'Most Popular'}
                  </div>
                )}
                
                <CardHeader className={`text-center pt-${plan.popular ? '12' : '8'}`}>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="mb-4">{plan.description}</CardDescription>
                  <div className="text-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.priceId, plan.name)}
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        {isRTL ? 'اختر هذه الخطة' : 'Choose Plan'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">
            {isRTL ? 'لست متأكداً من الخطة المناسبة؟' : 'Not sure which plan is right for you?'}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {isRTL ? 'تحدث مع فريقنا للحصول على استشارة مخصصة' : 'Talk to our team for a personalized recommendation'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/landing">
                {isRTL ? 'العودة للصفحة الرئيسية' : 'Back to Landing'}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/support">
                {isRTL ? 'تواصل مع المبيعات' : 'Contact Sales'}
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Eye, Clock, CreditCard, Calendar, DollarSign, CheckCircle, AlertCircle, User, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EnterpriseConsultationModal } from "@/components/modals/EnterpriseConsultationModal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePaymentIntegration } from "@/hooks/usePaymentIntegration";
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from "@/components/auth/AuthForm";

export const ManageSubscription = () => {
  const { user, userProfile, loading } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { processSubscriptionPayment } = usePaymentIntegration();
  const [activeView, setActiveView] = useState<'overview' | 'upgrade' | 'billing' | 'payment'>('overview');
  const [subscriptionData, setSubscriptionData] = useLocalStorage<any>('subscription-data', {
    subscribed: true,
    subscription_tier: 'Professional',
    subscription_end: '2024-03-15T00:00:00Z',
    next_billing_date: '2024-03-15',
    current_period_start: '2024-02-15',
    amount: 799,
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);
  const isRTL = language === 'ar';

  // Subscription metrics
  const metrics = useMemo(() => {
    return {
      daysRemaining: Math.ceil((new Date(subscriptionData.subscription_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      monthlySpend: subscriptionData.amount || 0,
      annualSavings: subscriptionData.subscription_tier === 'Professional' ? 1200 : 0,
      tierLevel: subscriptionData.subscription_tier || 'Basic'
    };
  }, [subscriptionData]);

  // Check subscription status on component load
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionData(data);
    } catch (error: any) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
    }
  };

  const handleUpgrade = async (plan: string) => {
    setIsLoading(true);
    try {
      // Simulate successful upgrade
      toast({
        title: "Redirecting to Checkout",
        description: `Processing upgrade to ${plan} plan...`,
      });
      
      // Simulate successful upgrade after 2 seconds
      setTimeout(() => {
        setSubscriptionData(prev => ({
          ...prev,
          subscription_tier: plan,
          amount: plan === 'Basic' ? 299 : plan === 'Professional' ? 799 : 1299
        }));
        
        toast({
          title: "Upgrade Successful",
          description: `Your subscription has been upgraded to ${plan}!`,
        });
      }, 2000);
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to process upgrade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      // Simulate opening customer portal
      toast({
        title: "Opening Customer Portal",
        description: "Redirecting to subscription management...",
      });
      
      // Open dummy portal
      const portalUrl = `https://billing.stripe.com/p/customer_portal/${Date.now()}`;
      window.open(portalUrl, '_blank');
      
      toast({
        title: "Portal Opened",
        description: "Customer portal opened in new tab. You can manage your subscription there.",
      });
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDowngradeSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Simulate downgrade process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscriptionData(prev => ({
        ...prev,
        subscription_tier: 'Basic',
        amount: 299,
        status: 'downgrading'
      }));
      
      toast({
        title: isRTL ? "تم تخفيض الاشتراك" : "Subscription Downgraded", 
        description: isRTL ? "سيتم تطبيق التغيير في الفترة القادمة" : "Downgrade will take effect at the end of current billing period",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to downgrade subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Simulate cancellation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscriptionData(prev => ({
        ...prev,
        status: 'cancelled',
        subscription_end: prev.subscription_end // Keep current end date
      }));
      
      toast({
        title: isRTL ? "تم إلغاء الاشتراك" : "Subscription Cancelled",
        description: isRTL ? "ستحتفظ بالوصول حتى نهاية الفترة الحالية" : "You'll retain access until the end of your current billing period",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    setIsLoading(true);
    try {
      // Simulate payment method update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Payment Method Updated",
        description: "Your payment method has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update payment method",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (userData: { id: string; email: string; role: 'client' | 'vendor' | 'admin' }) => {
    // Already handled by useEffect
  };

  // Render functions
  const renderOverview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            {isRTL ? 'إدارة الاشتراك' : 'Manage Subscription'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'معلومات اشتراكك الحالي والتحكم فيه' : 'Your current subscription details and management options'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Subscription Info */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-lg mb-3 text-primary">
                {isRTL ? 'الاشتراك الحالي' : 'Current Subscription'}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    {isRTL ? 'الخطة:' : 'Plan:'}
                  </span>
                  <span className="font-medium">{subscriptionData.subscription_tier}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    {isRTL ? 'تاريخ التجديد:' : 'Next Billing:'}
                  </span>
                  <span className="font-medium">March 15, 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    {isRTL ? 'الحالة:' : 'Status:'}
                  </span>
                  <Badge variant={subscriptionData.status === 'active' ? 'default' : 'destructive'}>
                    {subscriptionData.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Management Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full"
                onClick={() => setActiveView('upgrade')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {isRTL ? 'ترقية الاشتراك' : 'Upgrade Subscription'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveView('billing')}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isRTL ? 'عرض تفاصيل الفوترة' : 'View Billing Details'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleManageSubscription}
                disabled={isLoading}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isLoading ? "Opening..." : (isRTL ? 'إدارة الاشتراك' : 'Manage Subscription')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlanCards = () => {
    const plans = [
      {
        name: isRTL ? 'نمو الأعمال' : 'Business Growth',
        price: 299,
        features: [
          isRTL ? 'حتى 8 طلبات خدمة شهرياً' : 'Up to 8 service requests per month',
          isRTL ? 'أولوية في المطابقة الذكية' : 'Priority smart matching',
          isRTL ? 'دعم فني متخصص' : 'Specialist technical support'
        ],
        current: subscriptionData.subscription_tier === 'Basic'
      },
      {
        name: isRTL ? 'التميز المهني' : 'Professional Excellence',
        price: 799,
        features: [
          isRTL ? 'حتى 30 طلب خدمة شهرياً' : 'Up to 30 service requests per month',
          isRTL ? 'مطابقة ذكية متقدمة بالذكاء الاصطناعي' : 'Advanced AI-powered smart matching',
          isRTL ? 'فريق دعم مخصص' : 'Dedicated support team',
          isRTL ? 'استشارات استراتيجية' : 'Strategic consultations'
        ],
        current: subscriptionData.subscription_tier === 'Professional'
      },
      {
        name: isRTL ? 'قيادة المؤسسات' : 'Enterprise Leadership',
        price: 'Custom',
        features: [
          isRTL ? 'طلبات خدمة غير محدودة' : 'Unlimited service requests',
          isRTL ? 'مدير حساب مخصص' : 'Dedicated account manager',
          isRTL ? 'تكاملات تقنية مخصصة' : 'Custom technical integrations',
          isRTL ? 'استشارات تحول رقمي' : 'Digital transformation consultancy'
        ],
        current: subscriptionData.subscription_tier === 'Enterprise'
      }
    ];

    return plans.map((plan, index) => (
      <Card key={index} className={`${plan.current ? 'border-primary bg-primary/5' : 'border-muted'} hover:shadow-lg transition-shadow`}>
        <CardHeader className="text-center">
          <CardTitle className={`text-lg ${plan.current ? 'text-primary' : ''}`}>
            {plan.name}
          </CardTitle>
          <div className="text-3xl font-bold flex items-baseline justify-center gap-2">
            {typeof plan.price === 'number' ? plan.price : plan.price}
            {typeof plan.price === 'number' && (
              <>
                <img 
                  src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                  alt="SAR" 
                  className="h-6 w-6 opacity-80"
                />
                <span className="text-sm text-muted-foreground">{isRTL ? '/شهر' : '/month'}</span>
              </>
            )}
          </div>
          {plan.current && (
            <Badge variant="default" className="mt-2">
              {isRTL ? 'الخطة الحالية' : 'Current Plan'}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {plan.features.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
          <div className="pt-4">
            {plan.price === 'Custom' ? (
              <EnterpriseConsultationModal>
                <Button className="w-full">
                  {isRTL ? 'طلب استشارة مؤسسات' : 'Request Enterprise Consultation'}
                </Button>
              </EnterpriseConsultationModal>
            ) : (
              <Button 
                className="w-full"
                variant={plan.current ? "outline" : "default"}
                onClick={() => !plan.current && handleUpgrade(index === 0 ? 'Basic' : 'Professional')}
                disabled={isLoading || plan.current}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : plan.current ? (
                  isRTL ? 'الخطة الحالية' : 'Current Plan'
                ) : (
                  isRTL ? 'الترقية لهذه الخطة' : 'Upgrade to This Plan'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderUpgradeView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            {isRTL ? 'ترقية الاشتراك' : 'Upgrade Subscription'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'اختر خطة جديدة لتحسين تجربتك' : 'Choose a new plan to enhance your experience'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderPlanCards()}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBillingView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-primary" />
            {isRTL ? 'تفاصيل الفوترة' : 'Billing Details'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'تاريخ الفوترة والمدفوعات' : 'Your billing history and payment details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Period */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-lg mb-3 text-primary">
                {isRTL ? 'الفترة الحالية' : 'Current Billing Period'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground text-sm">
                    {isRTL ? 'بداية الفترة:' : 'Period Start:'}
                  </span>
                  <p className="font-medium">February 15, 2024</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    {isRTL ? 'نهاية الفترة:' : 'Period End:'}
                  </span>
                  <p className="font-medium">March 15, 2024</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    {isRTL ? 'المبلغ:' : 'Amount:'}
                  </span>
                  <div className="flex items-center gap-1">
                    <p className="font-medium">{subscriptionData.amount}</p>
                    <span className="text-sm">SAR</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    {isRTL ? 'الحالة:' : 'Status:'}
                  </span>
                  <p className="font-medium text-success">Paid</p>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div>
              <h4 className="font-semibold text-lg mb-4">
                {isRTL ? 'تاريخ الفوترة' : 'Billing History'}
              </h4>
              <div className="space-y-3">
                {[
                  { date: 'January 15, 2024', amount: '799', status: 'Paid', invoice: 'INV-001' },
                  { date: 'December 15, 2023', amount: '799', status: 'Paid', invoice: 'INV-002' },
                  { date: 'November 15, 2023', amount: '799', status: 'Paid', invoice: 'INV-003' },
                ].map((bill) => (
                  <div key={bill.invoice} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{bill.date}</p>
                      <p className="text-sm text-muted-foreground">{bill.invoice}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 font-medium">
                        <span>{bill.amount} SAR</span>
                      </div>
                      <span className="text-sm text-success">{bill.status}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({
                        title: "Invoice Downloaded",
                        description: `Invoice ${bill.invoice} has been downloaded.`,
                      })}
                    >
                      {isRTL ? 'تحميل' : 'Download'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            {isRTL ? 'طرق الدفع' : 'Payment Methods'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'إدارة طرق الدفع المحفوظة' : 'Manage your saved payment methods'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Primary Payment Method */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg text-primary">
                  {isRTL ? 'طريقة الدفع الأساسية' : 'Primary Payment Method'}
                </h4>
                <Badge variant="default">
                  {isRTL ? 'افتراضي' : 'Default'}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/2027</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleUpdatePaymentMethod}
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner size="sm" className="mr-1" /> : null}
                  {isRTL ? 'تحديث' : 'Update'}
                </Button>
              </div>
            </div>

            {/* Add New Payment Method */}
            <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
              <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-4">
                {isRTL ? 'إضافة طريقة دفع جديدة' : 'Add a new payment method'}
              </p>
              <Button 
                variant="outline"
                onClick={() => toast({
                  title: "Add Payment Method",
                  description: "Redirecting to secure payment form...",
                })}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isRTL ? 'إضافة بطاقة' : 'Add Card'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <ClientPageContainer>
        <div className="mb-8">
          <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </ClientPageContainer>
    );
  }

  if (!user || !userProfile) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <ClientPageContainer
      title="Subscription Management"
      description="Manage your subscription plan and billing preferences"
    >
      {/* Subscription Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Current Plan"
          value={metrics.tierLevel}
          icon={User}
          description="Your active subscription tier"
          variant="success"
        />
        <MetricCard
          title="Days Remaining"
          value={metrics.daysRemaining}
          icon={Clock}
          description="Until next billing cycle"
          variant={metrics.daysRemaining < 7 ? "warning" : "default"}
        />
        <MetricCard
          title="Monthly Cost"
          value={`${metrics.monthlySpend} SAR`}
          icon={DollarSign}
          description="Current monthly subscription"
        />
        <MetricCard
          title="Status"
          value={subscriptionData.status === 'active' ? 'Active' : 'Cancelled'}
          icon={Shield}
          variant={subscriptionData.status === 'active' ? "success" : "warning"}
        />
      </div>

      {/* Subscription Management Tabs */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="upgrade">{isRTL ? 'ترقية' : 'Upgrade'}</TabsTrigger>
          <TabsTrigger value="billing">{isRTL ? 'الفوترة' : 'Billing'}</TabsTrigger>
          <TabsTrigger value="payment">{isRTL ? 'الدفع' : 'Payment'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="upgrade" className="space-y-6">
          {renderUpgradeView()}
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {renderBillingView()}
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          {renderPaymentView()}
        </TabsContent>
      </Tabs>
    </ClientPageContainer>
  );
};
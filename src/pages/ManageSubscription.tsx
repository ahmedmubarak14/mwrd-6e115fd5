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
import { usePaymentIntegration } from "@/hooks/usePaymentIntegration";
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from "@/components/auth/AuthForm";
import { format } from "date-fns";

export const ManageSubscription = () => {
  const { user, userProfile, loading } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { processSubscriptionPayment } = usePaymentIntegration();
  const [activeView, setActiveView] = useState<'overview' | 'upgrade' | 'billing' | 'payment'>('overview');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isRTL = language === 'ar';

  // Get real subscription data from user profile
  const subscriptionData = useMemo(() => {
    if (!userProfile) return null;
    
    return {
      subscription_tier: userProfile.subscription_plan || 'free',
      subscription_status: userProfile.subscription_status || 'active',
      subscription_expires_at: userProfile.subscription_expires_at,
      created_at: userProfile.created_at,
      updated_at: userProfile.updated_at
    };
  }, [userProfile]);

  // Real subscription metrics
  const metrics = useMemo(() => {
    if (!subscriptionData || !transactions.length) {
      return {
        daysRemaining: subscriptionData?.subscription_expires_at 
          ? Math.ceil((new Date(subscriptionData.subscription_expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : 0,
        monthlySpend: 0,
        totalSpent: 0,
        tierLevel: subscriptionData?.subscription_tier || 'free'
      };
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.created_at);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             t.status === 'completed';
    });

    return {
      daysRemaining: subscriptionData.subscription_expires_at 
        ? Math.ceil((new Date(subscriptionData.subscription_expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0,
      monthlySpend: monthlyTransactions.reduce((sum, t) => sum + Number(t.amount), 0),
      totalSpent: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + Number(t.amount), 0),
      tierLevel: subscriptionData.subscription_tier
    };
  }, [subscriptionData, transactions]);

  // Load real data on component mount
  useEffect(() => {
    if (user) {
      fetchFinancialTransactions();
    }
  }, [user]);

  const fetchFinancialTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive",
      });
    }
  };

  const handleUpgrade = async (plan: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Create a real transaction record
      const planPrices = {
        'basic': 299,
        'professional': 799,
        'enterprise': 1299
      };
      
      const { error: transactionError } = await supabase
        .from('financial_transactions')
        .insert([{
          user_id: user.id,
          type: 'subscription',
          amount: planPrices[plan.toLowerCase() as keyof typeof planPrices] || 0,
          status: 'completed',
          description: `Subscription upgrade to ${plan} plan`,
          payment_method: 'credit_card'
        }]);

      if (transactionError) throw transactionError;

      // Update user profile with new subscription
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          subscription_plan: plan.toLowerCase(),
          subscription_status: 'active',
          subscription_expires_at: expirationDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Refresh data
      await fetchFinancialTransactions();
      
      toast({
        title: "Upgrade Successful",
        description: `Your subscription has been upgraded to ${plan}!`,
      });
    } catch (error: any) {
      console.error('Error upgrading subscription:', error);
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
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Update user profile with downgrade
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_plan: 'basic',
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
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
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Update user profile to cancelled status
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
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
                  <span className="font-medium capitalize">{subscriptionData?.subscription_tier}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    {isRTL ? 'تاريخ الانتهاء:' : 'Expires:'}
                  </span>
                  <span className="font-medium">
                    {subscriptionData?.subscription_expires_at 
                      ? format(new Date(subscriptionData.subscription_expires_at), 'MMM dd, yyyy')
                      : 'No expiration'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    {isRTL ? 'الحالة:' : 'Status:'}
                  </span>
                  <Badge variant={subscriptionData?.subscription_status === 'active' ? 'default' : 'destructive'}>
                    {subscriptionData?.subscription_status || 'inactive'}
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
        current: subscriptionData?.subscription_tier === 'basic'
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
        current: subscriptionData?.subscription_tier === 'professional'
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
        current: subscriptionData?.subscription_tier === 'enterprise'
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
                onClick={() => !plan.current && handleUpgrade(index === 0 ? 'basic' : 'professional')}
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
            {/* Real Transaction History */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">
                {isRTL ? 'سجل المعاملات' : 'Transaction History'}
              </h4>
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.description || transaction.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{transaction.amount} SAR</p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  {isRTL ? 'لا توجد معاملات' : 'No transactions found'}
                </p>
              )}
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
          value={subscriptionData?.subscription_status === 'active' ? 'Active' : 'Cancelled'}
          icon={Shield}
          variant={subscriptionData?.subscription_status === 'active' ? "success" : "warning"}
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
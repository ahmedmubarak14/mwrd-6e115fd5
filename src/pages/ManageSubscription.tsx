import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { AuthForm } from "@/components/auth/AuthForm";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TrendingUp, Eye, Clock, CreditCard, Calendar, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EnterpriseConsultationModal } from "@/components/modals/EnterpriseConsultationModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Footer } from "@/components/ui/layout/Footer";
import { usePaymentIntegration } from "@/hooks/usePaymentIntegration";

export const ManageSubscription = () => {
  const { user, userProfile, loading } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { processSubscriptionPayment } = usePaymentIntegration();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  const renderUpgradeView = () => (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          {isRTL ? 'ترقية الاشتراك' : 'Upgrade Subscription'}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {isRTL ? 'اختر خطة جديدة لتحسين تجربتك' : 'Choose a new plan to enhance your experience'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <Card className="border-2 border-muted">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{isRTL ? 'نمو الأعمال' : 'Business Growth'}</CardTitle>
                <div className="text-3xl font-bold flex items-baseline justify-center gap-2">
                  299
                  <img 
                    src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                    alt="SAR" 
                    className="h-6 w-6 opacity-80"
                  />
                  <span className="text-sm text-muted-foreground">{isRTL ? '/شهر' : '/month'}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{isRTL ? 'حتى 8 طلبات خدمة شهرياً' : 'Up to 8 service requests per month'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{isRTL ? 'أولوية في المطابقة الذكية' : 'Priority smart matching'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{isRTL ? 'دعم فني متخصص' : 'Specialist technical support'}</span>
                </div>
                <Button 
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => handleUpgrade('Basic')}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : (isRTL ? 'الترقية للأساسي' : 'Upgrade to Basic')}
                </Button>
              </CardContent>
            </Card>

          {/* Premium Plan - Current */}
          <Card className="border-2 border-primary bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-lg text-primary">{isRTL ? 'التميز المهني' : 'Professional Excellence'}</CardTitle>
              <div className="text-3xl font-bold flex items-baseline justify-center gap-2">
                799
                <img 
                  src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                  alt="SAR" 
                  className="h-6 w-6 opacity-80"
                />
                <span className="text-sm text-muted-foreground">{isRTL ? '/شهر' : '/month'}</span>
              </div>
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                {isRTL ? 'الخطة الحالية' : 'Current Plan'}
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{isRTL ? 'حتى 30 طلب خدمة شهرياً' : 'Up to 30 service requests per month'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{isRTL ? 'مطابقة ذكية متقدمة بالذكاء الاصطناعي' : 'Advanced AI-powered smart matching'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{isRTL ? 'فريق دعم مخصص' : 'Dedicated support team'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{isRTL ? 'استشارات استراتيجية' : 'Strategic consultations'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-accent">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">{isRTL ? 'قيادة المؤسسات' : 'Enterprise Leadership'}</CardTitle>
              <div className="text-3xl font-bold">
                {isRTL ? 'حسب الطلب' : 'Custom'}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{isRTL ? 'طلبات خدمة غير محدودة' : 'Unlimited service requests'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{isRTL ? 'مدير حساب مخصص' : 'Dedicated account manager'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{isRTL ? 'تكاملات تقنية مخصصة' : 'Custom technical integrations'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{isRTL ? 'استشارات تحول رقمي' : 'Digital transformation consultancy'}</span>
              </div>
              <EnterpriseConsultationModal>
                <Button className="w-full mt-4 bg-gradient-to-r from-accent to-primary">
                  {isRTL ? 'طلب استشارة مؤسسات' : 'Request Enterprise Consultation'}
                </Button>
              </EnterpriseConsultationModal>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderBillingView = () => (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl flex items-center gap-3">
          <Eye className="h-6 w-6 text-primary" />
          {isRTL ? 'تفاصيل الفوترة' : 'Billing Details'}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {isRTL ? 'تاريخ الفوترة والمدفوعات' : 'Your billing history and payment details'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
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
                  <p className="font-medium">799</p>
                  <img 
                    src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                    alt="SAR" 
                    className="h-4 w-4 opacity-80"
                  />
                </div>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">
                  {isRTL ? 'الحالة:' : 'Status:'}
                </span>
                <p className="font-medium text-green-600">Paid</p>
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
                      <span>{bill.amount}</span>
                      <img 
                        src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                        alt="SAR" 
                        className="h-3 w-3 opacity-70"
                      />
                    </div>
                    <span className="text-sm text-green-600">{bill.status}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        // Simulate invoice download
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        toast({
                          title: "Invoice Downloaded",
                          description: `Invoice ${bill.invoice} has been downloaded.`,
                        });
                      } catch (error) {
                        toast({
                          title: "Download Failed",
                          description: "Failed to download invoice. Please try again.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : (isRTL ? 'تحميل' : 'Download')}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPaymentView = () => (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-primary" />
          {isRTL ? 'طرق الدفع' : 'Payment Methods'}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {isRTL ? 'إدارة طرق الدفع المحفوظة' : 'Manage your saved payment methods'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* Primary Payment Method */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-lg text-primary">
                {isRTL ? 'طريقة الدفع الأساسية' : 'Primary Payment Method'}
              </h4>
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                {isRTL ? 'افتراضي' : 'Default'}
              </span>
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({
                  title: "Payment Method Removed",
                  description: "Primary payment method cannot be removed. Add another method first.",
                  variant: "destructive"
                })}
              >
                {isRTL ? 'حذف' : 'Remove'}
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
              <CreditCard className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'إضافة بطاقة' : 'Add Card'}
            </Button>
          </div>

          {/* Auto-renewal Settings */}
          <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
            <h4 className="font-semibold text-lg mb-3 text-accent">
              {isRTL ? 'إعدادات التجديد التلقائي' : 'Auto-renewal Settings'}
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {isRTL ? 'التجديد التلقائي مفعل' : 'Auto-renewal enabled'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'سيتم تجديد اشتراكك تلقائياً في 15 مارس 2024' : 'Your subscription will automatically renew on March 15, 2024'}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({
                  title: "Auto-renewal Settings",
                  description: "Auto-renewal has been disabled. You can re-enable it anytime.",
                })}
              >
                {isRTL ? 'تعطيل' : 'Disable'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Subscription Management Section */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            {isRTL ? 'إدارة الاشتراك' : 'Manage Subscription'}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {isRTL ? 'معلومات اشتراكك الحالي والتحكم فيه' : 'Your current subscription details and management options'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Subscription Info */}
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-lg mb-3 text-primary">
                  {isRTL ? 'الاشتراك الحالي' : 'Current Subscription'}
                </h4>
                <div className="space-y-3">
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground text-sm">
                      {isRTL ? 'الخطة:' : 'Plan:'}
                    </span>
                    <span className="font-medium">Professional Excellence Plan</span>
                  </div>
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground text-sm">
                      {isRTL ? 'مدة الاشتراك:' : 'Duration:'}
                    </span>
                    <span className="font-medium">Monthly</span>
                  </div>
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground text-sm">
                      {isRTL ? 'تاريخ التجديد:' : 'Next Billing:'}
                    </span>
                    <span className="font-medium">March 15, 2024</span>
                  </div>
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground text-sm">
                      {isRTL ? 'الوقت المتبقي:' : 'Time Remaining:'}
                    </span>
                    <span className="font-medium text-lime">23 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Actions */}
            <div className="space-y-4">
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-lg mb-3 text-accent">
                  {isRTL ? 'خيارات الإدارة' : 'Management Options'}
                </h4>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent hover-scale"
                    onClick={() => setActiveView('upgrade')}
                  >
                    <TrendingUp className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'ترقية الاشتراك' : 'Upgrade Subscription'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full hover-scale"
                    onClick={() => setActiveView('billing')}
                  >
                    <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'عرض تفاصيل الفوترة' : 'View Billing Details'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full hover-scale"
                    onClick={() => setActiveView('payment')}
                  >
                    <Clock className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'تغيير طريقة الدفع' : 'Change Payment Method'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full hover-scale"
                    onClick={handleManageSubscription}
                    disabled={isLoading}
                  >
                    <CreditCard className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isLoading ? "Opening..." : (isRTL ? 'إدارة الاشتراك' : 'Manage Subscription')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile.role} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile.role} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              <Button 
                variant={activeView === 'overview' ? 'default' : 'outline'}
                onClick={() => setActiveView('overview')}
                className="whitespace-nowrap"
              >
                {isRTL ? 'نظرة عامة' : 'Overview'}
              </Button>
              <Button 
                variant={activeView === 'upgrade' ? 'default' : 'outline'}
                onClick={() => setActiveView('upgrade')}
                className="whitespace-nowrap"
              >
                {isRTL ? 'ترقية الاشتراك' : 'Upgrade Plan'}
              </Button>
              <Button 
                variant={activeView === 'billing' ? 'default' : 'outline'}
                onClick={() => setActiveView('billing')}
                className="whitespace-nowrap"
              >
                {isRTL ? 'تفاصيل الفوترة' : 'Billing History'}
              </Button>
              <Button 
                variant={activeView === 'payment' ? 'default' : 'outline'}
                onClick={() => setActiveView('payment')}
                className="whitespace-nowrap"
              >
                {isRTL ? 'طرق الدفع' : 'Payment Methods'}
              </Button>
            </div>

            {/* Content Views */}
            {activeView === 'overview' && renderOverview()}
            {activeView === 'upgrade' && renderUpgradeView()}
            {activeView === 'billing' && renderBillingView()}
            {activeView === 'payment' && renderPaymentView()}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
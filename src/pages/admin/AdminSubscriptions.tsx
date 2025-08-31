import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, addDays, addMonths, isAfter, isBefore } from "date-fns";
import { CreditCard, Download, RefreshCw, TrendingUp, Users, Edit, Trash2, Eye, Calendar, DollarSign, Crown, AlertTriangle, Plus, BarChart3, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AdminSubscription {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  subscription_plan: string;
  subscription_status: string;
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
  role: string;
  avatar_url: string | null;
}

const SUBSCRIPTION_PLANS = [
  { value: 'free', label: 'Free', price: 0, features: ['Basic features', 'Limited access'] },
  { value: 'basic', label: 'Basic', price: 49, features: ['Standard features', 'Email support'] },
  { value: 'premium', label: 'Premium', price: 99, features: ['Premium features', 'Priority support', 'Advanced tools'] },
  { value: 'enterprise', label: 'Enterprise', price: 199, features: ['All features', '24/7 support', 'Custom integrations'] }
];

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [editingSubscription, setEditingSubscription] = useState<AdminSubscription | null>(null);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [newPlan, setNewPlan] = useState<string>("");
  const [newExpiryDays, setNewExpiryDays] = useState<number>(30);
  
  const { t, isRTL } = useLanguage();

  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedSubscriptions: AdminSubscription[] = (data || []).map(profile => ({
        id: profile.id,
        user_id: profile.user_id,
        email: profile.email,
        full_name: profile.full_name,
        company_name: profile.company_name,
        subscription_plan: profile.subscription_plan || 'free',
        subscription_status: profile.subscription_status || 'active',
        subscription_expires_at: profile.subscription_expires_at,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        role: profile.role,
        avatar_url: profile.avatar_url
      }));

      setSubscriptions(transformedSubscriptions);
    } catch (error: any) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (userId: string, updates: Partial<AdminSubscription>) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_plan: updates.subscription_plan,
          subscription_status: updates.subscription_status,
          subscription_expires_at: updates.subscription_expires_at,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      
      await fetchSubscriptions();
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive"
      });
    }
  };

  const cancelSubscription = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_status: 'cancelled',
          subscription_expires_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      
      await fetchSubscriptions();
      toast({
        title: "Success",
        description: "Subscription cancelled successfully",
      });
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive"
      });
    }
  };

  const handleBulkAction = async () => {
    if (selectedSubscriptions.length === 0 || !bulkAction) return;

    try {
      let updateData: any = { updated_at: new Date().toISOString() };

      if (bulkAction === 'cancel') {
        updateData.subscription_status = 'cancelled';
        updateData.subscription_expires_at = new Date().toISOString();
      } else if (bulkAction === 'activate') {
        updateData.subscription_status = 'active';
        updateData.subscription_expires_at = addDays(new Date(), 30).toISOString();
      } else if (SUBSCRIPTION_PLANS.find(p => p.value === bulkAction)) {
        updateData.subscription_plan = bulkAction;
        updateData.subscription_status = 'active';
        updateData.subscription_expires_at = addDays(new Date(), 30).toISOString();
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .in('id', selectedSubscriptions);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${selectedSubscriptions.length} subscriptions updated`,
      });

      setSelectedSubscriptions([]);
      setBulkAction("");
      await fetchSubscriptions();
    } catch (error: any) {
      console.error('Error with bulk action:', error);
      toast({
        title: "Error",
        description: "Bulk action failed",
        variant: "destructive"
      });
    }
  };

  const handleExportSelected = () => {
    const subscriptionsToExport = selectedSubscriptions.length > 0 
      ? filteredSubscriptions.filter(sub => selectedSubscriptions.includes(sub.id))
      : filteredSubscriptions;

    const csvContent = [
      'User ID,Name,Email,Company,Plan,Status,Expires,Created,Role',
      ...subscriptionsToExport.map(sub => 
        `${sub.user_id},"${sub.full_name || 'N/A'}","${sub.email}","${sub.company_name || 'N/A'}",${sub.subscription_plan},${sub.subscription_status},"${sub.subscription_expires_at ? format(new Date(sub.subscription_expires_at), 'yyyy-MM-dd') : 'N/A'}",${format(new Date(sub.created_at), 'yyyy-MM-dd')},${sub.role}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export completed",
      description: `${subscriptionsToExport.length} subscriptions exported to CSV`,
    });
  };

  const handleRefresh = () => {
    fetchSubscriptions();
    toast({
      title: "Data refreshed",
      description: "Subscriptions data has been updated",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      cancelled: "destructive",
      expired: "secondary",
      suspended: "outline"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      free: "secondary",
      basic: "outline", 
      premium: "default",
      enterprise: "destructive"
    } as const;

    const planInfo = SUBSCRIPTION_PLANS.find(p => p.value === plan);
    
    return (
      <Badge variant={colors[plan as keyof typeof colors] || "secondary"} className="flex items-center gap-1">
        {plan === 'enterprise' && <Crown className="h-3 w-3" />}
        {planInfo?.label || plan}
      </Badge>
    );
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const soon = addDays(new Date(), 7);
    return isBefore(expiry, soon) && isAfter(expiry, new Date());
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return isBefore(new Date(expiryDate), new Date());
  };

  // Analytics calculations
  const currentDate = new Date();
  const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(s => s.subscription_status === 'active').length;
  const expiredSubscriptions = subscriptions.filter(s => s.subscription_expires_at && isExpired(s.subscription_expires_at)).length;
  const expiringSoonCount = subscriptions.filter(s => isExpiringSoon(s.subscription_expires_at)).length;

  const monthlyRevenue = subscriptions
    .filter(s => s.subscription_status === 'active')
    .reduce((sum, s) => {
      const planInfo = SUBSCRIPTION_PLANS.find(p => p.value === s.subscription_plan);
      return sum + (planInfo?.price || 0);
    }, 0);

  const newSubscriptionsThisMonth = subscriptions.filter(s => 
    new Date(s.created_at) >= thisMonthStart
  ).length;

  const planDistribution = SUBSCRIPTION_PLANS.map(plan => ({
    ...plan,
    count: subscriptions.filter(s => s.subscription_plan === plan.value).length
  }));

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const searchMatch = searchTerm === "" || 
      subscription.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.subscription_plan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "all" || subscription.subscription_status === statusFilter;
    const planMatch = planFilter === "all" || subscription.subscription_plan === planFilter;
    
    const tabMatch = activeTab === "all" || 
      (activeTab === "active" && subscription.subscription_status === "active") ||
      (activeTab === "expired" && subscription.subscription_expires_at && isExpired(subscription.subscription_expires_at)) ||
      (activeTab === "expiring" && isExpiringSoon(subscription.subscription_expires_at));
    
    return searchMatch && statusMatch && planMatch && tabMatch;
  });

  const selectAllSubscriptions = () => {
    if (selectedSubscriptions.length === filteredSubscriptions.length) {
      setSelectedSubscriptions([]);
    } else {
      setSelectedSubscriptions(filteredSubscriptions.map(sub => sub.id));
    }
  };

  const handlePlanChange = (subscription: AdminSubscription) => {
    if (!newPlan) return;
    
    const expiryDate = addDays(new Date(), newExpiryDays).toISOString();
    updateSubscription(subscription.user_id, {
      subscription_plan: newPlan,
      subscription_status: 'active',
      subscription_expires_at: expiryDate
    });
    setEditingSubscription(null);
    setNewPlan("");
    setNewExpiryDays(30);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" data-admin-dashboard>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          {t('admin.subscriptionManagement')}
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          {t('admin.subscriptionManagementDesc')}
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{t('admin.allSubscriptions')}</TabsTrigger>
          <TabsTrigger value="active">{t('common.active')}</TabsTrigger>
          <TabsTrigger value="expiring">{t('admin.expiringSoon')}</TabsTrigger>
          <TabsTrigger value="expired">{t('admin.expired')}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.totalSubscriptions')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSubscriptions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{newSubscriptionsThisMonth} {t('admin.thisMonth')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.activeSubscriptions')}</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSubscriptions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {expiringSoonCount} {t('admin.expiringSoon')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.monthlyRevenue')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyRevenue.toLocaleString()} SAR</div>
                <p className="text-xs text-muted-foreground">
                  {t('admin.fromActiveSubscriptions')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.expiredCancelled')}</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expiredSubscriptions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {t('admin.needAttention')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Plan Distribution */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.planDistribution')}</CardTitle>
              <BarChart3 className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {planDistribution.map((plan) => (
                  <div key={plan.value} className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{plan.count}</div>
                    <div className="text-sm font-medium">{plan.label}</div>
                    <div className="text-xs text-muted-foreground">{plan.price} SAR/month</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters and Bulk Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.filtersActions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <Input
                     placeholder={t('admin.searchUsers')}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                   
                   <Select value={statusFilter} onValueChange={setStatusFilter}>
                     <SelectTrigger>
                       <SelectValue placeholder={t('admin.filterByStatus')} />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">{t('admin.allStatus')}</SelectItem>
                       <SelectItem value="active">{t('common.active')}</SelectItem>
                       <SelectItem value="cancelled">{t('admin.cancelled')}</SelectItem>
                       <SelectItem value="expired">{t('admin.expired')}</SelectItem>
                       <SelectItem value="suspended">{t('admin.suspended')}</SelectItem>
                     </SelectContent>
                   </Select>

                    <Select value={planFilter} onValueChange={setPlanFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.filterByPlan')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('admin.allPlans')}</SelectItem>
                        {SUBSCRIPTION_PLANS.map((plan) => (
                          <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {t('admin.refresh')}
                      </Button>
                      <Button variant="outline" onClick={handleExportSelected}>
                        <Download className="h-4 w-4 mr-2" />
                        {t('admin.export')}
                     </Button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedSubscriptions.length > 0 && (
                   <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                     <span className="text-sm font-medium">
                       {selectedSubscriptions.length} {t('admin.subscriptionsSelected')}
                     </span>
                     <Select value={bulkAction} onValueChange={setBulkAction}>
                       <SelectTrigger className="w-48">
                         <SelectValue placeholder={t('admin.bulkAction')} />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="activate">{t('admin.activateSubscriptions')}</SelectItem>
                         <SelectItem value="cancel">{t('admin.cancelSubscriptions')}</SelectItem>
                         {SUBSCRIPTION_PLANS.map((plan) => (
                           <SelectItem key={plan.value} value={plan.value}>
                             {t('admin.changeTo')} {plan.label}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <AlertDialog>
                       <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="sm" disabled={!bulkAction}>
                           {t('admin.applyAction')}
                         </Button>
                       </AlertDialogTrigger>
                       <AlertDialogContent>
                         <AlertDialogHeader>
                           <AlertDialogTitle>{t('admin.confirmBulkAction')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('admin.bulkActionWarning')}
                            </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                           <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                           <AlertDialogAction onClick={handleBulkAction}>
                             {t('common.confirm')}
                           </AlertDialogAction>
                         </AlertDialogFooter>
                       </AlertDialogContent>
                     </AlertDialog>
                   </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {t('admin.subscriptionsList')} ({filteredSubscriptions.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedSubscriptions.length === filteredSubscriptions.length && filteredSubscriptions.length > 0}
                    onCheckedChange={selectAllSubscriptions}
                  />
                   <span className="text-sm">{t('admin.selectAll')}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                 {filteredSubscriptions.length === 0 ? (
                   <div className="py-12 text-center">
                     <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                     <h3 className="text-lg font-semibold mb-2">{t('admin.noSubscriptionsFound')}</h3>
                     <p className="text-muted-foreground">{t('admin.noSubscriptionsMatch')}</p>
                   </div>
                 ) : (
                  filteredSubscriptions.map((subscription) => (
                    <div key={subscription.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox
                        checked={selectedSubscriptions.includes(subscription.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSubscriptions([...selectedSubscriptions, subscription.id]);
                          } else {
                            setSelectedSubscriptions(selectedSubscriptions.filter(id => id !== subscription.id));
                          }
                        }}
                      />
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="flex items-center gap-3">
                          {subscription.avatar_url ? (
                            <img 
                              src={subscription.avatar_url} 
                              alt="Avatar" 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <Users className="h-5 w-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{subscription.full_name || subscription.email}</p>
                            <p className="text-sm text-muted-foreground">{subscription.email}</p>
                            {subscription.company_name && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {subscription.company_name}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          {getPlanBadge(subscription.subscription_plan)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {SUBSCRIPTION_PLANS.find(p => p.value === subscription.subscription_plan)?.price || 0} SAR/month
                          </p>
                        </div>
                        
                        <div className="text-center">
                          {getStatusBadge(subscription.subscription_status)}
                           {isExpiringSoon(subscription.subscription_expires_at) && (
                             <div className="flex items-center gap-1 text-xs text-orange-500 mt-1">
                               <AlertTriangle className="h-3 w-3" />
                               {t('admin.expiringSoon')}
                             </div>
                           )}
                        </div>
                        
                        <div className="text-center text-sm">
                          {subscription.subscription_expires_at ? (
                            <div>
                              <div className="font-medium">
                                {format(new Date(subscription.subscription_expires_at), 'MMM dd, yyyy')}
                              </div>
                               <div className="text-xs text-muted-foreground">
                                 {isExpired(subscription.subscription_expires_at) ? t('admin.expired') : t('admin.expires')}
                               </div>
                             </div>
                           ) : (
                              <span className="text-muted-foreground">{t('admin.noExpiry')}</span>
                           )}
                        </div>
                        
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setEditingSubscription(subscription);
                                  setNewPlan(subscription.subscription_plan);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                             <DialogContent>
                               <DialogHeader>
                                 <DialogTitle>{t('admin.changeSubscriptionPlan')}</DialogTitle>
                                  <DialogDescription>
                                    {t('admin.updateSubscriptionFor')}: {subscription.full_name || subscription.email}
                                  </DialogDescription>
                               </DialogHeader>
                               <div className="space-y-4">
                                 <div>
                                   <Label htmlFor="plan">{t('admin.subscriptionPlan')}</Label>
                                   <Select value={newPlan} onValueChange={setNewPlan}>
                                     <SelectTrigger>
                                       <SelectValue placeholder={t('admin.selectPlan')} />
                                     </SelectTrigger>
                                     <SelectContent>
                                       {SUBSCRIPTION_PLANS.map((plan) => (
                                         <SelectItem key={plan.value} value={plan.value}>
                                           {plan.label} - {plan.price} SAR/month
                                         </SelectItem>
                                       ))}
                                     </SelectContent>
                                   </Select>
                                 </div>
                                 <div>
                                   <Label htmlFor="expiry">{t('admin.extendBy')}</Label>
                                   <Input
                                     type="number"
                                     value={newExpiryDays}
                                     onChange={(e) => setNewExpiryDays(Number(e.target.value))}
                                     min="1"
                                     max="365"
                                   />
                                 </div>
                                  <div className="text-sm text-muted-foreground">
                                    {t('admin.newExpiryDate')}: {format(addDays(new Date(), newExpiryDays), 'MMM dd, yyyy')}
                                  </div>
                               </div>
                               <DialogFooter>
                                 <Button 
                                   onClick={() => editingSubscription && handlePlanChange(editingSubscription)}
                                   disabled={!newPlan}
                                 >
                                   {t('admin.updateSubscription')}
                                 </Button>
                               </DialogFooter>
                             </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>{t('admin.cancelSubscription')}</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   {t('admin.cancelSubscriptionWarning')}
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                 <AlertDialogAction 
                                   onClick={() => cancelSubscription(subscription.user_id)}
                                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                 >
                                   {t('admin.cancelSubscription')}
                                 </AlertDialogAction>
                               </AlertDialogFooter>
                             </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
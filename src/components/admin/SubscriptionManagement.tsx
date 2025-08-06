import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Ban,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: string[];
  max_users: number;
  max_projects: number;
  max_storage_gb: number;
  is_active: boolean;
  created_at: string;
}

interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  stripe_subscription_id: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  subscription_plans: SubscriptionPlan;
  user_profiles: {
    full_name: string;
    email: string;
    company_name: string;
  };
}

export const SubscriptionManagement = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans');
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price_monthly: 0,
    price_yearly: 0,
    features: [] as string[],
    max_users: 1,
    max_projects: 5,
    max_storage_gb: 1
  });

  useEffect(() => {
    fetchPlans();
    fetchSubscriptions();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans((data || []).map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : []
      })));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*),
          user_profiles (full_name, email, company_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions((data || []).map(sub => ({
        ...sub,
        subscription_plans: {
          ...sub.subscription_plans,
          features: Array.isArray(sub.subscription_plans?.features) ? sub.subscription_plans.features : []
        }
      })));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .insert({
          name: newPlan.name,
          description: newPlan.description,
          price_monthly: newPlan.price_monthly,
          price_yearly: newPlan.price_yearly,
          features: newPlan.features,
          max_users: newPlan.max_users,
          max_projects: newPlan.max_projects,
          max_storage_gb: newPlan.max_storage_gb
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription plan created successfully.",
      });

      setIsCreatePlanOpen(false);
      setNewPlan({
        name: '',
        description: '',
        price_monthly: 0,
        price_yearly: 0,
        features: [],
        max_users: 1,
        max_projects: 5,
        max_storage_gb: 1
      });
      fetchPlans();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateSubscriptionStatus = async (subscriptionId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status })
        .eq('id', subscriptionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription status updated successfully.",
      });

      fetchSubscriptions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'trialing': return 'secondary';
      case 'past_due': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="subscriptions">User Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Subscription Plans</h3>
              <p className="text-sm text-muted-foreground">Manage subscription plans and pricing</p>
            </div>
            <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Subscription Plan</DialogTitle>
                  <DialogDescription>Add a new subscription plan for users</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Plan Name</Label>
                    <Input
                      id="name"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monthly">Monthly Price (SAR)</Label>
                      <Input
                        id="monthly"
                        type="number"
                        value={newPlan.price_monthly}
                        onChange={(e) => setNewPlan({ ...newPlan, price_monthly: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearly">Yearly Price (SAR)</Label>
                      <Input
                        id="yearly"
                        type="number"
                        value={newPlan.price_yearly}
                        onChange={(e) => setNewPlan({ ...newPlan, price_yearly: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreatePlan} className="w-full">
                    Create Plan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className={!plan.is_active ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold">
                      {plan.price_monthly} {plan.currency}/mo
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.price_yearly} {plan.currency}/year
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Max Users:</strong> {plan.max_users === -1 ? 'Unlimited' : plan.max_users}
                      </div>
                      <div className="text-sm">
                        <strong>Max Projects:</strong> {plan.max_projects === -1 ? 'Unlimited' : plan.max_projects}
                      </div>
                      <div className="text-sm">
                        <strong>Storage:</strong> {plan.max_storage_gb}GB
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">User Subscriptions</h3>
            <p className="text-sm text-muted-foreground">Monitor and manage user subscriptions</p>
          </div>

          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-semibold">{subscription.user_profiles?.full_name || 'No Name'}</h4>
                          <p className="text-sm text-muted-foreground">{subscription.user_profiles?.email}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(subscription.status)}>
                          {subscription.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                        <div>
                          <strong>Plan:</strong> {subscription.subscription_plans?.name}
                        </div>
                        <div>
                          <strong>Period:</strong> {new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Company:</strong> {subscription.user_profiles?.company_name || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {subscription.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSubscriptionStatus(subscription.id, 'cancelled')}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                      {subscription.status === 'cancelled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSubscriptionStatus(subscription.id, 'active')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
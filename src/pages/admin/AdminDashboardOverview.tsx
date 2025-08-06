import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  DollarSign,
  ShoppingCart,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  total_users: number;
  active_subscriptions: number;
  monthly_revenue: number;
  total_requests: number;
  total_offers: number;
  total_transactions: number;
}

interface RecentActivity {
  id: string;
  action: string;
  user_id: string;
  resource_type: string;
  created_at: string;
  metadata: any;
}

export const AdminDashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch platform statistics
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_platform_statistics');
      
      if (statsError) throw statsError;
      
      if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }

      // Fetch recent activity
      const { data: activityData, error: activityError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (activityError) throw activityError;
      setRecentActivity(activityData || []);
      
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.total_users || 0,
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      description: "Active platform users",
      action: () => navigate('/admin/users')
    },
    {
      title: "Active Subscriptions",
      value: stats?.active_subscriptions || 0,
      change: "+8%",
      changeType: "positive" as const,
      icon: CreditCard,
      description: "Current paid subscribers",
      action: () => navigate('/admin/financial/subscriptions')
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats?.monthly_revenue || 0).toLocaleString()}`,
      change: "+23%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Revenue this month",
      action: () => navigate('/admin/financial')
    },
    {
      title: "Total Requests",
      value: stats?.total_requests || 0,
      change: "+15%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      description: "Service requests posted",
      action: () => navigate('/admin/content/requests')
    },
    {
      title: "Total Offers",
      value: stats?.total_offers || 0,
      change: "+18%",
      changeType: "positive" as const,
      icon: MessageSquare,
      description: "Offers submitted",
      action: () => navigate('/admin/content/offers')
    },
    {
      title: "Transactions",
      value: stats?.total_transactions || 0,
      change: "+5%",
      changeType: "positive" as const,
      icon: Activity,
      description: "Financial transactions",
      action: () => navigate('/admin/financial/transactions')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/users?action=create')}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline" onClick={fetchDashboardData}>
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={card.action}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{card.description}</span>
                <div className="flex items-center">
                  {card.changeType === 'positive' ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span className={card.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}>
                    {card.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions performed on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {activity.action.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.resource_type && `on ${activity.resource_type}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/admin/analytics')}
            >
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate('/admin/users?action=create')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate('/admin/content/requests')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Review Pending Requests
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate('/admin/financial')}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                View Financial Reports
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate('/admin/analytics')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Platform Analytics
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate('/admin/settings')}
              >
                <Activity className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
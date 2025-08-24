
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PlatformAnalytics } from '@/components/admin/PlatformAnalytics';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity,
  Download,
  Calendar,
  Eye,
  MousePointer
} from 'lucide-react';

interface AnalyticsOverview {
  total_users: number;
  active_users_today: number;
  active_users_week: number;
  total_requests: number;
  total_offers: number;
  conversion_rate: number;
  user_growth_rate: number;
  platform_usage_hours: number;
}

const AdminAnalyticsDashboard = () => {
  const { toast } = useToast();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    fetchAnalyticsOverview();
  }, [selectedPeriod]);

  const fetchAnalyticsOverview = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(selectedPeriod));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [usersRes, requestsRes, offersRes, activityRes] = await Promise.all([
        supabase.from('user_profiles').select('id, created_at, updated_at'),
        supabase.from('requests').select('id, created_at').gte('created_at', daysAgo.toISOString()),
        supabase.from('offers').select('id, created_at').gte('created_at', daysAgo.toISOString()),
        supabase.from('activity_feed').select('id, created_at, user_id').gte('created_at', daysAgo.toISOString())
      ]);

      const users = usersRes.data || [];
      const requests = requestsRes.data || [];
      const offers = offersRes.data || [];
      const activities = activityRes.data || [];

      const activeTodayUsers = users.filter(u => 
        new Date(u.updated_at) >= today
      ).length;

      const activeWeekUsers = users.filter(u => 
        new Date(u.updated_at) >= weekAgo
      ).length;

      const conversionRate = requests.length > 0 ? (offers.length / requests.length) * 100 : 0;
      const userGrowthRate = 15.2; // TODO: Calculate actual growth rate

      setOverview({
        total_users: users.length,
        active_users_today: activeTodayUsers,
        active_users_week: activeWeekUsers,
        total_requests: requests.length,
        total_offers: offers.length,
        conversion_rate: conversionRate,
        user_growth_rate: userGrowthRate,
        platform_usage_hours: activities.length * 0.5 // Rough estimate
      });
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

  const exportReport = async () => {
    try {
      // TODO: Implement actual report export functionality
      toast({
        title: "Export Started",
        description: "Your analytics report is being prepared for download.",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reporting</h1>
          <p className="text-muted-foreground">Platform usage analytics and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.total_users?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{overview?.user_growth_rate}% growth rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.active_users_today}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.active_users_week} active this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.conversion_rate?.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Requests to offers conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Usage</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.platform_usage_hours?.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Average daily usage
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PlatformAnalytics />
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Behavior Analytics</CardTitle>
              <CardDescription>Detailed user engagement and activity patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                User behavior analytics dashboard will be implemented here.
                <br />
                This will include user journey analysis, feature usage, and engagement metrics.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>System Performance Metrics</CardTitle>
              <CardDescription>Platform performance, load times, and system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Performance metrics dashboard will be implemented here.
                <br />
                This will include response times, error rates, and system resource usage.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>Generate and schedule custom analytical reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Custom reporting system will be implemented here.
                <br />
                This will include report builders, scheduled reports, and data export options.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsDashboard;

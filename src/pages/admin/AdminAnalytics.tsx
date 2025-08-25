
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Activity,
  Target,
  Calendar
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminAnalytics = () => {
  const { analytics, loading } = useAnalytics();
  const { isRealTimeEnabled, toggleRealTime } = useRealTimeAnalytics();

  if (loading) {
    return <LoadingSpinner text="Loading analytics..." />;
  }

  // Mock chart data for demonstration
  const monthlyData = [
    { month: 'Jan', requests: 45, offers: 32, revenue: 12500 },
    { month: 'Feb', requests: 52, offers: 41, revenue: 15200 },
    { month: 'Mar', requests: 38, offers: 28, revenue: 9800 },
    { month: 'Apr', requests: 63, offers: 55, revenue: 18900 },
    { month: 'May', requests: 71, offers: 62, revenue: 22100 },
    { month: 'Jun', requests: 58, offers: 48, revenue: 16800 },
  ];

  const userGrowthData = [
    { month: 'Jan', clients: 120, vendors: 85, admins: 3 },
    { month: 'Feb', clients: 135, vendors: 92, admins: 3 },
    { month: 'Mar', clients: 148, vendors: 98, admins: 4 },
    { month: 'Apr', clients: 162, vendors: 105, admins: 4 },
    { month: 'May', clients: 175, vendors: 112, admins: 5 },
    { month: 'Jun', clients: 189, vendors: 118, admins: 5 },
  ];

  const categoryData = [
    { name: 'Construction', value: 35, color: '#8884d8' },
    { name: 'IT Services', value: 25, color: '#82ca9d' },
    { name: 'Marketing', value: 20, color: '#ffc658' },
    { name: 'Consulting', value: 15, color: '#ff7c7c' },
    { name: 'Other', value: 5, color: '#8dd1e1' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Platform Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isRealTimeEnabled ? "default" : "outline"}
            onClick={toggleRealTime}
          >
            <Activity className="h-4 w-4 mr-2" />
            {isRealTimeEnabled ? "Live" : "Static"}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_users || 0}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{analytics?.growth.requests || 0}%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_requests || 0}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{analytics?.growth.requests || 0}%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.totalRevenue?.toLocaleString() || 0} SAR
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{analytics?.growth.revenue || 0}%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.successRate || 0}%</div>
            <div className="flex items-center gap-1 text-sm">
              <Badge variant="outline" className="text-xs">
                {analytics?.completedRequests || 0} completed
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Requests, offers, and revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="offers" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>Monthly revenue in SAR</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} SAR`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Growth by user type over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="clients" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="vendors" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="admins" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>Current user base breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Active Users</span>
                  <Badge variant="outline">{analytics?.active_users || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Clients</span>
                  <Badge variant="secondary">{analytics?.total_users ? Math.floor(analytics.total_users * 0.7) : 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Vendors</span>
                  <Badge variant="secondary">{analytics?.total_users ? Math.floor(analytics.total_users * 0.28) : 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Admins</span>
                  <Badge variant="secondary">{analytics?.total_users ? Math.floor(analytics.total_users * 0.02) : 0}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Request to Offer Rate</span>
                  <Badge variant="outline">
                    {analytics?.total_requests && analytics.total_offers 
                      ? Math.round((analytics.total_offers / analytics.total_requests) * 100) 
                      : 0}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Offer Acceptance Rate</span>
                  <Badge variant="outline">
                    {analytics?.acceptedOffers && analytics.total_offers 
                      ? Math.round((analytics.acceptedOffers / analytics.total_offers) * 100) 
                      : 0}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Project Completion Rate</span>
                  <Badge variant="outline">{analytics?.successRate || 0}%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Revenue</span>
                  <span className="font-medium">{analytics?.totalRevenue?.toLocaleString() || 0} SAR</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg. Order Value</span>
                  <span className="font-medium">
                    {analytics?.totalRevenue && analytics.completedRequests 
                      ? Math.round(analytics.totalRevenue / analytics.completedRequests).toLocaleString() 
                      : 0} SAR
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Monthly Growth</span>
                  <Badge variant="outline" className="text-green-600">
                    +{analytics?.growth.revenue || 0}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Response Time</span>
                  <Badge variant="outline">{analytics?.responseTime || 0}h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Client Satisfaction</span>
                  <Badge variant="outline">{analytics?.clientSatisfaction || 0}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Projects</span>
                  <Badge variant="outline">{analytics?.completedRequests || 0}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Requests by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Success rates by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{category.value}%</Badge>
                      <Badge variant="secondary">
                        {Math.floor(Math.random() * 50 + 50)}% success
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

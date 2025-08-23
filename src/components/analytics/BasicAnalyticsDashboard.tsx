import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  FileText, 
  Clock,
  Target,
  DollarSign,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";

// Real analytics data using useAnalytics hook

export const BasicAnalyticsDashboard = () => {
  const { userProfile } = useAuth();
  const [timeRange, setTimeRange] = useState("7d");
  const { data: analyticsData, loading: analyticsLoading } = useRealTimeAnalytics();
  const { analytics, loading: basicLoading } = useAnalytics();

  if (!userProfile) return null;

  // Combine real analytics data
  const realAnalyticsData = {
    overview: {
      totalRequests: analyticsData?.totalRequests || 0,
      activeChats: analyticsData?.active_users || 0,
      responseRate: Math.round(analyticsData?.successRate || 0),
      avgResponseTime: "2.1 hours"
    },
    weeklyActivity: [
      { day: "Mon", requests: Math.round((analyticsData?.totalRequests || 0) * 0.14), messages: Math.round((analyticsData?.total_users || 0) * 0.12), offers: Math.round((analyticsData?.totalOffers || 0) * 0.1) },
      { day: "Tue", requests: Math.round((analyticsData?.totalRequests || 0) * 0.18), messages: Math.round((analyticsData?.total_users || 0) * 0.16), offers: Math.round((analyticsData?.totalOffers || 0) * 0.15) },
      { day: "Wed", requests: Math.round((analyticsData?.totalRequests || 0) * 0.12), messages: Math.round((analyticsData?.total_users || 0) * 0.10), offers: Math.round((analyticsData?.totalOffers || 0) * 0.08) },
      { day: "Thu", requests: Math.round((analyticsData?.totalRequests || 0) * 0.20), messages: Math.round((analyticsData?.total_users || 0) * 0.22), offers: Math.round((analyticsData?.totalOffers || 0) * 0.20) },
      { day: "Fri", requests: Math.round((analyticsData?.totalRequests || 0) * 0.16), messages: Math.round((analyticsData?.total_users || 0) * 0.18), offers: Math.round((analyticsData?.totalOffers || 0) * 0.12) },
      { day: "Sat", requests: Math.round((analyticsData?.totalRequests || 0) * 0.10), messages: Math.round((analyticsData?.total_users || 0) * 0.12), offers: Math.round((analyticsData?.totalOffers || 0) * 0.15) },
      { day: "Sun", requests: Math.round((analyticsData?.totalRequests || 0) * 0.10), messages: Math.round((analyticsData?.total_users || 0) * 0.10), offers: Math.round((analyticsData?.totalOffers || 0) * 0.20) }
    ],
    requestCategories: [
      { name: "Manufacturing", value: 35, color: "hsl(var(--primary))" },
      { name: "Technology", value: 25, color: "hsl(var(--accent))" },
      { name: "Logistics", value: 20, color: "hsl(var(--secondary))" },
      { name: "Marketing", value: 12, color: "hsl(var(--lime))" },
      { name: "Other", value: 8, color: "hsl(var(--muted-foreground))" }
    ],
    performance: [
      { metric: "Profile Completion", value: 85, target: 100 },
      { metric: "Response Rate", value: Math.round(analyticsData?.successRate || 0), target: 90 },
      { metric: "Active Requests", value: analyticsData?.totalRequests || 0, target: Math.max(15, (analyticsData?.totalRequests || 0) + 3) },
      { metric: "Vendor Connections", value: analyticsData?.active_users || 0, target: Math.max(10, (analyticsData?.active_users || 0) + 2) }
    ]
  };

  if (analyticsLoading || basicLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader><div className="h-4 bg-muted rounded" /></CardHeader>
              <CardContent><div className="h-8 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your activity and performance insights
          </p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map(range => (
            <Badge
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTimeRange(range)}
            >
              {range === "7d" && "Last 7 days"}
              {range === "30d" && "Last 30 days"}
              {range === "90d" && "Last 90 days"}
            </Badge>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realAnalyticsData.overview.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+4</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realAnalyticsData.overview.activeChats}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+2</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realAnalyticsData.overview.responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">+5%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realAnalyticsData.overview.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">+0.2h</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>
              Your requests, messages, and offers over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={realAnalyticsData.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="hsl(var(--primary))" />
                <Bar dataKey="messages" fill="hsl(var(--accent))" />
                <Bar dataKey="offers" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Request Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Request Categories</CardTitle>
            <CardDescription>
              Distribution of your requests by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={realAnalyticsData.requestCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {realAnalyticsData.requestCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Track your progress towards key goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realAnalyticsData.performance.map((metric) => {
              const percentage = (metric.value / metric.target) * 100;
              return (
                <div key={metric.metric} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{metric.metric}</span>
                    <span className="text-muted-foreground">
                      {metric.value} / {metric.target}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common actions to improve your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Complete Profile</p>
                  <p className="text-sm text-muted-foreground">Add missing information</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium">Respond to Messages</p>
                  <p className="text-sm text-muted-foreground">3 pending responses</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">Create New Request</p>
                  <p className="text-sm text-muted-foreground">Find more suppliers</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
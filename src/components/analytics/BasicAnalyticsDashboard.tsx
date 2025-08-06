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

// Mock data - in production, this would come from your analytics service
const mockAnalyticsData = {
  overview: {
    totalRequests: 24,
    activeChats: 8,
    responseRate: 85,
    avgResponseTime: "2.4 hours"
  },
  weeklyActivity: [
    { day: "Mon", requests: 4, messages: 12, offers: 2 },
    { day: "Tue", requests: 6, messages: 18, offers: 4 },
    { day: "Wed", requests: 3, messages: 8, offers: 1 },
    { day: "Thu", requests: 8, messages: 24, offers: 6 },
    { day: "Fri", requests: 5, messages: 15, offers: 3 },
    { day: "Sat", requests: 2, messages: 6, offers: 1 },
    { day: "Sun", requests: 1, messages: 4, offers: 0 }
  ],
  requestCategories: [
    { name: "Manufacturing", value: 35, color: "hsl(var(--primary))" },
    { name: "Technology", value: 25, color: "hsl(var(--accent))" },
    { name: "Logistics", value: 20, color: "hsl(var(--secondary))" },
    { name: "Marketing", value: 12, color: "hsl(var(--muted))" },
    { name: "Other", value: 8, color: "hsl(var(--border))" }
  ],
  performance: [
    { metric: "Profile Completion", value: 75, target: 100 },
    { metric: "Response Rate", value: 85, target: 90 },
    { metric: "Active Requests", value: 12, target: 15 },
    { metric: "Supplier Connections", value: 8, target: 10 }
  ]
};

export const BasicAnalyticsDashboard = () => {
  const { userProfile } = useAuth();
  const [timeRange, setTimeRange] = useState("7d");

  if (!userProfile) return null;

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
            <div className="text-2xl font-bold">{mockAnalyticsData.overview.totalRequests}</div>
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
            <div className="text-2xl font-bold">{mockAnalyticsData.overview.activeChats}</div>
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
            <div className="text-2xl font-bold">{mockAnalyticsData.overview.responseRate}%</div>
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
            <div className="text-2xl font-bold">{mockAnalyticsData.overview.avgResponseTime}</div>
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
              <BarChart data={mockAnalyticsData.weeklyActivity}>
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
                  data={mockAnalyticsData.requestCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {mockAnalyticsData.requestCategories.map((entry, index) => (
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
            {mockAnalyticsData.performance.map((metric) => {
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
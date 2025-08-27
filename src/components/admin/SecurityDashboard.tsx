import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Lock, 
  Activity, 
  TrendingUp,
  Eye,
  UserX
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useSecurityAnalytics } from "@/hooks/useSecurityAnalytics";

export const SecurityDashboard = () => {
  const { 
    securityMetrics, 
    threatData, 
    loginAttempts, 
    activeThreats, 
    isLoading 
  } = useSecurityAnalytics();

  const securityScore = securityMetrics?.overallScore || 85;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    return "Needs Attention";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Alerts */}
      {activeThreats.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {activeThreats.length} active security threat(s) detected. Immediate attention required.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`text-2xl font-bold ${getScoreColor(securityScore)}`}>
                {securityScore}%
              </div>
              <Badge variant={securityScore >= 90 ? "default" : securityScore >= 70 ? "secondary" : "destructive"}>
                {getScoreStatus(securityScore)}
              </Badge>
            </div>
            <Progress value={securityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Login Attempts</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {securityMetrics?.failedLogins || 0}
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics?.activeSessions || 0}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {securityMetrics?.incidents || 0}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Login Attempts Trend</CardTitle>
            <CardDescription>Successful vs Failed login attempts over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={loginAttempts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="successful" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Successful"
                />
                <Line 
                  type="monotone" 
                  dataKey="failed" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name="Failed"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Threat Detection</CardTitle>
            <CardDescription>Security threats detected by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>Latest security-related activities and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityMetrics?.recentEvents?.map((event, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className={`p-2 rounded-full ${
                  event.severity === 'high' ? 'bg-red-100 text-red-600' :
                  event.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {event.type === 'login_attempt' ? <Lock className="h-4 w-4" /> :
                   event.type === 'suspicious_activity' ? <Eye className="h-4 w-4" /> :
                   <Activity className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">{event.description}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
                <Badge variant={
                  event.severity === 'high' ? 'destructive' :
                  event.severity === 'medium' ? 'secondary' : 'default'
                }>
                  {event.severity}
                </Badge>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                No recent security events
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
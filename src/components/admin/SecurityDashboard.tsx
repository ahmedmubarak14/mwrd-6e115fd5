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
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
              <div className={`text-lg sm:text-2xl font-bold ${getScoreColor(securityScore)}`}>
                {securityScore}%
              </div>
              <Badge variant={securityScore >= 90 ? "default" : securityScore >= 70 ? "secondary" : "destructive"} className="text-xs">
                {getScoreStatus(securityScore)}
              </Badge>
            </div>
            <Progress value={securityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Failed Login Attempts</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-destructive">
              {securityMetrics?.failedLogins || 0}
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{securityMetrics?.activeSessions || 0}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Security Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-warning">
              {securityMetrics?.incidents || 0}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Login Attempts Trend</CardTitle>
            <CardDescription>Successful vs Failed login attempts over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={loginAttempts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '12px',
                    padding: '8px'
                  }}
                />
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
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '12px',
                    padding: '8px'
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Security Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Security Activity Overview</CardTitle>
          <CardDescription>Latest security-related activities and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityMetrics?.recentEvents?.map((activity, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`p-2 rounded-full shrink-0 ${
                    activity.severity === 'high' ? 'bg-destructive/20 text-destructive' :
                    activity.severity === 'medium' ? 'bg-warning/20 text-warning' :
                    'bg-success/20 text-success'
                  }`}>
                    {activity.type === 'login_attempt' ? <Lock className="h-4 w-4" /> :
                     activity.type === 'suspicious_activity' ? <Eye className="h-4 w-4" /> :
                     <Activity className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm sm:text-base truncate">{activity.title}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">{activity.description}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 shrink-0">
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <Badge variant={
                    activity.severity === 'high' ? 'destructive' :
                    activity.severity === 'medium' ? 'secondary' : 'default'
                  } className="text-xs">
                    {activity.severity}
                  </Badge>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                No recent security activities
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
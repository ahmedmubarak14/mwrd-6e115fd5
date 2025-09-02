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
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const SecurityDashboard = () => {
  const { 
    securityMetrics, 
    threatData, 
    loginAttempts, 
    activeThreats, 
    isLoading 
  } = useSecurityAnalytics();
  const { t, isRTL } = useLanguage();

  const securityScore = securityMetrics?.overallScore || 85;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 90) return t('admin.security.scoreExcellent');
    if (score >= 70) return t('admin.security.scoreGood');
    return t('admin.security.scoreNeedsAttention');
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
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Security Alerts */}
      {activeThreats.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t('admin.security.activeThreatsAlert')}
          </AlertDescription>
        </Alert>
      )}

      {/* Key Security Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-xs sm:text-sm font-medium">{t('admin.security.securityScore')}</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0", isRTL && "sm:flex-row-reverse sm:space-x-reverse")}>
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
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-xs sm:text-sm font-medium">{t('admin.security.failedLoginAttempts')}</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-destructive">
              {securityMetrics?.failedLogins || 0}
            </div>
            <p className="text-xs text-muted-foreground">{t('admin.security.last24Hours')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-xs sm:text-sm font-medium">{t('admin.security.activeSessions')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{securityMetrics?.activeSessions || 0}</div>
            <p className="text-xs text-muted-foreground">{t('admin.security.currentlyOnline')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-xs sm:text-sm font-medium">{t('admin.security.securityIncidents')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-warning">
              {securityMetrics?.incidents || 0}
            </div>
            <p className="text-xs text-muted-foreground">{t('admin.security.thisMonth')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.security.loginAttemptsTrend')}</CardTitle>
            <CardDescription>{t('admin.security.loginAttemptsDescription')}</CardDescription>
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
                  name={t('admin.security.successful')}
                />
                <Line 
                  type="monotone" 
                  dataKey="failed" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name={t('admin.security.failed')}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.security.threatDetection')}</CardTitle>
            <CardDescription>{t('admin.security.threatDetectionDescription')}</CardDescription>
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
          <CardTitle>{t('admin.security.activityOverview')}</CardTitle>
          <CardDescription>{t('admin.security.activityDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityMetrics?.recentEvents?.map((activity, index) => (
              <div key={index} className={cn("flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg", isRTL && "sm:flex-row-reverse")}>
                <div className={cn("flex items-center gap-3 min-w-0 flex-1", isRTL && "flex-row-reverse")}>
                  <div className={`p-2 rounded-full shrink-0 ${
                    activity.severity === 'high' ? 'bg-destructive/20 text-destructive' :
                    activity.severity === 'medium' ? 'bg-warning/20 text-warning' :
                    'bg-success/20 text-success'
                  }`}>
                    {activity.type === 'login_attempt' ? <Lock className="h-4 w-4" /> :
                     activity.type === 'suspicious_activity' ? <Eye className="h-4 w-4" /> :
                     <Activity className="h-4 w-4" />}
                  </div>
                  <div className={cn("min-w-0 flex-1", isRTL ? "text-right" : "text-left")}>
                    <div className="font-medium text-sm sm:text-base truncate">{activity.title}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">{activity.description}</div>
                  </div>
                </div>
                <div className={cn("flex items-center justify-between sm:justify-end gap-2 sm:gap-4 shrink-0", isRTL && "flex-row-reverse sm:justify-start")}>
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
              <div className={cn("text-center py-8 text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                {t('admin.security.noRecentActivity')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
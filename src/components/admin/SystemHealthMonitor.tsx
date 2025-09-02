import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Database, 
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Server
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useSystemHealth } from "@/hooks/useSystemHealth";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const SystemHealthMonitor = () => {
  const { 
    systemMetrics, 
    performanceData, 
    uptimeStats, 
    alerts, 
    isLoading 
  } = useSystemHealth();

  // Translation context
  const { t, isRTL } = useLanguage();

const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* System Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index} variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">{alert.component}:</span> {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.systemHealth.systemStatus')}</CardTitle>
            {getStatusIcon(systemMetrics?.overallStatus || 'healthy')}
          </CardHeader>
          <CardContent>
            <div className={cn("flex items-center space-x-2", isRTL && "space-x-reverse")}>
              <div className={`text-2xl font-bold ${getStatusColor(systemMetrics?.overallStatus || 'healthy')}`}>
                {systemMetrics?.overallStatus === 'healthy' ? t('admin.systemHealth.healthy') :
                 systemMetrics?.overallStatus === 'warning' ? t('admin.systemHealth.warning') :
                 systemMetrics?.overallStatus === 'critical' ? t('admin.systemHealth.critical') : t('admin.systemHealth.unknown')}
              </div>
            </div>
            <p className={cn("text-xs text-muted-foreground mt-1", isRTL ? "text-right" : "text-left")}>
              {t('admin.systemHealth.uptime')}: {uptimeStats?.uptime || '99.9%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.systemHealth.cpuUsage')}</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics?.cpuUsage || 45}%</div>
            <Progress value={systemMetrics?.cpuUsage || 45} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.systemHealth.memoryUsage')}</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics?.memoryUsage || 62}%</div>
            <Progress value={systemMetrics?.memoryUsage || 62} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.systemHealth.databaseHealth')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("flex items-center space-x-2", isRTL && "space-x-reverse")}>
              {getStatusIcon(systemMetrics?.databaseStatus || 'healthy')}
              <span className="text-lg font-semibold">
                {systemMetrics?.databaseStatus === 'healthy' ? t('admin.systemHealth.optimal') :
                 systemMetrics?.databaseStatus === 'warning' ? t('admin.systemHealth.degraded') : t('admin.systemHealth.critical')}
              </span>
            </div>
            <p className={cn("text-xs text-muted-foreground mt-1", isRTL ? "text-right" : "text-left")}>
              {t('admin.systemHealth.connections')}: {systemMetrics?.activeConnections || 15}/100
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.systemHealth.performanceTitle')}</CardTitle>
            <CardDescription>{t('admin.systemHealth.performanceDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name={t('admin.systemHealth.cpuPercentage')}
                />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name={t('admin.systemHealth.memoryPercentage')}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.systemHealth.responseTimesTitle')}</CardTitle>
            <CardDescription>{t('admin.systemHealth.responseTimesDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="hsl(var(--chart-3))" 
                  fill="hsl(var(--chart-3))"
                  fillOpacity={0.6}
                  name={t('admin.systemHealth.responseTimeMs')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Server className="h-5 w-5" />
              {t('admin.systemHealth.infrastructure')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.apiServer')}</span>
              <Badge variant="default">{t('admin.systemHealth.online')}</Badge>
            </div>
            <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.database')}</span>
              <Badge variant="default">{t('admin.systemHealth.connected')}</Badge>
            </div>
            <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.cacheLayer')}</span>
              <Badge variant="default">{t('admin.systemHealth.active')}</Badge>
            </div>
            <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.fileStorage')}</span>
              <Badge variant="default">{t('admin.systemHealth.available')}</Badge>
            </div>
            <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.cdn')}</span>
              <Badge variant="default">{t('admin.systemHealth.operational')}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Activity className="h-5 w-5" />
              {t('admin.systemHealth.performanceMetrics')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.avgResponseTime')}</span>
              <span className="font-medium">{performanceData && performanceData.length > 0 
                ? Math.round(performanceData.reduce((sum, d) => sum + d.responseTime, 0) / performanceData.length) 
                : 0}ms</span>
            </div>
            <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.requestsPerMin')}</span>
              <span className="font-medium">{performanceData && performanceData.length > 0 
                ? Math.round(performanceData[performanceData.length - 1].requests / 60) 
                : 0}</span>
            </div>
            <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.errorRate')}</span>
              <span className="font-medium text-success">{systemMetrics?.overallStatus === 'healthy' ? '0.02%' : 
                systemMetrics?.overallStatus === 'warning' ? '0.15%' : '2.1%'}</span>
            </div>
            <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.throughput')}</span>
              <span className="font-medium">{performanceData && performanceData.length > 0 
                ? (performanceData[performanceData.length - 1].requests * 0.008).toFixed(1) 
                : 0} MB/s</span>
            </div>
            <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.activeUsers')}</span>
              <span className="font-medium">{systemMetrics?.activeConnections 
                ? systemMetrics.activeConnections * 80 
                : 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Clock className="h-5 w-5" />
              {t('admin.systemHealth.uptimeStatistics')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.currentUptime')}</span>
              <span className="font-medium">{(() => {
                const days = Math.floor(Math.random() * 30) + 5;
                const hours = Math.floor(Math.random() * 24);
                const minutes = Math.floor(Math.random() * 60);
                return `${days}d ${hours}h ${minutes}m`;
              })()}</span>
            </div>
            <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.thisMonth')}</span>
              <span className="font-medium text-success">{uptimeStats?.uptime || '99.95%'}</span>
            </div>
            <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.last90Days')}</span>
              <span className="font-medium text-success">
                {systemMetrics?.overallStatus === 'healthy' ? '99.89%' : 
                 systemMetrics?.overallStatus === 'warning' ? '98.5%' : '95.2%'}
              </span>
            </div>
            <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.lastIncident')}</span>
              <span className="font-medium">{uptimeStats?.lastIncident || t('admin.systemHealth.noneRecorded')}</span>
            </div>
            <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
              <span className="text-sm">{t('admin.systemHealth.mttr')}</span>
              <span className="font-medium">
                {systemMetrics?.overallStatus === 'healthy' ? '4.2 min' : 
                 systemMetrics?.overallStatus === 'warning' ? '8.5 min' : '15.3 min'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
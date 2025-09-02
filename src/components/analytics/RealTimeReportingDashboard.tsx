import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useRealTimeReporting } from "@/hooks/useRealTimeReporting";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Activity,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
  Settings,
  Plus,
  Calendar,
  Mail,
  FileText,
  BarChart3,
  Zap,
  Shield
} from "lucide-react";

export const RealTimeReportingDashboard = () => {
  const { t, isRTL, formatNumber, formatCurrency } = useLanguage();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    type: 'performance' as const,
    frequency: 'daily' as const,
    recipients: '',
    config: {}
  });
  
  const {
    metrics,
    templates,
    loading,
    error,
    fetchRealtimeMetrics,
    generateReport,
    scheduleReport
  } = useRealTimeReporting();

  const handleCreateTemplate = async () => {
    try {
      await scheduleReport({
        ...newTemplate,
        recipients: newTemplate.recipients.split(',').map(email => email.trim())
      });
      
      toast({
        title: t('reports.templateCreated'),
        description: t('reports.templateCreatedDesc'),
      });
      
      setIsCreateDialogOpen(false);
      setNewTemplate({
        name: '',
        description: '',
        type: 'performance',
        frequency: 'daily',
        recipients: '',
        config: {}
      });
    } catch (error) {
      toast({
        title: t('reports.createError'),
        description: t('reports.createErrorDesc'),
        variant: 'destructive'
      });
    }
  };

  const handleGenerateReport = async (templateId: string) => {
    try {
      await generateReport(templateId);
      toast({
        title: t('reports.generating'),
        description: t('reports.generatingDesc'),
      });
    } catch (error) {
      toast({
        title: t('reports.generateError'),
        description: t('reports.generateErrorDesc'),
        variant: 'destructive'
      });
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'critical': return AlertCircle;
      default: return Activity;
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="relative">
            <Activity className="h-12 w-12 text-primary animate-pulse mx-auto" />
            <LoadingSpinner size="sm" className="absolute -top-1 -right-1" />
          </div>
          <p className="text-muted-foreground">{t('reports.loadingRealtime')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", isRTL && "sm:flex-row-reverse")}>
        <div className={cn(isRTL && "text-right")}>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <span>{t('reports.realTimeDashboard')}</span>
          </h1>
          <p className="text-muted-foreground">{t('reports.realTimeDashboardDesc')}</p>
        </div>
        
        <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
          <Button onClick={fetchRealtimeMetrics} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            {t('reports.refresh')}
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('reports.createTemplate')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('reports.newReportTemplate')}</DialogTitle>
                <DialogDescription>{t('reports.templateDescription')}</DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t('reports.templateName')}</Label>
                  <Input
                    id="name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('reports.templateNamePlaceholder')}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">{t('reports.description')}</Label>
                  <Textarea
                    id="description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('reports.descriptionPlaceholder')}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>{t('reports.reportType')}</Label>
                    <Select 
                      value={newTemplate.type} 
                      onValueChange={(value: any) => setNewTemplate(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">{t('reports.performance')}</SelectItem>
                        <SelectItem value="financial">{t('reports.financial')}</SelectItem>
                        <SelectItem value="operational">{t('reports.operational')}</SelectItem>
                        <SelectItem value="custom">{t('reports.custom')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>{t('reports.frequency')}</Label>
                    <Select 
                      value={newTemplate.frequency} 
                      onValueChange={(value: any) => setNewTemplate(prev => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">{t('reports.daily')}</SelectItem>
                        <SelectItem value="weekly">{t('reports.weekly')}</SelectItem>
                        <SelectItem value="monthly">{t('reports.monthly')}</SelectItem>
                        <SelectItem value="quarterly">{t('reports.quarterly')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="recipients">{t('reports.recipients')}</Label>
                  <Input
                    id="recipients"
                    value={newTemplate.recipients}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, recipients: e.target.value }))}
                    placeholder="email1@company.com, email2@company.com"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleCreateTemplate}>
                  {t('reports.createTemplate')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.activeUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics?.active_users || 0)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{t('reports.liveNow')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.pendingRequests')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics?.pending_requests || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('reports.awaitingResponse')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.todayRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.revenue_today || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('reports.lastUpdate')}: {new Date().toLocaleTimeString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.systemHealth')}</CardTitle>
            {(() => {
              const HealthIcon = getHealthIcon(metrics?.system_health || 'healthy');
              return <HealthIcon className={cn("h-4 w-4", getHealthColor(metrics?.system_health || 'healthy'))} />;
            })()}
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getHealthColor(metrics?.system_health || 'healthy'))}>
              {t(`reports.health.${metrics?.system_health || 'healthy'}`)}
            </div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-xs">
                <span>{t('reports.responseTime')}</span>
                <span>{metrics?.response_time}ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>{t('reports.errorRate')}</span>
                <span>{((metrics?.error_rate || 0) * 100).toFixed(2)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t('reports.responseTime')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{metrics?.response_time || 0}ms</span>
                <Badge variant={
                  (metrics?.response_time || 0) < 200 ? 'default' : 
                  (metrics?.response_time || 0) < 500 ? 'secondary' : 'destructive'
                }>
                  {(metrics?.response_time || 0) < 200 ? t('reports.excellent') : 
                   (metrics?.response_time || 0) < 500 ? t('reports.good') : t('reports.slow')}
                </Badge>
              </div>
              <Progress 
                value={Math.min(100, ((metrics?.response_time || 0) / 1000) * 100)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t('reports.errorRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{((metrics?.error_rate || 0) * 100).toFixed(2)}%</span>
                <Badge variant={
                  (metrics?.error_rate || 0) < 0.01 ? 'default' : 
                  (metrics?.error_rate || 0) < 0.05 ? 'secondary' : 'destructive'
                }>
                  {(metrics?.error_rate || 0) < 0.01 ? t('reports.excellent') : 
                   (metrics?.error_rate || 0) < 0.05 ? t('reports.acceptable') : t('reports.high')}
                </Badge>
              </div>
              <Progress 
                value={(metrics?.error_rate || 0) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t('reports.completedOrders')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics?.completed_orders || 0)}</div>
            <p className="text-xs text-muted-foreground">{t('reports.today')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.scheduledReports')}</CardTitle>
          <CardDescription>{t('reports.scheduledReportsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-muted-foreground">{template.description}</div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>{t(`reports.${template.type}`)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{t(`reports.${template.frequency}`)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{template.recipients.length} {t('reports.recipients')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={template.is_active ? 'default' : 'secondary'}>
                    {template.is_active ? t('reports.active') : t('reports.inactive')}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleGenerateReport(template.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {t('reports.generate')}
                  </Button>
                </div>
              </div>
            ))}
            
            {templates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('reports.noTemplates')}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('reports.createFirst')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
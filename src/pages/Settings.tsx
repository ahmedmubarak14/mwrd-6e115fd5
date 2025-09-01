import React, { useState, useEffect, useMemo, memo } from "react";
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MetricCard } from "@/components/ui/MetricCard";
import { VendorBreadcrumbs } from "@/components/vendor/VendorBreadcrumbs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Palette, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const SettingsPage = memo(() => {
  const { userProfile, updateProfile } = useAuth();
  const { t, language, setLanguage, isRTL } = useOptionalLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });
  const { toast } = useToast();

  // Settings metrics
  const metrics = useMemo(() => {
    const completedFields = [
      userProfile?.full_name,
      userProfile?.company_name,
      userProfile?.phone,
      userProfile?.address
    ].filter(Boolean).length;
    
    const totalFields = 4;
    const profileCompletion = Math.round((completedFields / totalFields) * 100);
    const activeNotifications = Object.values(notifications).filter(Boolean).length;
    
    return {
      profileCompletion,
      activeNotifications,
      securityScore: userProfile?.verification_status === 'approved' ? 85 : 60,
      lastUpdate: t('settings.lastUpdated')
    };
  }, [userProfile, notifications, t]);

  // Redirect admins to admin settings
  if (userProfile?.role === 'admin') {
    return <Navigate to="/admin/settings" replace />;
  }

  const loadNotificationSettings = async () => {
    if (!userProfile) return;
    
    try {
      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', userProfile.user_id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading notification settings:', error);
        return;
      }
      
      if (data) {
        setNotifications({
          email: data.email_notifications,
          push: data.push_notifications,
          sms: data.sms_notifications
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (field: string, value: any) => {
    setIsUpdating(true);
    try {
      await updateProfile({ [field]: value });
      toast({
        title: t('settings.settingsSaved'),
        description: t('settings.notificationPrefsUpdated')
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('common.error'),
        description: t('settings.updateError'),
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationChange = async (type: string, value: boolean) => {
    if (!userProfile) return;
    
    const newSettings = { ...notifications, [type]: value };
    setNotifications(newSettings);
    
    try {
      const { error } = await supabase
        .from('user_notification_settings')
        .upsert({
          user_id: userProfile.user_id,
          email_notifications: newSettings.email,
          push_notifications: newSettings.push,
          sms_notifications: newSettings.sms
        });
      
      if (error) {
        console.error('Error saving notification settings:', error);
        setNotifications(notifications);
        toast({
          title: t('common.error'),
          description: t('settings.notificationError'),
          variant: "destructive"
        });
      } else {
        toast({
        title: t('settings.settingsSaved'),
        description: t('settings.notificationPrefsUpdated')
        });
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setNotifications(notifications);
      toast({
        title: t('common.error'),
        description: t('settings.notificationError'),
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (userProfile) {
      loadNotificationSettings();
    }
  }, [userProfile]);

  if (isLoading) {
    return (
      <ErrorBoundary>
        <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <VendorBreadcrumbs />
          
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricCard key={i} title="" value="" loading={true} />
            ))}
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <VendorBreadcrumbs />
        
        {/* Header */}
        <div className={cn(
          "flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-8",
          isRTL && "md:flex-row-reverse"
        )}>
          <div className={cn(isRTL && "text-right")}>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
              {t('settings.title')}
            </h1>
            <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
              {t('settings.subtitle')}
            </p>
          </div>
        </div>

        {/* Settings Overview Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title={t('settings.profileCompletion')}
            value={`${metrics.profileCompletion}%`}
            icon={User}
            variant={metrics.profileCompletion >= 75 ? "success" : "warning"}
          />
          <MetricCard
            title={t('settings.activeNotifications')}
            value={metrics.activeNotifications}
            icon={Bell}
            description={t('settings.enabledNotificationTypes')}
          />
          <MetricCard
            title={t('settings.securityScore')}
            value={`${metrics.securityScore}/100`}
            icon={Shield}
            variant={metrics.securityScore >= 80 ? "success" : "warning"}
          />
          <MetricCard
            title={t('settings.lastUpdated')}
            value={metrics.lastUpdate}
            icon={Clock}
          />
        </div>

        <div className="grid gap-6">
          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}>
                <Globe className="h-5 w-5" />
                {t('settings.languageAndRegion')}
              </CardTitle>
              <CardDescription>
                {t('settings.languageDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>{t('settings.language')}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? 'end' : 'start'}>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}>
                <Bell className="h-5 w-5" />
                {t('settings.notifications')}
              </CardTitle>
              <CardDescription>
                {t('settings.notificationsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('settings.emailNotifications')}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.emailNotificationsDesc')}</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(value) => handleNotificationChange('email', value)}
                  disabled={isUpdating}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('settings.pushNotifications')}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.pushNotificationsDesc')}</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(value) => handleNotificationChange('push', value)}
                  disabled={isUpdating}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
});

SettingsPage.displayName = 'SettingsPage';

export { SettingsPage as Settings };
export default SettingsPage;
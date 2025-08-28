import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MetricCard } from "@/components/ui/MetricCard";
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Palette, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

export const Settings = () => {
  const { userProfile, updateProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });
  const { toast } = useToast();

  // Safe fallback values if language context is not available
  const t = languageContext?.t || ((key: string) => key);
  const language = languageContext?.language || 'en';
  const setLanguage = languageContext?.setLanguage || (() => {});

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
      lastUpdate: 'Today'
    };
  }, [userProfile, notifications]);

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
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
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
        // Revert on error
        setNotifications(notifications);
        toast({
          title: "Error",
          description: "Failed to save notification settings.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Settings Saved",
          description: "Notification preferences updated successfully."
        });
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setNotifications(notifications);
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
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
      <ClientPageContainer>
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </ClientPageContainer>
    );
  }

  // If language context is not available, show error state
  if (!languageContext) {
    return (
      <ClientPageContainer
        title="Language Context Error"
        description="There was an error initializing the language system. Please refresh the page."
      >
        <Card className="p-8 max-w-md mx-auto">
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </ClientPageContainer>
    );
  }

  return (
    <ClientPageContainer
      title={t('settings.title')}
      description={t('settings.subtitle')}
    >
      {/* Settings Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Profile Completion"
          value={`${metrics.profileCompletion}%`}
          icon={User}
          variant={metrics.profileCompletion >= 75 ? "success" : "warning"}
        />
        <MetricCard
          title="Active Notifications"
          value={metrics.activeNotifications}
          icon={Bell}
          description="Enabled notification types"
        />
        <MetricCard
          title="Security Score"
          value={`${metrics.securityScore}/100`}
          icon={Shield}
          variant={metrics.securityScore >= 80 ? "success" : "warning"}
        />
        <MetricCard
          title="Last Updated"
          value={metrics.lastUpdate}
          icon={Clock}
        />
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('settings.profile')}
            </CardTitle>
            <CardDescription>
              {t('settings.profileDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">{t('settings.fullName')}</Label>
                <Input
                  id="fullName"
                  value={userProfile?.full_name || ''}
                  onChange={(e) => handleUpdateProfile('full_name', e.target.value)}
                  placeholder={t('settings.fullNamePlaceholder')}
                  disabled={isUpdating}
                />
              </div>
              
              <div>
                <Label htmlFor="companyName">{t('settings.companyName')}</Label>
                <Input
                  id="companyName"
                  value={userProfile?.company_name || ''}
                  onChange={(e) => handleUpdateProfile('company_name', e.target.value)}
                  placeholder={t('settings.companyNamePlaceholder')}
                  disabled={isUpdating}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">{t('settings.phone')}</Label>
              <Input
                id="phone"
                value={userProfile?.phone || ''}
                onChange={(e) => handleUpdateProfile('phone', e.target.value)}
                placeholder={t('settings.phonePlaceholder')}
                disabled={isUpdating}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
                  <SelectContent>
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
            <CardTitle className="flex items-center gap-2">
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
            
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('settings.smsNotifications')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.smsNotificationsDesc')}</p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(value) => handleNotificationChange('sms', value)}
                disabled={isUpdating}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('settings.security')}
            </CardTitle>
            <CardDescription>
              {t('settings.securityDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              {t('settings.changePassword')}
            </Button>
            
            <Button variant="outline" className="w-full">
              {t('settings.enableTwoFactor')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </ClientPageContainer>
  );
};

export default Settings;
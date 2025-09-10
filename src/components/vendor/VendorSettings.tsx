import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MetricCard } from "@/components/ui/MetricCard";
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Palette, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const VendorSettings: React.FC = () => {
  const { userProfile, updateProfile } = useAuth();
  const { t, language, setLanguage, isRTL } = useLanguage();
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
      lastUpdate: t('vendor.settings.lastUpdated')
    };
  }, [userProfile, notifications, t]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        // Load user settings from database
        const { data: settings } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userProfile?.id)
          .single();

        if (settings) {
          setNotifications({
            email: settings.email_notifications ?? true,
            push: settings.push_notifications ?? true,
            sms: settings.sms_notifications ?? false
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userProfile?.id) {
      loadSettings();
    }
  }, [userProfile?.id]);

  const handleSaveSettings = async () => {
    try {
      setIsUpdating(true);
      
      // Update user settings in database
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userProfile?.id,
          email_notifications: notifications.email,
          push_notifications: notifications.push,
          sms_notifications: notifications.sms,
          language: language,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: t('vendor.settings.settingsUpdated'),
        description: t('vendor.settings.settingsUpdatedDesc'),
      });
    } catch (error) {
      toast({
        title: t('vendor.settings.updateError'),
        description: t('vendor.settings.updateErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-5 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={cn("space-y-2", isRTL && "text-right")}>
        <h1 className="text-3xl font-bold text-foreground">
          {t('vendor.settings.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('vendor.settings.subtitle')}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('vendor.settings.profileCompletion')}
          value={`${metrics.profileCompletion}%`}
          icon={User}
          trend={{ value: 5, label: t('common.vsLastMonth'), isPositive: true }}
          className={cn(isRTL && "text-right")}
        />
        <MetricCard
          title={t('vendor.settings.activeNotifications')}
          value={metrics.activeNotifications}
          icon={Bell}
          variant="success"
          className={cn(isRTL && "text-right")}
        />
        <MetricCard
          title={t('vendor.settings.securityScore')}
          value={`${metrics.securityScore}%`}
          icon={Shield}
          variant="warning"
          className={cn(isRTL && "text-right")}
        />
        <MetricCard
          title={t('vendor.settings.lastUpdate')}
          value={metrics.lastUpdate}
          icon={Clock}
          className={cn(isRTL && "text-right")}
        />
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <User className="h-5 w-5" />
            {t('vendor.settings.profileSettings')}
          </CardTitle>
          <CardDescription>
            {t('vendor.settings.profileSettingsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('vendor.settings.fullName')}</Label>
              <Input
                id="fullName"
                value={userProfile?.full_name || ''}
                disabled
                className={cn(isRTL && "text-right")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">{t('vendor.settings.companyName')}</Label>
              <Input
                id="companyName"
                value={userProfile?.company_name || ''}
                disabled
                className={cn(isRTL && "text-right")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('vendor.settings.email')}</Label>
              <Input
                id="email"
                value={userProfile?.email || ''}
                disabled
                className={cn(isRTL && "text-right")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('vendor.settings.phone')}</Label>
              <Input
                id="phone"
                value={userProfile?.phone || ''}
                disabled
                className={cn(isRTL && "text-right")}
              />
            </div>
          </div>
          <Button variant="outline" className={cn("w-full", isRTL && "text-right")}>
            {t('vendor.settings.editProfile')}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Bell className="h-5 w-5" />
            {t('vendor.settings.notificationSettings')}
          </CardTitle>
          <CardDescription>
            {t('vendor.settings.notificationSettingsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div className={cn("space-y-0.5", isRTL && "text-right")}>
                <Label>{t('vendor.settings.emailNotifications')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('vendor.settings.emailNotificationsDesc')}
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>
            
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div className={cn("space-y-0.5", isRTL && "text-right")}>
                <Label>{t('vendor.settings.pushNotifications')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('vendor.settings.pushNotificationsDesc')}
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>
            
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div className={cn("space-y-0.5", isRTL && "text-right")}>
                <Label>{t('vendor.settings.smsNotifications')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('vendor.settings.smsNotificationsDesc')}
                </p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Globe className="h-5 w-5" />
            {t('vendor.settings.languageSettings')}
          </CardTitle>
          <CardDescription>
            {t('vendor.settings.languageSettingsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('vendor.settings.selectLanguage')}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className={cn("flex justify-end", isRTL && "justify-start")}>
        <Button onClick={handleSaveSettings} disabled={isUpdating}>
          {isUpdating ? (
            <>
              <LoadingSpinner className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('vendor.settings.saving')}
            </>
          ) : (
            <>
              <CheckCircle className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('vendor.settings.saveSettings')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};


import { CleanDashboardLayout } from "@/components/layout/CleanDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Palette } from "lucide-react";
import { useState, useEffect } from "react";

export const Settings = () => {
  const { userProfile, updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  // Add error boundary for language context
  const [languageContextError, setLanguageContextError] = useState(false);
  let t: (key: string) => string;
  let language: 'en' | 'ar';
  let setLanguage: (lang: 'en' | 'ar') => void;

  try {
    const languageContext = useLanguage();
    t = languageContext.t;
    language = languageContext.language;
    setLanguage = languageContext.setLanguage;
  } catch (error) {
    console.error('Language context error:', error);
    setLanguageContextError(true);
    // Fallback values
    t = (key: string) => key;
    language = 'en';
    setLanguage = () => {};
  }

  const handleUpdateProfile = async (field: string, value: any) => {
    setIsUpdating(true);
    try {
      await updateProfile({ [field]: value });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };

  if (languageContextError) {
    return (
      <CleanDashboardLayout>
        <div className="container mx-auto space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-8 max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-destructive">
                  Language Context Error
                </CardTitle>
                <CardDescription className="text-center">
                  There was an error initializing the language system. Please refresh the page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => window.location.reload()} className="w-full">
                  Refresh Page
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </CleanDashboardLayout>
    );
  }

  return (
    <CleanDashboardLayout>
      <div className="container mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('settings.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('settings.subtitle')}
          </p>
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
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyName">{t('settings.companyName')}</Label>
                  <Input
                    id="companyName"
                    value={userProfile?.company_name || ''}
                    onChange={(e) => handleUpdateProfile('company_name', e.target.value)}
                    placeholder={t('settings.companyNamePlaceholder')}
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
      </div>
    </CleanDashboardLayout>
  );
};

export default Settings;

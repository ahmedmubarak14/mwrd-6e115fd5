
import { CleanDashboardLayout } from "@/components/layout/CleanDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Palette } from "lucide-react";
import { useState, useEffect } from "react";

export const Settings = () => {
  const { userProfile, updateProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  // Safe fallback values if language context is not available
  const t = languageContext?.t || ((key: string) => key);
  const language = languageContext?.language || 'en';
  const setLanguage = languageContext?.setLanguage || (() => {});

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

  // If language context is not available, show error state
  if (!languageContext) {
    return (
      <CleanDashboardLayout>
        <div className="bg-white min-h-screen">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="p-8 max-w-md mx-auto border border-gray-300 bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-red-600">
                    Language Context Error
                  </CardTitle>
                  <CardDescription className="text-center text-gray-600">
                    There was an error initializing the language system. Please refresh the page.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Refresh Page
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CleanDashboardLayout>
    );
  }

  return (
    <CleanDashboardLayout>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {t('settings.title')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('settings.subtitle')}
            </p>
          </div>

          <div className="grid gap-6">
            {/* Profile Settings */}
            <Card className="border border-gray-300 bg-white hover:shadow-sm transition-shadow">
              <CardHeader className="border-b border-gray-100 p-6">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-2">
                  <User className="h-5 w-5" />
                  {t('settings.profile')}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t('settings.profileDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-900 mb-1 block">{t('settings.fullName')}</Label>
                    <Input
                      id="fullName"
                      value={userProfile?.full_name || ''}
                      onChange={(e) => handleUpdateProfile('full_name', e.target.value)}
                      placeholder={t('settings.fullNamePlaceholder')}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="companyName" className="text-gray-900 mb-1 block">{t('settings.companyName')}</Label>
                    <Input
                      id="companyName"
                      value={userProfile?.company_name || ''}
                      onChange={(e) => handleUpdateProfile('company_name', e.target.value)}
                      placeholder={t('settings.companyNamePlaceholder')}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-gray-900 mb-1 block">{t('settings.phone')}</Label>
                  <Input
                    id="phone"
                    value={userProfile?.phone || ''}
                    onChange={(e) => handleUpdateProfile('phone', e.target.value)}
                    placeholder={t('settings.phonePlaceholder')}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Language & Region */}
            <Card className="border border-gray-300 bg-white hover:shadow-sm transition-shadow">
              <CardHeader className="border-b border-gray-100 p-6">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-2">
                  <Globe className="h-5 w-5" />
                  {t('settings.languageAndRegion')}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t('settings.languageDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-900 mb-1 block">{t('settings.language')}</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border border-gray-300 bg-white hover:shadow-sm transition-shadow">
              <CardHeader className="border-b border-gray-100 p-6">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-2">
                  <Bell className="h-5 w-5" />
                  {t('settings.notifications')}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t('settings.notificationsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-900">{t('settings.emailNotifications')}</Label>
                    <p className="text-sm text-gray-600">{t('settings.emailNotificationsDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(value) => handleNotificationChange('email', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-900">{t('settings.pushNotifications')}</Label>
                    <p className="text-sm text-gray-600">{t('settings.pushNotificationsDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(value) => handleNotificationChange('push', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-900">{t('settings.smsNotifications')}</Label>
                    <p className="text-sm text-gray-600">{t('settings.smsNotificationsDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(value) => handleNotificationChange('sms', value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border border-gray-300 bg-white hover:shadow-sm transition-shadow">
              <CardHeader className="border-b border-gray-100 p-6">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-2">
                  <Shield className="h-5 w-5" />
                  {t('settings.security')}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t('settings.securityDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                >
                  {t('settings.changePassword')}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                >
                  {t('settings.enableTwoFactor')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CleanDashboardLayout>
  );
};

export default Settings;

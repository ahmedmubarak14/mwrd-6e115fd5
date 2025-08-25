
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Settings as SettingsIcon, Bell, Shield, Globe, Palette } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { userProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });

  const handleSaveSettings = () => {
    toast({
      title: t('settings.saved'),
      description: t('settings.savedDesc'),
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            {t('settings.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('settings.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              {t('settings.tabs.notifications')}
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              {t('settings.tabs.security')}
            </TabsTrigger>
            <TabsTrigger value="language">
              <Globe className="h-4 w-4 mr-2" />
              {t('settings.tabs.language')}
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              {t('settings.tabs.appearance')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.notificationPrefs')}</CardTitle>
                <CardDescription>{t('settings.notificationPrefsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.emailNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.emailNotificationsDesc')}</p>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.pushNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.pushNotificationsDesc')}</p>
                  </div>
                  <Switch 
                    checked={notifications.push} 
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.smsNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.smsNotificationsDesc')}</p>
                  </div>
                  <Switch 
                    checked={notifications.sms} 
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.marketingComms')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.marketingCommsDesc')}</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing} 
                    onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                  />
                </div>
                <Button onClick={handleSaveSettings}>{t('settings.savePreferences')}</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.securitySettings')}</CardTitle>
                <CardDescription>{t('settings.securitySettingsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t('settings.currentPassword')}</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('settings.newPassword')}</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('settings.confirmPassword')}</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button onClick={handleSaveSettings}>{t('settings.updatePassword')}</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.languagePrefs')}</CardTitle>
                <CardDescription>{t('settings.languagePrefsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="english" 
                      name="language" 
                      value="en"
                      checked={language === 'en'}
                      onChange={() => setLanguage('en')}
                    />
                    <Label htmlFor="english">{t('settings.english')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="arabic" 
                      name="language" 
                      value="ar"
                      checked={language === 'ar'}
                      onChange={() => setLanguage('ar')}
                    />
                    <Label htmlFor="arabic">{t('settings.arabic')}</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.appearanceSettings')}</CardTitle>
                <CardDescription>{t('settings.appearanceSettingsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>{t('settings.theme')}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t('settings.themeDesc')}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="w-full h-20 bg-gradient-to-br from-background to-muted rounded mb-2"></div>
                        <p className="text-sm text-center">{t('settings.lightTheme')}</p>
                      </div>
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded mb-2"></div>
                        <p className="text-sm text-center">{t('settings.darkTheme')}</p>
                      </div>
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="w-full h-20 bg-gradient-to-br from-background via-muted to-gray-900 rounded mb-2"></div>
                        <p className="text-sm text-center">{t('settings.autoTheme')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

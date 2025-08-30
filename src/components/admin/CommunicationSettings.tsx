import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Settings, 
  Mail, 
  Smartphone, 
  Bell, 
  Globe,
  Shield,
  Clock,
  Users,
  MessageSquare,
  Save,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";

export const CommunicationSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useOptionalLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [emailSettings, setEmailSettings] = useState({
    smtp_host: "smtp.resend.com",
    smtp_port: "587",
    smtp_username: "resend",
    smtp_encryption: "tls",
    from_email: "noreply@mwrd.com",
    from_name: "MWRD Platform",
    reply_to: "support@mwrd.com",
    bounce_handling: true,
    email_tracking: true,
    unsubscribe_link: true
  });

  const [smsSettings, setSmsSettings] = useState({
    provider: "twilio",
    api_key: "",
    api_secret: "",
    from_number: "",
    delivery_reports: true,
    opt_out_keywords: ["STOP", "UNSUBSCRIBE"],
    rate_limit: 10
  });

  const [notificationSettings, setNotificationSettings] = useState({
    real_time_enabled: true,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    digest_frequency: "daily",
    quiet_hours_enabled: true,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00"
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    slack_webhook: "",
    discord_webhook: "",
    webhook_notifications: false,
    api_rate_limit: 1000,
    webhook_retries: 3,
    webhook_timeout: 30
  });

  // Load settings from database
  const loadSettings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch real communication settings from database
      const { data: settings, error } = await supabase
        .from('communication_settings')
        .select('*')
        .eq('user_id', user.id);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Process settings data if exists
      if (settings && settings.length > 0) {
        settings.forEach(setting => {
          const settingsData = setting.settings_data as Record<string, any>;
          switch (setting.settings_type) {
            case 'email':
              setEmailSettings(prev => ({ ...prev, ...settingsData }));
              break;
            case 'sms':
              setSmsSettings(prev => ({ ...prev, ...settingsData }));
              break;
            case 'notifications':
              setNotificationSettings(prev => ({ ...prev, ...settingsData }));
              break;
            case 'integrations':
              setIntegrationSettings(prev => ({ ...prev, ...settingsData }));
              break;
          }
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (settingsType: string) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      let settingsData = {};
      let dbSettingsType = '';
      
      switch (settingsType) {
        case 'Email':
          settingsData = emailSettings;
          dbSettingsType = 'email';
          break;
        case 'SMS':
          settingsData = smsSettings;
          dbSettingsType = 'sms';
          break;
        case 'Notifications':
          settingsData = notificationSettings;
          dbSettingsType = 'notifications';
          break;
        case 'Integrations':
          settingsData = integrationSettings;
          dbSettingsType = 'integrations';
          break;
      }

      // Save to real database
      const { error } = await supabase
        .from('communication_settings')
        .upsert({
          user_id: user.id,
          settings_type: dbSettingsType,
          settings_data: settingsData
        }, {
          onConflict: 'user_id,settings_type'
        });

      if (error) throw error;

      toast({
        title: t('communication.settingsSaved'),
        description: `${settingsType} ${t('communication.settingsUpdated')}`
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: t('communication.settingsError'),
        description: t('communication.settingsFailedSave'),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t('communication.emailTab')}
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            {t('communication.smsTab')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('communication.notificationsTab')}
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t('communication.integrationsTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t('communication.emailConfiguration')}
              </CardTitle>
              <CardDescription>
                {t('communication.emailConfigDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{t('communication.smtpHost')}</label>
                    <Input
                      value={emailSettings.smtp_host}
                      onChange={(e) => setEmailSettings({...emailSettings, smtp_host: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{t('communication.smtpPort')}</label>
                      <Input
                        value={emailSettings.smtp_port}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_port: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t('communication.encryption')}</label>
                      <Select value={emailSettings.smtp_encryption} onValueChange={(value) => setEmailSettings({...emailSettings, smtp_encryption: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tls">TLS</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('communication.smtpUsername')}</label>
                    <Input
                      value={emailSettings.smtp_username}
                      onChange={(e) => setEmailSettings({...emailSettings, smtp_username: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{t('communication.fromEmail')}</label>
                    <Input
                      type="email"
                      value={emailSettings.from_email}
                      onChange={(e) => setEmailSettings({...emailSettings, from_email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('communication.fromName')}</label>
                    <Input
                      value={emailSettings.from_name}
                      onChange={(e) => setEmailSettings({...emailSettings, from_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('communication.replyToEmail')}</label>
                    <Input
                      type="email"
                      value={emailSettings.reply_to}
                      onChange={(e) => setEmailSettings({...emailSettings, reply_to: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">{t('communication.emailFeatures')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('communication.bounceHandling')}</label>
                      <p className="text-xs text-muted-foreground">{t('communication.bounceHandlingDesc')}</p>
                    </div>
                    <Switch
                      checked={emailSettings.bounce_handling}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, bounce_handling: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('communication.emailTracking')}</label>
                      <p className="text-xs text-muted-foreground">{t('communication.emailTrackingDesc')}</p>
                    </div>
                    <Switch
                      checked={emailSettings.email_tracking}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, email_tracking: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('communication.unsubscribeLink')}</label>
                      <p className="text-xs text-muted-foreground">{t('communication.unsubscribeLinkDesc')}</p>
                    </div>
                    <Switch
                      checked={emailSettings.unsubscribe_link}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, unsubscribe_link: checked})}
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => handleSaveSettings("Email")} 
                className="w-full"
                disabled={isSaving}
              >
                {isSaving ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {t('communication.saveEmailSettings')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                {t('communication.smsConfiguration')}
              </CardTitle>
              <CardDescription>
                {t('communication.smsConfigDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{t('communication.smsProvider')}</label>
                    <Select value={smsSettings.provider} onValueChange={(value) => setSmsSettings({...smsSettings, provider: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="aws_sns">AWS SNS</SelectItem>
                        <SelectItem value="nexmo">Nexmo</SelectItem>
                        <SelectItem value="messagebird">MessageBird</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('communication.apiKey')}</label>
                    <Input
                      type="password"
                      value={smsSettings.api_key}
                      onChange={(e) => setSmsSettings({...smsSettings, api_key: e.target.value})}
                      placeholder={t('communication.apiKeyPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('communication.apiSecret')}</label>
                    <Input
                      type="password"
                      value={smsSettings.api_secret}
                      onChange={(e) => setSmsSettings({...smsSettings, api_secret: e.target.value})}
                      placeholder={t('communication.apiSecretPlaceholder')}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{t('communication.fromNumber')}</label>
                    <Input
                      value={smsSettings.from_number}
                      onChange={(e) => setSmsSettings({...smsSettings, from_number: e.target.value})}
                      placeholder={t('communication.fromNumberPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('communication.rateLimitPerMinute')}</label>
                    <Input
                      type="number"
                      value={smsSettings.rate_limit}
                      onChange={(e) => setSmsSettings({...smsSettings, rate_limit: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('communication.deliveryReports')}</label>
                      <p className="text-xs text-muted-foreground">{t('communication.deliveryReportsDesc')}</p>
                    </div>
                    <Switch
                      checked={smsSettings.delivery_reports}
                      onCheckedChange={(checked) => setSmsSettings({...smsSettings, delivery_reports: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">{t('communication.optOutKeywords')}</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {smsSettings.opt_out_keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">{keyword}</Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('communication.optOutKeywordsDesc')}
                </p>
              </div>

              <Button onClick={() => handleSaveSettings("SMS")} className="w-full" disabled={isSaving}>
                {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {t('communication.saveSmsSettings')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('communication.notificationPreferences')}
              </CardTitle>
              <CardDescription>
                {t('communication.notificationConfigDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('communication.realTimeNotifications')}</label>
                      <p className="text-xs text-muted-foreground">{t('communication.realTimeNotificationsDesc')}</p>
                    </div>
                    <Switch
                      checked={notificationSettings.real_time_enabled}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, real_time_enabled: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('communication.emailNotifications')}</label>
                      <p className="text-xs text-muted-foreground">{t('communication.emailNotificationsDesc')}</p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_notifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, email_notifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('communication.smsNotifications')}</label>
                      <p className="text-xs text-muted-foreground">{t('communication.smsNotificationsDesc')}</p>
                    </div>
                    <Switch
                      checked={notificationSettings.sms_notifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, sms_notifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('communication.pushNotificationsLabel')}</label>
                      <p className="text-xs text-muted-foreground">{t('communication.pushNotificationsDesc')}</p>
                    </div>
                    <Switch
                      checked={notificationSettings.push_notifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, push_notifications: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">{t('communication.digestFrequency')}</label>
                    <Select 
                      value={notificationSettings.digest_frequency} 
                      onValueChange={(value) => setNotificationSettings({...notificationSettings, digest_frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real-time">{t('communication.realTime')}</SelectItem>
                        <SelectItem value="hourly">{t('communication.hourly')}</SelectItem>
                        <SelectItem value="daily">{t('communication.daily')}</SelectItem>
                        <SelectItem value="weekly">{t('communication.weekly')}</SelectItem>
                        <SelectItem value="never">{t('communication.never')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('communication.quietHours')}</label>
                      <p className="text-xs text-muted-foreground">{t('communication.quietHoursDesc')}</p>
                    </div>
                    <Switch
                      checked={notificationSettings.quiet_hours_enabled}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, quiet_hours_enabled: checked})}
                    />
                  </div>

                  {notificationSettings.quiet_hours_enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">{t('communication.startTime')}</label>
                        <Input
                          type="time"
                          value={notificationSettings.quiet_hours_start}
                          onChange={(e) => setNotificationSettings({...notificationSettings, quiet_hours_start: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">{t('communication.endTime')}</label>
                        <Input
                          type="time"
                          value={notificationSettings.quiet_hours_end}
                          onChange={(e) => setNotificationSettings({...notificationSettings, quiet_hours_end: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Notifications")} className="w-full" disabled={isSaving}>
                {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {t('communication.saveNotificationSettings')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('communication.thirdPartyIntegrations')}
              </CardTitle>
              <CardDescription>
                {t('communication.integrationsConfigDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{t('communication.slackWebhookUrl')}</label>
                  <Input
                    value={integrationSettings.slack_webhook}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, slack_webhook: e.target.value})}
                    placeholder={t('communication.slackWebhookPlaceholder')}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t('communication.discordWebhookUrl')}</label>
                  <Input
                    value={integrationSettings.discord_webhook}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, discord_webhook: e.target.value})}
                    placeholder={t('communication.discordWebhookPlaceholder')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">{t('communication.enableWebhookNotifications')}</label>
                    <p className="text-xs text-muted-foreground">{t('communication.enableWebhookNotificationsDesc')}</p>
                  </div>
                  <Switch
                    checked={integrationSettings.webhook_notifications}
                    onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, webhook_notifications: checked})}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">{t('communication.apiConfiguration')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">{t('communication.apiRateLimit')}</label>
                    <Input
                      type="number"
                      value={integrationSettings.api_rate_limit}
                      onChange={(e) => setIntegrationSettings({...integrationSettings, api_rate_limit: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('communication.webhookRetries')}</label>
                    <Input
                      type="number"
                      value={integrationSettings.webhook_retries}
                      onChange={(e) => setIntegrationSettings({...integrationSettings, webhook_retries: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t('communication.timeoutSeconds')}</label>
                    <Input
                      type="number"
                      value={integrationSettings.webhook_timeout}
                      onChange={(e) => setIntegrationSettings({...integrationSettings, webhook_timeout: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Integrations")} className="w-full" disabled={isSaving}>
                {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {t('communication.saveIntegrationSettings')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
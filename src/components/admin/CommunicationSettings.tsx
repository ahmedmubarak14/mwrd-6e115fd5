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

export const CommunicationSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
        title: "Settings Saved",
        description: `${settingsType} settings have been updated successfully`
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
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
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings and email delivery options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">SMTP Host</label>
                    <Input
                      value={emailSettings.smtp_host}
                      onChange={(e) => setEmailSettings({...emailSettings, smtp_host: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">SMTP Port</label>
                      <Input
                        value={emailSettings.smtp_port}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_port: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Encryption</label>
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
                    <label className="text-sm font-medium">SMTP Username</label>
                    <Input
                      value={emailSettings.smtp_username}
                      onChange={(e) => setEmailSettings({...emailSettings, smtp_username: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">From Email</label>
                    <Input
                      type="email"
                      value={emailSettings.from_email}
                      onChange={(e) => setEmailSettings({...emailSettings, from_email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">From Name</label>
                    <Input
                      value={emailSettings.from_name}
                      onChange={(e) => setEmailSettings({...emailSettings, from_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reply-To Email</label>
                    <Input
                      type="email"
                      value={emailSettings.reply_to}
                      onChange={(e) => setEmailSettings({...emailSettings, reply_to: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Email Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Bounce Handling</label>
                      <p className="text-xs text-muted-foreground">Automatically handle bounced emails</p>
                    </div>
                    <Switch
                      checked={emailSettings.bounce_handling}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, bounce_handling: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Email Tracking</label>
                      <p className="text-xs text-muted-foreground">Track email opens and clicks</p>
                    </div>
                    <Switch
                      checked={emailSettings.email_tracking}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, email_tracking: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Unsubscribe Link</label>
                      <p className="text-xs text-muted-foreground">Include unsubscribe link in emails</p>
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
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                SMS Configuration
              </CardTitle>
              <CardDescription>
                Configure SMS provider and delivery settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">SMS Provider</label>
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
                    <label className="text-sm font-medium">API Key</label>
                    <Input
                      type="password"
                      value={smsSettings.api_key}
                      onChange={(e) => setSmsSettings({...smsSettings, api_key: e.target.value})}
                      placeholder="Your API key"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">API Secret</label>
                    <Input
                      type="password"
                      value={smsSettings.api_secret}
                      onChange={(e) => setSmsSettings({...smsSettings, api_secret: e.target.value})}
                      placeholder="Your API secret"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">From Number</label>
                    <Input
                      value={smsSettings.from_number}
                      onChange={(e) => setSmsSettings({...smsSettings, from_number: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Rate Limit (per minute)</label>
                    <Input
                      type="number"
                      value={smsSettings.rate_limit}
                      onChange={(e) => setSmsSettings({...smsSettings, rate_limit: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Delivery Reports</label>
                      <p className="text-xs text-muted-foreground">Track SMS delivery status</p>
                    </div>
                    <Switch
                      checked={smsSettings.delivery_reports}
                      onCheckedChange={(checked) => setSmsSettings({...smsSettings, delivery_reports: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Opt-Out Keywords</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {smsSettings.opt_out_keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">{keyword}</Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Users can reply with these keywords to unsubscribe from SMS notifications
                </p>
              </div>

              <Button onClick={() => handleSaveSettings("SMS")} className="w-full" disabled={isSaving}>
                {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save SMS Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure global notification settings and delivery preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Real-time Notifications</label>
                      <p className="text-xs text-muted-foreground">Instant notifications for critical events</p>
                    </div>
                    <Switch
                      checked={notificationSettings.real_time_enabled}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, real_time_enabled: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_notifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, email_notifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">SMS Notifications</label>
                      <p className="text-xs text-muted-foreground">Send critical alerts via SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.sms_notifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, sms_notifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Push Notifications</label>
                      <p className="text-xs text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.push_notifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, push_notifications: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">Digest Frequency</label>
                    <Select 
                      value={notificationSettings.digest_frequency} 
                      onValueChange={(value) => setNotificationSettings({...notificationSettings, digest_frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real-time">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Quiet Hours</label>
                      <p className="text-xs text-muted-foreground">Disable notifications during specified hours</p>
                    </div>
                    <Switch
                      checked={notificationSettings.quiet_hours_enabled}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, quiet_hours_enabled: checked})}
                    />
                  </div>

                  {notificationSettings.quiet_hours_enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <Input
                          type="time"
                          value={notificationSettings.quiet_hours_start}
                          onChange={(e) => setNotificationSettings({...notificationSettings, quiet_hours_start: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
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
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Third-party Integrations
              </CardTitle>
              <CardDescription>
                Configure webhooks and external service integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Slack Webhook URL</label>
                  <Input
                    value={integrationSettings.slack_webhook}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, slack_webhook: e.target.value})}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Discord Webhook URL</label>
                  <Input
                    value={integrationSettings.discord_webhook}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, discord_webhook: e.target.value})}
                    placeholder="https://discord.com/api/webhooks/..."
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Enable Webhook Notifications</label>
                    <p className="text-xs text-muted-foreground">Send notifications to configured webhooks</p>
                  </div>
                  <Switch
                    checked={integrationSettings.webhook_notifications}
                    onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, webhook_notifications: checked})}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">API Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">API Rate Limit</label>
                    <Input
                      type="number"
                      value={integrationSettings.api_rate_limit}
                      onChange={(e) => setIntegrationSettings({...integrationSettings, api_rate_limit: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Webhook Retries</label>
                    <Input
                      type="number"
                      value={integrationSettings.webhook_retries}
                      onChange={(e) => setIntegrationSettings({...integrationSettings, webhook_retries: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Timeout (seconds)</label>
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
                Save Integration Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
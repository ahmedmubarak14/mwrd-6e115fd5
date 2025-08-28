import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Globe, 
  Shield, 
  Server, 
  Mail, 
  Save,
  AlertTriangle,
  Info,
  Database,
  Key
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CommunicationSettings } from '@/components/admin/CommunicationSettings';

interface PlatformSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description: string;
}

export const AdminSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});

  const loadPlatformSettings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*');
      
      if (error) {
        console.error('Error loading platform settings:', error);
        toast({
          title: "Error",
          description: "Failed to load platform settings.",
          variant: "destructive"
        });
        return;
      }
      
      const settingsMap: Record<string, any> = {};
      data?.forEach((setting: PlatformSetting) => {
        settingsMap[setting.setting_key] = setting.setting_value?.value ?? setting.setting_value;
      });
      
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error loading platform settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (settingKey: string, value: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('platform_settings')
        .update({ 
          setting_value: { value },
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', settingKey);
      
      if (error) {
        console.error('Error updating setting:', error);
        toast({
          title: "Error",
          description: `Failed to update ${settingKey}.`,
          variant: "destructive"
        });
        return false;
      }
      
      setSettings(prev => ({ ...prev, [settingKey]: value }));
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
    }
  };

  const handleSaveSection = async (sectionKeys: string[]) => {
    setIsSaving(true);
    let allSuccessful = true;
    
    for (const key of sectionKeys) {
      const success = await updateSetting(key, settings[key]);
      if (!success) allSuccessful = false;
    }
    
    if (allSuccessful) {
      toast({
        title: "Settings Saved",
        description: "Platform settings have been updated successfully."
      });
    }
    
    setIsSaving(false);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (user) {
      loadPlatformSettings();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Platform Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage global platform configuration and administrative settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Platform Information
              </CardTitle>
              <CardDescription>
                Basic platform configuration and branding settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="siteName">Platform Name</Label>
                  <Input
                    id="siteName"
                    value={settings.site_name || ''}
                    onChange={(e) => handleSettingChange('site_name', e.target.value)}
                    placeholder="MWRD Platform"
                  />
                </div>
                
                <div>
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select 
                    value={settings.default_currency || 'SAR'} 
                    onValueChange={(value) => handleSettingChange('default_currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">SAR (Saudi Riyal)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="AED">AED (UAE Dirham)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">Platform Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.site_description || ''}
                  onChange={(e) => handleSettingChange('site_description', e.target.value)}
                  placeholder="Professional procurement and vendor management platform"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="defaultTimezone">Default Timezone</Label>
                  <Select 
                    value={settings.default_timezone || 'Asia/Riyadh'} 
                    onValueChange={(value) => handleSettingChange('default_timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">Asia/Riyadh</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="defaultUserRole">Default User Role</Label>
                  <Select 
                    value={settings.default_user_role || 'client'} 
                    onValueChange={(value) => handleSettingChange('default_user_role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>User Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new users to register on the platform</p>
                </div>
                <Switch
                  checked={settings.registration_open || false}
                  onCheckedChange={(checked) => handleSettingChange('registration_open', checked)}
                />
              </div>

              <Button 
                onClick={() => handleSaveSection(['site_name', 'site_description', 'default_currency', 'default_timezone', 'default_user_role', 'registration_open'])}
                className="w-full"
                disabled={isSaving}
              >
                {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Authentication and security policy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.session_timeout || 480}
                    onChange={(e) => handleSettingChange('session_timeout', parseInt(e.target.value))}
                    min="30"
                    max="1440"
                  />
                  <p className="text-xs text-muted-foreground mt-1">How long users stay logged in</p>
                </div>

                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.max_login_attempts || 5}
                    onChange={(e) => handleSettingChange('max_login_attempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Failed attempts before account lockout</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="passwordMinLength">Password Minimum Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.password_min_length || 8}
                    onChange={(e) => handleSettingChange('password_min_length', parseInt(e.target.value))}
                    min="6"
                    max="128"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Password Symbols</Label>
                    <p className="text-xs text-muted-foreground">Require special characters in passwords</p>
                  </div>
                  <Switch
                    checked={settings.require_password_symbols || false}
                    onCheckedChange={(checked) => handleSettingChange('require_password_symbols', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Verification Required</Label>
                    <p className="text-xs text-muted-foreground">Require email verification for new accounts</p>
                  </div>
                  <Switch
                    checked={settings.email_verification_required || false}
                    onCheckedChange={(checked) => handleSettingChange('email_verification_required', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.enable_two_factor || false}
                    onCheckedChange={(checked) => handleSettingChange('enable_two_factor', checked)}
                  />
                </div>
              </div>

              <Button 
                onClick={() => handleSaveSection(['session_timeout', 'max_login_attempts', 'password_min_length', 'require_password_symbols', 'email_verification_required', 'enable_two_factor'])}
                className="w-full"
                disabled={isSaving}
              >
                {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Performance, limits, and system behavior settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={settings.api_rate_limit || 1000}
                    onChange={(e) => handleSettingChange('api_rate_limit', parseInt(e.target.value))}
                    min="100"
                    max="10000"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Maximum API requests per user per hour</p>
                </div>

                <div>
                  <Label htmlFor="fileUploadMaxSize">Max File Upload Size (MB)</Label>
                  <Input
                    id="fileUploadMaxSize"
                    type="number"
                    value={settings.file_upload_max_size || 10}
                    onChange={(e) => handleSettingChange('file_upload_max_size', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Maximum file size for uploads</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable platform access for maintenance</p>
                  </div>
                </div>
                <Switch
                  checked={settings.maintenance_mode || false}
                  onCheckedChange={(checked) => handleSettingChange('maintenance_mode', checked)}
                />
              </div>

              {settings.maintenance_mode && (
                <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Maintenance Mode Active</span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    The platform is currently in maintenance mode. Only administrators can access the system.
                  </p>
                </div>
              )}

              <Button 
                onClick={() => handleSaveSection(['api_rate_limit', 'file_upload_max_size', 'maintenance_mode'])}
                className="w-full"
                disabled={isSaving}
              >
                {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <CommunicationSettings />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Advanced Configuration
              </CardTitle>
              <CardDescription>
                Advanced system settings and database operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Key className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">API Keys</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage external service API keys and integrations
                  </p>
                  <Button variant="outline" size="sm">
                    Manage API Keys
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="h-5 w-5 text-green-500" />
                    <h4 className="font-medium">Database</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Database maintenance and optimization tools
                  </p>
                  <Button variant="outline" size="sm">
                    Database Tools
                  </Button>
                </Card>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4 text-destructive">Danger Zone</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                    <div>
                      <h5 className="font-medium text-destructive">Reset Platform Settings</h5>
                      <p className="text-sm text-muted-foreground">Reset all platform settings to default values</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Reset Settings
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                    <div>
                      <h5 className="font-medium text-destructive">Export Platform Data</h5>
                      <p className="text-sm text-muted-foreground">Download a complete backup of platform data</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
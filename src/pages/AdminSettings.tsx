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
  Key,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CommunicationSettings } from '@/components/admin/CommunicationSettings';
import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t, isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadPlatformSettings = async (showRefreshToast = false) => {
    if (!user) return;
    
    setIsLoading(true);
    if (showRefreshToast) setIsRefreshing(true);
    
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*');
      
      if (error) {
        console.error('Error loading platform settings:', error);
        toast({
          title: t('common.error'),
          description: t('platformSettings.loadSettingsError'),
          variant: "destructive"
        });
        return;
      }
      
      const settingsMap: Record<string, any> = {};
      data?.forEach((setting: PlatformSetting) => {
        settingsMap[setting.setting_key] = setting.setting_value?.value ?? setting.setting_value;
      });
      
      setSettings(settingsMap);
      setHasUnsavedChanges(false);
      
      if (showRefreshToast) {
        toast({
          title: t('platformSettings.settingsRefreshed'),
          description: t('platformSettings.settingsRefreshedDesc')
        });
      }
    } catch (error) {
      console.error('Error loading platform settings:', error);
      toast({
        title: t('common.error'),
        description: t('platformSettings.loadSettingsError'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const updateSetting = async (settingKey: string, value: any) => {
    if (!user) return false;
    
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
          title: t('common.error'),
          description: t('platformSettings.updateSettingsError').replace('{settingKey}', settingKey),
          variant: "destructive"
        });
        return false;
      }
      
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
      if (settings[key] !== undefined) {
        const success = await updateSetting(key, settings[key]);
        if (!success) allSuccessful = false;
      }
    }
    
    if (allSuccessful) {
      setHasUnsavedChanges(false);
      toast({
        title: t('platformSettings.settingsSaved'),
        description: t('platformSettings.settingsSavedDesc')
      });
      // Refresh to get latest values
      await loadPlatformSettings();
    }
    
    setIsSaving(false);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const resetToDefaults = async () => {
    const defaultSettings = {
      site_name: "MWRD Platform",
      site_description: "Professional procurement and vendor management platform",
      registration_open: true,
      email_verification_required: false,
      default_user_role: "client",
      session_timeout: 480,
      max_login_attempts: 5,
      password_min_length: 8,
      require_password_symbols: true,
      enable_two_factor: false,
      api_rate_limit: 1000,
      file_upload_max_size: 10,
      maintenance_mode: false,
      default_timezone: "Asia/Riyadh",
      default_currency: "SAR"
    };
    
    setSettings(defaultSettings);
    setHasUnsavedChanges(true);
    
    toast({
      title: t('platformSettings.settingsReset'),
      description: t('platformSettings.settingsResetDesc')
    });
  };

  useEffect(() => {
    if (user) {
      loadPlatformSettings();
    }
  }, [user]);

  if (isLoading) {
    return (
      <AdminPageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminPageContainer>
    );
  }

  const headerActions = (
    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {hasUnsavedChanges && (
        <Badge variant="outline" className="text-amber-600 border-amber-600">
          {t('platformSettings.unsavedChanges')}
        </Badge>
      )}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => loadPlatformSettings(true)}
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <LoadingSpinner size="sm" className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
        ) : (
          <RefreshCw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        )}
        {t('platformSettings.refresh')}
      </Button>
    </div>
  );

  return (
    <AdminPageContainer
      title={t('platformSettings.title')}
      description={t('platformSettings.description')}
      headerActions={headerActions}
    >
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="general" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Globe className="h-4 w-4" />
              {t('platformSettings.general')}
            </TabsTrigger>
            <TabsTrigger value="security" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Shield className="h-4 w-4" />
              {t('platformSettings.security')}
            </TabsTrigger>
            <TabsTrigger value="system" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Server className="h-4 w-4" />
              {t('platformSettings.system')}
            </TabsTrigger>
            <TabsTrigger value="communication" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Mail className="h-4 w-4" />
              {t('platformSettings.communication')}
            </TabsTrigger>
            <TabsTrigger value="advanced" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Database className="h-4 w-4" />
              {t('platformSettings.advanced')}
            </TabsTrigger>
          </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Globe className="h-5 w-5" />
                {t('platformSettings.platformInformation')}
              </CardTitle>
              <CardDescription>
                {t('platformSettings.platformInfoDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="siteName">{t('platformSettings.platformName')}</Label>
                  <Input
                    id="siteName"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    value={settings.site_name || ''}
                    onChange={(e) => handleSettingChange('site_name', e.target.value)}
                    placeholder="MWRD Platform"
                  />
                </div>
                
                <div>
                  <Label htmlFor="defaultCurrency">{t('platformSettings.defaultCurrency')}</Label>
                  <Select 
                    value={settings.default_currency || 'SAR'} 
                    onValueChange={(value) => handleSettingChange('default_currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? 'end' : 'start'}>
                      <SelectItem value="SAR">{t('platformSettings.currencySAR')}</SelectItem>
                      <SelectItem value="USD">{t('platformSettings.currencyUSD')}</SelectItem>
                      <SelectItem value="EUR">{t('platformSettings.currencyEUR')}</SelectItem>
                      <SelectItem value="AED">{t('platformSettings.currencyAED')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">{t('platformSettings.platformDescription')}</Label>
                <Textarea
                  id="siteDescription"
                  dir={isRTL ? 'rtl' : 'ltr'}
                  value={settings.site_description || ''}
                  onChange={(e) => handleSettingChange('site_description', e.target.value)}
                  placeholder="Professional procurement and vendor management platform"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="defaultTimezone">{t('platformSettings.defaultTimezone')}</Label>
                  <Select 
                    value={settings.default_timezone || 'Asia/Riyadh'} 
                    onValueChange={(value) => handleSettingChange('default_timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? 'end' : 'start'}>
                      <SelectItem value="Asia/Riyadh">{t('platformSettings.timezoneRiyadh')}</SelectItem>
                      <SelectItem value="UTC">{t('platformSettings.timezoneUTC')}</SelectItem>
                      <SelectItem value="America/New_York">{t('platformSettings.timezoneNewYork')}</SelectItem>
                      <SelectItem value="Europe/London">{t('platformSettings.timezoneLondon')}</SelectItem>
                      <SelectItem value="Asia/Dubai">{t('platformSettings.timezoneDubai')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="defaultUserRole">{t('platformSettings.defaultUserRole')}</Label>
                  <Select 
                    value={settings.default_user_role || 'client'} 
                    onValueChange={(value) => handleSettingChange('default_user_role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? 'end' : 'start'}>
                      <SelectItem value="client">{t('platformSettings.roleClient')}</SelectItem>
                      <SelectItem value="vendor">{t('platformSettings.roleVendor')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('platformSettings.userRegistration')}</Label>
                  <p className="text-sm text-muted-foreground">{t('platformSettings.userRegistrationDesc')}</p>
                </div>
                <Switch
                  checked={settings.registration_open || false}
                  onCheckedChange={(checked) => handleSettingChange('registration_open', checked)}
                />
              </div>

              <div className={`flex items-center gap-2 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button 
                  onClick={() => handleSaveSection(['site_name', 'site_description', 'default_currency', 'default_timezone', 'default_user_role', 'registration_open'])}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? <LoadingSpinner size="sm" className={`${isRTL ? 'ml-2' : 'mr-2'}`} /> : <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                  {t('platformSettings.saveGeneralSettings')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Shield className="h-5 w-5" />
                {t('platformSettings.securityConfiguration')}
              </CardTitle>
              <CardDescription>
                {t('platformSettings.securityConfigDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sessionTimeout">{t('platformSettings.sessionTimeout')}</Label>
                  <Input
                    id="sessionTimeout"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    type="number"
                    value={settings.session_timeout || 480}
                    onChange={(e) => handleSettingChange('session_timeout', parseInt(e.target.value) || 480)}
                    min="30"
                    max="1440"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t('platformSettings.sessionTimeoutDesc')}</p>
                </div>

                <div>
                  <Label htmlFor="maxLoginAttempts">{t('platformSettings.maxLoginAttempts')}</Label>
                  <Input
                    id="maxLoginAttempts"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    type="number"
                    value={settings.max_login_attempts || 5}
                    onChange={(e) => handleSettingChange('max_login_attempts', parseInt(e.target.value) || 5)}
                    min="3"
                    max="10"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t('platformSettings.maxLoginAttemptsDesc')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="passwordMinLength">{t('platformSettings.passwordMinLength')}</Label>
                  <Input
                    id="passwordMinLength"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    type="number"
                    value={settings.password_min_length || 8}
                    onChange={(e) => handleSettingChange('password_min_length', parseInt(e.target.value) || 8)}
                    min="6"
                    max="128"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('platformSettings.requirePasswordSymbols')}</Label>
                    <p className="text-xs text-muted-foreground">{t('platformSettings.requirePasswordSymbolsDesc')}</p>
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
                    <Label>{t('platformSettings.emailVerificationRequired')}</Label>
                    <p className="text-xs text-muted-foreground">{t('platformSettings.emailVerificationDesc')}</p>
                  </div>
                  <Switch
                    checked={settings.email_verification_required || false}
                    onCheckedChange={(checked) => handleSettingChange('email_verification_required', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('platformSettings.twoFactorAuth')}</Label>
                    <p className="text-xs text-muted-foreground">{t('platformSettings.twoFactorAuthDesc')}</p>
                  </div>
                  <Switch
                    checked={settings.enable_two_factor || false}
                    onCheckedChange={(checked) => handleSettingChange('enable_two_factor', checked)}
                  />
                </div>
              </div>

              <div className={`flex items-center gap-2 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button 
                  onClick={() => handleSaveSection(['session_timeout', 'max_login_attempts', 'password_min_length', 'require_password_symbols', 'email_verification_required', 'enable_two_factor'])}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? <LoadingSpinner size="sm" className={`${isRTL ? 'ml-2' : 'mr-2'}`} /> : <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                  {t('platformSettings.saveSecuritySettings')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Server className="h-5 w-5" />
                {t('platformSettings.systemConfiguration')}
              </CardTitle>
              <CardDescription>
                {t('platformSettings.systemConfigDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="apiRateLimit">{t('platformSettings.apiRateLimit')}</Label>
                  <Input
                    id="apiRateLimit"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    type="number"
                    value={settings.api_rate_limit || 1000}
                    onChange={(e) => handleSettingChange('api_rate_limit', parseInt(e.target.value) || 1000)}
                    min="100"
                    max="10000"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t('platformSettings.apiRateLimitDesc')}</p>
                </div>

                <div>
                  <Label htmlFor="fileUploadMaxSize">{t('platformSettings.fileUploadMaxSize')}</Label>
                  <Input
                    id="fileUploadMaxSize"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    type="number"
                    value={settings.file_upload_max_size || 10}
                    onChange={(e) => handleSettingChange('file_upload_max_size', parseInt(e.target.value) || 10)}
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t('platformSettings.fileUploadMaxSizeDesc')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <Label className="text-base">{t('platformSettings.maintenanceMode')}</Label>
                    <p className="text-sm text-muted-foreground">{t('platformSettings.maintenanceModeDesc')}</p>
                  </div>
                </div>
                <Switch
                  checked={settings.maintenance_mode || false}
                  onCheckedChange={(checked) => handleSettingChange('maintenance_mode', checked)}
                />
              </div>

              {settings.maintenance_mode && (
                <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Info className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">{t('platformSettings.maintenanceModeActive')}</span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {t('platformSettings.maintenanceModeActiveDesc')}
                  </p>
                </div>
              )}

              <div className={`flex items-center gap-2 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button 
                  onClick={() => handleSaveSection(['api_rate_limit', 'file_upload_max_size', 'maintenance_mode'])}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? <LoadingSpinner size="sm" className={`${isRTL ? 'ml-2' : 'mr-2'}`} /> : <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
                  {t('platformSettings.saveSystemSettings')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <CommunicationSettings />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Database className="h-5 w-5" />
                {t('platformSettings.advancedConfiguration')}
              </CardTitle>
              <CardDescription>
                {t('platformSettings.advancedConfigDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Key className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">{t('platformSettings.apiKeyManagement')}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('platformSettings.apiKeyManagementDesc')}
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    {t('platformSettings.manageApiKeys')}
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Database className="h-5 w-5 text-green-500" />
                    <h4 className="font-medium">{t('platformSettings.databaseTools')}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('platformSettings.databaseToolsDesc')}
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    {t('platformSettings.manageDatabaseTools')}
                  </Button>
                </Card>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4 text-destructive">{t('platformSettings.dangerZone')}</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                    <div>
                      <h5 className="font-medium text-destructive">{t('platformSettings.resetPlatformSettings')}</h5>
                      <p className="text-sm text-muted-foreground">{t('platformSettings.resetPlatformSettingsDesc')}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={resetToDefaults}>
                      {t('platformSettings.resetSettings')}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                    <div>
                      <h5 className="font-medium text-destructive">{t('platformSettings.exportPlatformData')}</h5>
                      <p className="text-sm text-muted-foreground">{t('platformSettings.exportDataDesc')}</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      {t('platformSettings.exportData')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AdminPageContainer>
  );
};

export default AdminSettings;
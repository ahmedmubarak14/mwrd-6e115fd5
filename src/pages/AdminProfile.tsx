import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Building, 
  Settings, 
  Shield,
  Bell,
  Activity,
  Key,
  Database,
  Users,
  BarChart3,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";

interface AdminSettings {
  two_factor_enabled: boolean;
  email_notifications: boolean;
  security_alerts: boolean;
  admin_dashboard_theme: 'light' | 'dark' | 'system';
  session_timeout: number;
  audit_log_retention: number;
}

interface AdminStats {
  total_logins: number;
  last_login: string;
  failed_attempts: number;
  sessions_active: number;
  permissions_granted: string[];
}

const AdminProfile = () => {
  const { userProfile, updateProfile, user } = useAuth();
  const languageContext = useOptionalLanguage();
  const { t } = languageContext || { t: (key: string) => key };
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const { showSuccess, showError } = useToastFeedback();
  
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || "",
    company_name: userProfile?.company_name || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
    bio: userProfile?.bio || "",
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    two_factor_enabled: false,
    email_notifications: true,
    security_alerts: true,
    admin_dashboard_theme: 'system',
    session_timeout: 480, // 8 hours in minutes
    audit_log_retention: 90, // days
  });

  const [adminStats, setAdminStats] = useState<AdminStats>({
    total_logins: 0,
    last_login: new Date().toISOString(),
    failed_attempts: 0,
    sessions_active: 1,
    permissions_granted: ['users:read', 'users:write', 'analytics:read', 'system:admin']
  });

  const [showApiKeys, setShowApiKeys] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || "",
        company_name: userProfile.company_name || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        bio: userProfile.bio || "",
      });
      loadAdminData();
    }
  }, [userProfile]);

  const loadAdminData = async () => {
    try {
      setStatsLoading(true);
      
      // Load admin settings from localStorage (in real app, this would be from database)
      const savedSettings = localStorage.getItem('admin_settings');
      if (savedSettings) {
        setAdminSettings(JSON.parse(savedSettings));
      }

      // Mock admin stats (in real app, these would come from audit logs and session tables)
      const mockStats: AdminStats = {
        total_logins: Math.floor(Math.random() * 500) + 100,
        last_login: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        failed_attempts: Math.floor(Math.random() * 5),
        sessions_active: Math.floor(Math.random() * 3) + 1,
        permissions_granted: [
          'users:read', 'users:write', 'users:delete',
          'analytics:read', 'reports:generate',
          'system:admin', 'security:manage',
          'communications:send', 'verification:approve'
        ]
      };
      
      setAdminStats(mockStats);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        showSuccess('Profile updated successfully');
      } else {
        showError('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      // Save to localStorage (in real app, this would save to database)
      localStorage.setItem('admin_settings', JSON.stringify(adminSettings));
      showSuccess('Admin settings saved successfully');
    } catch (error) {
      showError('Failed to save settings');
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      showSuccess('Password reset email sent');
    } catch (error) {
      showError('Failed to send password reset email');
    }
  };

  if (!userProfile || userProfile.role !== 'admin') {
    return (
      <AdminPageContainer>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Access denied. Admin role required.</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Profile</h1>
            <p className="text-muted-foreground">
              Manage your admin profile, security settings, and system preferences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Administrator
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your admin profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, full_name: e.target.value }))
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={userProfile.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value="Administrator"
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      placeholder="Tell us about yourself and your administrative responsibilities..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} disabled={loading}>
                      {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your account security and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.two_factor_enabled}
                      onCheckedChange={(checked) =>
                        setAdminSettings(prev => ({ ...prev, two_factor_enabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about security events
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.security_alerts}
                      onCheckedChange={(checked) =>
                        setAdminSettings(prev => ({ ...prev, security_alerts: checked }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={adminSettings.session_timeout}
                      onChange={(e) =>
                        setAdminSettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) || 480 }))
                      }
                      min="30"
                      max="1440"
                    />
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after this period of inactivity
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <Button onClick={handlePasswordReset} variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Reset Password
                    </Button>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveSettings}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Security Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Admin Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your admin dashboard and notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email alerts for important admin events
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.email_notifications}
                      onCheckedChange={(checked) =>
                        setAdminSettings(prev => ({ ...prev, email_notifications: checked }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Audit Log Retention (days)</Label>
                    <Input
                      type="number"
                      value={adminSettings.audit_log_retention}
                      onChange={(e) =>
                        setAdminSettings(prev => ({ ...prev, audit_log_retention: parseInt(e.target.value) || 90 }))
                      }
                      min="30"
                      max="365"
                    />
                    <p className="text-sm text-muted-foreground">
                      How long to keep audit trail records
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveSettings}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="grid gap-6">
              {statsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner label="Loading activity data..." />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{adminStats.total_logins}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{adminStats.sessions_active}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-destructive">{adminStats.failed_attempts}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Login</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm font-bold">
                          {new Date(adminStats.last_login).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(adminStats.last_login).toLocaleTimeString()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Admin Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { action: 'User verification approved', target: 'vendor_123', time: '2 hours ago' },
                          { action: 'System settings updated', target: 'notification_config', time: '5 hours ago' },
                          { action: 'Financial transaction reviewed', target: 'txn_456', time: '1 day ago' },
                          { action: 'Category management update', target: 'construction', time: '2 days ago' }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                            <div>
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-muted-foreground">Target: {activity.target}</p>
                            </div>
                            <span className="text-sm text-muted-foreground">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="permissions">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Admin Permissions
                  </CardTitle>
                  <CardDescription>
                    Your current administrative permissions and access levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminStats.permissions_granted.map((permission, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-success" />
                          <span className="text-sm font-medium">{permission}</span>
                        </div>
                        <Badge variant="success" size="sm">Granted</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Access</CardTitle>
                  <CardDescription>
                    Manage your API keys and access tokens
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>API Key</Label>
                      <p className="text-sm text-muted-foreground">
                        Your personal admin API key
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKeys(!showApiKeys)}
                    >
                      {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-md font-mono text-sm">
                    {showApiKeys ? 'admin_key_' + user?.id?.slice(0, 8) + '...' + user?.id?.slice(-8) : '••••••••••••••••••••••••••••••••'}
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Generate New Key
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageContainer>
  );
};

export default AdminProfile;
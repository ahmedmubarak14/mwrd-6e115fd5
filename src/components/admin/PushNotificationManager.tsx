import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Plus, 
  Send, 
  Settings, 
  BarChart,
  Users,
  Globe,
  Bell,
  Target,
  Clock
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useToast } from "@/hooks/use-toast";

export const PushNotificationManager = () => {
  const { 
    pushNotifications, 
    deviceStats, 
    notificationSettings,
    createPushNotification,
    updateSettings,
    isLoading 
  } = usePushNotifications();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  const [newNotification, setNewNotification] = useState({
    title: "",
    body: "",
    icon: "/favicon.ico",
    badge: "/badge.png",
    target_platform: "all" as "all" | "android" | "ios" | "web",
    target_audience: "all_users",
    action_url: "",
    scheduled_for: ""
  });

  const [settings, setSettings] = useState({
    enabled: true,
    allow_promotional: true,
    quiet_hours_enabled: false,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00",
    max_daily_notifications: 5
  });

  const handleCreateNotification = async () => {
    try {
      await createPushNotification(newNotification);
      setNewNotification({
        title: "",
        body: "",
        icon: "/favicon.ico",
        badge: "/badge.png",
        target_platform: "all",
        target_audience: "all_users",
        action_url: "",
        scheduled_for: ""
      });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Push notification created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create push notification",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await updateSettings(settings);
      setIsSettingsDialogOpen(false);
      toast({
        title: "Success",
        description: "Push notification settings updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    }
  };

  const platformData = [
    { name: 'Android', value: 65, color: '#3DDC84' },
    { name: 'iOS', value: 30, color: '#007AFF' },
    { name: 'Web', value: 5, color: '#FF6B6B' }
  ];

  const engagementData = [
    { platform: 'Android', sent: 1200, delivered: 1150, clicked: 230 },
    { platform: 'iOS', sent: 800, delivered: 780, clicked: 195 },
    { platform: 'Web', sent: 200, delivered: 185, clicked: 25 }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Push Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Push Notification</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                      placeholder="Important Update Available"
                      maxLength={50}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {newNotification.title.length}/50 characters
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      value={newNotification.body}
                      onChange={(e) => setNewNotification({...newNotification, body: e.target.value})}
                      placeholder="Check out the latest features and improvements we've made for you."
                      rows={3}
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {newNotification.body.length}/200 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Target Platform</label>
                      <Select value={newNotification.target_platform} onValueChange={(value: "all" | "android" | "ios" | "web") => setNewNotification({...newNotification, target_platform: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Platforms</SelectItem>
                          <SelectItem value="android">Android</SelectItem>
                          <SelectItem value="ios">iOS</SelectItem>
                          <SelectItem value="web">Web</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Target Audience</label>
                      <Select value={newNotification.target_audience} onValueChange={(value) => setNewNotification({...newNotification, target_audience: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_users">All Users</SelectItem>
                          <SelectItem value="clients">Clients</SelectItem>
                          <SelectItem value="vendors">Vendors</SelectItem>
                          <SelectItem value="active_users">Active Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Action URL (Optional)</label>
                    <Input
                      value={newNotification.action_url}
                      onChange={(e) => setNewNotification({...newNotification, action_url: e.target.value})}
                      placeholder="https://yourapp.com/feature"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Schedule (Optional)</label>
                    <Input
                      type="datetime-local"
                      value={newNotification.scheduled_for}
                      onChange={(e) => setNewNotification({...newNotification, scheduled_for: e.target.value})}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateNotification}>
                      Create & Send
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Push Notification Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Enable Push Notifications</label>
                      <p className="text-xs text-muted-foreground">Allow sending push notifications to users</p>
                    </div>
                    <Switch
                      checked={settings.enabled}
                      onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Allow Promotional Notifications</label>
                      <p className="text-xs text-muted-foreground">Send marketing and promotional content</p>
                    </div>
                    <Switch
                      checked={settings.allow_promotional}
                      onCheckedChange={(checked) => setSettings({...settings, allow_promotional: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Enable Quiet Hours</label>
                      <p className="text-xs text-muted-foreground">Don't send notifications during quiet hours</p>
                    </div>
                    <Switch
                      checked={settings.quiet_hours_enabled}
                      onCheckedChange={(checked) => setSettings({...settings, quiet_hours_enabled: checked})}
                    />
                  </div>

                  {settings.quiet_hours_enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Quiet Hours Start</label>
                        <Input
                          type="time"
                          value={settings.quiet_hours_start}
                          onChange={(e) => setSettings({...settings, quiet_hours_start: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Quiet Hours End</label>
                        <Input
                          type="time"
                          value={settings.quiet_hours_end}
                          onChange={(e) => setSettings({...settings, quiet_hours_end: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium">Max Daily Notifications per User</label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={settings.max_daily_notifications}
                      onChange={(e) => setSettings({...settings, max_daily_notifications: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateSettings}>
                      Save Settings
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deviceStats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">Registered devices</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-info">{deviceStats?.sentToday || 0}</div>
                <p className="text-xs text-muted-foreground">Push notifications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{deviceStats?.deliveryRate || 0}%</div>
                <p className="text-xs text-muted-foreground">Successfully delivered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{deviceStats?.clickRate || 0}%</div>
                <p className="text-xs text-muted-foreground">User engagement</p>
              </CardContent>
            </Card>
          </div>

          {/* Platform Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Active devices by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {platformData.map((platform) => (
                    <div key={platform.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: platform.color }}
                      ></div>
                      <span className="text-sm">{platform.name} ({platform.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest push notifications sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pushNotifications?.slice(0, 5).map((notification, index) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded">
                      <Bell className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{notification.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{notification.body}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {notification.target_platform}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center text-muted-foreground py-8">
                      <Bell className="h-8 w-8 mx-auto mb-2" />
                      <p>No notifications sent yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {pushNotifications?.map((notification) => (
            <Card key={notification.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{notification.title}</h3>
                      <Badge variant={notification.status === 'sent' ? 'default' : 'secondary'}>
                        {notification.status}
                      </Badge>
                      <Badge variant="outline">{notification.target_platform}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{notification.body}</p>
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Target: {notification.target_audience}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Sent: {new Date(notification.created_at).toLocaleDateString()}</span>
                      </div>
                      {notification.click_count && (
                        <div>Clicks: {notification.click_count}</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || (
            <Card>
              <CardContent className="p-12 text-center">
                <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No push notifications yet</p>
                <p className="text-muted-foreground">Create your first push notification to get started</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Notification engagement by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sent" fill="hsl(var(--chart-1))" name="Sent" />
                  <Bar dataKey="delivered" fill="hsl(var(--chart-2))" name="Delivered" />
                  <Bar dataKey="clicked" fill="hsl(var(--chart-3))" name="Clicked" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['New Feature Release', 'Weekly Update', 'Special Offer'].map((title, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <span className="font-medium">{title}</span>
                      <div className="text-right">
                        <div className="font-semibold text-success">{25 - index * 3}% CTR</div>
                        <div className="text-sm text-muted-foreground">{1200 - index * 200} sent</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimal Send Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>9:00 AM - 11:00 AM</span>
                    <Badge variant="default">Highest Engagement</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>2:00 PM - 4:00 PM</span>
                    <Badge variant="secondary">Good Engagement</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>7:00 PM - 9:00 PM</span>
                    <Badge variant="secondary">Moderate Engagement</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Push Notification Configuration</CardTitle>
              <CardDescription>Manage global push notification settings and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Global Push Notifications</label>
                      <p className="text-xs text-muted-foreground">Master switch for all push notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Marketing Notifications</label>
                      <p className="text-xs text-muted-foreground">Promotional and marketing content</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">System Notifications</label>
                      <p className="text-xs text-muted-foreground">Critical system updates and alerts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Daily Notification Limit</label>
                    <Input type="number" defaultValue="5" className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Maximum notifications per user per day</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">Default Icon URL</label>
                    <Input defaultValue="/favicon.ico" className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Default icon for notifications</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Default Badge URL</label>
                    <Input defaultValue="/badge.png" className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Default badge for notifications</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Fallback Action URL</label>
                    <Input defaultValue="https://yourapp.com" className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Default URL when notification is clicked</p>
                  </div>

                  <Button className="w-full">Save Configuration</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
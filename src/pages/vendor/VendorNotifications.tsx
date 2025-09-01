import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bell, MessageSquare, DollarSign, FileText, Settings, Check, X, Archive } from "lucide-react";

export const VendorNotifications = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    new_rfqs: true,
    bid_updates: true,
    payment_alerts: true,
    messages: true,
    system_updates: false
  });

  useEffect(() => {
    if (userProfile) {
      fetchNotifications();
      loadSettings();
    }
  }, [userProfile]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userProfile?.user_id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem(`notification-settings-${userProfile?.user_id}`);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const updateSettings = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(`notification-settings-${userProfile?.user_id}`, JSON.stringify(newSettings));
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved"
    });
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userProfile?.user_id)
        .eq('read', false);
      
      if (error) throw error;
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'rfq':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const todayNotifications = notifications.filter(n => {
    const today = new Date().toDateString();
    const notifDate = new Date(n.created_at).toDateString();
    return today === notifDate;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('vendor.notifications.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('vendor.notifications.description')}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            {t('vendor.notifications.markAllRead')}
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Notifications pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayNotifications.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              New today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              All notifications
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>Your complete notification history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      !notification.read 
                        ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={notification.priority === 'high' ? 'destructive' : 'secondary'}>
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No notifications yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>Notifications that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.filter(n => !n.read).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {unreadCount === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No unread notifications
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Delivery Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Email Notifications</label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.email_notifications}
                      onCheckedChange={(checked) => updateSettings('email_notifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Push Notifications</label>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.push_notifications}
                      onCheckedChange={(checked) => updateSettings('push_notifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">SMS Notifications</label>
                      <p className="text-sm text-muted-foreground">Text message notifications</p>
                    </div>
                    <Switch
                      checked={settings.sms_notifications}
                      onCheckedChange={(checked) => updateSettings('sms_notifications', checked)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">New RFQs</label>
                      <p className="text-sm text-muted-foreground">When new RFQs match your profile</p>
                    </div>
                    <Switch
                      checked={settings.new_rfqs}
                      onCheckedChange={(checked) => updateSettings('new_rfqs', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Bid Updates</label>
                      <p className="text-sm text-muted-foreground">Status updates on your bids</p>
                    </div>
                    <Switch
                      checked={settings.bid_updates}
                      onCheckedChange={(checked) => updateSettings('bid_updates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Payment Alerts</label>
                      <p className="text-sm text-muted-foreground">Payment confirmations and reminders</p>
                    </div>
                    <Switch
                      checked={settings.payment_alerts}
                      onCheckedChange={(checked) => updateSettings('payment_alerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Messages</label>
                      <p className="text-sm text-muted-foreground">New messages from clients</p>
                    </div>
                    <Switch
                      checked={settings.messages}
                      onCheckedChange={(checked) => updateSettings('messages', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">System Updates</label>
                      <p className="text-sm text-muted-foreground">Platform updates and maintenance</p>
                    </div>
                    <Switch
                      checked={settings.system_updates}
                      onCheckedChange={(checked) => updateSettings('system_updates', checked)}
                    />
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
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
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorState } from "@/components/ui/ErrorState";
import { ResponsiveContainer } from "@/components/ui/ResponsiveContainer";
import { Bell, MessageSquare, DollarSign, FileText, Settings, Check, X, Archive } from "lucide-react";

export const VendorNotifications = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: t('common.error'),
        description: t('vendorNotifications.fetchError'),
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
      title: t('common.success'),
      description: t('vendorNotifications.settingsUpdated')
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
        title: t('common.success'),
        description: t('vendorNotifications.allMarkedRead')
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: t('common.error'),
        description: t('vendorNotifications.markReadError'),
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
      <ResponsiveContainer variant="dashboard">
        <LoadingScreen variant="notifications" />
      </ResponsiveContainer>
    );
  }

  if (error) {
    return (
      <ResponsiveContainer variant="dashboard">
        <ErrorState 
          variant="error"
          title={t('common.error')}
          description={error}
          onRetry={fetchNotifications}
          showBackButton={false}
        />
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer variant="dashboard">
      <div className="space-y-6"
           role="main"
           aria-label={t('vendorNotifications.title')}
      >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('vendorNotifications.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('vendorNotifications.description')}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            onClick={markAllAsRead}
            aria-label={`${t('vendorNotifications.markAllRead')} - ${unreadCount} notifications`}
          >
            <Check className="h-4 w-4 mr-2" />
            {t('vendorNotifications.markAllRead')}
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3" role="region" aria-label="Notification statistics">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('vendorNotifications.unread')}</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('vendorNotifications.notificationsPending')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('vendorNotifications.today')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayNotifications.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('vendorNotifications.newToday')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('vendorNotifications.total')}</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('vendorNotifications.allNotificationsCount')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4" aria-label="Notification tabs">
        <TabsList>
          <TabsTrigger value="all">{t('vendorNotifications.allNotifications')}</TabsTrigger>
          <TabsTrigger value="unread">{t('vendorNotifications.unread')} ({unreadCount})</TabsTrigger>
          <TabsTrigger value="settings">{t('vendorNotifications.settings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendorNotifications.allNotifications')}</CardTitle>
              <CardDescription>{t('vendorNotifications.notificationHistory')}</CardDescription>
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
                              aria-label={`Mark notification "${notification.title}" as read`}
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
                    {t('vendorNotifications.noNotifications')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendorNotifications.unreadNotifications')}</CardTitle>
              <CardDescription>{t('vendorNotifications.unreadDescription')}</CardDescription>
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
                          aria-label={`Mark notification "${notification.title}" as read`}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {unreadCount === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('vendorNotifications.noUnreadNotifications')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('vendorNotifications.settingsTitle')}</CardTitle>
              <CardDescription>{t('vendorNotifications.settingsDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">{t('vendorNotifications.deliveryMethods')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">{t('vendorNotifications.emailNotifications')}</label>
                      <p className="text-sm text-muted-foreground">{t('vendorNotifications.emailDescription')}</p>
                    </div>
                    <Switch
                      checked={settings.email_notifications}
                      onCheckedChange={(checked) => updateSettings('email_notifications', checked)}
                      aria-describedby="email-notifications-desc"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium" id="push-notifications-label">{t('vendorNotifications.pushNotifications')}</label>
                      <p className="text-sm text-muted-foreground" id="push-notifications-desc">{t('vendorNotifications.pushDescription')}</p>
                    </div>
                    <Switch
                      checked={settings.push_notifications}
                      onCheckedChange={(checked) => updateSettings('push_notifications', checked)}
                      aria-describedby="push-notifications-desc"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium" id="sms-notifications-label">{t('vendorNotifications.smsNotifications')}</label>
                      <p className="text-sm text-muted-foreground" id="sms-notifications-desc">{t('vendorNotifications.smsDescription')}</p>
                    </div>
                    <Switch
                      checked={settings.sms_notifications}
                      onCheckedChange={(checked) => updateSettings('sms_notifications', checked)}
                      aria-describedby="sms-notifications-desc"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">{t('vendorNotifications.notificationTypes')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">{t('vendorNotifications.newRfqs')}</label>
                      <p className="text-sm text-muted-foreground">{t('vendorNotifications.newRfqsDescription')}</p>
                    </div>
                    <Switch
                      checked={settings.new_rfqs}
                      onCheckedChange={(checked) => updateSettings('new_rfqs', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">{t('vendorNotifications.bidUpdates')}</label>
                      <p className="text-sm text-muted-foreground">{t('vendorNotifications.bidUpdatesDescription')}</p>
                    </div>
                    <Switch
                      checked={settings.bid_updates}
                      onCheckedChange={(checked) => updateSettings('bid_updates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">{t('vendorNotifications.paymentAlerts')}</label>
                      <p className="text-sm text-muted-foreground">{t('vendorNotifications.paymentAlertsDescription')}</p>
                    </div>
                    <Switch
                      checked={settings.payment_alerts}
                      onCheckedChange={(checked) => updateSettings('payment_alerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">{t('vendorNotifications.messages')}</label>
                      <p className="text-sm text-muted-foreground">{t('vendorNotifications.messagesDescription')}</p>
                    </div>
                    <Switch
                      checked={settings.messages}
                      onCheckedChange={(checked) => updateSettings('messages', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">{t('vendorNotifications.systemUpdates')}</label>
                      <p className="text-sm text-muted-foreground">{t('vendorNotifications.systemUpdatesDescription')}</p>
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
    </ResponsiveContainer>
  );
};
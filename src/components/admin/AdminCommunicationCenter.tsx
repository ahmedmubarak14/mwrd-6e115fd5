import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Mail, 
  Bell,
  Megaphone,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  read: boolean;
  created_at: string;
  user_profiles?: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface BroadcastMessage {
  id: string;
  title: string;
  message: string;
  target_audience: string;
  priority: string;
  status: string;
  sent_at?: string;
  recipients_count: number;
  opened_count: number;
}

export const AdminCommunicationCenter = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [newBroadcast, setNewBroadcast] = useState({
    title: '',
    message: '',
    target_audience: 'all_users',
    priority: 'medium'
  });

  const audienceTypes = [
    { value: 'all_users', label: t('admin.communication.allUsers') },
    { value: 'clients', label: t('admin.communication.clientsOnly') },
    { value: 'vendors', label: t('admin.communication.vendorsOnly') },
    { value: 'pending_verification', label: t('admin.communication.pendingVerification') },
    { value: 'inactive_users', label: t('admin.communication.inactiveUsers') }
  ];

  const priorityTypes = [
    { value: 'low', label: t('admin.communication.lowPriority') },
    { value: 'medium', label: t('admin.communication.mediumPriority') },
    { value: 'high', label: t('admin.communication.highPriority') },
    { value: 'urgent', label: t('admin.communication.urgentPriority') }
  ];

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          user_profiles (
            full_name,
            email,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchBroadcasts = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform to broadcast format
      const broadcastData: BroadcastMessage[] = data?.map(campaign => ({
        id: campaign.id,
        title: campaign.name,
        message: campaign.subject,
        target_audience: campaign.target_audience,
        priority: 'medium', // Default as campaigns don't have priority
        status: campaign.status,
        sent_at: campaign.sent_at,
        recipients_count: campaign.recipients_count || 0,
        opened_count: campaign.opened_count || 0
      })) || [];

      setBroadcasts(broadcastData);
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
    }
  };

  const sendBroadcastMessage = async () => {
    try {
      // Get current user for created_by
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create email campaign
      const { error } = await supabase
        .from('email_campaigns')
        .insert({
          name: newBroadcast.title,
          subject: newBroadcast.title,
          target_audience: newBroadcast.target_audience,
          status: 'draft',
          created_by: user.id
        });

      if (error) throw error;

      // Reset form
      setNewBroadcast({
        title: '',
        message: '',
        target_audience: 'all_users',
        priority: 'medium'
      });

      await fetchBroadcasts();

      toast({
        title: t('admin.communication.success'),
        description: t('admin.communication.broadcastCreated'),
        variant: 'default'
      });
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast({
        title: t('admin.communication.error'),
        description: t('admin.communication.broadcastFailed'),
        variant: 'destructive'
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));

      toast({
        title: t('admin.communication.success'),
        description: t('admin.communication.allMarkedRead'),
        variant: 'default'
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchNotifications(), fetchBroadcasts()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">{t('admin.communication.urgent')}</Badge>;
      case 'high':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">{t('admin.communication.high')}</Badge>;
      case 'medium':
        return <Badge variant="outline">{t('admin.communication.medium')}</Badge>;
      case 'low':
        return <Badge variant="secondary">{t('admin.communication.low')}</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-success text-success-foreground">{t('admin.communication.sent')}</Badge>;
      case 'draft':
        return <Badge variant="secondary">{t('admin.communication.draft')}</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="border-blue-200 text-blue-800">{t('admin.communication.scheduled')}</Badge>;
      case 'failed':
        return <Badge variant="destructive">{t('admin.communication.failed')}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12">{t('admin.communication.loadingCenter')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            {t('admin.communication.center')}
          </h2>
          <p className="text-muted-foreground">
            {t('admin.communication.centerDescription')}
          </p>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">{t('admin.communication.notifications')}</TabsTrigger>
          <TabsTrigger value="broadcast">{t('admin.communication.broadcastMessages')}</TabsTrigger>
          <TabsTrigger value="templates">{t('admin.communication.emailTemplates')}</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Notifications Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{t('admin.communication.totalSent')}</span>
                </div>
                <p className="text-2xl font-bold mt-1">{notifications.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">{t('admin.communication.unread')}</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {notifications.filter(n => !n.read).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">{t('admin.communication.activeUsers')}</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {new Set(notifications.map(n => n.user_id)).size}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('admin.communication.readRate')}</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {notifications.length > 0 ? 
                    Math.round((notifications.filter(n => n.read).length / notifications.length) * 100) : 0
                  }%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('admin.communication.searchNotifications')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admin.communication.allTypes')}</SelectItem>
                    <SelectItem value="offer_received">{t('admin.communication.offerReceived')}</SelectItem>
                    <SelectItem value="request_created">{t('admin.communication.requestCreated')}</SelectItem>
                    <SelectItem value="order_update">{t('admin.communication.orderUpdate')}</SelectItem>
                    <SelectItem value="system">{t('admin.communication.system')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={markAllAsRead} variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('admin.communication.markAllRead')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card key={notification.id} className={cn(
                "transition-all hover:shadow-md",
                !notification.read && "bg-primary/5 border-primary/20"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.user_profiles?.avatar_url} />
                      <AvatarFallback>
                        {notification.user_profiles?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium truncate">{notification.title}</h4>
                        <div className="flex items-center gap-2 ml-4">
                          {getPriorityBadge(notification.priority)}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {notification.user_profiles?.full_name || t('admin.communication.unknownUser')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {notification.user_profiles?.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {notification.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">{t('admin.communication.noNotificationsFound')}</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterType !== 'all' ? 
                      t('admin.communication.adjustSearchCriteria') : 
                      t('admin.communication.notificationsWillAppear')
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-4">
          {/* Broadcast Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                {t('admin.communication.sendBroadcastMessage')}
              </CardTitle>
              <CardDescription>
                {t('admin.communication.sendMessageToGroups')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('admin.communication.messageTitle')}</Label>
                  <Input
                    id="title"
                    value={newBroadcast.title}
                    onChange={(e) => setNewBroadcast(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={t('admin.communication.titlePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audience">{t('admin.communication.targetAudience')}</Label>
                  <Select
                    value={newBroadcast.target_audience}
                    onValueChange={(value) => setNewBroadcast(prev => ({ ...prev, target_audience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audienceTypes.map(audience => (
                        <SelectItem key={audience.value} value={audience.value}>
                          {audience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">{t('admin.communication.messageContent')}</Label>
                <Textarea
                  id="message"
                  value={newBroadcast.message}
                  onChange={(e) => setNewBroadcast(prev => ({ ...prev, message: e.target.value }))}
                  placeholder={t('admin.communication.messagePlaceholder')}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">{t('admin.communication.priorityLevel')}</Label>
                <Select
                  value={newBroadcast.priority}
                  onValueChange={(value) => setNewBroadcast(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityTypes.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={sendBroadcastMessage}>
                <Send className="h-4 w-4 mr-2" />
                {t('admin.communication.sendMessage')}
              </Button>
            </CardContent>
          </Card>

          {/* Broadcast History */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.communication.recentBroadcasts')}</CardTitle>
              <CardDescription>
                {t('admin.communication.broadcastHistory')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {broadcasts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Megaphone className="h-8 w-8 mx-auto mb-2" />
                  <p>{t('admin.communication.noBroadcastsYet')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {broadcasts.map((broadcast) => (
                    <div key={broadcast.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{broadcast.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          To: {broadcast.target_audience.replace('_', ' ')} • 
                          Recipients: {broadcast.recipients_count} • 
                          Opened: {broadcast.opened_count}
                        </p>
                        {broadcast.sent_at && (
                          <p className="text-xs text-muted-foreground">
                            Sent: {new Date(broadcast.sent_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(broadcast.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.communication.templateLibrary')}</CardTitle>
              <CardDescription>
                {t('admin.communication.manageEmailTemplates')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4" />
                <p>{t('admin.communication.noTemplatesYet')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
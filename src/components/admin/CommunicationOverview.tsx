import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  MessageSquare, 
  Bell, 
  Mail, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useRealTimeChat } from "@/hooks/useRealTimeChat";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CommunicationMetrics {
  totalMessages: number;
  totalNotifications: number;
  activeConversations: number;
  unreadMessages: number;
  notificationsSentToday: number;
  averageResponseTime: number;
}

export const CommunicationOverview = () => {
  const { conversations, loading: chatLoading } = useRealTimeChat();
  const { notifications, loading: notificationLoading } = useNotifications();
  const { user } = useAuth();
  const { t } = useOptionalLanguage();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<CommunicationMetrics>({
    totalMessages: 0,
    totalNotifications: 0,
    activeConversations: 0,
    unreadMessages: 0,
    notificationsSentToday: 0,
    averageResponseTime: 0
  });
  const [messageActivityData, setMessageActivityData] = useState<any[]>([]);
  const [channelUsageData, setChannelUsageData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSendAnnouncement = async () => {
    try {
      const { error } = await supabase
        .from('push_notifications')
        .insert({
          title: t('admin.communication.announcement'),
          message: t('admin.communication.announcementMessage'),
          target_audience: 'all_users',
          created_by: user?.id,
          status: 'sent',
          sent_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success(t('admin.communication.announcementSent'));
    } catch (error) {
      toast.error(t('admin.communication.announcementError'));
    }
  };

  const handleCreateEmailCampaign = () => {
    // Navigate to email campaign manager with new campaign state
    navigate('/admin/communications?tab=email&action=create');
  };

  const handleViewAllChats = () => {
    navigate('/admin/communications?tab=chat');
  };

  const handleUserEngagementReport = async () => {
    try {
      // Generate a basic engagement report
      const reportData = {
        totalUsers: metrics.activeConversations,
        totalMessages: metrics.totalMessages,
        avgResponseTime: metrics.averageResponseTime,
        generatedAt: new Date().toISOString()
      };
      
      // Create a simple CSV download
      const csvContent = `${t('admin.communication.userEngagementReportTitle')}
${t('admin.communication.generated')}: ${new Date().toLocaleString()}
${t('admin.communication.totalActiveUsers')}: ${reportData.totalUsers}
${t('admin.communication.totalMessagesLabel')}: ${reportData.totalMessages}
${t('admin.communication.averageResponseTimeLabel')}: ${reportData.avgResponseTime} ${t('admin.communication.minutes')}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `engagement_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success(t('admin.communication.reportGenerated'));
    } catch (error) {
      toast.error(t('admin.communication.reportError'));
    }
  };

  const fetchMetrics = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);

      // Fetch real communication data from database
      const [messagesResponse, notificationsResponse] = await Promise.all([
        supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000),
        supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000)
      ]);

      const messagesData = messagesResponse.data || [];
      const notificationCount = { count: notificationsResponse.data?.length || 0 };

      // Calculate real message activity data based on actual messages
      const messageActivityData = [];
      for (let hour = 0; hour < 24; hour += 4) {
        const hourStart = new Date();
        hourStart.setHours(hour, 0, 0, 0);
        const hourEnd = new Date();
        hourEnd.setHours(hour + 4, 0, 0, 0);
        
        const hourMessages = messagesData?.filter(m => {
          const msgTime = new Date(m.created_at);
          return msgTime >= hourStart && msgTime < hourEnd;
        }).length || 0;
        
        const hourNotifications = notifications?.filter(n => {
          const notifTime = new Date(n.created_at);
          return notifTime >= hourStart && notifTime < hourEnd;
        }).length || 0;
        
        messageActivityData.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          messages: hourMessages,
          notifications: hourNotifications
        });
      }

      // Calculate real channel usage data
      const emailNotifications = notifications?.filter(n => n.type === 'email').length || 0;
      const pushNotifications = notifications?.filter(n => n.type === 'push_notification').length || 0;
      const chatMessages = messagesData?.filter(m => m.message_type === 'text').length || 0;
      const smsNotifications = notifications?.filter(n => n.type === 'sms').length || 0;

      const channelUsageData = [
        { channel: t('admin.communication.inAppChat'), count: chatMessages, color: '#8B5CF6' },
        { channel: t('admin.communication.email'), count: emailNotifications, color: '#06B6D4' },
        { channel: t('admin.communication.pushNotifications'), count: pushNotifications, color: '#10B981' },
        { channel: t('admin.communication.sms'), count: smsNotifications, color: '#F59E0B' }
      ];

      setMessageActivityData(messageActivityData);
      setChannelUsageData(channelUsageData);

      // Calculate active conversations (those with activity in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const activeConversations = conversations?.filter(conv => 
        new Date(conv.last_message_at || conv.created_at) >= sevenDaysAgo
      ).length || 0;

      // Calculate unread messages (check read property safely)
      const unreadMessages = notifications?.filter(n => !(n as any).read).length || 0;

      // Get today's notifications
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const notificationsSentToday = notifications?.filter(n => 
        new Date(n.created_at) >= today
      ).length || 0;

      // Calculate average response time from message threads
      const activeConvos = conversations?.filter(conv => 
        conv.last_message_at && conv.created_at
      ) || [];
      
      const avgResponseTime = activeConvos.length > 0
        ? Math.round(activeConvos.reduce((sum, conv) => {
            const timeDiff = new Date(conv.last_message_at).getTime() - new Date(conv.created_at).getTime();
            return sum + (timeDiff / (1000 * 60)); // Convert to minutes
          }, 0) / activeConvos.length)
        : 0;

      setMetrics({
        totalMessages: messagesData?.length || 0,
        totalNotifications: notificationCount?.count || 0,
        activeConversations,
        unreadMessages,
        notificationsSentToday,
        averageResponseTime: avgResponseTime
      });

    } catch (error) {
      console.error('Error fetching communication metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [user, conversations, notifications]);

  if (isLoading || chatLoading || notificationLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner label={t('admin.communication.loadingOverview')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.communication.overview')}</h2>
          <p className="text-muted-foreground">{t('admin.communication.overviewDescription')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span>{t('admin.communication.liveData')}</span>
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.communication.totalMessages')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{metrics.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t('admin.communication.allTime')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.communication.activeConversations')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{metrics.activeConversations}</div>
            <p className="text-xs text-muted-foreground">{t('admin.communication.lastSevenDays')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.communication.notificationsToday')}</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{metrics.notificationsSentToday}</div>
            <p className="text-xs text-muted-foreground">{t('admin.communication.todaysTotal')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.communication.avgResponseTime')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{metrics.averageResponseTime}m</div>
            <p className="text-xs text-muted-foreground">{t('admin.communication.averageResponse')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>{t('admin.communication.messageActivity')}</span>
            </CardTitle>
            <CardDescription>{t('admin.communication.messageActivityDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={messageActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="messages" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="notifications" stroke="hsl(var(--secondary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>{t('admin.communication.communicationChannels')}</span>
            </CardTitle>
            <CardDescription>{t('admin.communication.usageByMethod')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={channelUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>{t('admin.communication.recentActivity')}</span>
          </CardTitle>
          <CardDescription>{t('admin.communication.latestEvents')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversations?.slice(0, 4).map((conv, index) => (
              <div key={conv.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-card/50">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    {t('admin.communication.conversation')} {conv.conversation_type === 'support' ? t('admin.communication.support') : t('admin.communication.business')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {conv.last_message ? conv.last_message.slice(0, 60) + '...' : t('admin.communication.noRecentMessage')}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                     {conv.last_message_at 
                       ? new Date(conv.last_message_at).toLocaleString()
                       : t('admin.communication.noActivity')
                     }
                  </span>
                </div>
              </div>
            ))}
            {(!conversations || conversations.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('admin.communication.noRecentActivity')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3">
        <Button 
          variant="default" 
          className="w-full lg:w-auto"
          onClick={handleSendAnnouncement}
        >
          <Bell className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{t('admin.communication.sendAnnouncement')}</span>
          <span className="sm:hidden">{t('admin.communication.announce')}</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full lg:w-auto"
          onClick={handleCreateEmailCampaign}
        >
          <Mail className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{t('admin.communication.createEmailCampaign')}</span>
          <span className="sm:hidden">{t('admin.communication.email')}</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full lg:w-auto"
          onClick={handleViewAllChats}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{t('admin.communication.viewAllChats')}</span>
          <span className="sm:hidden">{t('admin.communication.chats')}</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full lg:w-auto"
          onClick={handleUserEngagementReport}
        >
          <Users className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{t('admin.communication.userEngagementReport')}</span>
          <span className="sm:hidden">{t('admin.communication.report')}</span>
        </Button>
      </div>
    </div>
  );
};
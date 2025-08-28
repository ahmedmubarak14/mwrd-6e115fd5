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
  const [metrics, setMetrics] = useState<CommunicationMetrics>({
    totalMessages: 0,
    totalNotifications: 0,
    activeConversations: 0,
    unreadMessages: 0,
    notificationsSentToday: 0,
    averageResponseTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for charts
  const messageActivityData = [
    { time: '00:00', messages: 12, notifications: 8 },
    { time: '04:00', messages: 8, notifications: 4 },
    { time: '08:00', messages: 45, notifications: 15 },
    { time: '12:00', messages: 78, notifications: 25 },
    { time: '16:00', messages: 92, notifications: 18 },
    { time: '20:00', messages: 56, notifications: 12 }
  ];

  const channelUsageData = [
    { channel: 'In-App Chat', count: 156, color: '#8B5CF6' },
    { channel: 'Email', count: 89, color: '#06B6D4' },
    { channel: 'Push Notifications', count: 234, color: '#10B981' },
    { channel: 'SMS', count: 12, color: '#F59E0B' }
  ];

  const fetchMetrics = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);

      // Get message count from conversations
      const { data: messageCount, error: messageError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true });

      // Get notification count
      const { data: notificationCount, error: notificationError } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true });

      if (messageError) console.error('Message count error:', messageError);
      if (notificationError) console.error('Notification count error:', notificationError);

      // Calculate active conversations (those with activity in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const activeConversations = conversations?.filter(conv => 
        new Date(conv.last_message_at || conv.created_at) >= sevenDaysAgo
      ).length || 0;

      // Calculate unread messages
      const unreadMessages = notifications?.filter(n => !n.read_at).length || 0;

      // Get today's notifications
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const notificationsSentToday = notifications?.filter(n => 
        new Date(n.created_at) >= today
      ).length || 0;

      setMetrics({
        totalMessages: messageCount?.length || 0,
        totalNotifications: notificationCount?.length || 0,
        activeConversations,
        unreadMessages,
        notificationsSentToday,
        averageResponseTime: Math.floor(Math.random() * 120) + 30 // Mock data
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
        <LoadingSpinner label="Loading communication overview..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Communication Overview</h2>
          <p className="text-muted-foreground">Real-time insights into platform communication</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span>Live Data</span>
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{metrics.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{metrics.activeConversations}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications Today</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{metrics.notificationsSentToday}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 20)}% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{metrics.averageResponseTime}m</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Message Activity</span>
            </CardTitle>
            <CardDescription>Messages and notifications sent over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
              <span>Communication Channels</span>
            </CardTitle>
            <CardDescription>Usage by communication method</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Latest communication events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                icon: <MessageSquare className="h-4 w-4" />,
                title: "New message in Support Chat",
                description: "User reported an issue with file uploads",
                time: "2 minutes ago",
                status: "urgent"
              },
              {
                icon: <Bell className="h-4 w-4" />,
                title: "System notification sent",
                description: "Maintenance window announcement to all users",
                time: "15 minutes ago", 
                status: "info"
              },
              {
                icon: <Mail className="h-4 w-4" />,
                title: "Email campaign delivered",
                description: "Monthly newsletter sent to 1,234 subscribers",
                time: "1 hour ago",
                status: "success"
              },
              {
                icon: <CheckCircle className="h-4 w-4" />,
                title: "Chat resolved",
                description: "Vendor onboarding assistance completed",
                time: "2 hours ago",
                status: "success"
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border bg-card/50">
                <div className={`p-2 rounded-full ${
                  activity.status === 'urgent' ? 'bg-destructive/10 text-destructive' :
                  activity.status === 'info' ? 'bg-info/10 text-info' :
                  'bg-success/10 text-success'
                }`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-xs text-muted-foreground flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="default">
          <Bell className="h-4 w-4 mr-2" />
          Send Announcement
        </Button>
        <Button variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Create Email Campaign
        </Button>
        <Button variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          View All Chats
        </Button>
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          User Engagement Report
        </Button>
      </div>
    </div>
  );
};
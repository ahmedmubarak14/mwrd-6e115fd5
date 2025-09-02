import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { formatDistanceToNow } from "date-fns";
import { 
  Bell, 
  Check, 
  X, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock,
  DollarSign,
  FileText,
  Users,
  Star,
  Settings,
  Filter,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: 'offer_accepted' | 'new_request' | 'payment_received' | 'message' | 'system' | 'rating';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: any;
}

export const VendorNotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useRealTimeNotifications();
  const { t, isRTL } = useLanguage();

  // Mock notifications for demo
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'offer_accepted',
      title: t('vendor.notifications.offerAccepted'),
      message: t('vendor.notifications.sampleMessage1') || 'Your offer for Construction Project Alpha has been accepted!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      priority: 'high',
      actionUrl: '/vendor/offers/1'
    },
    {
      id: '2',
      type: 'new_request',
      title: t('vendor.notifications.newRequest'),
      message: t('vendor.notifications.sampleMessage2') || 'New procurement request matching your expertise in Engineering',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      priority: 'medium',
      actionUrl: '/vendor/requests/2'
    },
    {
      id: '3',
      type: 'payment_received',
      title: t('vendor.notifications.paymentReceived'),
      message: t('vendor.notifications.sampleMessage3') || 'Payment of $15,000 received for Project Beta',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      priority: 'high',
      actionUrl: '/vendor/transactions/3'
    },
    {
      id: '4',
      type: 'message',
      title: t('vendor.notifications.newMessage'),
      message: t('vendor.notifications.sampleMessage4') || 'You have 3 new messages from clients',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: true,
      priority: 'medium',
      actionUrl: '/vendor/messages'
    },
    {
      id: '5',
      type: 'rating',
      title: t('vendor.notifications.newRating'),
      message: t('vendor.notifications.sampleMessage5') || 'You received a 5-star rating from ABC Construction',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      read: true,
      priority: 'low',
      actionUrl: '/vendor/reviews/5'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer_accepted':
        return CheckCircle;
      case 'new_request':
        return FileText;
      case 'payment_received':
        return DollarSign;
      case 'message':
        return Users;
      case 'rating':
        return Star;
      case 'system':
        return Settings;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'hsl(var(--destructive))';
    if (priority === 'medium') return 'hsl(var(--warning))';
    switch (type) {
      case 'offer_accepted':
        return 'hsl(var(--success))';
      case 'payment_received':
        return 'hsl(var(--success))';
      case 'rating':
        return 'hsl(var(--primary))';
      default:
        return 'hsl(var(--muted-foreground))';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const filteredNotifications = mockNotifications.filter(notification => {
    if (activeTab !== 'all' && activeTab !== notification.type) return false;
    if (filterPriority !== 'all' && filterPriority !== notification.priority) return false;
    return true;
  });

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
                variant="destructive"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {t('vendor.notifications.title')}
            </h1>
            <p className="text-muted-foreground">
                                   {unreadCount > 0 
                                     ? t('vendor.notifications.unreadCount').replace('{count}', unreadCount.toString()) || `${unreadCount} unread notifications`
                                     : t('vendor.notifications.allRead') || 'All notifications read'
                                   }
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                {t('common.filter')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem 
                onClick={() => setFilterPriority('all')}
                className={filterPriority === 'all' ? 'bg-accent' : ''}
              >
                {t('common.all')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilterPriority('high')}
                className={filterPriority === 'high' ? 'bg-accent' : ''}
              >
                {t('vendor.notifications.highPriority')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilterPriority('medium')}
                className={filterPriority === 'medium' ? 'bg-accent' : ''}
              >
                {t('vendor.notifications.mediumPriority')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilterPriority('low')}
                className={filterPriority === 'low' ? 'bg-accent' : ''}
              >
                {t('vendor.notifications.lowPriority')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {unreadCount > 0 && (
            <Button onClick={() => {}} size="sm">
              <Check className="w-4 h-4 mr-2" />
              {t('vendor.notifications.markAllRead')}
            </Button>
          )}
        </div>
      </div>

      {/* Notification Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="relative">
            {t('common.all')}
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="offer_accepted">
            {t('vendor.notifications.offers')}
          </TabsTrigger>
          <TabsTrigger value="new_request">
            {t('vendor.notifications.requests')}
          </TabsTrigger>
          <TabsTrigger value="payment_received">
            {t('vendor.notifications.payments')}
          </TabsTrigger>
          <TabsTrigger value="message">
            {t('vendor.notifications.messages')}
          </TabsTrigger>
          <TabsTrigger value="system">
            {t('vendor.notifications.system')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {t('vendor.notifications.noNotifications')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('vendor.notifications.noNotificationsDesc')}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      const iconColor = getNotificationColor(notification.type, notification.priority);
                      
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-muted/20 transition-colors ${
                            !notification.read ? 'bg-accent/10 border-l-4 border-l-primary' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div 
                              className="p-2 rounded-full"
                              style={{ backgroundColor: `${iconColor}20` }}
                            >
                              <Icon 
                                className="w-4 h-4" 
                                style={{ color: iconColor }}
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className={`text-sm font-medium ${
                                      !notification.read ? 'text-foreground' : 'text-muted-foreground'
                                    }`}>
                                      {notification.title}
                                    </h4>
                                    <Badge 
                                      variant={getPriorityBadgeVariant(notification.priority)}
                                      className="text-xs"
                                    >
                                      {t(`vendor.notifications.${notification.priority}Priority`)}
                                    </Badge>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-primary rounded-full" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {notification.message}
                                  </p>
                                   <p className="text-xs text-muted-foreground">
                                     {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                   </p>
                                </div>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {!notification.read && (
                                      <DropdownMenuItem onClick={() => {}}>
                                        <Check className="w-4 h-4 mr-2" />
                                        {t('vendor.notifications.markRead')}
                                      </DropdownMenuItem>
                                    )}
                                    {notification.actionUrl && (
                                      <DropdownMenuItem onClick={() => {}}>
                                        <FileText className="w-4 h-4 mr-2" />
                                        {t('vendor.notifications.viewDetails')}
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => {}}>
                                      <X className="w-4 h-4 mr-2" />
                                      {t('vendor.notifications.delete')}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                          
                          {notification.actionUrl && (
                            <div className="mt-3 ml-12">
                              <Button variant="outline" size="sm">
                                {t('vendor.notifications.viewDetails')}
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
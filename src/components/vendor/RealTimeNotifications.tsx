import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Bell, BellRing, CheckCircle, AlertCircle, Info, MessageSquare, 
  Package, DollarSign, Clock, X, Eye, MoreHorizontal, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, SheetContent, SheetDescription, SheetHeader, 
  SheetTitle, SheetTrigger 
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOptimizedFormatters } from '@/hooks/usePerformanceOptimization';
import { cn } from '@/lib/utils';

// Notification types
type NotificationType = 'message' | 'order' | 'payment' | 'system' | 'update';
type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  data?: Record<string, any>;
  expiresAt?: Date;
}

interface NotificationSettings {
  messages: boolean;
  orders: boolean;
  payments: boolean;
  system: boolean;
  updates: boolean;
  soundEnabled: boolean;
  pushEnabled: boolean;
}

// Mock notifications for demonstration
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    priority: 'high',
    title: 'New Message from Ahmed Al-Rashid',
    message: 'Client has sent you a message regarding the office building project.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
    actionUrl: '/vendor/messages/1',
    actionLabel: 'Reply'
  },
  {
    id: '2',
    type: 'order',
    priority: 'medium',
    title: 'New Order Received',
    message: 'Villa renovation project in Jeddah - SAR 75,000',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
    actionUrl: '/vendor/orders/2',
    actionLabel: 'View Order'
  },
  {
    id: '3',
    type: 'payment',
    priority: 'high',
    title: 'Payment Received',
    message: 'You received SAR 25,000 for Mall Maintenance project',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: true,
    actionUrl: '/vendor/payments',
    actionLabel: 'View Payment'
  },
  {
    id: '4',
    type: 'system',
    priority: 'medium',
    title: 'Profile Update Required',
    message: 'Please update your CR documentation to maintain verified status.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: false,
    actionUrl: '/vendor/profile',
    actionLabel: 'Update Profile'
  },
  {
    id: '5',
    type: 'update',
    priority: 'low',
    title: 'New Feature Available',
    message: 'Check out our new project management tools in your dashboard.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    actionUrl: '/vendor/dashboard',
    actionLabel: 'Explore'
  }
];

// Notification type configuration
const notificationConfig: Record<NotificationType, {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  label: string;
}> = {
  message: {
    icon: MessageSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Message'
  },
  order: {
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Order'
  },
  payment: {
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    label: 'Payment'
  },
  system: {
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'System'
  },
  update: {
    icon: Info,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Update'
  }
};

// Notification priority configuration
const priorityConfig: Record<NotificationPriority, {
  color: string;
  label: string;
}> = {
  low: { color: 'bg-gray-500', label: 'Low' },
  medium: { color: 'bg-blue-500', label: 'Medium' },
  high: { color: 'bg-orange-500', label: 'High' },
  urgent: { color: 'bg-red-500', label: 'Urgent' }
};

// Individual Notification Component
const NotificationItem = React.memo<{
  notification: Notification;
  onRead: (id: string) => void;
  onAction: (notification: Notification) => void;
  onDelete: (id: string) => void;
}>(({ notification, onRead, onAction, onDelete }) => {
  const { formatRelativeTime } = useOptimizedFormatters();
  const config = notificationConfig[notification.type];
  const priority = priorityConfig[notification.priority];
  const Icon = config.icon;

  const handleMarkAsRead = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      onRead(notification.id);
    }
  }, [notification.id, notification.isRead, onRead]);

  const handleAction = useCallback(() => {
    if (notification.actionUrl) {
      onAction(notification);
    }
    if (!notification.isRead) {
      onRead(notification.id);
    }
  }, [notification, onAction, onRead]);

  return (
    <div 
      className={cn(
        "group relative p-4 border-b border-muted hover:bg-muted/50 transition-colors cursor-pointer",
        !notification.isRead && "bg-primary/5 border-l-4 border-l-primary"
      )}
      onClick={handleAction}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn("p-2 rounded-full shrink-0", config.bgColor)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={cn(
                "font-medium text-sm leading-5",
                !notification.isRead && "font-semibold"
              )}>
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 leading-5">
                {notification.message}
              </p>
            </div>

            {/* Priority indicator */}
            <div className={cn(
              "w-2 h-2 rounded-full shrink-0 mt-2",
              priority.color
            )} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {config.label}
              </Badge>
              <span>{formatRelativeTime(notification.timestamp)}</span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.isRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMarkAsRead}
                  className="h-6 w-6 p-0"
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!notification.isRead && (
                    <DropdownMenuItem onClick={() => onRead(notification.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Read
                    </DropdownMenuItem>
                  )}
                  {notification.actionUrl && (
                    <DropdownMenuItem onClick={() => onAction(notification)}>
                      <Eye className="h-4 w-4 mr-2" />
                      {notification.actionLabel || 'View'}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(notification.id)}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';

// Notification Settings Component
const NotificationSettings = React.memo<{
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}>(({ settings, onSettingsChange }) => {
  const handleToggle = useCallback((key: keyof NotificationSettings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key]
    });
  }, [settings, onSettingsChange]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Notification Types</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">Messages</div>
              <div className="text-sm text-muted-foreground">
                Client messages and communications
              </div>
            </div>
            <Switch
              checked={settings.messages}
              onCheckedChange={() => handleToggle('messages')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">Orders</div>
              <div className="text-sm text-muted-foreground">
                New orders and order updates
              </div>
            </div>
            <Switch
              checked={settings.orders}
              onCheckedChange={() => handleToggle('orders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">Payments</div>
              <div className="text-sm text-muted-foreground">
                Payment confirmations and receipts
              </div>
            </div>
            <Switch
              checked={settings.payments}
              onCheckedChange={() => handleToggle('payments')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">System</div>
              <div className="text-sm text-muted-foreground">
                Account and system notifications
              </div>
            </div>
            <Switch
              checked={settings.system}
              onCheckedChange={() => handleToggle('system')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">Updates</div>
              <div className="text-sm text-muted-foreground">
                Feature updates and announcements
              </div>
            </div>
            <Switch
              checked={settings.updates}
              onCheckedChange={() => handleToggle('updates')}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Delivery Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">Sound</div>
              <div className="text-sm text-muted-foreground">
                Play sound for notifications
              </div>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={() => handleToggle('soundEnabled')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">Push Notifications</div>
              <div className="text-sm text-muted-foreground">
                Receive push notifications on your device
              </div>
            </div>
            <Switch
              checked={settings.pushEnabled}
              onCheckedChange={() => handleToggle('pushEnabled')}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

NotificationSettings.displayName = 'NotificationSettings';

export const RealTimeNotifications: React.FC = () => {
  const { isRTL } = useLanguage();
  
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>({
    messages: true,
    orders: true,
    payments: true,
    system: true,
    updates: false,
    soundEnabled: true,
    pushEnabled: true
  });
  const [isOpen, setIsOpen] = useState(false);

  // Computed values
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.isRead).length
  , [notifications]);

  const sortedNotifications = useMemo(() =>
    notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  , [notifications]);

  // Handlers
  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  }, []);

  const handleDeleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleNotificationAction = useCallback((notification: Notification) => {
    if (notification.actionUrl) {
      // Navigate to the action URL
      console.log('Navigate to:', notification.actionUrl);
      setIsOpen(false);
    }
  }, []);

  const handleClearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving a new notification occasionally
      if (Math.random() > 0.97) { // ~3% chance every second
        const newNotification: Notification = {
          id: `${Date.now()}`,
          type: 'message',
          priority: 'medium',
          title: 'New Activity',
          message: 'You have new activity on your account',
          timestamp: new Date(),
          isRead: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        // Play sound if enabled
        if (settings.soundEnabled) {
          // Play notification sound (would be actual audio in real app)
          console.log('🔔 Notification sound');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.soundEnabled]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side={isRTL ? "left" : "right"} 
        className="w-full sm:w-96 p-0"
      >
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription>
                {unreadCount > 0 
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'
                }
              </SheetDescription>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClearAll} disabled={notifications.length === 0}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          {sortedNotifications.length > 0 ? (
            <div className="divide-y">
              {sortedNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={handleMarkAsRead}
                  onAction={handleNotificationAction}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Settings Panel */}
        <div className="border-t p-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:w-96">
              <SheetHeader>
                <SheetTitle>Notification Settings</SheetTitle>
                <SheetDescription>
                  Customize your notification preferences
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <NotificationSettings
                  settings={settings}
                  onSettingsChange={setSettings}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </SheetContent>
    </Sheet>
  );
};
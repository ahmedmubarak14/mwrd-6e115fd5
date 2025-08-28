import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, CheckCircle, AlertCircle, Info, Star, Package, FileText, Users } from "lucide-react";
import { format } from "date-fns";

interface NotificationsModalProps {
  children: React.ReactNode;
}

export const NotificationsModal = ({ children }: NotificationsModalProps) => {
  const [open, setOpen] = useState(false);
  const languageContext = useOptionalLanguage();
  const language = languageContext?.language || 'en';
  const { toast } = useToast();
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const isRTL = language === 'ar';
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer':
      case 'offer_status':
        return Package;
      case 'request':
      case 'request_approval':
        return FileText;
      case 'rating':
        return Star;
      case 'user':
        return Users;
      default:
        return Info;
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast({
      title: isRTL ? "تم تحديد الكل كمقروء" : "All Notifications Marked as Read",
      description: isRTL ? "تم وضع علامة قراءة على جميع الإشعارات" : "All notifications have been marked as read",
    });
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read_at) {
      await markAsRead(notification.id);
    }
    toast({
      title: isRTL ? "إشعار" : "Notification",
      description: notification.message,
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return isRTL ? "الآن" : "Now";
    } else if (diffInMinutes < 60) {
      return isRTL ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return isRTL ? `منذ ${hours} ساعة` : `${hours} hours ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return isRTL ? `منذ ${days} يوم` : `${days} days ago`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <Bell className="h-5 w-5" />
            {isRTL ? "الإشعارات" : "Notifications"}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : "text-left"}>
            {isRTL ? "آخر الإشعارات والتحديثات" : "Latest notifications and updates"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Buttons */}
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              {isRTL ? "وضع علامة قراءة للكل" : "Mark All Read"}
            </Button>
            <Button variant="outline" size="sm">
              {isRTL ? "إعدادات الإشعارات" : "Notification Settings"}
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className={`text-center p-8 text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{isRTL ? "لا توجد إشعارات" : "No notifications yet"}</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                
                return (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                      !notification.read_at ? 'bg-primary/5 border-primary/20' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h4 className={`font-semibold text-sm ${!notification.read_at ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {!notification.read_at && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-muted-foreground">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* View All Button */}
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full">
              {isRTL ? "عرض جميع الإشعارات" : "View All Notifications"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
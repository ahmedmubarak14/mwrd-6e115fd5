import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Bell, CheckCircle, AlertCircle, Info, Star, Package, FileText, Users } from "lucide-react";

interface NotificationsModalProps {
  children: React.ReactNode;
}

export const NotificationsModal = ({ children }: NotificationsModalProps) => {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';

  // Dummy notifications
  const [notifications] = useState([
    {
      id: 1,
      type: "offer",
      icon: Package,
      title: isRTL ? "عرض جديد تم استلامه" : "New Offer Received",
      message: isRTL ? "تلقيت عرضاً جديداً من TechAudio Pro لطلبك" : "You received a new offer from TechAudio Pro for your request",
      time: isRTL ? "منذ 5 دقائق" : "5 minutes ago",
      unread: true,
      priority: "high"
    },
    {
      id: 2,
      type: "request",
      icon: FileText,
      title: isRTL ? "طلب جديد متاح" : "New Request Available",
      message: isRTL ? "طلب جديد لمعدات الصوت في الرياض" : "New audio equipment request in Riyadh",
      time: isRTL ? "منذ ساعة" : "1 hour ago",
      unread: true,
      priority: "medium"
    },
    {
      id: 3,
      type: "status",
      icon: CheckCircle,
      title: isRTL ? "تم قبول عرضك" : "Your Offer Was Accepted",
      message: isRTL ? "قبل العميل عرضك لحفل الزفاف" : "Client accepted your offer for the wedding event",
      time: isRTL ? "منذ 3 ساعات" : "3 hours ago",
      unread: false,
      priority: "high"
    },
    {
      id: 4,
      type: "rating",
      icon: Star,
      title: isRTL ? "تقييم جديد" : "New Rating",
      message: isRTL ? "حصلت على تقييم 5 نجوم من العميل" : "You received a 5-star rating from client",
      time: isRTL ? "منذ 6 ساعات" : "6 hours ago",
      unread: false,
      priority: "low"
    },
    {
      id: 5,
      type: "info",
      icon: Info,
      title: isRTL ? "تحديث الملف الشخصي" : "Profile Update",
      message: isRTL ? "يرجى تحديث ملفك الشخصي لتحسين الظهور" : "Please update your profile to improve visibility",
      time: isRTL ? "منذ يوم" : "1 day ago",
      unread: false,
      priority: "low"
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      high: { label: isRTL ? "عالية" : "High", variant: "destructive" as const },
      medium: { label: isRTL ? "متوسطة" : "Medium", variant: "secondary" as const },
      low: { label: isRTL ? "منخفضة" : "Low", variant: "outline" as const }
    };
    return priorityMap[priority as keyof typeof priorityMap] || priorityMap.low;
  };

  const handleMarkAllRead = () => {
    toast({
      title: isRTL ? "تم تحديد الكل كمقروء" : "All Notifications Marked as Read",
      description: isRTL ? "تم وضع علامة قراءة على جميع الإشعارات" : "All notifications have been marked as read",
    });
  };

  const handleNotificationClick = (notification: any) => {
    toast({
      title: isRTL ? "إشعار" : "Notification",
      description: notification.message,
    });
  };

  const unreadCount = notifications.filter(n => n.unread).length;

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
            {notifications.map((notification) => {
              const Icon = notification.icon;
              const priorityBadge = getPriorityBadge(notification.priority);
              
              return (
                <div 
                  key={notification.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                    notification.unread ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)} bg-current/10`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-center justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h4 className={`font-semibold text-sm ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h4>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                          <Badge variant={priorityBadge.variant} className="text-xs">
                            {priorityBadge.label}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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
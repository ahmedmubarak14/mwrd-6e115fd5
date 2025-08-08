import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, PlusCircle, Send, CheckCircle, XCircle, User, MessageCircle, Search } from 'lucide-react';
import { useActivityFeed, ActivityItem } from '@/hooks/useActivityFeed';
import { useLanguage } from '@/contexts/LanguageContext';

const ActivityFeed: React.FC = () => {
  const { activities, loading, error } = useActivityFeed();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const getIcon = (activityType: ActivityItem['activity_type']) => {
    const className = "h-4 w-4";
    switch (activityType) {
      case 'request_created':
        return <PlusCircle className={className} />;
      case 'offer_submitted':
        return <Send className={className} />;
      case 'offer_accepted':
        return <CheckCircle className={className} />;
      case 'offer_rejected':
        return <XCircle className={className} />;
      case 'profile_updated':
        return <User className={className} />;
      case 'message_sent':
        return <MessageCircle className={className} />;
      case 'search_performed':
        return <Search className={className} />;
      default:
        return <Activity className={className} />;
    }
  };

  const getActivityColor = (activityType: ActivityItem['activity_type']) => {
    switch (activityType) {
      case 'request_created':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'offer_submitted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offer_accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'offer_rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'profile_updated':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'message_sent':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'search_performed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatActivityType = (activityType: ActivityItem['activity_type']) => {
    switch (activityType) {
      case 'request_created':
        return t?.('activity.request_created') || 'Request Created';
      case 'offer_submitted':
        return t?.('activity.offer_submitted') || 'Offer Submitted';
      case 'offer_accepted':
        return t?.('activity.offer_accepted') || 'Offer Accepted';
      case 'offer_rejected':
        return t?.('activity.offer_rejected') || 'Offer Rejected';
      case 'profile_updated':
        return t?.('activity.profile_updated') || 'Profile Updated';
      case 'message_sent':
        return t?.('activity.message_sent') || 'Message Sent';
      case 'search_performed':
        return t?.('activity.search_performed') || 'Search Performed';
      default:
        return 'Activity';
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t?.('activity.recent_activity') || 'Recent Activity'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-sm">
            {t?.('activity.error_loading') || 'Error loading activities'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t?.('activity.recent_activity') || 'Recent Activity'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t?.('activity.no_activity') || 'No recent activity'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full border flex items-center justify-center ${getActivityColor(activity.activity_type)}`}>
                    {getIcon(activity.activity_type)}
                  </div>
                  <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <Badge variant="secondary" className="text-xs">
                        {formatActivityType(activity.activity_type)}
                      </Badge>
                    </div>
                    {activity.description && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {activity.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
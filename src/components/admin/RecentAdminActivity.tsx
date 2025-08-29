import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ActivityItem {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
  user_profiles?: {
    full_name?: string;
    company_name?: string;
  };
}

interface RecentAdminActivityProps {
  userId?: string;
}

export const RecentAdminActivity = ({ userId }: RecentAdminActivityProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        
        // Fetch real audit log data with user profiles
        const { data: auditLogs, error } = await supabase
          .from('audit_log')
          .select(`
            id,
            action,
            entity_type,
            entity_id,
            user_id,
            created_at
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching audit logs:', error);
          setActivities([]);
          return;
        }

        // Get user profiles for the audit log entries
        const userIds = [...new Set(auditLogs?.map(log => log.user_id).filter(Boolean))];
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('user_id, full_name, company_name')
          .in('user_id', userIds);

        const profilesMap = profiles?.reduce((acc, profile) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {} as Record<string, any>) || {};

        // Transform audit logs to activity format
        const transformedActivities = (auditLogs || []).map(log => ({
          id: log.id,
          action: log.action,
          entity_type: log.entity_type,
          entity_id: log.entity_id,
          created_at: log.created_at,
          user_profiles: log.user_id ? profilesMap[log.user_id] || {
            full_name: 'Unknown User',
            company_name: 'N/A'
          } : {
            full_name: 'System',
            company_name: 'Automated'
          }
        }));

        setActivities(transformedActivities);
      } catch (error) {
        console.error('Error fetching admin activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, [userId]);

  const formatActivityAction = (action: string, entityType: string) => {
    const actionMap: Record<string, string> = {
      'INSERT': 'Created',
      'UPDATE': 'Updated',
      'DELETE': 'Deleted',
      'SELECT': 'Viewed'
    };

    const entityMap: Record<string, string> = {
      'user_profiles': 'user profile',
      'requests': 'request',
      'offers': 'offer',
      'orders': 'order',
      'verification_requests': 'verification request'
    };

    return `${actionMap[action] || action} ${entityMap[entityType] || entityType}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>No recent admin activity found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
          <div>
            <p className="font-medium">
              {formatActivityAction(activity.action, activity.entity_type)}
            </p>
            <p className="text-sm text-muted-foreground">
              ID: {activity.entity_id.slice(0, 8)}...
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatTimeAgo(activity.created_at)}
          </span>
        </div>
      ))}
    </div>
  );
};
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: 'request_created' | 'offer_submitted' | 'offer_accepted' | 'offer_rejected' | 'profile_updated' | 'message_sent' | 'search_performed';
  title: string;
  description?: string;
  metadata: Record<string, any>;
  entity_type?: 'request' | 'offer' | 'message' | 'profile' | 'search';
  entity_id?: string;
  created_at: string;
}

export const useActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activity_feed')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setActivities((data || []) as ActivityItem[]);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const trackActivity = useCallback(async (
    activityType: ActivityItem['activity_type'],
    title: string,
    description?: string,
    metadata: Record<string, any> = {},
    entityType?: ActivityItem['entity_type'],
    entityId?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activity_feed')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          title,
          description,
          metadata,
          entity_type: entityType,
          entity_id: entityId
        });

      if (error) throw error;

      // Optimistically update local state
      const newActivity: ActivityItem = {
        id: Date.now().toString(), // Temporary ID
        user_id: user.id,
        activity_type: activityType,
        title,
        description,
        metadata,
        entity_type: entityType,
        entity_id: entityId,
        created_at: new Date().toISOString()
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
    } catch (err: any) {
      console.error('Error tracking activity:', err);
    }
  }, [user]);

  // Set up real-time subscription for activity updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('activity-feed-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_feed',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newActivity = payload.new as ActivityItem;
          setActivities(prev => {
            // Avoid duplicates (in case of optimistic update)
            const exists = prev.some(activity => 
              activity.activity_type === newActivity.activity_type && 
              activity.title === newActivity.title &&
              Math.abs(new Date(activity.created_at).getTime() - new Date(newActivity.created_at).getTime()) < 5000
            );
            
            if (exists) return prev;
            return [newActivity, ...prev.slice(0, 19)];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Fetch activities on user login
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const getActivityIcon = useCallback((activityType: ActivityItem['activity_type']) => {
    switch (activityType) {
      case 'request_created':
        return 'plus-circle';
      case 'offer_submitted':
        return 'send';
      case 'offer_accepted':
        return 'check-circle';
      case 'offer_rejected':
        return 'x-circle';
      case 'profile_updated':
        return 'user';
      case 'message_sent':
        return 'message-circle';
      case 'search_performed':
        return 'search';
      default:
        return 'activity';
    }
  }, []);

  const getActivityColor = useCallback((activityType: ActivityItem['activity_type']) => {
    switch (activityType) {
      case 'request_created':
        return 'text-blue-600';
      case 'offer_submitted':
        return 'text-green-600';
      case 'offer_accepted':
        return 'text-emerald-600';
      case 'offer_rejected':
        return 'text-red-600';
      case 'profile_updated':
        return 'text-purple-600';
      case 'message_sent':
        return 'text-cyan-600';
      case 'search_performed':
        return 'text-gray-600';
      default:
        return 'text-gray-500';
    }
  }, []);

  return {
    activities,
    loading,
    error,
    trackActivity,
    refetch: fetchActivities,
    getActivityIcon,
    getActivityColor
  };
};
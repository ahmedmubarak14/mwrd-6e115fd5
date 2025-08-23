import { useState, useEffect } from 'react';

export interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  title?: string;
  metadata?: any;
  created_at: string;
}

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      // Mock activities for now since there's no activity_feed table
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          user_id: 'user-1',
          activity_type: 'request_created',
          description: 'New request created',
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          user_id: 'user-2',
          activity_type: 'offer_submitted',
          description: 'New offer submitted',
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      setActivities(mockActivities);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: Omit<ActivityItem, 'id' | 'created_at'>) => {
    // This is a placeholder - in a real app, you'd have an activity_feed table
    console.log('Activity added:', activity);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    fetchActivities,
    addActivity,
    error: null,
    trackActivity: addActivity
  };
};
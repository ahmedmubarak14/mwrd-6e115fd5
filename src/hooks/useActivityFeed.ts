import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  title?: string;
  metadata?: any;
  created_at: string;
  updated_at?: string;
}

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchActivities = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('activity_feed')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setActivities(data || []);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: Omit<ActivityItem, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { error: insertError } = await supabase
        .from('activity_feed')
        .insert({
          ...activity,
          user_id: user.id
        });

      if (insertError) throw insertError;

      // Refresh activities after adding
      await fetchActivities();
    } catch (error: any) {
      console.error('Error adding activity:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    fetchActivities,
    addActivity,
    trackActivity: addActivity
  };
};
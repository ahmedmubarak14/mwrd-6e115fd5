import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  reference_id?: string;
  read_at?: string;
  created_at: string;
  user_id: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      const notificationData = (data || []) as Notification[];
      setNotifications(notificationData);
      setUnreadCount(notificationData.filter(n => !n.read_at).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const unreadIds = notifications
        .filter(n => !n.read_at)
        .map(n => n.id);
      
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Set up real-time subscription with enhanced error handling
  useEffect(() => {
    if (!user) return;

    let channel: any = null;
    
    try {
      console.log('useNotifications: Setting up realtime subscription');
      channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('useNotifications: New notification received:', payload);
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('useNotifications: Notification updated:', payload);
            const updatedNotification = payload.new as Notification;
            setNotifications(prev =>
              prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
          }
        )
        .subscribe((status: string, error?: any) => {
          console.log('useNotifications: Subscription status:', status, error ? 'Error:' : '', error);
          
          if (error) {
            console.error('Notifications realtime subscription error:', error);
            console.log('Notifications realtime disabled - app will work without live updates');
            
            // Handle WebSocket errors gracefully
            if (error.message?.includes('WebSocket') || error.message?.includes('insecure')) {
              console.log('WebSocket connection unavailable for notifications - continuing without realtime');
              return;
            }
          } else if (status === 'SUBSCRIBED') {
            console.log('Notifications realtime subscription active');
          } else if (status === 'CHANNEL_ERROR') {
            console.warn('Notifications subscription error - continuing without realtime updates');
          } else if (status === 'TIMED_OUT') {
            console.warn('Notifications subscription timed out - continuing without realtime updates');
          } else if (status === 'CLOSED') {
            console.log('Notifications subscription closed');
          }
        });
        
    } catch (error) {
      console.warn('Failed to set up notifications realtime subscription:', error);
      console.log('Continuing without realtime notifications - app will work normally with polling');
      // App continues to work without realtime updates
    }

    return () => {
      if (channel) {
        try {
          console.log('useNotifications: Cleaning up realtime subscription');
          supabase.removeChannel(channel);
        } catch (cleanupError) {
          console.warn('useNotifications: Error during subscription cleanup:', cleanupError);
        }
      }
    };
  }, [user]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};
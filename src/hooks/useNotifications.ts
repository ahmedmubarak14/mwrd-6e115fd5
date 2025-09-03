import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { createLogger } from '@/utils/logger';

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

const logger = createLogger('useNotifications');

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
      logger.error('Error fetching notifications', { error });
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
      logger.error('Error marking notification as read', { error, notificationId });
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
      logger.error('Error marking all notifications as read', { error });
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
      logger.debug('Setting up realtime subscription');
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
            logger.debug('New notification received', { payload });
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
            logger.debug('Notification updated', { payload });
            const updatedNotification = payload.new as Notification;
            setNotifications(prev =>
              prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
          }
        )
        .subscribe((status: string, error?: any) => {
          logger.debug('Subscription status', { status, error });
          
          if (error) {
            logger.error('Notifications realtime subscription error', { error });
            logger.info('Notifications realtime disabled - app will work without live updates');
            
            // Handle WebSocket errors gracefully
            if (error.message?.includes('WebSocket') || error.message?.includes('insecure')) {
              logger.info('WebSocket connection unavailable for notifications - continuing without realtime');
              return;
            }
          } else if (status === 'SUBSCRIBED') {
            logger.info('Notifications realtime subscription active');
          } else if (status === 'CHANNEL_ERROR') {
            logger.warn('Notifications subscription error - continuing without realtime updates');
          } else if (status === 'TIMED_OUT') {
            logger.warn('Notifications subscription timed out - continuing without realtime updates');
          } else if (status === 'CLOSED') {
            logger.info('Notifications subscription closed');
          }
        });
        
    } catch (error) {
      logger.warn('Failed to set up notifications realtime subscription', { error });
      logger.info('Continuing without realtime notifications - app will work normally with polling');
      // App continues to work without realtime updates
    }

    return () => {
      if (channel) {
        try {
          logger.debug('Cleaning up realtime subscription');
          supabase.removeChannel(channel);
        } catch (cleanupError) {
          logger.warn('Error during subscription cleanup', { cleanupError });
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
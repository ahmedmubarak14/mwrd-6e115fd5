import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  target_audience: string;
  scheduled_for?: string;
  created_at: string;
  sent_at?: string;
  category?: string;
}

export interface NotificationStats {
  total: number;
  sentToday: number;
  pending: number;
  openRate: number;
}

export const useNotificationCenter = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [notificationStats, setNotificationStats] = useState<NotificationStats>({
    total: 0,
    sentToday: 0,
    pending: 0,
    openRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch admin notifications (system-wide notifications)
      const { data: adminNotifications, error: adminError } = await supabase
        .from('notifications')
        .select('*')
        .or('category.eq.system,category.eq.announcement,category.eq.maintenance,category.is.null')
        .order('created_at', { ascending: false })
        .limit(100);

      if (adminError) throw adminError;

      // Transform data to match NotificationData interface
      const transformedNotifications: NotificationData[] = (adminNotifications || []).map(notification => ({
        id: notification.id,
        type: notification.category || notification.type || 'announcement',
        title: notification.title,
        message: notification.message,
        priority: notification.priority || 'medium',
        status: notification.read ? 'sent' : 'draft',
        target_audience: 'all_users',
        created_at: notification.created_at,
        category: notification.category
      }));

      setNotifications(transformedNotifications);

      // Calculate stats
      const total = transformedNotifications.length;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sentToday = transformedNotifications.filter(n => 
        new Date(n.created_at) >= today && n.status === 'sent'
      ).length;
      const pending = transformedNotifications.filter(n => n.status === 'draft').length;

      setNotificationStats({
        total,
        sentToday,
        pending,
        openRate: total > 0 ? Math.round((sentToday / total) * 100) : 0
      });

    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNotification = async (notificationData: Partial<NotificationData>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: notificationData.type || 'announcement',
          title: notificationData.title || '',
          message: notificationData.message || '',
          priority: notificationData.priority || 'medium',
          category: notificationData.type || 'system',
          data: {
            target_audience: notificationData.target_audience || 'all_users',
            scheduled_for: notificationData.scheduled_for
          }
        })
        .select()
        .single();

      if (error) throw error;
      await fetchNotifications();
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  const updateNotification = async (notificationId: string, updates: Partial<NotificationData>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const updateData: any = {};
      
      if (updates.title) updateData.title = updates.title;
      if (updates.message) updateData.message = updates.message;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.status === 'sent') updateData.read = true;

      const { error } = await supabase
        .from('notifications')
        .update(updateData)
        .eq('id', notificationId);

      if (error) throw error;
      await fetchNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  return {
    notifications,
    notificationStats,
    isLoading,
    createNotification,
    updateNotification,
    refreshNotifications: fetchNotifications
  };
};
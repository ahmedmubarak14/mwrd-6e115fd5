import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

export interface NotificationStats {
  total: number;
  sentToday: number;
  pending: number;
  openRate: number;
}

export const useNotificationCenter = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [notificationStats, setNotificationStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      // Mock notification data
      const mockNotifications: NotificationData[] = [
        {
          id: '1',
          title: 'System Maintenance Scheduled',
          message: 'Our platform will undergo maintenance on Sunday from 2:00 AM to 4:00 AM GMT.',
          type: 'announcement',
          priority: 'high',
          status: 'sent',
          target_audience: 'all_users',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          title: 'New Feature Release: Advanced Analytics',
          message: 'Discover powerful new insights with our enhanced analytics dashboard.',
          type: 'announcement',
          priority: 'medium',
          status: 'scheduled',
          target_audience: 'all_users',
          scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          title: 'Security Alert: Password Reset Required',
          message: 'We detected unusual activity on your account. Please reset your password immediately.',
          type: 'alert',
          priority: 'critical',
          status: 'draft',
          target_audience: 'affected_users',
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ];

      const mockStats: NotificationStats = {
        total: 156,
        sentToday: 12,
        pending: 3,
        openRate: 78
      };

      setNotifications(mockNotifications);
      setNotificationStats(mockStats);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNotification = async (notificationData: Partial<NotificationData>) => {
    try {
      const newNotification: NotificationData = {
        id: Math.random().toString(36).substr(2, 9),
        title: notificationData.title || '',
        message: notificationData.message || '',
        type: notificationData.type || 'announcement',
        priority: notificationData.priority || 'medium',
        status: notificationData.scheduled_for ? 'scheduled' : 'draft',
        target_audience: notificationData.target_audience || 'all_users',
        scheduled_for: notificationData.scheduled_for,
        created_at: new Date().toISOString()
      };

      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  const updateNotification = async (notificationId: string, updates: Partial<NotificationData>) => {
    try {
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, ...updates }
          : notification
      ));
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    notificationStats,
    isLoading,
    createNotification,
    updateNotification,
    refreshNotifications: fetchNotifications
  };
};
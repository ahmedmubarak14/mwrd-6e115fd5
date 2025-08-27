import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  target_platform: 'all' | 'android' | 'ios' | 'web';
  target_audience: string;
  action_url?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
  click_count?: number;
}

export interface DeviceStats {
  total: number;
  sentToday: number;
  deliveryRate: number;
  clickRate: number;
}

export const usePushNotifications = () => {
  const [pushNotifications, setPushNotifications] = useState<PushNotification[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPushNotifications = async () => {
    try {
      // Mock push notifications data
      const mockNotifications: PushNotification[] = [
        {
          id: '1',
          title: 'New Message Received',
          body: 'You have a new message from Ahmed Al-Rashid',
          icon: '/favicon.ico',
          badge: '/badge.png',
          target_platform: 'all',
          target_audience: 'all_users',
          action_url: '/messages',
          status: 'sent',
          sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          click_count: 45
        },
        {
          id: '2',
          title: 'Project Update Available',
          body: 'Your construction project has a new update',
          icon: '/favicon.ico',
          target_platform: 'android',
          target_audience: 'clients',
          action_url: '/projects',
          status: 'scheduled',
          scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          title: 'Weekly Report Ready',
          body: 'Your weekly performance report is now available',
          icon: '/favicon.ico',
          target_platform: 'web',
          target_audience: 'vendors',
          action_url: '/analytics',
          status: 'draft',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ];

      const mockStats: DeviceStats = {
        total: 2847,
        sentToday: 156,
        deliveryRate: 94,
        clickRate: 18
      };

      setPushNotifications(mockNotifications);
      setDeviceStats(mockStats);
    } catch (error) {
      console.error('Error fetching push notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPushNotification = async (notificationData: Partial<PushNotification>) => {
    try {
      const newNotification: PushNotification = {
        id: Math.random().toString(36).substr(2, 9),
        title: notificationData.title || '',
        body: notificationData.body || '',
        icon: notificationData.icon || '/favicon.ico',
        badge: notificationData.badge || '/badge.png',
        target_platform: notificationData.target_platform || 'all',
        target_audience: notificationData.target_audience || 'all_users',
        action_url: notificationData.action_url,
        status: notificationData.scheduled_for ? 'scheduled' : 'sent',
        scheduled_for: notificationData.scheduled_for,
        sent_at: notificationData.scheduled_for ? undefined : new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      setPushNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (error) {
      console.error('Error creating push notification:', error);
      throw error;
    }
  };

  const updateSettings = async (settings: any) => {
    try {
      setNotificationSettings(settings);
    } catch (error) {
      console.error('Error updating push notification settings:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPushNotifications();
  }, []);

  return {
    pushNotifications,
    deviceStats,
    notificationSettings,
    isLoading,
    createPushNotification,
    updateSettings,
    refreshNotifications: fetchPushNotifications
  };
};
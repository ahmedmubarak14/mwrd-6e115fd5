import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';

interface RealTimeConfig {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onUpdate?: (payload: any) => void;
}

export const useRealTimeUpdates = (configs: RealTimeConfig[]) => {
  const { user } = useAuth();
  const { showInfo } = useToastFeedback();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const handleRealtimeChange = useCallback((payload: any, config: RealTimeConfig) => {
    console.log(`Real-time ${payload.eventType} on ${config.table}:`, payload);
    
    // Update timestamp
    setLastUpdate(new Date());
    
    // Call custom handler if provided
    if (config.onUpdate) {
      config.onUpdate(payload);
    }

    // Show notification for relevant updates
    if (payload.eventType === 'INSERT') {
      switch (config.table) {
        case 'notifications':
          // Don't show toast for notifications (handled separately)
          break;
        case 'orders':
          showInfo('New order received');
          break;
        case 'offers':
          showInfo('New offer received');
          break;
        case 'requests':
          showInfo('New request posted');
          break;
      }
    }
  }, [showInfo]);

  useEffect(() => {
    if (!user) return;

    const subscriptions: any[] = [];

    // Subscribe to each real-time configuration
    configs.forEach((config) => {
      const channel = supabase
        .channel(`${config.table}_${config.event}`)
        .on(
          'postgres_changes' as any,
          {
            event: config.event,
            schema: 'public',
            table: config.table,
            filter: config.filter
          },
          (payload) => handleRealtimeChange(payload, config)
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            console.log(`✅ Subscribed to ${config.table} ${config.event} events`);
          } else if (status === 'CHANNEL_ERROR') {
            setIsConnected(false);
            console.error(`❌ Error subscribing to ${config.table} events`);
          }
        });

      subscriptions.push(channel);
    });

    return () => {
      subscriptions.forEach((subscription) => {
        supabase.removeChannel(subscription);
      });
      setIsConnected(false);
    };
  }, [user, configs, handleRealtimeChange]);

  return {
    isConnected,
    lastUpdate,
    connectionStatus: isConnected ? 'connected' : 'disconnected'
  };
};
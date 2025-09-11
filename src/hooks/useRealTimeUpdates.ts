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
    if (!user || !configs.length) return;

    console.log('Setting up real-time subscriptions for tables:', configs.map(c => c.table));

    let channels: any[] = [];

    try {
      // Subscribe to each real-time configuration
      configs.forEach((config, index) => {
        const channelName = `${config.table}_${config.event}_${index}`;
        
        const channel = supabase
          .channel(channelName, {
            config: {
              broadcast: { self: false }
            }
          })
          .subscribe((status, error) => {
            if (status === 'SUBSCRIBED') {
              setIsConnected(true);
              console.log(`✅ Subscribed to ${config.table} ${config.event} events`);
            } else if (status === 'CHANNEL_ERROR' || error) {
              console.warn(`⚠️ Real-time subscription failed for ${config.table} - app will work without live updates`);
              setIsConnected(false);
            }
          });

        channels.push(channel);
      });

      return () => {
        console.log('Cleaning up real-time subscriptions');
        channels.forEach((channel) => {
          try {
            supabase.removeChannel(channel);
          } catch (error) {
            console.warn('Error removing channel:', error);
          }
        });
        setIsConnected(false);
      };
    } catch (error) {
      console.warn('Failed to setup real-time subscriptions - app will work without live updates:', error);
      setIsConnected(false);
      return () => {};
    }
  }, [user, configs, handleRealtimeChange]);

  return {
    isConnected,
    lastUpdate,
    connectionStatus: isConnected ? 'connected' : 'disconnected'
  };
};
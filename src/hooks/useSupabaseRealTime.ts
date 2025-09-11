import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Real-time event types for the platform
export type RealTimeEvent = 
  | 'order_created'
  | 'order_updated'
  | 'order_completed'
  | 'message_received'
  | 'payment_completed'
  | 'profile_updated'
  | 'notification_sent'
  | 'offer_created'
  | 'offer_updated'
  | 'request_created'
  | 'user_registered';

interface RealTimeMessage {
  id: string;
  type: RealTimeEvent;
  timestamp: Date;
  data: Record<string, any>;
  userId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface UseSupabaseRealTimeOptions {
  enableToasts?: boolean;
  debug?: boolean;
  channels?: string[];
}

interface UseSupabaseRealTimeReturn {
  isConnected: boolean;
  lastMessage: RealTimeMessage | null;
  subscribe: (eventType: RealTimeEvent, callback: (data: RealTimeMessage) => void) => () => void;
  sendBroadcast: (type: RealTimeEvent, data: Record<string, any>) => void;
  connectionInfo: {
    connectedAt: Date | null;
    activeChannels: number;
    messagesReceived: number;
  };
}

export const useSupabaseRealTime = (
  options: UseSupabaseRealTimeOptions = {}
): UseSupabaseRealTimeReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<RealTimeMessage | null>(null);
  const [connectedAt, setConnectedAt] = useState<Date | null>(null);
  const [messagesReceived, setMessagesReceived] = useState(0);
  const [activeChannels, setActiveChannels] = useState(0);
  const { toast } = useToast();
  
  const listeners = new Map<RealTimeEvent, Set<(data: RealTimeMessage) => void>>();

  // Subscribe to database changes
  useEffect(() => {
    const channels: any[] = [];

    // Orders channel
    const ordersChannel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          const message: RealTimeMessage = {
            id: `order-${Date.now()}`,
            type: payload.eventType === 'INSERT' ? 'order_created' : 
                  payload.eventType === 'UPDATE' ? 'order_updated' : 'order_updated',
            timestamp: new Date(),
            data: {
              orderId: payload.new?.id || payload.old?.id,
              status: payload.new?.status,
              amount: payload.new?.amount,
              clientId: payload.new?.client_id,
              vendorId: payload.new?.vendor_id
            },
            priority: 'high'
          };
          
          setLastMessage(message);
          setMessagesReceived(prev => prev + 1);
          
          // Notify subscribers
          const eventListeners = listeners.get(message.type);
          eventListeners?.forEach(callback => callback(message));
          
          if (options.enableToasts && payload.eventType === 'INSERT') {
            toast({
              title: 'New Order',
              description: `Order ${payload.new?.title || 'created'}`
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setConnectedAt(new Date());
          setActiveChannels(prev => prev + 1);
          if (options.debug) console.log('[RealTime] Orders channel connected');
        }
      });

    channels.push(ordersChannel);

    // Messages channel
    const messagesChannel = supabase
      .channel('messages-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const message: RealTimeMessage = {
            id: `message-${Date.now()}`,
            type: 'message_received',
            timestamp: new Date(),
            data: {
              messageId: payload.new?.id,
              senderId: payload.new?.sender_id,
              content: payload.new?.content,
              conversationId: payload.new?.conversation_id
            },
            priority: 'medium'
          };
          
          setLastMessage(message);
          setMessagesReceived(prev => prev + 1);
          
          const eventListeners = listeners.get(message.type);
          eventListeners?.forEach(callback => callback(message));
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setActiveChannels(prev => prev + 1);
          if (options.debug) console.log('[RealTime] Messages channel connected');
        }
      });

    channels.push(messagesChannel);

    // Financial transactions channel
    const transactionsChannel = supabase
      .channel('transactions-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'financial_transactions' },
        (payload) => {
          if (payload.new?.status === 'completed') {
            const message: RealTimeMessage = {
              id: `payment-${Date.now()}`,
              type: 'payment_completed',
              timestamp: new Date(),
              data: {
                transactionId: payload.new?.id,
                amount: payload.new?.amount,
                userId: payload.new?.user_id
              },
              priority: 'high'
            };
            
            setLastMessage(message);
            setMessagesReceived(prev => prev + 1);
            
            const eventListeners = listeners.get(message.type);
            eventListeners?.forEach(callback => callback(message));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setActiveChannels(prev => prev + 1);
          if (options.debug) console.log('[RealTime] Transactions channel connected');
        }
      });

    channels.push(transactionsChannel);

    // User profiles channel
    const profilesChannel = supabase
      .channel('profiles-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_profiles' },
        (payload) => {
          const message: RealTimeMessage = {
            id: `profile-${Date.now()}`,
            type: payload.eventType === 'INSERT' ? 'user_registered' : 'profile_updated',
            timestamp: new Date(),
            data: {
              userId: payload.new?.user_id || payload.old?.user_id,
              role: payload.new?.role,
              status: payload.new?.status
            },
            priority: 'low'
          };
          
          setLastMessage(message);
          setMessagesReceived(prev => prev + 1);
          
          const eventListeners = listeners.get(message.type);
          eventListeners?.forEach(callback => callback(message));
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setActiveChannels(prev => prev + 1);
          if (options.debug) console.log('[RealTime] Profiles channel connected');
        }
      });

    channels.push(profilesChannel);

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      setIsConnected(false);
      setActiveChannels(0);
      setConnectedAt(null);
    };
  }, [options.debug, options.enableToasts]);

  const subscribe = useCallback((
    eventType: RealTimeEvent, 
    callback: (data: RealTimeMessage) => void
  ) => {
    if (!listeners.has(eventType)) {
      listeners.set(eventType, new Set());
    }
    
    const eventListeners = listeners.get(eventType)!;
    eventListeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        listeners.delete(eventType);
      }
    };
  }, []);

  const sendBroadcast = useCallback((type: RealTimeEvent, data: Record<string, any>) => {
    if (!isConnected) {
      console.warn('[RealTime] Cannot send broadcast - not connected');
      return;
    }

    const message: RealTimeMessage = {
      id: `broadcast-${Date.now()}`,
      type,
      timestamp: new Date(),
      data,
      priority: 'medium'
    };

    // Use the orders channel for broadcasting (could be any channel)
    supabase.channel('orders-realtime').send({
      type: 'broadcast',
      event: 'custom-event',
      payload: message
    });

    if (options.debug) {
      console.log('[RealTime] Broadcast sent:', message);
    }
  }, [isConnected, options.debug]);

  return {
    isConnected,
    lastMessage,
    subscribe,
    sendBroadcast,
    connectionInfo: {
      connectedAt,
      activeChannels,
      messagesReceived
    }
  };
};
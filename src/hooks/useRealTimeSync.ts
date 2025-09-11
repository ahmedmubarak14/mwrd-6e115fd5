import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// WebSocket connection states
type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

// Real-time event types
type RealTimeEvent = 
  | 'order_created'
  | 'order_updated'
  | 'message_received'
  | 'payment_completed'
  | 'profile_updated'
  | 'notification_sent';

interface RealTimeMessage {
  id: string;
  type: RealTimeEvent;
  timestamp: Date;
  data: Record<string, any>;
  userId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface UseRealTimeSyncOptions {
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  enableNotifications?: boolean;
  enableToasts?: boolean;
  debug?: boolean;
}

interface UseRealTimeSyncReturn {
  connectionState: ConnectionState;
  isConnected: boolean;
  lastMessage: RealTimeMessage | null;
  subscribe: (eventType: RealTimeEvent, callback: (data: RealTimeMessage) => void) => () => void;
  unsubscribe: (eventType: RealTimeEvent) => void;
  sendMessage: (type: RealTimeEvent, data: Record<string, any>) => void;
  forceReconnect: () => void;
  disconnect: () => void;
  getConnectionInfo: () => {
    state: ConnectionState;
    connectedAt: Date | null;
    reconnectAttempts: number;
    subscribedEvents: RealTimeEvent[];
  };
}

// Mock WebSocket implementation for development
class MockWebSocket {
  public readyState: number = 0; // CONNECTING = 0, OPEN = 1, CLOSING = 2, CLOSED = 3
  private listeners: Record<string, ((event: any) => void)[]> = {};
  private interval: NodeJS.Timeout | null = null;
  
  // WebSocket constants
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  
  constructor(private url: string) {
    this.readyState = MockWebSocket.CONNECTING;
    
    // Simulate connection delay
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.dispatchEvent('open', {});
      this.startMockEvents();
    }, 1000);
  }

  addEventListener(event: string, callback: (event: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeEventListener(event: string, callback: (event: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  send(data: string) {
    console.log('Mock WebSocket sending:', data);
    // Echo back for testing
    setTimeout(() => {
      this.dispatchEvent('message', { data: JSON.stringify({
        id: `echo-${Date.now()}`,
        type: 'echo',
        timestamp: new Date(),
        data: JSON.parse(data),
        priority: 'low'
      })});
    }, 100);
  }

  close() {
    this.readyState = MockWebSocket.CLOSING;
    if (this.interval) {
      clearInterval(this.interval);
    }
    setTimeout(() => {
      this.readyState = MockWebSocket.CLOSED;
      this.dispatchEvent('close', {});
    }, 100);
  }

  private dispatchEvent(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  private startMockEvents() {
    const events: RealTimeEvent[] = [
      'order_created', 'order_updated', 'message_received', 
      'payment_completed', 'notification_sent'
    ];

    this.interval = setInterval(() => {
      // Randomly send mock events (low frequency for demo)
      if (Math.random() > 0.95) {
        const eventType = events[Math.floor(Math.random() * events.length)];
        const mockMessage: RealTimeMessage = {
          id: `mock-${Date.now()}`,
          type: eventType,
          timestamp: new Date(),
          data: {
            title: `Mock ${eventType.replace('_', ' ')} event`,
            description: 'This is a simulated real-time event for demonstration',
            value: Math.floor(Math.random() * 10000)
          },
          priority: 'medium'
        };

        this.dispatchEvent('message', { 
          data: JSON.stringify(mockMessage) 
        });
      }
    }, 2000);
  }
}

export const useRealTimeSync = (options: UseRealTimeSyncOptions = {}): UseRealTimeSyncReturn => {
  const {
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    enableNotifications = true,
    enableToasts = false,
    debug = process.env.NODE_ENV === 'development'
  } = options;

  const { toast } = useToast();
  
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [lastMessage, setLastMessage] = useState<RealTimeMessage | null>(null);
  
  const wsRef = useRef<WebSocket | MockWebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectedAtRef = useRef<Date | null>(null);
  const subscriptionsRef = useRef<Map<RealTimeEvent, ((data: RealTimeMessage) => void)[]>>(new Map());

  // WebSocket URL - in production, this would be your actual WebSocket endpoint
  const wsUrl = process.env.NODE_ENV === 'production' 
    ? 'wss://api.yourapp.com/ws'
    : 'ws://localhost:3001/ws'; // Mock URL for development

  const log = useCallback((message: string, data?: any) => {
    if (debug) {
      console.log(`[RealTimeSync] ${message}`, data || '');
    }
  }, [debug]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    log('Attempting to connect...');
    setConnectionState('connecting');

    try {
      // Use MockWebSocket in development, real WebSocket in production
      const WebSocketClass = process.env.NODE_ENV === 'development' ? MockWebSocket : WebSocket;
      wsRef.current = new WebSocketClass(wsUrl) as WebSocket;

      wsRef.current.addEventListener('open', () => {
        log('Connected successfully');
        setConnectionState('connected');
        connectedAtRef.current = new Date();
        reconnectAttemptsRef.current = 0;

        if (enableToasts) {
          toast({
            title: "Connected",
            description: "Real-time sync is now active",
          });
        }
      });

      wsRef.current.addEventListener('message', (event) => {
        try {
          const message: RealTimeMessage = JSON.parse(event.data);
          log('Received message:', message);
          
          setLastMessage(message);

          // Notify subscribers
          const subscribers = subscriptionsRef.current.get(message.type) || [];
          subscribers.forEach(callback => {
            try {
              callback(message);
            } catch (error) {
              console.error('Error in message subscriber:', error);
            }
          });

          // Show toast notification if enabled
          if (enableToasts && message.priority !== 'low') {
            toast({
              title: message.data.title || `New ${message.type.replace('_', ' ')}`,
              description: message.data.description || message.data.message,
              variant: message.priority === 'urgent' ? 'destructive' : 'default'
            });
          }

        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      wsRef.current.addEventListener('error', (error) => {
        log('WebSocket error:', error);
        setConnectionState('error');
        
        if (enableToasts) {
          toast({
            title: "Connection Error",
            description: "Real-time sync encountered an error",
            variant: "destructive"
          });
        }
      });

      wsRef.current.addEventListener('close', () => {
        log('Connection closed');
        setConnectionState('disconnected');
        connectedAtRef.current = null;

        // Auto-reconnect if enabled
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          setConnectionState('reconnecting');
          
          log(`Reconnecting in ${reconnectInterval}ms (attempt ${reconnectAttemptsRef.current})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      });

    } catch (error) {
      log('Failed to create WebSocket connection:', error);
      setConnectionState('error');
    }
  }, [wsUrl, autoReconnect, reconnectInterval, maxReconnectAttempts, enableToasts, toast, log]);

  const disconnect = useCallback(() => {
    log('Disconnecting...');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnectionState('disconnected');
    connectedAtRef.current = null;
    reconnectAttemptsRef.current = 0;
  }, [log]);

  const forceReconnect = useCallback(() => {
    log('Force reconnecting...');
    reconnectAttemptsRef.current = 0;
    disconnect();
    setTimeout(connect, 100);
  }, [disconnect, connect, log]);

  const subscribe = useCallback((eventType: RealTimeEvent, callback: (data: RealTimeMessage) => void) => {
    log(`Subscribing to ${eventType}`);
    
    const subscribers = subscriptionsRef.current.get(eventType) || [];
    subscribers.push(callback);
    subscriptionsRef.current.set(eventType, subscribers);

    // Return unsubscribe function
    return () => {
      const currentSubscribers = subscriptionsRef.current.get(eventType) || [];
      const filteredSubscribers = currentSubscribers.filter(cb => cb !== callback);
      
      if (filteredSubscribers.length > 0) {
        subscriptionsRef.current.set(eventType, filteredSubscribers);
      } else {
        subscriptionsRef.current.delete(eventType);
      }
      
      log(`Unsubscribed from ${eventType}`);
    };
  }, [log]);

  const unsubscribe = useCallback((eventType: RealTimeEvent) => {
    log(`Unsubscribing from all ${eventType} listeners`);
    subscriptionsRef.current.delete(eventType);
  }, [log]);

  const sendMessage = useCallback((type: RealTimeEvent, data: Record<string, any>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        id: `client-${Date.now()}`,
        type,
        timestamp: new Date(),
        data,
        priority: 'medium' as const
      };

      wsRef.current.send(JSON.stringify(message));
      log('Sent message:', message);
    } else {
      console.warn('Cannot send message: WebSocket is not connected');
    }
  }, [log]);

  const getConnectionInfo = useCallback(() => ({
    state: connectionState,
    connectedAt: connectedAtRef.current,
    reconnectAttempts: reconnectAttemptsRef.current,
    subscribedEvents: Array.from(subscriptionsRef.current.keys())
  }), [connectionState]);

  // Initialize connection on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    connectionState,
    isConnected: connectionState === 'connected',
    lastMessage,
    subscribe,
    unsubscribe,
    sendMessage,
    forceReconnect,
    disconnect,
    getConnectionInfo
  };
};
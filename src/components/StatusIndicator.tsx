import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const StatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isConnected, setIsConnected] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const { user } = useAuth();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor Supabase connection status with error handling
  useEffect(() => {
    if (!user) return;

    let channel: any = null;
    
    try {
      console.log('StatusIndicator: Attempting to create presence channel');
      channel = supabase.channel('connection-status');
      
      channel
        .on('presence', { event: 'sync' }, () => {
          console.log('StatusIndicator: Presence sync event received');
          setIsConnected(true);
          setLastActivity(new Date());
        })
        .on('presence', { event: 'join' }, () => {
          console.log('StatusIndicator: Presence join event received');
          setIsConnected(true);
          setLastActivity(new Date());
        })
        .on('presence', { event: 'leave' }, () => {
          console.log('StatusIndicator: Presence leave event received');
          setIsConnected(false);
        })
        .subscribe(async (status: string, error?: any) => {
          console.log('StatusIndicator: Subscription status:', status, error ? 'Error:' : '', error);
          
          if (status === 'SUBSCRIBED') {
            try {
              await channel.track({
                user_id: user.id,
                online_at: new Date().toISOString()
              });
              console.log('StatusIndicator: User presence tracked successfully');
              setIsConnected(true);
            } catch (trackError) {
              console.warn('StatusIndicator: Failed to track user presence:', trackError);
              // Continue without tracking - app still works
            }
          } else if (status === 'CHANNEL_ERROR') {
            console.warn('StatusIndicator: Channel error, continuing without presence:', error);
            setIsConnected(false);
          } else if (status === 'TIMED_OUT') {
            console.warn('StatusIndicator: Channel timed out, continuing without presence');
            setIsConnected(false);
          } else if (status === 'CLOSED') {
            console.log('StatusIndicator: Channel closed');
            setIsConnected(false);
          }
        });
        
    } catch (error) {
      console.warn('StatusIndicator: Failed to set up presence channel:', error);
      console.log('StatusIndicator: Continuing without realtime presence - app will work normally');
      // Set as disconnected but don't crash the app
      setIsConnected(false);
    }

    return () => {
      if (channel) {
        try {
          console.log('StatusIndicator: Cleaning up presence channel');
          supabase.removeChannel(channel);
        } catch (cleanupError) {
          console.warn('StatusIndicator: Error during channel cleanup:', cleanupError);
        }
      }
    };
  }, [user]);

  // Update activity timestamp periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && isConnected) {
        setLastActivity(new Date());
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isOnline, isConnected]);

  const getStatusColor = () => {
    if (!isOnline) return 'destructive';
    if (!isConnected) return 'secondary';
    return 'default';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (!isConnected) return 'Connecting...';
    return 'Live';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-3 w-3" />;
    if (!isConnected) return <Wifi className="h-3 w-3 animate-pulse" />;
    return <Activity className="h-3 w-3" />;
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={getStatusColor()}
        className="flex items-center gap-1 text-xs"
      >
        {getStatusIcon()}
        {getStatusText()}
      </Badge>
      {isConnected && (
        <span className="text-xs text-muted-foreground">
          Active {Math.round((Date.now() - lastActivity.getTime()) / 1000)}s ago
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
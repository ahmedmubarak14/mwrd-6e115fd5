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

  // Monitor Supabase connection status
  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('connection-status');
    
    channel
      .on('presence', { event: 'sync' }, () => {
        setIsConnected(true);
        setLastActivity(new Date());
      })
      .on('presence', { event: 'join' }, () => {
        setIsConnected(true);
        setLastActivity(new Date());
      })
      .on('presence', { event: 'leave' }, () => {
        setIsConnected(false);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
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
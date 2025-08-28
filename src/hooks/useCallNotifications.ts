import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';

export interface CallInvitation {
  id: string;
  callId: string;
  inviterId: string;
  inviterName: string;
  callType: 'video' | 'audio';
  conversationId?: string;
  expiresAt: string;
}

export const useCallNotifications = () => {
  const { user } = useAuth();
  const { showInfo } = useToastFeedback();
  const [incomingCall, setIncomingCall] = useState<CallInvitation | null>(null);
  const [signalingSocket, setSignalingSocket] = useState<WebSocket | null>(null);

  // Connect to signaling server for call notifications
  const connectToSignaling = useCallback(() => {
    if (!user || signalingSocket) return;

    const wsUrl = `wss://jpxqywtitjjphkiuokov.functions.supabase.co/functions/v1/webrtc-signaling`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to signaling server for notifications');
      setSignalingSocket(ws);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'incoming-call') {
        console.log('Incoming call notification:', message);
        
        const invitation: CallInvitation = {
          id: message.invitationId,
          callId: message.callId,
          inviterId: message.callerId,
          inviterName: message.callerName,
          callType: message.callType,
          conversationId: message.conversationId,
          expiresAt: new Date(Date.now() + 2 * 60 * 1000).toISOString() // 2 minutes from now
        };
        
        setIncomingCall(invitation);
        showInfo(`Incoming ${message.callType} call from ${message.callerName}`);
        
        // Auto-expire invitation after 2 minutes
        setTimeout(() => {
          setIncomingCall(prev => 
            prev?.id === invitation.id ? null : prev
          );
        }, 2 * 60 * 1000);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from signaling server');
      setSignalingSocket(null);
    };

    ws.onerror = (error) => {
      console.error('Signaling connection error:', error);
      setSignalingSocket(null);
    };

  }, [user, signalingSocket, showInfo]);

  // Listen for real-time call invitations from database
  useEffect(() => {
    if (!user) return;

    const setupRealtimeSubscription = async () => {
      try {
        const channel = supabase
          .channel('call-invitations')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'call_invitations',
              filter: `invitee_id=eq.${user.id}`
            },
            async (payload) => {
              console.log('New call invitation from database:', payload);
              
              // Get additional call details
              const { data: callData } = await supabase
                .from('video_calls')
                .select('*')
                .eq('id', payload.new.call_id)
                .single();
                
              // Get caller profile
              const { data: callerProfile } = await supabase
                .from('user_profiles')
                .select('full_name')
                .eq('user_id', payload.new.inviter_id)
                .single();
                
              if (callData) {
                const invitation: CallInvitation = {
                  id: payload.new.id,
                  callId: payload.new.call_id,
                  inviterId: payload.new.inviter_id,
                  inviterName: callerProfile?.full_name || 'Unknown',
                  callType: callData.call_type as 'video' | 'audio',
                  conversationId: callData.conversation_id,
                  expiresAt: payload.new.expires_at
                };
                
                setIncomingCall(invitation);
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'call_invitations',
              filter: `invitee_id=eq.${user.id}`
            },
            (payload) => {
              // Clear invitation if it was responded to
              if (payload.new.status !== 'pending') {
                setIncomingCall(prev => 
                  prev?.id === payload.new.id ? null : prev
                );
              }
            }
          )
          .subscribe((status, error) => {
            if (error) {
              console.error('Call invitations realtime subscription error:', error);
              console.log('Call invitations realtime disabled - app will work without live updates');
            } else {
              console.log('Call invitations realtime subscription status:', status);
            }
          });

        // Connect to signaling server
        connectToSignaling();

        return () => {
          try {
            channel.unsubscribe();
          } catch (cleanupError) {
            console.warn('Error cleaning up call invitations realtime channel:', cleanupError);
          }
          if (signalingSocket) {
            signalingSocket.close();
            setSignalingSocket(null);
          }
        };
      } catch (error) {
        console.error('Failed to setup call invitations realtime subscription:', error);
        return () => {}; // Return empty cleanup function
      }
    };

    const cleanup = setupRealtimeSubscription();
    
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, [user, connectToSignaling, signalingSocket]);

  // Clear incoming call
  const clearIncomingCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  // Get active call invitations for current user
  const getActiveInvitations = useCallback(async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('call_invitations')
      .select(`
        *,
        video_calls(*)
      `)
      .eq('invitee_id', user.id)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error fetching call invitations:', error);
      return [];
    }

    // Get caller names for each invitation
    const invitationsWithNames = await Promise.all(
      data.map(async (invite) => {
        const { data: callerProfile } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('user_id', invite.inviter_id)
          .single();
          
        return {
          id: invite.id,
          callId: invite.call_id,
          inviterId: invite.inviter_id,
          inviterName: callerProfile?.full_name || 'Unknown',
          callType: invite.video_calls?.call_type as 'video' | 'audio' || 'video',
          conversationId: invite.video_calls?.conversation_id,
          expiresAt: invite.expires_at
        };
      })
    );
    
    return invitationsWithNames;
  }, [user]);

  // Get call history for current user
  const getCallHistory = useCallback(async (limit: number = 20) => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('video_calls')
      .select('*')
      .or(`caller_id.eq.${user.id},callee_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching call history:', error);
      return [];
    }

    return data || [];
  }, [user]);

  return {
    incomingCall,
    clearIncomingCall,
    getActiveInvitations,
    getCallHistory,
    signalingSocket
  };
};
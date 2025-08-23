import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';

export interface VideoCallState {
  callId: string | null;
  status: 'idle' | 'calling' | 'ringing' | 'connecting' | 'connected' | 'ended';
  isVideo: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  duration: number;
  remoteUserId: string | null;
  error: string | null;
}

export const useVideoCall = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToastFeedback();
  
  const [callState, setCallState] = useState<VideoCallState>({
    callId: null,
    status: 'idle',
    isVideo: true,
    isMuted: false,
    isVideoEnabled: true,
    isScreenSharing: false,
    duration: 0,
    remoteUserId: null,
    error: null
  });

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const signalingSocket = useRef<WebSocket | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<Date | null>(null);

  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ];

  // Initialize WebRTC peer connection
  const initializePeerConnection = useCallback(() => {
    if (peerConnection.current) return;

    peerConnection.current = new RTCPeerConnection({
      iceServers
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && signalingSocket.current) {
        signalingSocket.current.send(JSON.stringify({
          type: 'ice-candidate',
          callId: callState.callId,
          targetUserId: callState.remoteUserId,
          userId: user?.id,
          data: event.candidate
        }));
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log('Received remote stream');
      remoteStream.current = event.streams[0];
    };

    peerConnection.current.onconnectionstatechange = () => {
      const state = peerConnection.current?.connectionState;
      console.log('Connection state:', state);
      
      if (state === 'connected') {
        setCallState(prev => ({ ...prev, status: 'connected', error: null }));
        startCallTimer();
      } else if (state === 'failed' || state === 'disconnected') {
        setCallState(prev => ({ ...prev, error: 'Connection failed' }));
        endCall();
      }
    };
  }, [callState.callId, callState.remoteUserId, user?.id]);

  // Connect to signaling server
  const connectSignaling = useCallback(() => {
    if (signalingSocket.current) return;

    const wsUrl = `wss://jpxqywtitjjphkiuokov.functions.supabase.co/functions/v1/webrtc-signaling`;
    signalingSocket.current = new WebSocket(wsUrl);

    signalingSocket.current.onopen = () => {
      console.log('Connected to signaling server');
    };

    signalingSocket.current.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log('Received signaling message:', message.type);

      switch (message.type) {
        case 'offer':
          await handleOffer(message.data);
          break;
        case 'answer':
          await handleAnswer(message.data);
          break;
        case 'ice-candidate':
          await handleIceCandidate(message.data);
          break;
        case 'call-response':
          handleCallResponse(message);
          break;
        case 'user-joined':
          console.log('User joined call:', message.userId);
          break;
        case 'user-left':
          console.log('User left call:', message.userId);
          endCall();
          break;
        case 'error':
          console.error('Signaling error:', message.message);
          setCallState(prev => ({ ...prev, error: message.message }));
          break;
      }
    };

    signalingSocket.current.onclose = () => {
      console.log('Disconnected from signaling server');
      signalingSocket.current = null;
    };

    signalingSocket.current.onerror = (error) => {
      console.error('Signaling error:', error);
      setCallState(prev => ({ ...prev, error: 'Signaling connection failed' }));
    };
  }, []);

  // Get user media
  const getUserMedia = useCallback(async (isVideo: boolean = true) => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true
      });
      return localStream.current;
    } catch (error) {
      console.error('Error accessing media:', error);
      setCallState(prev => ({ ...prev, error: 'Failed to access camera/microphone' }));
      throw error;
    }
  }, []);

  // Start call timer
  const startCallTimer = useCallback(() => {
    startTime.current = new Date();
    durationInterval.current = setInterval(() => {
      if (startTime.current) {
        const duration = Math.floor((Date.now() - startTime.current.getTime()) / 1000);
        setCallState(prev => ({ ...prev, duration }));
      }
    }, 1000);
  }, []);

  // Stop call timer
  const stopCallTimer = useCallback(() => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
  }, []);

  // Handle WebRTC offer
  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnection.current) return;

    await peerConnection.current.setRemoteDescription(offer);
    
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        peerConnection.current!.addTrack(track, localStream.current!);
      });
    }

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    if (signalingSocket.current) {
      signalingSocket.current.send(JSON.stringify({
        type: 'answer',
        callId: callState.callId,
        targetUserId: callState.remoteUserId,
        userId: user?.id,
        data: answer
      }));
    }
  }, [callState.callId, callState.remoteUserId, user?.id]);

  // Handle WebRTC answer
  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnection.current) return;
    await peerConnection.current.setRemoteDescription(answer);
  }, []);

  // Handle ICE candidate
  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    if (!peerConnection.current) return;
    await peerConnection.current.addIceCandidate(candidate);
  }, []);

  // Handle call response
  const handleCallResponse = useCallback((message: any) => {
    if (message.accepted) {
      setCallState(prev => ({ ...prev, status: 'connecting' }));
      // Join the call room
      if (signalingSocket.current) {
        signalingSocket.current.send(JSON.stringify({
          type: 'join-room',
          callId: callState.callId,
          userId: user?.id
        }));
      }
    } else {
      setCallState(prev => ({ ...prev, status: 'ended', error: 'Call declined' }));
      showError('Call was declined');
      endCall();
    }
  }, [callState.callId, user?.id, showError]);

  // Start outgoing call
  const startCall = useCallback(async (recipientId: string, isVideo: boolean = true, conversationId?: string) => {
    try {
      setCallState(prev => ({ 
        ...prev, 
        status: 'calling', 
        remoteUserId: recipientId, 
        isVideo,
        error: null 
      }));

      await getUserMedia(isVideo);
      connectSignaling();
      initializePeerConnection();

      // Wait for signaling connection
      await new Promise((resolve) => {
        const checkConnection = () => {
          if (signalingSocket.current?.readyState === WebSocket.OPEN) {
            resolve(true);
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });

      // Send call invitation
      signalingSocket.current!.send(JSON.stringify({
        type: 'call-invitation',
        userId: user?.id,
        targetUserId: recipientId,
        data: {
          callType: isVideo ? 'video' : 'audio',
          callerName: user?.user_metadata?.full_name || 'Unknown',
          conversationId
        }
      }));

    } catch (error) {
      console.error('Error starting call:', error);
      setCallState(prev => ({ ...prev, error: 'Failed to start call', status: 'idle' }));
      showError('Failed to start call');
    }
  }, [user, getUserMedia, connectSignaling, initializePeerConnection, showError]);

  // Answer incoming call
  const answerCall = useCallback(async (callId: string, invitationId: string, callerId: string, isVideo: boolean = true) => {
    try {
      setCallState(prev => ({ 
        ...prev, 
        callId, 
        status: 'connecting', 
        remoteUserId: callerId,
        isVideo,
        error: null 
      }));

      await getUserMedia(isVideo);
      connectSignaling();
      initializePeerConnection();

      // Wait for signaling connection
      await new Promise((resolve) => {
        const checkConnection = () => {
          if (signalingSocket.current?.readyState === WebSocket.OPEN) {
            resolve(true);
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });

      // Send call acceptance
      signalingSocket.current!.send(JSON.stringify({
        type: 'call-response',
        userId: user?.id,
        data: {
          invitationId,
          callId,
          accepted: true
        }
      }));

      // Join the call room
      signalingSocket.current!.send(JSON.stringify({
        type: 'join-room',
        callId,
        userId: user?.id
      }));

    } catch (error) {
      console.error('Error answering call:', error);
      setCallState(prev => ({ ...prev, error: 'Failed to answer call', status: 'idle' }));
      showError('Failed to answer call');
    }
  }, [user, getUserMedia, connectSignaling, initializePeerConnection, showError]);

  // Decline incoming call
  const declineCall = useCallback((callId: string, invitationId: string) => {
    if (signalingSocket.current) {
      signalingSocket.current.send(JSON.stringify({
        type: 'call-response',
        userId: user?.id,
        data: {
          invitationId,
          callId,
          accepted: false
        }
      }));
    }
  }, [user?.id]);

  // End call
  const endCall = useCallback(async () => {
    stopCallTimer();

    // Update call record with duration
    if (callState.callId && callState.status === 'connected') {
      const endTime = new Date();
      const duration = startTime.current ? Math.floor((endTime.getTime() - startTime.current.getTime()) / 1000) : 0;
      
      await supabase
        .from('video_calls')
        .update({
          status: 'ended',
          ended_at: endTime.toISOString(),
          duration
        })
        .eq('id', callState.callId);
    }

    // Leave call room
    if (signalingSocket.current && callState.callId) {
      signalingSocket.current.send(JSON.stringify({
        type: 'leave-room',
        callId: callState.callId,
        userId: user?.id
      }));
    }

    // Clean up streams
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }

    // Clean up peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Close signaling connection
    if (signalingSocket.current) {
      signalingSocket.current.close();
      signalingSocket.current = null;
    }

    setCallState({
      callId: null,
      status: 'idle',
      isVideo: true,
      isMuted: false,
      isVideoEnabled: true,
      isScreenSharing: false,
      duration: 0,
      remoteUserId: null,
      error: null
    });

    showSuccess('Call ended');
  }, [callState, user?.id, stopCallTimer, showSuccess]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setCallState(prev => ({ ...prev, isMuted: !audioTrack.enabled }));
      }
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCallState(prev => ({ ...prev, isVideoEnabled: videoTrack.enabled }));
      }
    }
  }, []);

  // Get local stream for UI
  const getLocalStream = useCallback(() => localStream.current, []);
  const getRemoteStream = useCallback(() => remoteStream.current, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  return {
    callState,
    startCall,
    answerCall,
    declineCall,
    endCall,
    toggleMute,
    toggleVideo,
    getLocalStream,
    getRemoteStream
  };
};
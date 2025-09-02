import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CallState {
  isActive: boolean;
  isIncoming: boolean;
  callerInfo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  callType: 'voice' | 'video';
  duration: number;
  status: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';
}

interface VoiceRecordingState {
  isRecording: boolean;
  duration: number;
  audioBlob?: Blob;
}

export const useVoiceVideo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isIncoming: false,
    callType: 'voice',
    duration: 0,
    status: 'idle'
  });
  
  const [recordingState, setRecordingState] = useState<VoiceRecordingState>({
    isRecording: false,
    duration: 0
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Voice Recording Functions
  const startVoiceRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setRecordingState(prev => ({ ...prev, audioBlob }));
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      setRecordingState({ isRecording: true, duration: 0 });
      
      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setRecordingState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      
    } catch (error) {
      console.error('Error starting voice recording:', error);
      toast({
        title: 'Recording Error',
        description: 'Failed to access microphone',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const stopVoiceRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      
      setRecordingState(prev => ({ ...prev, isRecording: false }));
    }
  }, [recordingState.isRecording]);

  const sendVoiceMessage = useCallback(async (recipientId: string, conversationId: string) => {
    if (!recordingState.audioBlob || !user) return false;

    try {
      // Convert blob to base64
      const reader = new FileReader();
      return new Promise<boolean>((resolve) => {
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          
          if (!base64Audio) {
            resolve(false);
            return;
          }

          // Send to voice transcription service
          const { data, error } = await supabase.functions.invoke('voice-transcription', {
            body: { audio: base64Audio }
          });

          if (error) throw error;

          // Store voice message in chat
          const { error: messageError } = await supabase
            .from('messages')
            .insert({
              conversation_id: conversationId,
              sender_id: user.id,
              recipient_id: recipientId,
              message_type: 'voice',
              content: data.text || 'Voice message',
              attachment_url: base64Audio, // Store base64 audio
              file_metadata: {
                duration: recordingState.duration,
                type: 'audio/webm'
              }
            });

          if (messageError) throw messageError;

          setRecordingState({ isRecording: false, duration: 0, audioBlob: undefined });
          resolve(true);
        };
        
        reader.readAsDataURL(recordingState.audioBlob);
      });
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast({
        title: 'Send Error',
        description: 'Failed to send voice message',
        variant: 'destructive'
      });
      return false;
    }
  }, [recordingState.audioBlob, recordingState.duration, user, toast]);

  // Video/Voice Call Functions
  const initiateCall = useCallback(async (recipientId: string, callType: 'voice' | 'video') => {
    try {
      setCallState({
        isActive: true,
        isIncoming: false,
        callType,
        duration: 0,
        status: 'calling'
      });

      // Use existing video call hook for WebRTC functionality
      // This would integrate with the useVideoCall hook
      
      toast({
        title: 'Call Starting',
        description: `Initiating ${callType} call...`,
      });
      
    } catch (error) {
      console.error('Error initiating call:', error);
      toast({
        title: 'Call Error',
        description: 'Failed to start call',
        variant: 'destructive'
      });
      setCallState(prev => ({ ...prev, status: 'idle', isActive: false }));
    }
  }, [toast]);

  const endCall = useCallback(() => {
    setCallState({
      isActive: false,
      isIncoming: false,
      callType: 'voice',
      duration: 0,
      status: 'ended'
    });
    
    // Clean up streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }, []);

  const answerCall = useCallback(() => {
    setCallState(prev => ({ ...prev, status: 'connected' }));
  }, []);

  const declineCall = useCallback(() => {
    setCallState(prev => ({ ...prev, status: 'ended', isActive: false }));
  }, []);

  return {
    // Call state
    callState,
    
    // Recording state
    recordingState,
    
    // Voice recording functions
    startVoiceRecording,
    stopVoiceRecording,
    sendVoiceMessage,
    
    // Call functions
    initiateCall,
    endCall,
    answerCall,
    declineCall,
  };
};
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Square, Play, Pause, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number, transcription?: string) => void;
  onCancel: () => void;
  className?: string;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onCancel,
  className,
  disabled = false
}) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(audioBlob);
        
        // Stop the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Failed to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (recordedBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(recordedBlob);
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const transcribeAudio = async (blob: Blob): Promise<string | undefined> => {
    try {
      setIsTranscribing(true);
      
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      
      reader.readAsDataURL(blob);
      const base64Audio = await base64Promise;
      
      // Send to transcription service
      const { data, error } = await supabase.functions.invoke('voice-transcription', {
        body: { audio: base64Audio }
      });
      
      if (error) throw error;
      
      return data?.text;
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription Failed",
        description: "Could not transcribe audio. The message will be sent as voice only.",
        variant: "destructive",
      });
      return undefined;
    } finally {
      setIsTranscribing(false);
    }
  };

  const sendVoiceMessage = async () => {
    if (!recordedBlob) return;
    
    try {
      // Transcribe the audio
      const transcription = await transcribeAudio(recordedBlob);
      
      // Send the voice message with duration
      onRecordingComplete(recordedBlob, recordingTime, transcription);
      
      // Reset state
      setRecordedBlob(null);
      setRecordingTime(0);
      
      toast({
        title: "Voice Message Sent",
        description: transcription ? "Message sent with transcription" : "Voice message sent",
      });
      
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast({
        title: "Error",
        description: "Failed to send voice message",
        variant: "destructive",
      });
    }
  };

  const cancelRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    if (isPlaying) {
      pausePlayback();
    }
    onCancel();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (recordedBlob) {
    return (
      <div className={cn("flex items-center gap-2 p-3 bg-muted/50 rounded-lg", className)}>
        <div className="flex items-center gap-2 flex-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={isPlaying ? pausePlayback : playRecording}
            disabled={isTranscribing}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1">
            <div className="text-sm font-medium">Voice Message</div>
            <div className="text-xs text-muted-foreground">
              {formatTime(recordingTime)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={cancelRecording}
            disabled={isTranscribing}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={sendVoiceMessage}
            disabled={isTranscribing}
          >
            {isTranscribing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Send'
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className={cn("flex items-center gap-2 p-3 bg-red-50 rounded-lg", className)}>
        <Button
          size="sm"
          variant="destructive"
          onClick={stopRecording}
        >
          <Square className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="font-mono">{formatTime(recordingTime)}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={cancelRecording}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        size="sm"
        variant="ghost"
        onClick={startRecording}
        disabled={disabled}
        className="p-2"
      >
        <Mic className="h-4 w-4" />
      </Button>
    </div>
  );
};
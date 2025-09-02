import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Play, 
  Pause,
  Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceVideo } from '@/hooks/useVoiceVideo';
import { triggerHapticFeedback } from '@/utils/mobileOptimizations';

interface VoiceMessageRecorderProps {
  isVisible: boolean;
  onClose: () => void;
  onSend: (audioBlob: Blob, duration: number) => void;
  recipientName?: string;
}

export const VoiceMessageRecorder = ({ 
  isVisible, 
  onClose, 
  onSend, 
  recipientName 
}: VoiceMessageRecorderProps) => {
  const { recordingState, startVoiceRecording, stopVoiceRecording } = useVoiceVideo();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (recordingState.audioBlob) {
      const url = URL.createObjectURL(recordingState.audioBlob);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [recordingState.audioBlob]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    triggerHapticFeedback('light');
    await startVoiceRecording();
  };

  const handleStopRecording = () => {
    triggerHapticFeedback('medium');
    stopVoiceRecording();
  };

  const handleSend = () => {
    if (recordingState.audioBlob) {
      triggerHapticFeedback('light');
      onSend(recordingState.audioBlob, recordingState.duration);
      onClose();
    }
  };

  const handlePlayPause = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
      triggerHapticFeedback('light');
    }
  };

  const handleClose = () => {
    triggerHapticFeedback('light');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <Card className="w-full rounded-t-3xl rounded-b-none bg-background border-t">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Voice Message</h3>
              {recipientName && (
                <p className="text-sm text-muted-foreground">To: {recipientName}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Recording Interface */}
          <div className="text-center space-y-6">
            {/* Waveform Visual (Placeholder) */}
            <div className="h-16 bg-muted/30 rounded-lg flex items-center justify-center">
              {recordingState.isRecording ? (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 bg-primary rounded-full transition-all duration-150",
                        recordingState.isRecording 
                          ? "animate-pulse h-8" 
                          : "h-2"
                      )}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: recordingState.isRecording 
                          ? `${Math.random() * 32 + 8}px` 
                          : '8px'
                      }}
                    />
                  ))}
                </div>
              ) : recordingState.audioBlob ? (
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlayPause}
                    className="rounded-full"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {formatDuration(recordingState.duration)}
                  </span>
                </div>
              ) : (
                <p className="text-muted-foreground">Ready to record</p>
              )}
            </div>

            {/* Duration Display */}
            <div className="text-2xl font-mono font-bold text-primary">
              {formatDuration(recordingState.duration)}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-6">
              {!recordingState.audioBlob && (
                <Button
                  size="lg"
                  variant={recordingState.isRecording ? "destructive" : "default"}
                  onClick={recordingState.isRecording ? handleStopRecording : handleStartRecording}
                  className="rounded-full w-16 h-16"
                >
                  {recordingState.isRecording ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
              )}

              {recordingState.audioBlob && (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAudioUrl(null);
                      // Reset recording state would need to be added to hook
                    }}
                  >
                    Re-record
                  </Button>
                  <Button onClick={handleSend} className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              )}
            </div>

            {/* Recording Hint */}
            {!recordingState.isRecording && !recordingState.audioBlob && (
              <p className="text-sm text-muted-foreground">
                Tap the microphone to start recording
              </p>
            )}
            
            {recordingState.isRecording && (
              <p className="text-sm text-red-500 animate-pulse">
                Recording... Tap to stop
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
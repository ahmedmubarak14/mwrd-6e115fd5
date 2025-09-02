import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceVideo } from '@/hooks/useVoiceVideo';
import { triggerHapticFeedback } from '@/utils/mobileOptimizations';

interface VoiceVideoInterfaceProps {
  isVisible: boolean;
  onClose: () => void;
}

export const VoiceVideoInterface = ({ isVisible, onClose }: VoiceVideoInterfaceProps) => {
  const { callState, endCall, answerCall, declineCall } = useVoiceVideo();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    triggerHapticFeedback('medium');
    endCall();
    onClose();
  };

  const handleAnswer = () => {
    triggerHapticFeedback('light');
    answerCall();
  };

  const handleDecline = () => {
    triggerHapticFeedback('heavy');
    declineCall();
    onClose();
  };

  const toggleMute = () => {
    triggerHapticFeedback('light');
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    triggerHapticFeedback('light');
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleSpeaker = () => {
    triggerHapticFeedback('light');
    setIsSpeakerOn(!isSpeakerOn);
  };

  if (!isVisible || !callState.isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className={cn(
        "w-full max-w-md mx-auto bg-gradient-to-b from-background to-muted/50",
        isMinimized && "max-w-xs"
      )}>
        <CardContent className="p-6 text-center">
          {/* Minimize/Maximize Button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </div>

          {!isMinimized && (
            <>
              {/* Caller Info */}
              <div className="mb-8">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={callState.callerInfo?.avatar} />
                  <AvatarFallback className="text-2xl">
                    {callState.callerInfo?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-2">
                  {callState.callerInfo?.name || 'Unknown Caller'}
                </h2>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  {callState.callType === 'video' ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                  <span className="capitalize">{callState.callType} Call</span>
                </div>
              </div>

              {/* Call Status */}
              <div className="mb-6">
                {callState.status === 'calling' && (
                  <p className="text-muted-foreground animate-pulse">Calling...</p>
                )}
                {callState.status === 'ringing' && (
                  <p className="text-muted-foreground animate-pulse">Incoming call...</p>
                )}
                {callState.status === 'connected' && (
                  <p className="text-green-600 font-medium">
                    {formatDuration(callState.duration)}
                  </p>
                )}
              </div>

              {/* Video View (if video call) */}
              {callState.callType === 'video' && callState.status === 'connected' && (
                <div className="mb-6 bg-black rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-white/70">Video will appear here</p>
                </div>
              )}
            </>
          )}

          {/* Call Controls */}
          <div className={cn(
            "flex justify-center gap-4",
            isMinimized && "gap-2"
          )}>
            {callState.status === 'ringing' && callState.isIncoming ? (
              // Incoming call controls
              <>
                <Button
                  size={isMinimized ? "sm" : "lg"}
                  variant="destructive"
                  onClick={handleDecline}
                  className="rounded-full"
                >
                  <PhoneOff className={cn("h-5 w-5", !isMinimized && "h-6 w-6")} />
                </Button>
                <Button
                  size={isMinimized ? "sm" : "lg"}
                  variant="default"
                  onClick={handleAnswer}
                  className="rounded-full bg-green-600 hover:bg-green-700"
                >
                  <Phone className={cn("h-5 w-5", !isMinimized && "h-6 w-6")} />
                </Button>
              </>
            ) : (
              // Active call controls
              <>
                {!isMinimized && (
                  <>
                    {/* Mute Button */}
                    <Button
                      size="lg"
                      variant={isMuted ? "destructive" : "secondary"}
                      onClick={toggleMute}
                      className="rounded-full"
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>

                    {/* Video Toggle (for video calls) */}
                    {callState.callType === 'video' && (
                      <Button
                        size="lg"
                        variant={isVideoEnabled ? "secondary" : "destructive"}
                        onClick={toggleVideo}
                        className="rounded-full"
                      >
                        {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                      </Button>
                    )}

                    {/* Speaker Button */}
                    <Button
                      size="lg"
                      variant={isSpeakerOn ? "default" : "secondary"}
                      onClick={toggleSpeaker}
                      className="rounded-full"
                    >
                      {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    </Button>
                  </>
                )}

                {/* End Call Button */}
                <Button
                  size={isMinimized ? "sm" : "lg"}
                  variant="destructive"
                  onClick={handleEndCall}
                  className="rounded-full"
                >
                  <PhoneOff className={cn("h-5 w-5", !isMinimized && "h-6 w-6")} />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
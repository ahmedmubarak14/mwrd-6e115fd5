import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { WebRTCManager } from '@/utils/webrtc';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MoreVertical,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientAvatar?: string;
  isIncoming?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientAvatar,
  isIncoming = false,
  onAccept,
  onReject
}) => {
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ringing' | 'ended'>('ringing');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcManagerRef = useRef<WebRTCManager>();
  const callTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen && !webrtcManagerRef.current) {
      webrtcManagerRef.current = new WebRTCManager();
      
      webrtcManagerRef.current.setOnRemoteStream((stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });

      webrtcManagerRef.current.setOnConnectionStateChange((state) => {
        if (state === 'connected') {
          setCallState('connected');
          startCallTimer();
        } else if (state === 'disconnected' || state === 'failed') {
          setCallState('ended');
          stopCallTimer();
        }
      });
    }

    return () => {
      if (!isOpen && webrtcManagerRef.current) {
        webrtcManagerRef.current.endCall();
        stopCallTimer();
      }
    };
  }, [isOpen]);

  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const stopCallTimer = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = undefined;
    }
    setCallDuration(0);
  };

  const handleAcceptCall = async () => {
    if (!webrtcManagerRef.current) return;
    
    try {
      setCallState('connecting');
      const localStream = await webrtcManagerRef.current.startCall(true);
      
      if (localStream && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      
      // Simulate connection success after 2 seconds
      setTimeout(() => {
        setCallState('connected');
        startCallTimer();
      }, 2000);
      
      onAccept?.();
      
      toast({
        title: language === 'ar' ? 'تم قبول المكالمة' : 'Call Accepted',
        description: language === 'ar' ? 'تم بدء مكالمة الفيديو' : 'Video call started'
      });
    } catch (error) {
      console.error('Error accepting call:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في بدء المكالمة' : 'Failed to start call',
        variant: 'destructive'
      });
    }
  };

  const handleRejectCall = () => {
    webrtcManagerRef.current?.endCall();
    setCallState('ended');
    onReject?.();
    onClose();
    
    toast({
      title: language === 'ar' ? 'تم رفض المكالمة' : 'Call Rejected',
      description: language === 'ar' ? 'تم رفض مكالمة الفيديو' : 'Video call rejected'
    });
  };

  const handleEndCall = () => {
    webrtcManagerRef.current?.endCall();
    setCallState('ended');
    stopCallTimer();
    onClose();
    
    toast({
      title: language === 'ar' ? 'انتهت المكالمة' : 'Call Ended',
      description: language === 'ar' ? 'تم إنهاء مكالمة الفيديو' : 'Video call ended'
    });
  };

  const handleToggleMute = () => {
    if (webrtcManagerRef.current) {
      const muted = webrtcManagerRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  const handleToggleVideo = () => {
    if (webrtcManagerRef.current) {
      const disabled = webrtcManagerRef.current.toggleVideo();
      setIsVideoEnabled(!disabled);
    }
  };

  const handleScreenShare = async () => {
    if (!webrtcManagerRef.current) return;
    
    try {
      if (isScreenSharing) {
        // Stop screen sharing and return to camera
        const localStream = await webrtcManagerRef.current.startCall(true);
        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenStream = await webrtcManagerRef.current.getScreenShare();
        if (screenStream && localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error('Error with screen sharing:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في مشاركة الشاشة' : 'Failed to share screen',
        variant: 'destructive'
      });
    }
  };

  const formatCallDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-4xl w-full p-0 border-0 bg-black text-white overflow-hidden",
          isMinimized ? "h-64" : "h-[600px]"
        )}
      >
        {/* Video Container */}
        <div className="relative w-full h-full">
          {/* Remote Video (Full Screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Remote Video Placeholder */}
          {callState !== 'connected' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white/20">
                  <AvatarImage src={recipientAvatar} alt={recipientName} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {recipientName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-2">{recipientName}</h3>
                <p className="text-white/70">
                  {callState === 'ringing' && (language === 'ar' ? 'جاري الاتصال...' : 'Calling...')}
                  {callState === 'connecting' && (language === 'ar' ? 'جاري الاتصال...' : 'Connecting...')}
                </p>
              </div>
            </div>
          )}

          {/* Local Video (Picture in Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-white/20">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff className="h-8 w-8 text-white/70" />
              </div>
            )}
          </div>

          {/* Call Info */}
          {callState === 'connected' && (
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {formatCallDuration(callDuration)}
                </span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <div className="flex items-center justify-center gap-4">
              {/* Incoming Call Actions */}
              {isIncoming && callState === 'ringing' && (
                <>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="rounded-full w-16 h-16"
                    onClick={handleRejectCall}
                  >
                    <PhoneOff className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    className="rounded-full w-16 h-16 bg-green-600 hover:bg-green-700"
                    onClick={handleAcceptCall}
                  >
                    <Phone className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* In-Call Controls */}
              {callState === 'connected' && (
                <>
                  <Button
                    variant={isMuted ? 'destructive' : 'secondary'}
                    size="lg"
                    className="rounded-full w-12 h-12"
                    onClick={handleToggleMute}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant={!isVideoEnabled ? 'destructive' : 'secondary'}
                    size="lg"
                    className="rounded-full w-12 h-12"
                    onClick={handleToggleVideo}
                  >
                    {!isVideoEnabled ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant={isScreenSharing ? 'default' : 'secondary'}
                    size="lg"
                    className="rounded-full w-12 h-12"
                    onClick={handleScreenShare}
                  >
                    <Monitor className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full w-12 h-12"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant="destructive"
                    size="lg"
                    className="rounded-full w-16 h-16"
                    onClick={handleEndCall}
                  >
                    <PhoneOff className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full w-12 h-12"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Connecting/Calling Controls */}
              {(callState === 'connecting' || (callState === 'ringing' && !isIncoming)) && (
                <Button
                  variant="destructive"
                  size="lg"
                  className="rounded-full w-16 h-16"
                  onClick={handleEndCall}
                >
                  <PhoneOff className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
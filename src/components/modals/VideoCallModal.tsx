import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useVideoCall } from '@/hooks/useVideoCall';
import { CallInvitation } from '@/hooks/useCallNotifications';
import { cn } from '@/lib/utils';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId?: string;
  recipientName: string;
  recipientAvatar?: string;
  isIncoming?: boolean;
  incomingCall?: CallInvitation;
  conversationId?: string;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  recipientAvatar,
  isIncoming = false,
  incomingCall,
  conversationId
}) => {
  const { 
    callState, 
    startCall, 
    answerCall, 
    declineCall, 
    endCall, 
    toggleMute, 
    toggleVideo,
    getLocalStream,
    getRemoteStream 
  } = useVideoCall();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Handle incoming call acceptance
  const handleAcceptCall = async () => {
    if (incomingCall) {
      await answerCall(
        incomingCall.callId,
        incomingCall.id,
        incomingCall.inviterId,
        incomingCall.callType === 'video'
      );
    }
  };

  // Handle incoming call rejection
  const handleRejectCall = () => {
    if (incomingCall) {
      declineCall(incomingCall.callId, incomingCall.id);
    }
    onClose();
  };

  // Start outgoing call
  const handleStartCall = async (isVideo: boolean = true) => {
    if (recipientId) {
      await startCall(recipientId, isVideo, conversationId);
    }
  };

  // Handle call end
  const handleEndCall = () => {
    endCall();
    onClose();
  };

  // Update video elements when streams change
  useEffect(() => {
    const updateStreams = () => {
      const localStream = getLocalStream();
      const remoteStream = getRemoteStream();
      
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    // Update streams periodically when connected
    if (callState.status === 'connected' || callState.status === 'connecting') {
      updateStreams();
      const interval = setInterval(updateStreams, 1000);
      return () => clearInterval(interval);
    }
  }, [callState.status, getLocalStream, getRemoteStream]);

  // Auto-start outgoing call when modal opens
  useEffect(() => {
    if (isOpen && !isIncoming && callState.status === 'idle' && recipientId) {
      handleStartCall(true);
    }
  }, [isOpen, isIncoming, callState.status, recipientId]);

  // Close modal when call ends
  useEffect(() => {
    if (callState.status === 'ended' && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [callState.status, isOpen, onClose]);

  const formatCallDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (callState.status) {
      case 'calling':
        return 'Calling...';
      case 'ringing':
        return isIncoming ? 'Incoming call' : 'Ringing...';
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Connected';
      case 'ended':
        return 'Call ended';
      default:
        return 'Initializing...';
    }
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
          {callState.status !== 'connected' && (
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
                  {getStatusText()}
                </p>
                {callState.error && (
                  <p className="text-red-400 text-sm mt-2">
                    {callState.error}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Local Video (Picture in Picture) */}
          {(callState.isVideo || callState.status === 'connected') && (
            <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-white/20">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!callState.isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <VideoOff className="h-8 w-8 text-white/70" />
                </div>
              )}
            </div>
          )}

          {/* Call Info */}
          {callState.status === 'connected' && (
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {formatCallDuration(callState.duration)}
                </span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <div className="flex items-center justify-center gap-4">
              {/* Incoming Call Actions */}
              {isIncoming && (callState.status === 'idle' || callState.status === 'ringing') && (
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
              {callState.status === 'connected' && (
                <>
                  <Button
                    variant={callState.isMuted ? 'destructive' : 'secondary'}
                    size="lg"
                    className="rounded-full w-12 h-12"
                    onClick={toggleMute}
                  >
                    {callState.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant={!callState.isVideoEnabled ? 'destructive' : 'secondary'}
                    size="lg"
                    className="rounded-full w-12 h-12"
                    onClick={toggleVideo}
                  >
                    {!callState.isVideoEnabled ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant={isScreenSharing ? 'default' : 'secondary'}
                    size="lg"
                    className="rounded-full w-12 h-12"
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
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
                </>
              )}

              {/* Connecting/Calling Controls */}
              {(callState.status === 'connecting' || callState.status === 'calling') && (
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
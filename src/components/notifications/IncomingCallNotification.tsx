import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, PhoneOff, Video, VideoOff } from 'lucide-react';
import { CallInvitation } from '@/hooks/useCallNotifications';
import { useVideoCall } from '@/hooks/useVideoCall';

interface IncomingCallNotificationProps {
  invitation: CallInvitation;
  onClose: () => void;
}

export const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({
  invitation,
  onClose
}) => {
  const { answerCall, declineCall } = useVideoCall();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Calculate time left until expiration
  useEffect(() => {
    const updateTimeLeft = () => {
      const expirationTime = new Date(invitation.expiresAt).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((expirationTime - now) / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        onClose();
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [invitation.expiresAt, onClose]);

  const handleAccept = async () => {
    await answerCall(
      invitation.callId,
      invitation.id,
      invitation.inviterId,
      invitation.callType === 'video'
    );
    onClose();
  };

  const handleDecline = () => {
    declineCall(invitation.callId, invitation.id);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const CallIcon = invitation.callType === 'video' ? Video : Phone;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <Card className="w-80 shadow-lg border-primary/20 bg-background/95 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={invitation.inviterName} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {invitation.inviterName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">
                  {invitation.inviterName}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <CallIcon className="h-4 w-4" />
                  Incoming {invitation.callType} call
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Expires in {formatTime(timeLeft)}
            </div>
            <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000"
                style={{ 
                  width: `${Math.max(0, (timeLeft / 120) * 100)}%` 
                }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDecline}
              variant="destructive"
              size="sm"
              className="flex-1"
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              variant="default"
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Phone className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
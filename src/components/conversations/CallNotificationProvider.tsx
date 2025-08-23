import React, { createContext, useContext, useState } from 'react';
import { useCallNotifications, CallInvitation } from '@/hooks/useCallNotifications';
import { IncomingCallNotification } from '@/components/notifications/IncomingCallNotification';
import { VideoCallModal } from '@/components/modals/VideoCallModal';

interface CallNotificationContextType {
  showVideoCall: (recipientId: string, recipientName: string, conversationId?: string) => void;
}

const CallNotificationContext = createContext<CallNotificationContextType | null>(null);

export const useCallNotificationContext = () => {
  const context = useContext(CallNotificationContext);
  if (!context) {
    throw new Error('useCallNotificationContext must be used within CallNotificationProvider');
  }
  return context;
};

interface CallNotificationProviderProps {
  children: React.ReactNode;
}

export const CallNotificationProvider: React.FC<CallNotificationProviderProps> = ({ children }) => {
  const { incomingCall, clearIncomingCall } = useCallNotifications();
  const [outgoingCall, setOutgoingCall] = useState<{
    recipientId: string;
    recipientName: string;
    conversationId?: string;
  } | null>(null);

  const showVideoCall = (recipientId: string, recipientName: string, conversationId?: string) => {
    setOutgoingCall({ recipientId, recipientName, conversationId });
  };

  const closeOutgoingCall = () => {
    setOutgoingCall(null);
  };

  const closeIncomingCall = () => {
    clearIncomingCall();
  };

  return (
    <CallNotificationContext.Provider value={{ showVideoCall }}>
      {children}
      
      {/* Incoming Call Notification */}
      {incomingCall && (
        <IncomingCallNotification
          invitation={incomingCall}
          onClose={closeIncomingCall}
        />
      )}

      {/* Incoming Call Modal */}
      {incomingCall && (
        <VideoCallModal
          isOpen={true}
          onClose={closeIncomingCall}
          recipientName={incomingCall.inviterName}
          isIncoming={true}
          incomingCall={incomingCall}
        />
      )}

      {/* Outgoing Call Modal */}
      {outgoingCall && (
        <VideoCallModal
          isOpen={true}
          onClose={closeOutgoingCall}
          recipientId={outgoingCall.recipientId}
          recipientName={outgoingCall.recipientName}
          conversationId={outgoingCall.conversationId}
        />
      )}
    </CallNotificationContext.Provider>
  );
};
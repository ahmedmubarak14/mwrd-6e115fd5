import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Phone, Video } from "lucide-react";
import { useRealTimeChat } from "@/hooks/useRealTimeChat";
import { useAuth } from "@/contexts/AuthContext";
import { ChatInterface } from "./ChatInterface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuickChatButtonProps {
  recipientId?: string;
  recipientName?: string;
  requestId?: string;
  offerId?: string;
  variant?: 'button' | 'card';
  className?: string;
}

export const QuickChatButton: React.FC<QuickChatButtonProps> = ({
  recipientId,
  recipientName,
  requestId,
  offerId,
  variant = 'button',
  className
}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const { conversations, getUnreadCount } = useRealTimeChat();
  const { user } = useAuth();

  // Find existing conversation
  const existingConversation = conversations.find(conv => {
    if (requestId) return conv.request_id === requestId;
    if (offerId) return conv.offer_id === offerId;
    return false;
  });

  const unreadCount = existingConversation ? getUnreadCount(existingConversation.id) : 0;

  if (variant === 'card') {
    return (
      <>
        <div 
          className={`p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${className}`}
          onClick={() => setChatOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">
                  {recipientName ? `Chat with ${recipientName}` : 'Start Conversation'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {existingConversation ? 'Continue conversation' : 'Send a message'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="default" className="h-5 min-w-5 text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={chatOpen} onOpenChange={setChatOpen}>
          <DialogContent className="max-w-4xl h-[80vh] p-0">
            <ChatInterface
              initialConversationId={existingConversation?.id}
              recipientId={recipientId}
              requestId={requestId}
              offerId={offerId}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setChatOpen(true)}
        className={`relative ${className}`}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        {recipientName ? `Message ${recipientName}` : 'Start Chat'}
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 min-w-5 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <ChatInterface
            initialConversationId={existingConversation?.id}
            recipientId={recipientId}
            requestId={requestId}
            offerId={offerId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
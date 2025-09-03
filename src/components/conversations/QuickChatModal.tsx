import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, MessageSquare, Clock, Check, CheckCheck, Reply, MoreHorizontal, Phone, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeChat, type Message } from "@/hooks/useRealTimeChat";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface QuickChatModalProps {
  children?: React.ReactNode;
  recipientId: string;
  recipientName?: string;
  requestId?: string;
  offerId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  conversationType?: 'business' | 'support';
}

interface MessageWithStatus extends Message {
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
}

export const QuickChatModal = ({ 
  children, 
  recipientId, 
  recipientName = "Unknown User",
  requestId,
  offerId,
  open = false,
  onOpenChange,
  conversationType = 'business'
}: QuickChatModalProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const [message, setMessage] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<MessageWithStatus | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    conversations,
    messages,
    loading,
    error,
    activeConversation,
    setActiveConversation,
    startConversation,
    sendMessage: sendChatMessage,
    markAsRead,
    fetchMessages,
    getUnreadCount,
    getOtherParticipant
  } = useRealTimeChat();

  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [conversationMessages, setConversationMessages] = useState<MessageWithStatus[]>([]);
  const [otherParticipant, setOtherParticipant] = useState<any>(null);

  // Sync internal state with external props
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  // Handle modal state changes
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
    
    if (!newOpen) {
      // Reset state when modal closes
      setCurrentConversation(null);
      setConversationMessages([]);
      setOtherParticipant(null);
      setMessage("");
      setReplyToMessage(null);
    }
  };

  // Initialize conversation when modal opens
  useEffect(() => {
    if (isOpen && user) {
      initializeConversation();
    }
  }, [isOpen, user, recipientId]);

  // Fetch participant info
  useEffect(() => {
    if (currentConversation) {
      getOtherParticipant(currentConversation).then(setOtherParticipant);
    }
  }, [currentConversation]);

  // Update messages when they change
  useEffect(() => {
    if (activeConversation && messages[activeConversation]) {
      const msgs = messages[activeConversation].map(msg => ({
        ...msg,
        status: (msg.sender_id === user?.id ? 'sent' : 'delivered') as 'sent' | 'delivered'
      })) as MessageWithStatus[];
      setConversationMessages(msgs);
      scrollToBottom();
      
      // Mark messages as read
      const unreadMessages = msgs
        .filter(msg => msg.recipient_id === user?.id && !msg.read_at)
        .map(msg => msg.id);
      if (unreadMessages.length > 0) {
        markAsRead(unreadMessages);
      }
    }
  }, [messages, activeConversation, user]);

  const initializeConversation = async () => {
    try {
      const conversation = await startConversation(recipientId, requestId, offerId, conversationType);
      
      setCurrentConversation(conversation);
      setActiveConversation(conversation.id);
      await fetchMessages(conversation.id);
    } catch (error) {
      console.error('QuickChatModal: Error initializing conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversation) return;
    
    try {
      await sendChatMessage(activeConversation, message, recipientId);
      setMessage("");
      setReplyToMessage(null);
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
    }
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
    
    setTypingTimeout(timeout);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'sent': return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-primary" />;
      default: return null;
    }
  };

  const MessageBubble = ({ msg, isOwn }: { msg: MessageWithStatus; isOwn: boolean }) => (
    <div className={cn(
      "flex gap-2 mb-4",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={otherParticipant?.avatar_url} />
          <AvatarFallback>
            {otherParticipant?.full_name?.[0] || recipientName?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "max-w-[70%] group",
        isOwn ? "items-end" : "items-start"
      )}>
        {msg.replyTo && (
          <div className="text-xs text-muted-foreground mb-1 px-3 py-1 bg-muted rounded">
            Replying to: {conversationMessages.find(m => m.id === msg.replyTo)?.content?.substring(0, 50)}...
          </div>
        )}
        
        <div className={cn(
          "px-3 py-2 rounded-lg relative",
          isOwn 
            ? "bg-primary text-primary-foreground ml-auto" 
            : "bg-muted"
        )}>
          <p className="text-sm">{msg.content}</p>
          
          <div className={cn(
            "flex items-center gap-1 mt-1",
            isOwn ? "justify-end" : "justify-start"
          )}>
            <span className="text-xs opacity-70">
              {formatTime(msg.created_at)}
            </span>
            {isOwn && getMessageStatusIcon(msg.status || 'sent')}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setReplyToMessage(msg)}>
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={otherParticipant?.avatar_url} />
                <AvatarFallback>
                  {otherParticipant?.full_name?.[0] || recipientName?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{otherParticipant?.full_name || recipientName}</h3>
                <Badge variant="secondary" className="text-xs">
                  {conversationType === 'support' ? 'Support Agent' : (otherParticipant?.role || 'User')}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : conversationMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Start the conversation</h3>
              <p className="text-sm">
                Send your first message to {recipientName}
              </p>
            </div>
          ) : (
            <div className="py-4">
              {conversationMessages.map((msg) => (
                <MessageBubble 
                  key={msg.id} 
                  msg={msg} 
                  isOwn={msg.sender_id === user?.id} 
                />
              ))}
              {isTyping && (
                <div className="flex gap-2 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={otherParticipant?.avatar_url} />
                    <AvatarFallback>
                      {otherParticipant?.full_name?.[0] || recipientName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
        
        <div className="px-6 py-4 border-t">
          {replyToMessage && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-muted rounded text-sm">
              <Reply className="h-4 w-4" />
              <span>Replying to: {replyToMessage.content?.substring(0, 50)}...</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setReplyToMessage(null)}
                className="ml-auto h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type your message..."
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              disabled={!message.trim() || loading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

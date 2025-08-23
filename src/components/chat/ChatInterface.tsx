import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  MessageCircle, 
  Clock, 
  Check, 
  CheckCheck, 
  Reply, 
  MoreHorizontal, 
  Phone, 
  Video, 
  Paperclip,
  Smile 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeChat, type Conversation, type Message } from "@/hooks/useRealTimeChat";
import { TypingIndicator } from "./TypingIndicator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface MessageWithStatus extends Message {
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
}

interface ChatInterfaceProps {
  conversation?: Conversation;
  className?: string;
}

export const ChatInterface = ({ conversation, className }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<MessageWithStatus | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [otherParticipant, setOtherParticipant] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    messages,
    loading,
    setActiveConversation,
    sendMessage: sendChatMessage,
    markAsRead,
    fetchMessages,
    getOtherParticipant
  } = useRealTimeChat();

  const [conversationMessages, setConversationMessages] = useState<MessageWithStatus[]>([]);

  // Set active conversation when prop changes
  useEffect(() => {
    if (conversation) {
      setActiveConversation(conversation.id);
      fetchMessages(conversation.id);
      getOtherParticipant(conversation).then(setOtherParticipant);
    }
  }, [conversation]);

  // Update messages when they change
  useEffect(() => {
    if (conversation && messages[conversation.id]) {
      const msgs = messages[conversation.id].map(msg => ({
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
  }, [messages, conversation, user]);

  const handleSendMessage = async () => {
    if (!message.trim() || !conversation || !otherParticipant) return;
    
    const recipientId = conversation.client_id === user?.id ? conversation.vendor_id : conversation.client_id;
    
    try {
      await sendChatMessage(conversation.id, message, recipientId);
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
            {otherParticipant?.full_name?.[0] || otherParticipant?.company_name?.[0] || 'U'}
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
          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
          
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

  if (!conversation) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="text-center text-muted-foreground">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
          <p>Choose a conversation from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherParticipant?.avatar_url} />
            <AvatarFallback>
              {otherParticipant?.full_name?.[0] || otherParticipant?.company_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {otherParticipant?.full_name || otherParticipant?.company_name || "Unknown User"}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {otherParticipant?.role || 'User'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {otherParticipant?.status === 'approved' ? 'Verified' : 'Pending'}
              </span>
            </div>
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
      </div>
      
      {/* Messages Area */}
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
              Send your first message to {otherParticipant?.full_name || "this user"}
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
                    {otherParticipant?.full_name?.[0] || otherParticipant?.company_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <TypingIndicator userName={otherParticipant?.full_name || otherParticipant?.company_name} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {/* Message Input Area */}
      <div className="px-6 py-4 border-t bg-background">
        {replyToMessage && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-muted rounded text-sm">
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
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          
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
          
          <Button variant="outline" size="icon" className="shrink-0">
            <Smile className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={!message.trim() || loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
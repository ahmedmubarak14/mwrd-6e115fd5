import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRealTimeChat, type Conversation, type Message } from '@/hooks/useRealTimeChat';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  Mic, 
  MicOff,
  PhoneOff,
  Paperclip,
  Smile,
  MoreVertical,
  Check,
  CheckCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RealTimeChatModalProps {
  children: React.ReactNode;
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  requestId?: string;
  offerId?: string;
  conversationId?: string;
}

export const RealTimeChatModal: React.FC<RealTimeChatModalProps> = ({
  children,
  recipientId,
  recipientName = "User",
  recipientAvatar,
  requestId,
  offerId,
  conversationId: initialConversationId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout>();

  const {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    startConversation,
    sendMessage,
    markAsRead,
    getUnreadCount,
    getOtherParticipant
  } = useRealTimeChat();

  // Find or create conversation
  const currentConversation = React.useMemo(() => {
    if (initialConversationId) {
      return conversations.find(c => c.id === initialConversationId);
    }
    if (recipientId) {
      return conversations.find(c => 
        getOtherParticipant(c) === recipientId &&
        (!requestId || c.request_id === requestId) &&
        (!offerId || c.offer_id === offerId)
      );
    }
    return null;
  }, [conversations, initialConversationId, recipientId, requestId, offerId, getOtherParticipant]);

  const currentMessages = React.useMemo(() => {
    if (!activeConversation) return [];
    return messages[activeConversation] || [];
  }, [messages, activeConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Set active conversation when modal opens
  useEffect(() => {
    if (isOpen && currentConversation) {
      setActiveConversation(currentConversation.id);
      
      // Mark messages as read
      const unreadMessages = currentMessages
        .filter(msg => msg.recipient_id === user?.id && msg.message_status !== 'read')
        .map(msg => msg.id);
      
      if (unreadMessages.length > 0) {
        markAsRead(unreadMessages);
      }
    }
  }, [isOpen, currentConversation, setActiveConversation, currentMessages, user, markAsRead]);

  // Handle call timer
  useEffect(() => {
    if (isCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      setCallDuration(0);
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [isCallActive]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !recipientId) return;

    setIsLoading(true);
    
    try {
      let conversationId = currentConversation?.id;
      
      // Create conversation if it doesn't exist
      if (!conversationId && recipientId) {
        const newConversationId = await startConversation(recipientId, requestId, offerId);
        if (newConversationId) {
          conversationId = newConversationId;
          setActiveConversation(newConversationId);
        }
      }

      if (conversationId) {
        await sendMessage(conversationId, newMessage.trim(), recipientId);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في إرسال الرسالة' : 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartCall = () => {
    setIsCallActive(true);
    setIsVideoCall(false);
    toast({
      title: language === 'ar' ? 'بدء المكالمة' : 'Call Started',
      description: language === 'ar' ? 'تم بدء المكالمة الصوتية' : 'Voice call initiated'
    });
  };

  const handleStartVideo = () => {
    setIsCallActive(true);
    setIsVideoCall(true);
    toast({
      title: language === 'ar' ? 'بدء مكالمة الفيديو' : 'Video Call Started',
      description: language === 'ar' ? 'تم بدء مكالمة الفيديو' : 'Video call initiated'
    });
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsVideoCall(false);
    setIsMuted(false);
    toast({
      title: language === 'ar' ? 'انتهت المكالمة' : 'Call Ended',
      description: language === 'ar' ? 'تم إنهاء المكالمة' : 'Call has been ended'
    });
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMessageStatusIcon = (message: Message) => {
    if (message.sender_id !== user?.id) return null;
    
    if (message.message_status === 'read') {
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    } else if (message.message_status === 'delivered') {
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    } else {
      return <Check className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-md w-full h-[600px] p-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={recipientAvatar} alt={recipientName} />
              <AvatarFallback>{recipientName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{recipientName}</h3>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'متصل' : 'Online'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Call Controls */}
          <div className="flex items-center gap-2">
            {!isCallActive ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleStartCall}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleStartVideo}>
                  <Video className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button variant="destructive" size="sm" onClick={handleEndCall}>
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Call Status */}
        {isCallActive && (
          <div className="bg-primary/10 p-3 text-center border-b">
            <div className="text-sm font-medium">
              {isVideoCall 
                ? (language === 'ar' ? 'مكالمة فيديو جارية' : 'Video call in progress')
                : (language === 'ar' ? 'مكالمة صوتية جارية' : 'Voice call in progress')
              }
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCallDuration(callDuration)}
            </div>
            {isMuted && (
              <Badge variant="secondary" className="mt-1">
                {language === 'ar' ? 'مكتوم الصوت' : 'Muted'}
              </Badge>
            )}
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.sender_id === user?.id 
                    ? (language === 'ar' ? 'justify-start flex-row-reverse' : 'justify-end')
                    : (language === 'ar' ? 'justify-end flex-row-reverse' : 'justify-start')
                )}
              >
                {message.sender_id !== user?.id && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={recipientAvatar} alt={recipientName} />
                    <AvatarFallback className="text-xs">
                      {recipientName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={cn(
                  "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                  message.sender_id === user?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}>
                  <div>{message.content}</div>
                  <div className={cn(
                    "flex items-center gap-1 mt-1",
                    message.sender_id === user?.id 
                      ? (language === 'ar' ? 'justify-start' : 'justify-end')
                      : (language === 'ar' ? 'justify-end' : 'justify-start')
                  )}>
                    <span className={cn(
                      "text-xs opacity-70",
                      message.sender_id === user?.id 
                        ? "text-primary-foreground" 
                        : "text-muted-foreground"
                    )}>
                      {formatMessageTime(message.created_at)}
                    </span>
                    {getMessageStatusIcon(message)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder={language === 'ar' ? 'اكتب رسالة...' : 'Type a message...'}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Paperclip, 
  Image, 
  Mic, 
  MoreVertical,
  Search,
  Phone,
  Video,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRealTimeChat, type Message, type Conversation } from '@/hooks/useRealTimeChat';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface ConversationWithProfiles extends Conversation {
  client_profile?: {
    full_name: string;
    avatar_url?: string;
    company_name?: string;
  };
  vendor_profile?: {
    full_name: string;
    avatar_url?: string;
    company_name?: string;
  };
  unread_count?: number;
}

interface MessageWithProfile extends Message {
  sender_profile?: {
    full_name: string;
    avatar_url?: string;
    role: string;
  };
}

interface RealTimeChatInterfaceProps {
  className?: string;
  initialConversationId?: string;
  height?: string;
}

export const RealTimeChatInterface: React.FC<RealTimeChatInterfaceProps> = ({
  className,
  initialConversationId,
  height = "600px"
}) => {
  const { userProfile } = useAuth();
  const {
    conversations,
    messages,
    activeConversation,
    loading,
    setActiveConversation,
    sendMessage,
    startConversation,
    getOtherParticipant,
    getUnreadCount
  } = useRealTimeChat();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationsWithProfiles, setConversationsWithProfiles] = useState<ConversationWithProfiles[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set initial conversation
  useEffect(() => {
    if (initialConversationId && !activeConversation) {
      setActiveConversation(initialConversationId);
    }
  }, [initialConversationId, activeConversation, setActiveConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversation]);

  // Load conversations with profiles
  useEffect(() => {
    const loadConversationsWithProfiles = async () => {
      const withProfiles = await Promise.all(
        conversations.map(async (conv) => {
          const otherParticipant = await getOtherParticipant(conv);
          const unreadCount = getUnreadCount(conv.id);
          
          const isClientSide = conv.client_id === userProfile?.id;
          
          return {
            ...conv,
            [isClientSide ? 'vendor_profile' : 'client_profile']: otherParticipant ? {
              full_name: otherParticipant.full_name || 'Unknown User',
              avatar_url: otherParticipant.avatar_url,
              company_name: otherParticipant.company_name
            } : undefined,
            unread_count: unreadCount
          } as ConversationWithProfiles;
        })
      );
      
      setConversationsWithProfiles(withProfiles);
    };

    if (conversations.length > 0) {
      loadConversationsWithProfiles();
    }
  }, [conversations, getOtherParticipant, getUnreadCount, userProfile]);

  // Filter conversations based on search
  const filteredConversations = conversationsWithProfiles.filter(conv => {
    if (!searchQuery) return true;
    
    const otherUser = conv.client_id === userProfile?.id 
      ? conv.vendor_profile 
      : conv.client_profile;
    
    return (
      otherUser?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherUser?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversation) return;

    const message = messageInput;
    setMessageInput('');
    
    // Find the conversation to get recipient ID
    const conversation = conversationsWithProfiles.find(c => c.id === activeConversation);
    if (!conversation || !userProfile) return;

    const recipientId = conversation.client_id === userProfile.id 
      ? conversation.vendor_id 
      : conversation.client_id;

    await sendMessage(activeConversation, message, recipientId);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherUserInfo = (conversation: ConversationWithProfiles) => {
    if (!userProfile) return null;
    
    return conversation.client_id === userProfile.id 
      ? conversation.vendor_profile 
      : conversation.client_profile;
  };

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const currentMessages = activeConversation ? messages[activeConversation] || [] : [];
  const activeConversationData = conversationsWithProfiles.find(c => c.id === activeConversation);

  return (
    <Card className={cn("flex h-full", className)} style={{ height }}>
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Messages</h3>
            <Badge variant="secondary" className="ml-auto">
              {conversationsWithProfiles.length}
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const otherUser = getOtherUserInfo(conversation);
                const isActive = activeConversation === conversation.id;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                    )}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={otherUser?.avatar_url} />
                      <AvatarFallback>
                        {otherUser?.full_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">
                          {otherUser?.full_name || 'Unknown User'}
                        </p>
                        {conversation.last_message_at && (
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(conversation.last_message_at)}
                          </span>
                        )}
                      </div>
                      
                      {otherUser?.company_name && (
                        <p className="text-xs text-muted-foreground truncate">
                          {otherUser.company_name}
                        </p>
                      )}
                      
                      {conversation.last_message && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.last_message}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" size="sm">
                          {conversation.conversation_type}
                        </Badge>
                        {conversation.unread_count && conversation.unread_count > 0 && (
                          <Badge variant="destructive" size="sm">
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversationData ? (
          <>
            {/* Chat Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getOtherUserInfo(activeConversationData)?.avatar_url} />
                    <AvatarFallback>
                      {getOtherUserInfo(activeConversationData)?.full_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">
                      {getOtherUserInfo(activeConversationData)?.full_name || 'Unknown User'}
                    </h4>
                    {getOtherUserInfo(activeConversationData)?.company_name && (
                      <p className="text-sm text-muted-foreground">
                        {getOtherUserInfo(activeConversationData)?.company_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <Separator />

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentMessages.map((message) => {
                  const isOwnMessage = message.sender_id === userProfile?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        isOwnMessage ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isOwnMessage && activeConversationData && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={getOtherUserInfo(activeConversationData)?.avatar_url} />
                          <AvatarFallback>
                            {getOtherUserInfo(activeConversationData)?.full_name?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          isOwnMessage
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                         {!isOwnMessage && activeConversationData && (
                           <p className="text-xs font-medium mb-1">
                             {getOtherUserInfo(activeConversationData)?.full_name || 'User'}
                           </p>
                         )}
                        
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>

                        {message.attachment_url && (
                          <div className="mt-2">
                            {message.message_type === 'image' ? (
                              <img
                                src={message.attachment_url}
                                alt="Attachment"
                                className="rounded max-w-full h-auto"
                              />
                            ) : (
                              <a
                                href={message.attachment_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs underline"
                              >
                                View Attachment
                              </a>
                            )}
                          </div>
                        )}

                        <p className="text-xs opacity-70 mt-2">
                          {formatMessageTime(message.created_at)}
                        </p>
                      </div>

                      {isOwnMessage && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={userProfile?.avatar_url} />
                          <AvatarFallback>
                            {userProfile?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mic className="h-4 w-4" />
                </Button>
                
                <Input
                  ref={inputRef}
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealTimeChat } from "@/hooks/useRealTimeChat";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Send, Paperclip, Image, Mic, MoreVertical, Phone, Video, Archive, Search } from "lucide-react";
import { FileUploader } from "./FileUploader";
import { VoiceRecorder } from "./VoiceRecorder";
import { MessageBubble } from "./MessageBubble";
import { ConversationList } from "./ConversationList";
import { TypingIndicator } from "./TypingIndicator";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatInterfaceProps {
  initialConversationId?: string;
  recipientId?: string;
  requestId?: string;
  offerId?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialConversationId,
  recipientId,
  requestId,
  offerId
}) => {
  const {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    startConversation,
    sendMessage,
    fetchMessages,
    markAsRead,
    getUnreadCount,
    getOtherParticipant,
    loading
  } = useRealTimeChat();

  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [otherParticipant, setOtherParticipant] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversation]);

  // Initialize conversation if IDs are provided
  useEffect(() => {
    if (initialConversationId) {
      setActiveConversation(initialConversationId);
      fetchMessages(initialConversationId);
    } else if (recipientId && user) {
      handleStartConversation(recipientId);
    }
  }, [initialConversationId, recipientId, user]);

  // Load other participant info when conversation changes
  useEffect(() => {
    if (activeConversation) {
      const conversation = conversations.find(c => c.id === activeConversation);
      if (conversation) {
        getOtherParticipant(conversation).then(setOtherParticipant);
        fetchMessages(activeConversation);
      }
    }
  }, [activeConversation, conversations]);

  // Mark messages as read when conversation is active
  useEffect(() => {
    if (activeConversation && user) {
      const conversationMessages = messages[activeConversation] || [];
      const unreadMessages = conversationMessages
        .filter(msg => msg.recipient_id === user.id && !msg.read_at)
        .map(msg => msg.id);
      
      if (unreadMessages.length > 0) {
        markAsRead(unreadMessages);
      }
    }
  }, [activeConversation, messages, user, markAsRead]);

  const handleStartConversation = async (targetRecipientId: string) => {
    try {
      const conversation = await startConversation(
        targetRecipientId,
        requestId,
        offerId
      );
      setActiveConversation(conversation.id);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !otherParticipant) return;

    try {
      await sendMessage(
        activeConversation,
        newMessage.trim(),
        otherParticipant.user_id,
        'text'
      );
      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (url: string, fileName: string, fileSize: number, messageType: 'image' | 'file') => {
    if (!activeConversation || !otherParticipant) return;

    try {
      const content = messageType === 'image' ? '📷 Image' : `📎 ${fileName}`;
      await sendMessage(
        activeConversation,
        content,
        otherParticipant.user_id,
        messageType,
        url
      );
      setShowFileUploader(false);
    } catch (error) {
      console.error('Error sending file:', error);
      toast({
        title: "Error",
        description: "Failed to send file",
        variant: "destructive"
      });
    }
  };

  const handleVoiceMessage = async (audioUrl: string) => {
    if (!activeConversation || !otherParticipant) return;

    try {
      await sendMessage(
        activeConversation,
        '🎵 Voice message',
        otherParticipant.user_id,
        'voice',
        audioUrl
      );
      setShowVoiceRecorder(false);
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast({
        title: "Error",
        description: "Failed to send voice message",
        variant: "destructive"
      });
    }
  };

  const currentConversation = conversations.find(c => c.id === activeConversation);
  const conversationMessages = activeConversation ? messages[activeConversation] || [] : [];
  const filteredMessages = conversationMessages.filter(msg => 
    searchQuery ? msg.content.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] max-w-6xl mx-auto border rounded-lg overflow-hidden bg-background">
      {/* Conversation List */}
      <div className="w-1/3 border-r">
        <ConversationList
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={setActiveConversation}
          getUnreadCount={getUnreadCount}
          getOtherParticipant={getOtherParticipant}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation && currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {otherParticipant?.avatar_url ? (
                      <img 
                        src={otherParticipant.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary font-medium">
                        {(otherParticipant?.company_name || otherParticipant?.full_name || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {otherParticipant?.company_name || otherParticipant?.full_name || 'Loading...'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {otherParticipant?.role === 'vendor' ? 'Vendor' : 'Client'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-48"
                    />
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive Conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    {searchQuery ? 'No messages found matching your search.' : 'No messages yet. Start the conversation!'}
                  </div>
                ) : (
                  filteredMessages.map((message, index) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.sender_id === user?.id}
                      showAvatar={
                        index === 0 || 
                        filteredMessages[index - 1]?.sender_id !== message.sender_id
                      }
                      otherParticipant={otherParticipant}
                    />
                  ))
                )}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFileUploader(true)}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFileUploader(true)}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVoiceRecorder(true)}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="mb-4 text-4xl">💬</div>
              <h3 className="text-lg font-medium mb-2">Select a Conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* File Upload Modal */}
      {showFileUploader && (
        <FileUploader
          onUpload={handleFileUpload}
          onClose={() => setShowFileUploader(false)}
        />
      )}

      {/* Voice Recorder Modal */}
      {showVoiceRecorder && (
        <VoiceRecorder
          onRecordingComplete={handleVoiceMessage}
          onClose={() => setShowVoiceRecorder(false)}
        />
      )}
    </div>
  );
};
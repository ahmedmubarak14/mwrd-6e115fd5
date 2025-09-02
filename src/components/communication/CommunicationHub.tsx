import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Paperclip, User } from "lucide-react";
import { useCommunicationHub, Conversation, Message } from "@/hooks/useCommunicationHub";
import { format } from "date-fns";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation?: string;
  onSelectConversation: (conversationId: string) => void;
  getUnreadCount: (conversationId: string) => number;
}

const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation, 
  getUnreadCount 
}: ConversationListProps) => {
  if (conversations.length === 0) {
    return (
      <Card className="p-6 text-center">
        <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Conversations</h3>
        <p className="text-muted-foreground">Start a conversation with a client or vendor.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const unreadCount = getUnreadCount(conversation.id);
        const isSelected = selectedConversation === conversation.id;

        return (
          <Card
            key={conversation.id}
            className={`p-4 cursor-pointer transition-colors ${
              isSelected ? 'bg-accent' : 'hover:bg-accent/50'
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-sm">
                    Conversation #{conversation.id.slice(0, 8)}
                  </span>
                  {unreadCount > 0 && (
                    <Badge variant="default" className="h-5 px-2 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                {conversation.last_message && (
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message}
                  </p>
                )}
                {conversation.last_message_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(conversation.last_message_at), 'MMM dd, HH:mm')}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender_id === currentUserId;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {format(new Date(message.created_at), 'HH:mm')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 min-h-[40px] max-h-[120px]"
          disabled={disabled}
        />
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-10 w-10 p-0"
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="h-10 w-10 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const CommunicationHub = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { 
    conversations, 
    messages, 
    loading, 
    sendMessage, 
    fetchMessages, 
    getUnreadCount 
  } = useCommunicationHub();

  const handleSelectConversation = async (conversationId: string) => {
    setSelectedConversation(conversationId);
    await fetchMessages(conversationId);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    const recipientId = conversation.client_id === 'current_user' 
      ? conversation.vendor_id 
      : conversation.client_id;

    await sendMessage({
      conversation_id: selectedConversation,
      recipient_id: recipientId,
      content,
      message_type: 'text'
    });
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <Card className="lg:col-span-1 p-4 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-2 p-4 animate-pulse">
          <div className="h-full bg-muted rounded"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Conversations</h2>
        </div>
        <ScrollArea className="h-[550px] p-4">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation || undefined}
            onSelectConversation={handleSelectConversation}
            getUnreadCount={getUnreadCount}
          />
        </ScrollArea>
      </Card>

      {/* Message View */}
      <Card className="lg:col-span-2 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b">
              <h3 className="font-semibold">
                Conversation #{selectedConversation.slice(0, 8)}
              </h3>
            </div>
            <MessageList
              messages={messages}
              currentUserId="current_user" // This should be actual user ID
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={loading}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start messaging.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
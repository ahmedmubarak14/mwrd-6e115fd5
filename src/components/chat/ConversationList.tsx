import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Archive } from "lucide-react";
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  client_id: string;
  vendor_id: string;
  last_message?: string;
  last_message_at: string;
  status: string;
  conversation_type?: string;
  unread_count_client?: number;
  unread_count_vendor?: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
  getUnreadCount: (conversationId: string) => number;
  getOtherParticipant: (conversation: Conversation) => Promise<any>;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  getUnreadCount,
  getOtherParticipant
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [participantData, setParticipantData] = useState<Record<string, any>>({});
  const [showArchived, setShowArchived] = useState(false);

  // Load participant data for all conversations
  useEffect(() => {
    const loadParticipants = async () => {
      const data: Record<string, any> = {};
      for (const conversation of conversations) {
        try {
          const participant = await getOtherParticipant(conversation);
          if (participant) {
            data[conversation.id] = participant;
          }
        } catch (error) {
          console.error('Error loading participant:', error);
        }
      }
      setParticipantData(data);
    };

    if (conversations.length > 0) {
      loadParticipants();
    }
  }, [conversations, getOtherParticipant]);

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isThisWeek(date)) {
      return format(date, 'EEE');
    } else {
      return format(date, 'dd/MM');
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const participant = participantData[conversation.id];
    if (!participant) return false;

    const searchText = searchQuery.toLowerCase();
    const name = (participant.company_name || participant.full_name || '').toLowerCase();
    const lastMessage = (conversation.last_message || '').toLowerCase();
    
    return name.includes(searchText) || lastMessage.includes(searchText);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => {
                const participant = participantData[conversation.id];
                const unreadCount = getUnreadCount(conversation.id);
                const isActive = activeConversation === conversation.id;

                if (!participant) return null;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                      isActive && "bg-muted border-l-2 border-l-primary"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        {participant.avatar_url ? (
                          <img 
                            src={participant.avatar_url} 
                            alt="Avatar" 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-medium">
                            {(participant.company_name || participant.full_name || 'U')[0].toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={cn(
                            "font-medium truncate text-sm",
                            unreadCount > 0 && "font-semibold"
                          )}>
                            {participant.company_name || participant.full_name || 'Unknown User'}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {conversation.last_message_at && (
                              <span className="text-xs text-muted-foreground">
                                {formatLastMessageTime(conversation.last_message_at)}
                              </span>
                            )}
                            {unreadCount > 0 && (
                              <Badge variant="default" className="h-5 min-w-5 text-xs">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "text-sm text-muted-foreground truncate",
                            unreadCount > 0 && "font-medium text-foreground"
                          )}>
                            {conversation.last_message || 'No messages yet'}
                          </p>
                          
                          <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                            {participant.role === 'vendor' ? 'Vendor' : 'Client'}
                          </Badge>
                        </div>

                        {/* Conversation Type Indicator */}
                        {conversation.conversation_type && conversation.conversation_type !== 'business' && (
                          <div className="mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {conversation.conversation_type}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
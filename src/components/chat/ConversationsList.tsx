import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Phone, Video } from "lucide-react";
import { useRealTimeChat, type Conversation } from "@/hooks/useRealTimeChat";
import { MessageNotification } from "./MessageNotification";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface ConversationsListProps {
  onConversationSelect: (conversation: Conversation) => void;
  selectedConversation?: Conversation;
  className?: string;
}

export const ConversationsList = ({ 
  onConversationSelect, 
  selectedConversation, 
  className 
}: ConversationsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [participantsInfo, setParticipantsInfo] = useState<Record<string, any>>({});
  const { user } = useAuth();
  
  const {
    conversations,
    loading,
    getUnreadCount,
    getOtherParticipant
  } = useRealTimeChat();

  // Load participant info for all conversations
  useEffect(() => {
    const loadParticipants = async () => {
      const participantPromises = conversations.map(async (conv) => {
        const participant = await getOtherParticipant(conv);
        return { [conv.id]: participant };
      });
      
      const results = await Promise.all(participantPromises);
      const participantsMap = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setParticipantsInfo(participantsMap);
    };

    if (conversations.length > 0) {
      loadParticipants();
    }
  }, [conversations, getOtherParticipant]);

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery.trim()) return true;
    
    const participant = participantsInfo[conv.id];
    const searchLower = searchQuery.toLowerCase();
    
    return (
      participant?.full_name?.toLowerCase().includes(searchLower) ||
      participant?.company_name?.toLowerCase().includes(searchLower) ||
      conv.last_message?.toLowerCase().includes(searchLower)
    );
  });

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString();
  };

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
    const participant = participantsInfo[conversation.id];
    const unreadCount = getUnreadCount(conversation.id);
    const isSelected = selectedConversation?.id === conversation.id;

    return (
      <div
        onClick={() => onConversationSelect(conversation)}
        className={cn(
          "flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b transition-colors",
          isSelected && "bg-muted"
        )}
      >
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={participant?.avatar_url} />
            <AvatarFallback>
              {participant?.full_name?.[0] || participant?.company_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          {unreadCount > 0 && <MessageNotification count={unreadCount} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm truncate">
              {participant?.full_name || participant?.company_name || "Unknown User"}
            </h4>
            {conversation.last_message_at && (
              <span className="text-xs text-muted-foreground">
                {formatLastMessageTime(conversation.last_message_at)}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground truncate flex-1">
              {conversation.last_message || "No messages yet"}
            </p>
            <div className="flex gap-1 ml-2">
              <Badge variant="outline" className="text-xs">
                {participant?.role || 'User'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 px-4">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            {searchQuery ? (
              <>
                <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
                <p className="text-sm">Try searching with different terms</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                <p className="text-sm">Start a conversation with a client or supplier</p>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <ConversationItem 
                key={conversation.id} 
                conversation={conversation} 
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
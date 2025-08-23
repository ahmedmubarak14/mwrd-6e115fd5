import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, Clock, Plus, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeChat, type Conversation } from "@/hooks/useRealTimeChat";

interface ConversationsDropdownProps {
  children: React.ReactNode;
}

export const ConversationsDropdown = ({ children }: ConversationsDropdownProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    conversations, 
    loading, 
    getUnreadCount,
    getOtherParticipant,
    messages 
  } = useRealTimeChat();

  const [participantCache, setParticipantCache] = useState<Map<string, any>>(new Map());

  // Calculate total unread count
  const totalUnreadCount = conversations.reduce((total, conv) => {
    return total + getUnreadCount(conv.id);
  }, 0);

  // Cache participants for display
  useEffect(() => {
    const updateParticipants = async () => {
      const cache = new Map();
      for (const conversation of conversations.slice(0, 5)) { // Only cache first 5 for dropdown
        const participant = await getOtherParticipant(conversation);
        cache.set(conversation.id, participant);
      }
      setParticipantCache(cache);
    };
    
    if (conversations.length > 0) {
      updateParticipants();
    }
  }, [conversations, getOtherParticipant]);

  const handleConversationClick = (conversation: Conversation) => {
    navigate('/messages');
  };

  const handleViewAllMessages = () => {
    navigate('/messages');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          {children}
          {totalUnreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
            {totalUnreadCount > 0 && (
              <Badge variant="secondary" className="h-5 text-xs">
                {totalUnreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAllMessages}
            className="h-6 px-2 text-xs"
          >
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No conversations yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              Start messaging from requests or offers
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewAllMessages}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Go to Messages
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto">
              {conversations.slice(0, 5).map((conversation) => {
                const participant = participantCache.get(conversation.id);
                const unreadCount = getUnreadCount(conversation.id);
                
                return (
                  <DropdownMenuItem
                    key={conversation.id}
                    className="p-0 cursor-pointer"
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="flex items-start gap-3 p-3 w-full">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={participant?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {participant?.full_name?.[0] || participant?.company_name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">
                            {participant?.full_name || participant?.company_name || 'Unknown User'}
                          </p>
                          {unreadCount > 0 && (
                            <Badge className="h-4 w-4 flex items-center justify-center p-0 text-xs">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.last_message || 'No messages yet'}
                        </p>
                        
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline" className="text-xs h-4">
                            {participant?.role || 'User'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(conversation.last_message_at || conversation.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
            
            {conversations.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewAllMessages}
                    className="w-full justify-between text-xs"
                  >
                    View All {conversations.length} Conversations
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
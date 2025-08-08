import { useState, useEffect } from 'react';
import { MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { useUserProfiles } from '@/hooks/useUserProfiles';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { QuickChatModal } from './QuickChatModal';
import { cn } from '@/lib/utils';

interface ConversationsDropdownProps {
  isActive?: boolean;
  className?: string;
}

export const ConversationsDropdown = ({ isActive, className }: ConversationsDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const { conversations, getUnreadCount, getOtherParticipant, messages } = useRealTimeChat();
  const { fetchUserProfile, fetchMultipleProfiles, profiles } = useUserProfiles();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();

  // Fetch user profiles for all conversation participants
  useEffect(() => {
    const participantIds = conversations
      .map(conv => getOtherParticipant(conv))
      .filter(Boolean) as string[];
    
    if (participantIds.length > 0) {
      fetchMultipleProfiles(participantIds);
    }
  }, [conversations, getOtherParticipant, fetchMultipleProfiles]);

  // Calculate total unread count
  const totalUnreadCount = conversations.reduce((total, conv) => {
    return total + getUnreadCount(conv.id);
  }, 0);

  const handleConversationClick = (conversation: any) => {
    const otherParticipantId = getOtherParticipant(conversation);
    if (otherParticipantId) {
      setSelectedConversation(conversation);
      setChatModalOpen(true);
      setOpen(false);
    }
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins < 1 ? t('time.now') : `${diffMins}m`;
    } else if (diffDays < 1) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getLastMessage = (conversationId: string) => {
    const conversationMessages = messages[conversationId] || [];
    return conversationMessages[conversationMessages.length - 1];
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full gap-3 h-10 sm:h-12 text-sm sm:text-base rtl-justify-start rtl-flex relative",
              isActive && "bg-primary/10 text-primary hover:bg-primary/20",
              className
            )}
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">{t('nav.messages')}</span>
            {totalUnreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-80 p-0 mr-2" 
          side={language === 'ar' ? 'left' : 'right'}
          align="start"
        >
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t('nav.messages')}</h3>
              <Link to="/messages" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <span className="text-xs">{t('common.viewAll')}</span>
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          <ScrollArea className="h-96">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('messages.noConversations')}</p>
              </div>
            ) : (
              <div className="p-2">
                {conversations.slice(0, 8).map((conversation) => {
                  const unreadCount = getUnreadCount(conversation.id);
                  const lastMessage = getLastMessage(conversation.id);
                  const otherParticipantId = getOtherParticipant(conversation);
                  const otherParticipantProfile = otherParticipantId ? profiles[otherParticipantId] : null;
                  const displayName = otherParticipantProfile?.full_name || otherParticipantProfile?.email || 'Unknown User';
                  const displayCompany = otherParticipantProfile?.company_name;
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={otherParticipantProfile?.avatar_url} />
                        <AvatarFallback>
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm truncate">
                            {displayName}
                          </p>
                          {lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {formatLastMessageTime(lastMessage.created_at)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            {displayCompany && (
                              <p className="text-xs text-muted-foreground/80 truncate">
                                {displayCompany}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground truncate">
                              {lastMessage?.content || t('messages.noMessages')}
                            </p>
                          </div>
                          {unreadCount > 0 && (
                            <Badge 
                              variant="destructive" 
                              className="h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs ml-2 flex-shrink-0"
                            >
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {selectedConversation && chatModalOpen && (
        <QuickChatModal
          open={chatModalOpen}
          onClose={() => {
            setChatModalOpen(false);
            setSelectedConversation(null);
          }}
          conversationId={selectedConversation.id}
          recipientId={getOtherParticipant(selectedConversation)!}
          recipientName={profiles[getOtherParticipant(selectedConversation)!]?.full_name}
          recipientCompany={profiles[getOtherParticipant(selectedConversation)!]?.company_name}
          recipientAvatar={profiles[getOtherParticipant(selectedConversation)!]?.avatar_url}
        />
      )}
    </>
  );
};
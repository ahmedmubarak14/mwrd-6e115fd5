
import { CleanDashboardLayout } from "@/components/layout/CleanDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MessageSquare, Search, Plus, User, Circle, Users, HeadphonesIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRealTimeChat } from "@/hooks/useRealTimeChat";
import { QuickChatModal } from "@/components/conversations/QuickChatModal";
import { StartChatModal } from "@/components/chat/StartChatModal";

export const Messages = () => {
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isStartChatModalOpen, setIsStartChatModalOpen] = useState(false);

  // Safe fallback for translation
  const t = languageContext?.t || ((key: string) => key.split('.').pop() || key);

  const {
    conversations,
    loading,
    getOtherParticipant,
    refetch
  } = useRealTimeChat();

  const [conversationParticipants, setConversationParticipants] = useState<Record<string, any>>({});

  // Fetch participant info for each conversation
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!conversations.length) return;

      const participantPromises = conversations.map(async (conv) => {
        const participant = await getOtherParticipant(conv);
        return { conversationId: conv.id, participant };
      });

      const results = await Promise.all(participantPromises);
      const participantMap: Record<string, any> = {};
      
      results.forEach(({ conversationId, participant }) => {
        if (participant) {
          participantMap[conversationId] = participant;
        }
      });

      setConversationParticipants(participantMap);
    };

    fetchParticipants();
  }, [conversations, getOtherParticipant]);

  // Auto-refresh conversations periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchTerm) return true;
    
    const participant = conversationParticipants[conversation.id];
    const participantName = participant?.full_name || participant?.company_name || '';
    const lastMessage = conversation.last_message || '';
    
    return (
      participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleConversationClick = (conversation: any) => {
    const participant = conversationParticipants[conversation.id];
    if (participant) {
      setSelectedConversation({
        ...conversation,
        participant
      });
      setIsChatModalOpen(true);
    }
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getConversationType = (conversation: any) => {
    return conversation.conversation_type || 'business';
  };

  const getConversationIcon = (conversationType: string) => {
    return conversationType === 'support' ? (
      <HeadphonesIcon className="h-6 w-6 text-muted-foreground" />
    ) : (
      <User className="h-6 w-6 text-muted-foreground" />
    );
  };

  const getConversationTypeLabel = (conversationType: string) => {
    return conversationType === 'support' ? 'Support' : 'Business';
  };

  if (loading) {
    return (
      <CleanDashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </CleanDashboardLayout>
    );
  }

  return (
    <CleanDashboardLayout>
      <div className="container mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('messages.title') || 'Messages'}
          </h1>
          <p className="text-muted-foreground">
            {t('messages.subtitle') || 'Your conversations and support chats'}
          </p>
        </div>

        {/* Search and New Chat */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t('messages.searchMessages') || 'Search conversations...'}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsStartChatModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('messages.startNewChat') || 'New Chat'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {conversations.length === 0 
                  ? (t('messages.noConversations') || 'No conversations yet')
                  : (t('messages.noResults') || 'No conversations found')
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {conversations.length === 0 
                  ? (t('messages.noConversationsDesc') || 'Start a conversation with other users or contact support')
                  : 'Try adjusting your search terms'
                }
              </p>
              {conversations.length === 0 && (
                <Button onClick={() => setIsStartChatModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start Your First Conversation
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => {
              const participant = conversationParticipants[conversation.id];
              const conversationType = getConversationType(conversation);
              const isSupport = conversationType === 'support';
              
              return (
                <Card 
                  key={conversation.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleConversationClick(conversation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          {getConversationIcon(conversationType)}
                        </div>
                        <Circle className="absolute -bottom-1 -right-1 h-4 w-4 text-green-500 fill-current" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">
                              {participant?.full_name || participant?.company_name || 'Unknown User'}
                            </h3>
                            <Badge 
                              variant={isSupport ? "default" : "secondary"} 
                              className="text-xs"
                            >
                              {getConversationTypeLabel(conversationType)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {t('messages.online') || 'Online'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {conversation.last_message_at 
                                ? formatLastMessageTime(conversation.last_message_at)
                                : 'No messages'
                              }
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message || 'Start a conversation...'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Start Chat Modal */}
        <StartChatModal 
          open={isStartChatModalOpen}
          onOpenChange={setIsStartChatModalOpen}
        />

        {/* Chat Modal */}
        {selectedConversation && (
          <QuickChatModal
            open={isChatModalOpen}
            onOpenChange={setIsChatModalOpen}
            recipientId={selectedConversation.participant.user_id}
            recipientName={selectedConversation.participant.full_name || selectedConversation.participant.company_name}
            requestId={selectedConversation.request_id}
            offerId={selectedConversation.offer_id}
            conversationType={selectedConversation.conversation_type || 'business'}
          />
        )}
      </div>
    </CleanDashboardLayout>
  );
};

export default Messages;

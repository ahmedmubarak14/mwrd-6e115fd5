import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare, Search, Plus, User, Circle, Phone, Users, Filter, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRealTimeChat } from "@/hooks/useRealTimeChat";
import { QuickChatModal } from "@/components/conversations/QuickChatModal";

export const Messages = () => {
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Safe fallback for translation
  const t = languageContext?.t || ((key: string) => key.split('.').pop() || key);

  const {
    conversations,
    loading,
    getOtherParticipant
  } = useRealTimeChat();

  const [conversationParticipants, setConversationParticipants] = useState<Record<string, any>>({});

  // Message metrics
  const metrics = useMemo(() => {
    if (!conversations || conversations.length === 0) return { total: 0, unread: 0, business: 0, support: 0 };
    
    return {
      total: conversations.length,
      unread: conversations.filter(c => (c as any).unread_count > 0).length,
      business: conversations.filter(c => c.conversation_type === 'business').length,
      support: conversations.filter(c => c.conversation_type === 'support').length,
    };
  }, [conversations]);

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

  if (loading) {
    return (
      <ClientPageContainer>
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </ClientPageContainer>
    );
  }

  return (
    <ClientPageContainer
      title={t('messages.title') || 'Messages'}
      description={t('messages.subtitle') || 'Your conversations and support chats'}
    >
      {/* Metrics */}
      {conversations.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Total Conversations"
            value={metrics.total}
            icon={MessageSquare}
          />
          <MetricCard
            title="Unread Messages"  
            value={metrics.unread}
            icon={AlertCircle}
            variant="warning"
          />
          <MetricCard
            title="Business Chats"
            value={metrics.business}
            icon={Users}
            variant="success"
          />
          <MetricCard
            title="Support Tickets"
            value={metrics.support}
            icon={Phone}
          />
        </div>
      )}

      {/* Search and New Chat */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              {t('messages.startNewChat') || 'New Chat'}
            </Button>
          </div>

          {searchTerm && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {filteredConversations.length} of {conversations.length} conversations</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={
            conversations.length === 0 
              ? (t('messages.noConversations') || 'No conversations yet')
              : (t('messages.noResults') || 'No conversations found')
          }
          description={
            conversations.length === 0 
              ? (t('messages.noConversationsDesc') || 'Start a conversation from the support page or when responding to requests')
              : 'Try adjusting your search terms'
          }
          action={
            conversations.length === 0 ? {
              label: "Go to Support",
              onClick: () => window.location.href = '/support',
              variant: "default" as const
            } : undefined
          }
        />
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
                        {isSupport ? (
                          <Users className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <User className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <Circle className="absolute -bottom-1 -right-1 h-4 w-4 text-green-500 fill-current" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">
                            {participant?.full_name || participant?.company_name || 'Unknown User'}
                          </h3>
                          {isSupport && (
                            <Badge variant="secondary" className="text-xs">
                              Support
                            </Badge>
                          )}
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

      {/* Chat Modal */}
      {selectedConversation && (
        <QuickChatModal
          open={isChatModalOpen}
          onOpenChange={setIsChatModalOpen}
          recipientId={selectedConversation.participant.user_id}
          recipientName={selectedConversation.participant.full_name || selectedConversation.participant.company_name}
          requestId={selectedConversation.request_id}
          offerId={selectedConversation.offer_id}
        />
      )}
    </ClientPageContainer>
  );
};

export default Messages;
import React from 'react';
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare, Search, Plus, User, Circle, Phone, Users, Filter, Clock, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRealTimeChat } from "@/hooks/useRealTimeChat";
import { QuickChatModal } from "@/components/conversations/QuickChatModal";
import { cn } from "@/lib/utils";

const Messages = React.memo(() => {
  const { userProfile } = useAuth();
  const { language, isRTL, t, formatDate, formatNumber } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

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

    if (diffMins < 1) return t('messages.now');
    if (diffMins < 60) return t('messages.minutesAgo').replace('{minutes}', diffMins.toString());
    if (diffHours < 24) return t('messages.hoursAgo').replace('{hours}', diffHours.toString());
    return t('messages.daysAgo').replace('{days}', diffDays.toString());
  };

  const getConversationType = (conversation: any) => {
    return conversation.conversation_type || 'business';
  };

  if (loading) {
    return (
      <ErrorBoundary>
        <ClientPageContainer>
          <div className="mb-8">
            <div className={cn("h-8 w-48 bg-muted rounded animate-pulse mb-2", isRTL && "ml-auto")} />
            <div className={cn("h-4 w-32 bg-muted rounded animate-pulse", isRTL && "ml-auto")} />
          </div>
          
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",
            isRTL && "rtl-grid"
          )}>
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricCard key={i} title="" value="" loading={true} />
            ))}
          </div>
        </ClientPageContainer>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ClientPageContainer
        title={t('messages.title')}
        description={t('messages.subtitle')}
      >
        {/* Metrics */}
        {conversations.length > 0 && (
          <div className={cn(
            "grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8",
            isRTL && "rtl-grid"
          )}>
            <MetricCard
              title={t('messages.totalConversations')}
              value={formatNumber(metrics.total)}
              icon={MessageSquare}
            />
            <MetricCard
              title={t('messages.unreadMessages')}
              value={formatNumber(metrics.unread)}
              icon={AlertCircle}
              variant="warning"
            />
            <MetricCard
              title={t('messages.businessChats')}
              value={formatNumber(metrics.business)}
              icon={Users}
              variant="success"
            />
            <MetricCard
              title={t('messages.supportTickets')}
              value={formatNumber(metrics.support)}
              icon={Phone}
            />
          </div>
        )}

        {/* Search and New Chat */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <Filter className="h-5 w-5" />
              {t('messages.searchAndActions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={cn(
              "flex gap-4",
              isRTL && "flex-row-reverse"
            )}>
              <div className="relative flex-1">
                <Search className={cn(
                  "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                  isRTL ? "right-3" : "left-3"
                )} />
                <Input 
                  placeholder={t('messages.searchMessages')}
                  className={cn(isRTL ? "pr-10" : "pl-10")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button disabled>
                <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {t('messages.startNewChat')}
              </Button>
            </div>

            {searchTerm && (
              <div className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                isRTL && "flex-row-reverse"
              )}>
                <span>
                  {t('messages.showingResults')
                    .replace('{count}', filteredConversations.length.toString())
                    .replace('{total}', conversations.length.toString())
                  }
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                >
                  {t('messages.clearSearch')}
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
                ? t('messages.noConversations')
                : t('messages.noResults')
            }
            description={
              conversations.length === 0 
                ? t('messages.noConversationsDesc')
                : t('messages.noResultsDesc')
            }
            action={
              conversations.length === 0 ? {
                label: t('messages.goToSupport'),
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
                    <div className={cn(
                      "flex items-center gap-4",
                      isRTL && "flex-row-reverse"
                    )}>
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          {isSupport ? (
                            <Users className="h-6 w-6 text-muted-foreground" />
                          ) : (
                            <User className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <Circle className={cn(
                          "absolute h-4 w-4 text-green-500 fill-current",
                          isRTL ? "-bottom-1 -left-1" : "-bottom-1 -right-1"
                        )} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "flex justify-between items-start mb-1",
                          isRTL && "flex-row-reverse"
                        )}>
                          <div className={cn(
                            "flex items-center gap-2",
                            isRTL && "flex-row-reverse"
                          )}>
                            <h3 className="font-semibold truncate">
                              {participant?.full_name || participant?.company_name || t('messages.unknownUser')}
                            </h3>
                            {isSupport && (
                              <Badge variant="secondary" className="text-xs">
                                {t('messages.support')}
                              </Badge>
                            )}
                          </div>
                          <div className={cn(
                            "flex items-center gap-2",
                            isRTL && "flex-row-reverse"
                          )}>
                            <Badge variant="secondary" className="text-xs">
                              {t('messages.online')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {conversation.last_message_at 
                                ? formatLastMessageTime(conversation.last_message_at)
                                : t('messages.noMessages')
                              }
                            </span>
                          </div>
                        </div>
                        <p className={cn(
                          "text-sm text-muted-foreground truncate",
                          isRTL && "text-right"
                        )}>
                          {conversation.last_message || t('messages.startConversation')}
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
    </ErrorBoundary>
  );
});

Messages.displayName = 'Messages';

export { Messages };
export default Messages;
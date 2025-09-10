import React from 'react';
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

export const VendorMessages: React.FC = () => {
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

      const participantPromises = conversations.map(async (conversation) => {
        const otherParticipant = await getOtherParticipant(conversation.id);
        return { conversationId: conversation.id, participant: otherParticipant };
      });

      const participants = await Promise.all(participantPromises);
      const participantMap = participants.reduce((acc, { conversationId, participant }) => {
        acc[conversationId] = participant;
        return acc;
      }, {} as Record<string, any>);

      setConversationParticipants(participantMap);
    };

    fetchParticipants();
  }, [conversations, getOtherParticipant]);

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    
    return conversations.filter(conversation => {
      const searchLower = searchTerm.toLowerCase();
      const participant = conversationParticipants[conversation.id];
      const participantName = participant?.full_name || participant?.company_name || 'Unknown User';
      
      return searchTerm === "" || 
        participantName.toLowerCase().includes(searchLower) ||
        conversation.conversation_type?.toLowerCase().includes(searchLower);
    });
  }, [conversations, searchTerm, conversationParticipants]);

  const getConversationTypeColor = (type: string) => {
    switch (type) {
      case 'business': return 'default';
      case 'support': return 'secondary';
      default: return 'outline';
    }
  };

  const getConversationTypeLabel = (type: string) => {
    switch (type) {
      case 'business': return t('vendor.messages.business');
      case 'support': return t('vendor.messages.support');
      default: return t('vendor.messages.general');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-5 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={cn("space-y-2", isRTL && "text-right")}>
        <h1 className="text-3xl font-bold text-foreground">
          {t('vendor.messages.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('vendor.messages.subtitle')}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('vendor.messages.totalConversations')}
          value={metrics.total}
          icon={MessageSquare}
          trend={{ value: 12, label: t('common.vsLastMonth'), isPositive: true }}
        />
        <MetricCard
          title={t('vendor.messages.unreadMessages')}
          value={metrics.unread}
          icon={AlertCircle}
          variant="warning"
        />
        <MetricCard
          title={t('vendor.messages.businessChats')}
          value={metrics.business}
          icon={Users}
          variant="success"
        />
        <MetricCard
          title={t('vendor.messages.supportChats')}
          value={metrics.support}
          icon={Phone}
        />
      </div>

      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Search className="h-5 w-5" />
            {t('vendor.messages.searchAndActions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className={cn(
              "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input 
              placeholder={t('vendor.messages.searchPlaceholder')}
              className={cn(isRTL ? "pr-10 text-right" : "pl-10")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          
          <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
            <Button onClick={() => setIsChatModalOpen(true)}>
              <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('vendor.messages.startNewChat')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={t('vendor.messages.noConversations')}
          description={t('vendor.messages.noConversationsDesc')}
        />
      ) : (
        <div className="space-y-4">
          {filteredConversations.map((conversation) => {
            const participant = conversationParticipants[conversation.id];
            const participantName = participant?.full_name || participant?.company_name || 'Unknown User';
            const isOnline = participant?.last_seen && new Date(participant.last_seen) > new Date(Date.now() - 5 * 60 * 1000);
            
            return (
              <Card key={conversation.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedConversation(conversation)}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className={cn(
                      "flex justify-between items-start",
                      isRTL && "flex-row-reverse"
                    )}>
                      <div className="flex-1">
                        <div className={cn(
                          "flex items-start justify-between mb-2",
                          isRTL && "flex-row-reverse"
                        )}>
                          <div className={cn(
                            "flex items-center gap-3",
                            isRTL && "flex-row-reverse"
                          )}>
                            <div className="relative">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              {isOnline && (
                                <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                              )}
                            </div>
                            <div className={cn(isRTL && "text-right")}>
                              <h3 className="font-semibold">{participantName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {isOnline ? t('vendor.messages.online') : t('vendor.messages.offline')}
                              </p>
                            </div>
                          </div>
                          <div className={cn(
                            "flex items-center gap-2",
                            isRTL && "flex-row-reverse"
                          )}>
                            <Badge variant={getConversationTypeColor(conversation.conversation_type) as any}>
                              {getConversationTypeLabel(conversation.conversation_type)}
                            </Badge>
                            {(conversation as any).unread_count > 0 && (
                              <Badge variant="destructive">
                                {(conversation as any).unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className={cn(
                          "flex items-center gap-4 mb-2",
                          isRTL && "flex-row-reverse"
                        )}>
                          <div className={cn(
                            "flex items-center gap-1 text-sm text-muted-foreground",
                            isRTL && "flex-row-reverse"
                          )}>
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(conversation.updated_at)}</span>
                          </div>
                          {conversation.conversation_type === 'business' && (
                            <div className={cn(
                              "flex items-center gap-1 text-sm text-muted-foreground",
                              isRTL && "flex-row-reverse"
                            )}>
                              <Users className="h-3 w-3" />
                              <span>{t('vendor.messages.businessChat')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedConversation(conversation);
                        }}
                      >
                        <MessageSquare className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                        {t('vendor.messages.openChat')}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle call functionality
                        }}
                      >
                        <Phone className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                        {t('vendor.messages.call')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Chat Modal */}
      <QuickChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onConversationStart={(conversation) => {
          setSelectedConversation(conversation);
          setIsChatModalOpen(false);
        }}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { 
  MessageCircle, 
  Search,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Footer } from '@/components/ui/layout/Footer';
import { useRealTimeChat, type Conversation } from '@/hooks/useRealTimeChat';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConversationsDropdown } from '@/components/conversations/ConversationsDropdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function EnhancedMessages() {
  const { user, userProfile } = useAuth();
  const { language, t } = useLanguage();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConversationsList, setShowConversationsList] = useState(true);

  const isRTL = language === 'ar';

  const {
    conversations,
    loading,
    getOtherParticipant
  } = useRealTimeChat();

  // Cache participants for filtering
  const [participantCache, setParticipantCache] = useState<Map<string, any>>(new Map());
  
  // Update participant cache
  useEffect(() => {
    const updateParticipants = async () => {
      const cache = new Map();
      for (const conversation of conversations) {
        const participant = await getOtherParticipant(conversation);
        cache.set(conversation.id, participant);
      }
      setParticipantCache(cache);
    };
    
    if (conversations.length > 0) {
      updateParticipants();
    }
  }, [conversations, getOtherParticipant]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchTerm) return true;
    const otherParticipant = participantCache.get(conversation.id);
    return otherParticipant?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           otherParticipant?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Set first conversation as default
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{t('messages.title') || 'Messages'}</h1>
                  <p className="text-muted-foreground">{t('messages.subtitle') || 'Real-time communication with enhanced features'}</p>
                </div>
              </div>
            </div>

            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden h-[calc(100vh-16rem)]">
              <div className="h-full flex">
                {/* Conversations Sidebar */}
                <div className={cn(
                  "border-r bg-card/50 transition-all duration-300",
                  showConversationsList ? "w-full lg:w-1/3" : "w-0 lg:w-0 overflow-hidden"
                )}>
                  <div className="p-4 border-b">
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder={t('messages.searchConversations') || 'Search conversations...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Conversations ({filteredConversations.length})</span>
                      </div>
                      <ConversationsDropdown>
                        <Button variant="outline" size="sm">Start New</Button>
                      </ConversationsDropdown>
                    </div>
                  </div>
                  
                  <div className="overflow-y-auto h-[calc(100%-5rem)]">
                    {conversations.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-medium mb-2">No conversations yet</h3>
                        <p className="text-sm">Start a conversation from a request or offer</p>
                      </div>
                     ) : (
                      filteredConversations.map((conversation) => (
                        <ConversationItem
                          key={conversation.id}
                          conversation={conversation}
                          isSelected={selectedConversation?.id === conversation.id}
                          onClick={() => {
                            setSelectedConversation(conversation);
                            // On mobile, hide sidebar after selection
                            if (window.innerWidth < 1024) {
                              setShowConversationsList(false);
                            }
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="flex-1 flex flex-col">
                  <ChatInterface 
                    conversation={selectedConversation} 
                    className="h-full"
                  />
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

// Conversation Item Component
interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, isSelected, onClick }: ConversationItemProps) => {
  const { user } = useAuth();
  const { getOtherParticipant } = useRealTimeChat();
  const [otherParticipant, setOtherParticipant] = useState<any>(null);

  useEffect(() => {
    getOtherParticipant(conversation).then(setOtherParticipant);
  }, [conversation]);

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return messageTime.toLocaleDateString();
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors",
        isSelected && "bg-accent border-l-4 border-l-primary"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={otherParticipant?.avatar_url} />
          <AvatarFallback>
            {otherParticipant?.full_name?.[0] || otherParticipant?.company_name?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium truncate">
              {otherParticipant?.full_name || otherParticipant?.company_name || 'Unknown User'}
            </h3>
            <span className="text-xs text-muted-foreground">
              {getTimeAgo(conversation.last_message_at || conversation.created_at)}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground truncate mb-2">
            {conversation.last_message || 'No messages yet'}
          </p>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {conversation.status}
            </Badge>
            
            {otherParticipant && (
              <Badge variant="secondary" className="text-xs">
                {otherParticipant.role}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
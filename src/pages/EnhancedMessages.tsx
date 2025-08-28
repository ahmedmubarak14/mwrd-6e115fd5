import React, { useState, useEffect, useMemo } from 'react';
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  MessageCircle, 
  Search,
  Users,
  Clock,
  Circle,
  Plus,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { Footer } from '@/components/ui/layout/Footer';
import { useRealTimeChat, type Conversation } from '@/hooks/useRealTimeChat';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConversationsDropdown } from '@/components/conversations/ConversationsDropdown';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function EnhancedMessages() {
  const { user, userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const language = languageContext?.language || 'en';
  const isRTL = language === 'ar';
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConversationsList, setShowConversationsList] = useState(true);
  const [participantData, setParticipantData] = useState<Record<string, any>>({});

  const {
    conversations,
    loading
  } = useRealTimeChat();

  // Fetch participant data for all conversations
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!conversations.length || !user) return;

      // Get current user's profile ID first
      const { data: currentUserProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!currentUserProfile) return;

      const participantIds = new Set<string>();
      // Always include current user profile
      participantIds.add(currentUserProfile.id);
      
      conversations.forEach(conv => {
        // Add all participant profile IDs
        participantIds.add(conv.client_id);
        participantIds.add(conv.vendor_id);
      });

      // Fetch user profiles for all participants using profile IDs
      if (participantIds.size > 0) {
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', Array.from(participantIds));

        const participantMap: Record<string, any> = {};
        profiles?.forEach(profile => {
          participantMap[profile.id] = profile;
        });
        
        setParticipantData(participantMap);
      }
    };

    fetchParticipants();
  }, [conversations, user]);

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user || !participantData) return null;
    
    // Find current user's profile ID from participant data
    const currentUserProfile = Object.values(participantData).find(p => p.user_id === user.id);
    if (!currentUserProfile) return null;
    
    // Get the other participant's profile ID
    const otherParticipantId = conversation.client_id === currentUserProfile.id 
      ? conversation.vendor_id 
      : conversation.client_id;
    
    return participantData[otherParticipantId] || null;
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchTerm) return true;
    const otherParticipant = getOtherParticipant(conversation);
    const searchLower = searchTerm.toLowerCase();
    
    return (
      otherParticipant?.full_name?.toLowerCase().includes(searchLower) ||
      otherParticipant?.company_name?.toLowerCase().includes(searchLower) ||
      conversation.last_message?.toLowerCase().includes(searchLower)
    );
  });

  // Conversation metrics
  const metrics = useMemo(() => {
    return {
      total: conversations.length,
      unread: 0, // We'll implement proper unread count later
      business: conversations.filter(c => c.conversation_type === 'business').length,
      support: conversations.filter(c => c.conversation_type === 'support').length,
    };
  }, [conversations]);

  // Set first conversation as default
  useEffect(() => {
    if (filteredConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(filteredConversations[0]);
    }
  }, [filteredConversations, selectedConversation]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return format(date, 'MMM d');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner />
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
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {isRTL ? 'الرسائل' : 'Messages'}
                  </h1>
                  <p className="text-muted-foreground">
                    {isRTL ? 'تواصل مع الموردين والعملاء' : 'Communicate with vendors and clients'}
                  </p>
                </div>
                
                {/* Quick Stats */}
                {conversations.length > 0 && (
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg">{metrics.total}</div>
                      <div className="text-muted-foreground text-xs">
                        {isRTL ? 'محادثات' : 'Total'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-yellow-600">{metrics.unread}</div>
                      <div className="text-muted-foreground text-xs">
                        {isRTL ? 'غير مقروءة' : 'Unread'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden h-[calc(100vh-16rem)]">
              {conversations.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <EmptyState
                    icon={MessageCircle}
                    title={isRTL ? 'لا توجد محادثات بعد' : 'No conversations yet'}
                    description={isRTL ? 'ابدأ محادثة من صفحة الموردين أو من الطلبات' : 'Start a conversation from the vendors page or from requests'}
                    action={{
                      label: isRTL ? 'تصفح الموردين' : 'Browse Vendors',
                      onClick: () => window.location.href = '/vendors',
                      variant: "default" as const
                    }}
                  />
                </div>
              ) : (
                <div className="h-full flex">
                  {/* Conversations Sidebar */}
                  <div className={cn(
                    "border-r bg-muted/20 transition-all duration-300 flex flex-col",
                    showConversationsList ? "w-full lg:w-2/5" : "w-0 lg:w-0 overflow-hidden"
                  )}>
                    {/* Search Header */}
                    <div className="p-4 border-b bg-background/50">
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder={isRTL ? 'البحث في المحادثات...' : 'Search conversations...'}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-background"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {isRTL ? `المحادثات (${filteredConversations.length})` : `Conversations (${filteredConversations.length})`}
                          </span>
                        </div>
                        <ConversationsDropdown>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            {isRTL ? 'جديد' : 'New'}
                          </Button>
                        </ConversationsDropdown>
                      </div>
                      
                      {searchTerm && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {isRTL ? 
                            `عرض ${filteredConversations.length} من ${conversations.length}` : 
                            `Showing ${filteredConversations.length} of ${conversations.length}`
                          }
                        </div>
                      )}
                    </div>
                    
                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                       {filteredConversations.map((conversation) => {
                         const otherParticipant = getOtherParticipant(conversation);
                         const isSelected = selectedConversation?.id === conversation.id;
                         const hasUnread = false; // We'll implement proper unread detection later
                         
                         return (
                          <div
                            key={conversation.id}
                            onClick={() => {
                              setSelectedConversation(conversation);
                              // On mobile, hide sidebar after selection
                              if (window.innerWidth < 1024) {
                                setShowConversationsList(false);
                              }
                            }}
                            className={cn(
                              "p-4 border-b cursor-pointer hover:bg-accent/30 transition-all duration-200",
                              isSelected && "bg-accent/50 border-l-4 border-l-primary shadow-sm",
                              hasUnread && "bg-primary/5"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative flex-shrink-0">
                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                  <AvatarImage src={otherParticipant?.avatar_url} />
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {otherParticipant?.company_name?.[0] || 
                                     otherParticipant?.full_name?.[0] || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <Circle className="absolute -bottom-1 -right-1 h-4 w-4 text-green-500 fill-current border-2 border-background rounded-full" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className={cn(
                                    "font-semibold truncate",
                                    hasUnread && "text-primary"
                                  )}>
                                    {otherParticipant?.company_name || 
                                     otherParticipant?.full_name || 
                                     (isRTL ? 'مستخدم غير معروف' : 'Unknown User')}
                                  </h3>
                                  <span className="text-xs text-muted-foreground">
                                    {conversation.last_message_at 
                                      ? formatMessageTime(conversation.last_message_at)
                                      : (isRTL ? 'الآن' : 'now')
                                    }
                                  </span>
                                </div>
                                
                                <p className={cn(
                                  "text-sm truncate mb-2",
                                  hasUnread ? "font-medium text-foreground" : "text-muted-foreground"
                                )}>
                                  {conversation.last_message || 
                                   (isRTL ? 'ابدأ محادثة...' : 'Start a conversation...')}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant={conversation.conversation_type === 'support' ? 'destructive' : 'secondary'} 
                                      className="text-xs"
                                    >
                                      {conversation.conversation_type === 'support' 
                                        ? (isRTL ? 'دعم فني' : 'Support')
                                        : (isRTL ? 'عمل' : 'Business')
                                      }
                                    </Badge>
                                    
                                    {otherParticipant?.role && (
                                      <Badge variant="outline" className="text-xs">
                                        {otherParticipant.role === 'vendor' 
                                          ? (isRTL ? 'مورد' : 'Vendor')
                                          : (isRTL ? 'عميل' : 'Client')
                                        }
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {hasUnread && (
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chat Interface */}
                  <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                      <>
                        {/* Chat Header */}
                        <div className="p-4 border-b bg-background/80 backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="lg:hidden"
                              onClick={() => setShowConversationsList(true)}
                            >
                              <ArrowLeft className="h-4 w-4" />
                            </Button>
                            
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={getOtherParticipant(selectedConversation)?.avatar_url} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getOtherParticipant(selectedConversation)?.company_name?.[0] || 
                                 getOtherParticipant(selectedConversation)?.full_name?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {getOtherParticipant(selectedConversation)?.company_name || 
                                 getOtherParticipant(selectedConversation)?.full_name || 
                                 (isRTL ? 'مستخدم غير معروف' : 'Unknown User')}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Circle className="h-2 w-2 text-green-500 fill-current" />
                                {isRTL ? 'متصل' : 'Online'}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {selectedConversation.conversation_type === 'support' 
                                  ? (isRTL ? 'دعم فني' : 'Support')
                                  : (isRTL ? 'عمل' : 'Business')
                                }
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {/* Chat Content */}
                        <ChatInterface 
                          conversation={selectedConversation} 
                          className="flex-1"
                        />
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-semibold mb-2">
                            {isRTL ? 'اختر محادثة' : 'Select a conversation'}
                          </h3>
                          <p className="text-muted-foreground">
                            {isRTL ? 'اختر محادثة من القائمة للبدء' : 'Choose a conversation from the sidebar to get started'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
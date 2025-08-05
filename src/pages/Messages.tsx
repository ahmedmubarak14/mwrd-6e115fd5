import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/layout/Header';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { RealTimeChatModal } from '@/components/modals/RealTimeChatModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserProfiles } from '@/hooks/useUserProfiles';
import { 
  Search, 
  MessageCircle, 
  Video, 
  Phone,
  MoreVertical,
  Pin,
  Archive,
  Trash2,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { language, t } = useLanguage();
  const { user, userProfile } = useAuth();
  const isMobile = useIsMobile();
  const {
    conversations,
    loading: chatLoading,
    getUnreadCount,
    getOtherParticipant
  } = useRealTimeChat();
  
  const { getProfile, fetchUserProfile, fetchMultipleProfiles } = useUserProfiles();

  // Fetch profiles for all conversation participants
  useEffect(() => {
    if (conversations.length > 0) {
      const participantIds = conversations
        .map(conv => getOtherParticipant(conv))
        .filter((id): id is string => id !== null);
      
      if (participantIds.length > 0) {
        fetchMultipleProfiles(participantIds);
      }
    }
  }, [conversations, getOtherParticipant, fetchMultipleProfiles]);

  // Fetch user profile with proper fallback
  const getUserProfile = async (userId: string) => {
    const profile = getProfile(userId);
    if (profile) return profile;
    
    const fetchedProfile = await fetchUserProfile(userId);
    return fetchedProfile || {
      id: userId,
      email: '',
      role: 'client' as const,
      full_name: 'Unknown User',
      avatar_url: undefined
    };
  };

  const filteredConversations = conversations.filter(conversation => {
    if (selectedTab === 'unread') {
      return getUnreadCount(conversation.id) > 0;
    }
    return true;
  }).filter(conversation => {
    if (!searchQuery) return true;
    const otherParticipantId = getOtherParticipant(conversation);
    if (!otherParticipantId) return false;
    
    const profile = getProfile(otherParticipantId);
    if (!profile) return false;
    
    return (profile.full_name || profile.company_name || profile.email || '')
      .toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatLastMessageTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) {
      return messageTime.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageTime.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (chatLoading) {
    return (
      <div className="min-h-screen flex">
        <Header />
        {!isMobile && <Sidebar userRole={userProfile?.role} userProfile={userProfile} />}
        <main className="flex-1 p-6 pt-20">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
      <Header />
      {!isMobile && <Sidebar userRole={userProfile?.role} userProfile={userProfile} />}
      
      <main className="flex-1 p-6 pt-20">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {language === 'ar' ? 'الرسائل' : 'Messages'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'تواصل مع العملاء والموردين' 
                  : 'Communicate with clients and suppliers'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'تصفية' : 'Filter'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {language === 'ar' ? 'المحادثات' : 'Conversations'}
                  </CardTitle>
                  <Badge variant="secondary">
                    {conversations.length}
                  </Badge>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'ar' ? 'البحث في المحادثات...' : 'Search conversations...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">
                      {language === 'ar' ? 'الكل' : 'All'}
                    </TabsTrigger>
                    <TabsTrigger value="unread">
                      {language === 'ar' ? 'غير مقروءة' : 'Unread'}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {filteredConversations.length === 0 ? (
                    <div className="p-6 text-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        {language === 'ar' ? 'لا توجد محادثات' : 'No conversations'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredConversations.map((conversation) => {
                        const otherParticipantId = getOtherParticipant(conversation);
                        const unreadCount = getUnreadCount(conversation.id);
                        const profile = otherParticipantId ? getProfile(otherParticipantId) : null;
                        
                        if (!profile || !otherParticipantId) return null;
                        
                        const displayName = profile.company_name || profile.full_name || profile.email || 'Unknown User';
                        
                        return (
                          <RealTimeChatModal
                            key={conversation.id}
                            conversationId={conversation.id}
                            recipientId={otherParticipantId}
                            recipientName={displayName}
                            recipientAvatar={profile.avatar_url}
                          >
                            <div className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage 
                                    src={profile.avatar_url} 
                                    alt={displayName} 
                                  />
                                  <AvatarFallback>
                                    {displayName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-sm truncate">
                                      {displayName}
                                    </h4>
                                    <span className="text-xs text-muted-foreground">
                                      {conversation.last_message_at && formatLastMessageTime(conversation.last_message_at)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-muted-foreground truncate">
                                      {conversation.request_id 
                                        ? (language === 'ar' ? 'طلب خدمة' : 'Service Request')
                                        : conversation.offer_id
                                        ? (language === 'ar' ? 'عرض' : 'Offer')
                                        : (language === 'ar' ? 'محادثة عامة' : 'General Chat')
                                      }
                                    </p>
                                    
                                    {unreadCount > 0 && (
                                      <Badge variant="default" className="h-5 w-5 p-0 text-xs">
                                        {unreadCount}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </RealTimeChatModal>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2">
              <CardContent className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">
                    {language === 'ar' ? 'اختر محادثة للبدء' : 'Select a conversation to start'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' 
                      ? 'اختر محادثة من القائمة على اليسار لبدء المراسلة'
                      : 'Choose a conversation from the list on the left to start messaging'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRealTimeChat, type Conversation } from "@/hooks/useRealTimeChat";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { RealTimeChatModal } from "@/components/modals/RealTimeChatModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { 
  Search, 
  MessageCircle, 
  Clock, 
  Star, 
  MoreVertical, 
  Send,
  Filter,
  Users,
  MessageSquare
} from "lucide-react";
import { useState, useMemo } from "react";

const Messages = () => {
  const { t, language } = useLanguage();
  const { user, userProfile, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');
  const isMobile = useIsMobile();
  const { 
    conversations, 
    loading: chatLoading 
  } = useRealTimeChat();
  const { fetchMultipleProfiles } = useUserProfiles();
  
  const isRTL = language === 'ar';

  // Fetch user profiles for conversations
  const [userProfiles, setUserProfiles] = useState<Record<string, any>>({});

  const getUserProfile = async (userId: string) => {
    if (userProfiles[userId]) return userProfiles[userId];
    
    try {
      const profiles = await fetchMultipleProfiles([userId]);
      const profile = profiles[0];
      setUserProfiles(prev => ({ ...prev, [userId]: profile }));
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { name: 'Unknown User', email: '', avatar_url: null };
    }
  };

  // Filter conversations based on search and tab
  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    
    return conversations.filter(conversation => {
      const otherUserId = conversation.client_id === user?.id ? conversation.supplier_id : conversation.client_id;
      const userProfile = userProfiles[otherUserId || ''];
      const matchesSearch = searchQuery === "" || 
        (userProfile?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTab = selectedTab === 'all' || 
        (selectedTab === 'unread' && false); // TODO: Implement unread count when DB schema is ready
      
      return matchesSearch && matchesTab;
    });
  }, [conversations, searchQuery, selectedTab, userProfiles, user?.id]);

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-7xl mx-auto h-[calc(100vh-120px)]">
            
            {/* Enhanced Header with gradient background */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    Messages
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Connect and communicate with clients and suppliers
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-right rtl:text-left">
                    <p className="text-2xl font-bold text-primary">
                      {filteredConversations.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Active chats</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              
              {/* Conversations List */}
              <Card className="lg:col-span-1 border-0 bg-card/70 backdrop-blur-sm h-full flex flex-col">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    Conversations
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Manage your communications
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 p-0 flex flex-col">
                  {/* Search and Filters */}
                  <div className="p-4 space-y-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search conversations..."
                        className="pl-10 rtl:pl-3 rtl:pr-10 h-10 bg-background/50 border-primary/20 focus:border-primary/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    {/* Tab filters */}
                    <div className="flex gap-2">
                      <Button
                        variant={selectedTab === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTab('all')}
                        className="flex-1 h-8"
                      >
                        All ({conversations?.length || 0})
                      </Button>
                      <Button
                        variant={selectedTab === 'unread' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTab('unread')}
                        className="flex-1 h-8"
                      >
                        Unread (0)
                      </Button>
                    </div>
                  </div>
                  
                  {/* Conversations List */}
                  <div className="flex-1 overflow-y-auto">
                    {chatLoading ? (
                      <div className="p-8 text-center">
                        <LoadingSpinner />
                      </div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="p-8 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold mb-2">No conversations</h3>
                        <p className="text-muted-foreground text-sm">
                          {searchQuery ? 'No conversations match your search' : 'Start a conversation to get connected'}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredConversations.map((conversation) => {
                          const otherUserId = conversation.client_id === user?.id ? conversation.supplier_id : conversation.client_id;
                          const profile = userProfiles[otherUserId || ''];
                          const unreadCount = 0; // TODO: Implement when DB schema includes unread_count
                          
                          // Fetch profile if not already loaded
                          if (!profile && otherUserId) {
                            getUserProfile(otherUserId);
                          }
                          
                          return (
                            <RealTimeChatModal
                              key={conversation.id}
                              recipientId={otherUserId || ''}
                            >
                              <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex items-start gap-3">
                                  <div className="relative">
                                    <Avatar className="h-12 w-12">
                                      <AvatarImage src={profile?.avatar_url} />
                                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                        {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
                                      </AvatarFallback>
                                    </Avatar>
                                    {unreadCount > 0 && (
                                      <div className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 bg-destructive text-destructive-foreground rounded-full min-w-[1.25rem] h-5 flex items-center justify-center text-xs font-medium">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                      <h4 className="font-semibold text-sm truncate">
                                        {profile?.name || 'Loading...'}
                                      </h4>
                                      <span className="text-xs text-muted-foreground">
                                        {conversation.last_message_at && formatLastMessageTime(conversation.last_message_at)}
                                      </span>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground truncate">
                                      No messages yet
                                    </p>
                                    
                                    {profile?.company && (
                                      <p className="text-xs text-primary mt-1 truncate">
                                        {profile.company}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </RealTimeChatModal>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Area Placeholder */}
              <Card className="lg:col-span-2 border-0 bg-card/70 backdrop-blur-sm h-full flex flex-col">
                <CardContent className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground mb-6">
                      Choose a conversation from the list to start messaging
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <span>Real-time messaging</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span>File sharing</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
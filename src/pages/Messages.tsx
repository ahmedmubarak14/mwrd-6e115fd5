import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Search, Plus, Phone, Video, Archive, Trash2, Star } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { RealTimeChatModal } from "@/components/modals/RealTimeChatModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/ui/layout/Footer";

interface Conversation {
  id: string;
  participants: string[];
  last_message: string;
  last_message_at: string;
  unread_count: number;
  other_participant: {
    id: string;
    full_name: string;
    company_name?: string;
    email: string;
    avatar_url?: string;
  };
  conversation_id?: string;
}

export const Messages = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadConversations = async () => {
    if (!userProfile?.id) return;
    
    setLoading(true);
    try {
      // First, get all conversations for the user
      const { data: conversationData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .or(`client_id.eq.${userProfile.id},vendor_id.eq.${userProfile.id}`)
        .order('last_message_at', { ascending: false });

      if (convError) throw convError;

      // Then get messages for each conversation to get the latest message
      const conversationMap = new Map<string, any>();
      
      for (const conv of conversationData || []) {
        const otherParticipantId = conv.client_id === userProfile.id 
          ? conv.vendor_id 
          : conv.client_id;

        // Fetch participant details
        const { data: participant } = await supabase
          .from('user_profiles')
          .select('id, full_name, company_name, email, avatar_url')
          .eq('id', otherParticipantId)
          .single();

        // Get latest message for this conversation
        const { data: latestMessage } = await supabase
          .from('messages')
          .select('content, created_at')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Count unread messages
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('recipient_id', userProfile.id)
          .is('read_at', null);

        conversationMap.set(conv.id, {
          id: conv.id,
          participants: [conv.client_id, conv.vendor_id],
          last_message: latestMessage?.content || conv.last_message || 'No messages yet',
          last_message_at: latestMessage?.created_at || conv.last_message_at || conv.created_at,
          unread_count: count || 0,
          other_participant: participant,
          conversation_id: conv.id
        });
      }

      setConversations(Array.from(conversationMap.values()));
    } catch (error: any) {
      console.error('Error loading conversations:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحميل المحادثات' : 'Failed to load conversations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [userProfile?.id]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userProfile?.id) return;

    const channel = supabase
      .channel('messages_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('Message updated:', payload);
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile?.id]);

  const filteredConversations = conversations.filter(conversation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      conversation.other_participant?.full_name?.toLowerCase().includes(searchLower) ||
      conversation.other_participant?.company_name?.toLowerCase().includes(searchLower) ||
      conversation.other_participant?.email?.toLowerCase().includes(searchLower) ||
      conversation.last_message?.toLowerCase().includes(searchLower)
    );
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return isRTL ? 'الآن' : 'Now';
    if (diffInMinutes < 60) return isRTL ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return isRTL ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return isRTL ? `منذ ${diffInDays} أيام` : `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getTotalUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unread_count, 0);
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-arabic' : ''}`}>
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <MessageCircle className="h-8 w-8" />
                  {isRTL ? 'الرسائل' : 'Messages'}
                  {getTotalUnreadCount() > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {getTotalUnreadCount()}
                    </Badge>
                  )}
                </h1>
                <p className="text-muted-foreground">
                  {isRTL ? 'تواصل مع الموردين والعملاء' : 'Communicate with suppliers and clients'}
                </p>
              </div>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-muted-foreground`} />
                  <Input
                    placeholder={isRTL ? "البحث في المحادثات..." : "Search conversations..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                  />
                </div>
              </CardContent>
            </Card>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {searchTerm 
                          ? (isRTL ? 'لا توجد محادثات مطابقة' : 'No matching conversations')
                          : (isRTL ? 'لا توجد محادثات' : 'No conversations')
                        }
                      </h3>
                      <p className="text-muted-foreground">
                        {searchTerm 
                          ? (isRTL ? 'جرب مصطلح بحث مختلف' : 'Try a different search term')
                          : (isRTL ? 'ابدأ محادثة من خلال الرد على عرض أو طلب' : 'Start a conversation by responding to an offer or request')
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredConversations.map((conversation) => (
                    <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="h-12 w-12">
                            <AvatarImage 
                              src={conversation.other_participant?.avatar_url} 
                              alt={conversation.other_participant?.full_name}
                            />
                            <AvatarFallback>
                              {conversation.other_participant?.full_name?.charAt(0) || 
                               conversation.other_participant?.email?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>

                          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div>
                                <h3 className="font-semibold">
                                  {conversation.other_participant?.company_name || 
                                   conversation.other_participant?.full_name ||
                                   conversation.other_participant?.email}
                                </h3>
                              </div>
                              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {conversation.unread_count > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {conversation.unread_count}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(conversation.last_message_at)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {conversation.last_message}
                            </p>
                          </div>

                          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <RealTimeChatModal 
                              recipientId={conversation.other_participant.id}
                              recipientName={conversation.other_participant?.company_name || 
                                           conversation.other_participant?.full_name ||
                                           conversation.other_participant?.email}
                            >
                              <Button variant="outline" size="sm">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </RealTimeChatModal>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;

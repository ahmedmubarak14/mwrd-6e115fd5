
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
import { MessageSquare, Search, Plus, Users, Clock, MoreHorizontal } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { RealTimeChatModal } from "@/components/modals/RealTimeChatModal";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/ui/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Conversation {
  id: string;
  client_id: string;
  vendor_id: string;
  request_id?: string;
  offer_id?: string;
  status: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  unread_count: number;
  participant?: {
    id: string;
    full_name: string;
    company_name?: string;
    email: string;
    avatar_url?: string;
  };
  request?: {
    id: string;
    title: string;
  };
  offer?: {
    id: string;
    title: string;
  };
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
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const fetchConversations = async () => {
    if (!userProfile?.id) return;
    
    setLoading(true);
    try {
      // Get conversations where user is either client or vendor
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          requests:request_id(id, title),
          offers:offer_id(id, title)
        `)
        .or(`client_id.eq.${userProfile.id},vendor_id.eq.${userProfile.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // For each conversation, get the other participant's info and unread count
      const conversationsWithParticipants = await Promise.all(
        (data || []).map(async (conv) => {
          const isClient = conv.client_id === userProfile.id;
          const participantId = isClient ? conv.vendor_id : conv.client_id;
          
          // Get participant info
          const { data: participantData } = await supabase
            .from('user_profiles')
            .select('id, full_name, company_name, email, avatar_url')
            .eq('user_id', participantId)
            .single();

          // Get unread message count
          const { count } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('conversation_id', conv.id)
            .eq('recipient_id', userProfile.id)
            .is('read_at', null);

          return {
            ...conv,
            participant: participantData,
            unread_count: count || 0
          };
        })
      );

      setConversations(conversationsWithParticipants);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في تحميل المحادثات" : "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userProfile]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userProfile?.id) return;

    const channel = supabase
      .channel('conversations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversations' },
        (payload) => {
          console.log('Conversation updated:', payload);
          fetchConversations();
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('Message updated:', payload);
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile?.id]);

  const filteredConversations = conversations.filter(conv => {
    const participantName = conv.participant?.company_name || conv.participant?.full_name || '';
    const requestTitle = conv.request?.title || '';
    const offerTitle = conv.offer?.title || '';
    
    return (
      participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offerTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const markAsRead = async (conversationId: string) => {
    if (!userProfile?.id) return;
    
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('recipient_id', userProfile.id)
      .is('read_at', null);

    if (!error) {
      fetchConversations();
    }
  };

  const deleteConversation = async (conversationId: string) => {
    const { error } = await supabase
      .from('conversations')
      .update({ status: 'archived' })
      .eq('id', conversationId);

    if (error) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في حذف المحادثة" : "Failed to delete conversation",
        variant: "destructive"
      });
    } else {
      toast({
        title: isRTL ? "تم الحذف" : "Deleted",
        description: isRTL ? "تم أرشفة المحادثة" : "Conversation archived",
      });
      fetchConversations();
    }
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);

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
          <div className="max-w-7xl mx-auto space-y-6">
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h1 className="text-3xl font-bold mb-2">
                  {isRTL ? 'الرسائل' : 'Messages'}
                  {totalUnread > 0 && (
                    <Badge className="ml-2" variant="destructive">
                      {totalUnread}
                    </Badge>
                  )}
                </h1>
                <p className="text-muted-foreground">
                  {isRTL ? 'تواصل مع الموردين والعملاء' : 'Communicate with vendors and clients'}
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

            {loading && (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            )}

            {!loading && (
              <div className="space-y-4">
                {filteredConversations.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {isRTL ? 'لا توجد محادثات' : 'No Conversations'}
                      </h3>
                      <p className="text-muted-foreground">
                        {searchTerm 
                          ? (isRTL ? 'لم يتم العثور على محادثات تطابق البحث' : 'No conversations match your search')
                          : (isRTL ? 'ابدأ محادثة من صفحة العروض أو الطلبات' : 'Start a conversation from offers or requests page')
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredConversations.map((conversation) => (
                    <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-start gap-4 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={conversation.participant?.avatar_url} />
                              <AvatarFallback>
                                {(conversation.participant?.company_name?.[0] || 
                                  conversation.participant?.full_name?.[0] || 
                                  conversation.participant?.email?.[0] || '?').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                              <CardTitle className="text-lg mb-1">
                                {conversation.participant?.company_name || conversation.participant?.full_name || 'Unknown User'}
                              </CardTitle>
                              <CardDescription className="mb-2">
                                {conversation.request && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                    {isRTL ? 'طلب: ' : 'Request: '}{conversation.request.title}
                                  </span>
                                )}
                                {conversation.offer && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {isRTL ? 'عرض: ' : 'Offer: '}{conversation.offer.title}
                                  </span>
                                )}
                              </CardDescription>
                              
                              {conversation.last_message && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {conversation.last_message}
                                </p>
                              )}
                              
                              <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Clock className="h-3 w-3" />
                                {conversation.last_message_at 
                                  ? format(new Date(conversation.last_message_at), 'MMM dd, HH:mm')
                                  : format(new Date(conversation.created_at), 'MMM dd, HH:mm')
                                }
                              </div>
                            </div>
                          </div>
                          
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {conversation.unread_count > 0 && (
                              <Badge variant="destructive" className="h-6 min-w-6 flex items-center justify-center">
                                {conversation.unread_count}
                              </Badge>
                            )}
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => markAsRead(conversation.id)}>
                                  {isRTL ? 'تحديد كمقروء' : 'Mark as Read'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteConversation(conversation.id)}
                                  className="text-destructive"
                                >
                                  {isRTL ? 'أرشفة المحادثة' : 'Archive Conversation'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <RealTimeChatModal 
                            recipientId={conversation.participant?.id || ''}
                            recipientName={conversation.participant?.company_name || conversation.participant?.full_name || 'User'}
                            requestId={conversation.request_id}
                            offerId={conversation.offer_id}
                            existingConversationId={conversation.id}
                          >
                            <Button className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                              <MessageSquare className="h-4 w-4" />
                              {isRTL ? 'فتح المحادثة' : 'Open Chat'}
                            </Button>
                          </RealTimeChatModal>
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

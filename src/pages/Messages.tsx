
import { useState, useEffect } from 'react';
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageCircle, 
  Send, 
  Search,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  read_at: string | null;
  message_type: string;
  message_status: string;
  conversation_id: string | null;
  request_id: string | null;
  offer_id: string | null;
}

interface Conversation {
  id: string;
  client_id: string;
  supplier_id: string;
  request_id: string | null;
  offer_id: string | null;
  status: string;
  last_message_at: string;
  created_at: string;
  messages?: Message[];
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  company_name: string | null;
}

export default function Messages() {
  const { user, userProfile } = useAuth();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userProfiles, setUserProfiles] = useState<{[key: string]: UserProfile}>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isRTL = language === 'ar';

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`client_id.eq.${user.id},supplier_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      setConversations(data || []);

      // Fetch user profiles for all participants
      const userIds = new Set<string>();
      data?.forEach(conv => {
        userIds.add(conv.client_id);
        userIds.add(conv.supplier_id);
      });

      if (userIds.size > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', Array.from(userIds));

        if (profileError) {
          console.warn('Could not fetch user profiles:', profileError);
        } else {
          const profileMap = profiles?.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as {[key: string]: UserProfile}) || {};
          setUserProfiles(profileMap);
        }
      }

      // Select first conversation if none selected
      if (data && data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      if (data && data.length > 0) {
        const unreadMessages = data.filter(msg => 
          msg.recipient_id === user?.id && !msg.read_at
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || !user || !newMessage.trim()) return;

    try {
      const recipientId = selectedConversation.client_id === user.id 
        ? selectedConversation.supplier_id 
        : selectedConversation.client_id;

      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage,
          sender_id: user.id,
          recipient_id: recipientId,
          conversation_id: selectedConversation.id,
          message_type: 'text'
        });

      if (error) throw error;

      // Update conversation's last message time
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      setNewMessage('');
      fetchMessages(selectedConversation.id);
      fetchConversations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return null;
    const otherUserId = conversation.client_id === user.id 
      ? conversation.supplier_id 
      : conversation.client_id;
    return userProfiles[otherUserId] || null;
  };

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = getOtherParticipant(conversation);
    return otherParticipant?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           otherParticipant?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          <div className="max-w-6xl mx-auto">
            {/* Messages Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{t('messages.title')}</h1>
                  <p className="text-muted-foreground">{t('messages.subtitle')}</p>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <div className="h-[calc(100vh-16rem)] flex">
                {/* Conversations List */}
                <div className="w-full lg:w-1/3 border-r bg-card/50">
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder={t('messages.searchConversations')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-y-auto h-full">
                    {filteredConversations.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        {t('messages.noConversations')}
                      </div>
                    ) : (
                      filteredConversations.map((conversation) => {
                        const otherParticipant = getOtherParticipant(conversation);
                        return (
                          <div
                            key={conversation.id}
                            onClick={() => setSelectedConversation(conversation)}
                            className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                              selectedConversation?.id === conversation.id ? 'bg-accent' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <MessageCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium truncate">
                                    {otherParticipant?.full_name || t('messages.unknownUser')}
                                  </h3>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(conversation.last_message_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {otherParticipant?.company_name || t('messages.noCompany')}
                                </p>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {conversation.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="hidden lg:flex lg:flex-1 flex-col">
                  {selectedConversation ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b bg-card/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageCircle className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {getOtherParticipant(selectedConversation)?.full_name || t('messages.unknownUser')}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {getOtherParticipant(selectedConversation)?.company_name || t('messages.noCompany')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => {
                          const isOwnMessage = message.sender_id === user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  isOwnMessage
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t bg-card/50">
                        <div className="flex gap-2">
                        <Input
                          placeholder={t('messages.typeMessage')}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>{t('messages.selectConversation')}</p>
                        </div>
                    </div>
                  )}
                </div>

                {/* Mobile Chat Overlay - shown when conversation is selected on mobile */}
                {selectedConversation && (
                  <div className="lg:hidden fixed inset-0 bg-background z-50 flex flex-col">
                    {/* Mobile Chat Header */}
                    <div className="p-4 border-b bg-card flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedConversation(null)}
                        className="mr-2"
                      >
                        ←
                      </Button>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {getOtherParticipant(selectedConversation)?.full_name || t('messages.unknownUser')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {getOtherParticipant(selectedConversation)?.company_name || t('messages.noCompany')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => {
                        const isOwnMessage = message.sender_id === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isOwnMessage
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile Message Input */}
                    <div className="p-4 border-t bg-card">
                      <div className="flex gap-2">
                        <Input
                          placeholder={t('messages.typeMessage')}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

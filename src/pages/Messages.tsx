
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userProfiles, setUserProfiles] = useState<{[key: string]: UserProfile}>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto h-full">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No conversations found
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
                          {otherParticipant?.full_name || 'Unknown User'}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(conversation.last_message_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {otherParticipant?.company_name || 'No company'}
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
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">
                    {getOtherParticipant(selectedConversation)?.full_name || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getOtherParticipant(selectedConversation)?.company_name || 'No company'}
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
            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
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
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

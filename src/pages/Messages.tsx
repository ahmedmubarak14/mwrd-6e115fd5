
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { Send, Search, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export default function Messages() {
  console.log('Messages component rendering...');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    conversations,
    messages,
    loading,
    activeConversation,
    setActiveConversation,
    sendMessage,
    markAsRead,
    getUnreadCount,
    getOtherParticipant
  } = useRealTimeChat();

  console.log('Messages component state:', { 
    conversationsCount: conversations.length, 
    profilesCount: Object.keys(profiles).length,
    activeConversation,
    loading
  });

  // Fetch user profiles for conversations
  useEffect(() => {
    if (!conversations.length) {
      console.log('No conversations to fetch profiles for');
      return;
    }

    const fetchProfiles = async () => {
      console.log('Fetching profiles for conversations:', conversations.length);
      
      try {
        const participantIds = conversations.map(conv => 
          getOtherParticipant(conv)
        ).filter(Boolean);

        console.log('Participant IDs to fetch:', participantIds);

        if (participantIds.length === 0) {
          console.log('No participant IDs to fetch');
          return;
        }

        const { data: profilesData, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, email, avatar_url')
          .in('id', participantIds);

        console.log('Fetched profiles data:', profilesData, 'Error:', error);

        if (error) {
          console.error('Error fetching profiles:', error);
          throw error;
        }

        // Safely handle profiles data
        const profilesMap: Record<string, UserProfile> = {};
        if (profilesData && Array.isArray(profilesData)) {
          profilesData.forEach(profile => {
            if (profile && profile.id) {
              profilesMap[profile.id] = profile;
            }
          });
        }

        console.log('Setting profiles map:', profilesMap);
        setProfiles(profilesMap);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
        toast({
          title: "Error",
          description: "Failed to load user profiles",
          variant: "destructive",
        });
      }
    };

    fetchProfiles();
  }, [conversations, getOtherParticipant, toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !user) return;

    const conversation = conversations.find(c => c.id === activeConversation);
    if (!conversation) return;

    const recipientId = getOtherParticipant(conversation);
    if (!recipientId) return;

    try {
      await sendMessage(activeConversation, newMessage.trim(), recipientId);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const getProfileForConversation = (conversation: any) => {
    const otherParticipantId = getOtherParticipant(conversation);
    return otherParticipantId ? profiles[otherParticipantId] : null;
  };

  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm) return true;
    
    const profile = getProfileForConversation(conversation);
    if (!profile) return false;
    
    return profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           profile.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] max-w-7xl mx-auto">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
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

        <ScrollArea className="flex-1">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {conversations.length === 0 ? 'No conversations yet' : 'No matching conversations'}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredConversations.map((conversation) => {
                const profile = getProfileForConversation(conversation);
                const unreadCount = getUnreadCount(conversation.id);
                const isActive = activeConversation === conversation.id;

                // Skip rendering if profile is not loaded yet
                if (!profile) {
                  return null;
                }

                return (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      isActive ? 'bg-muted' : ''
                    }`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                        <AvatarFallback>
                          {profile.full_name?.charAt(0) || profile.email?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium truncate">
                            {profile.full_name || profile.email}
                          </h3>
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.last_message_content || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(() => {
                  const conversation = conversations.find(c => c.id === activeConversation);
                  const profile = conversation ? getProfileForConversation(conversation) : null;
                  
                  if (!profile) {
                    return (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-full" />
                        <div className="w-24 h-4 bg-muted rounded" />
                      </div>
                    );
                  }
                  
                  return (
                    <>
                      <Avatar>
                        <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                        <AvatarFallback>
                          {profile.full_name?.charAt(0) || profile.email?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{profile.full_name || profile.email}</h3>
                        <p className="text-sm text-muted-foreground">Online</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {(messages[activeConversation] || []).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 ${
                        message.sender_id === user?.id
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
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

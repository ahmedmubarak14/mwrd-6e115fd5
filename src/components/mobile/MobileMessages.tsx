import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileDrawer } from '@/components/ui/mobile/MobileDrawer';
import { PullToRefresh } from '@/components/ui/mobile/PullToRefresh';
import { SwipeableCard, MessageSwipeCard } from '@/components/ui/mobile/SwipeableCard';
import { MobileBottomNavSpacer } from '@/components/navigation/MobileBottomNav';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Video, 
  MoreVertical,
  Send,
  Paperclip,
  Mic,
  Star,
  Archive,
  Trash2
} from 'lucide-react';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  participant_name: string;
  participant_avatar?: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  is_online?: boolean;
}

export const MobileMessages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { conversations, loading } = useRealTimeChat();

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Refresh conversations
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredConversations = conversations.filter(conversation => {
    // Use actual conversation structure for filtering
    return conversation.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const conversationsList = (
    <div className="space-y-2">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No conversations found</p>
        </div>
      ) : (
        filteredConversations.map((conversation) => (
          <MessageSwipeCard
            key={conversation.id}
            onReply={() => setSelectedConversation(conversation.id)}
            onStar={() => console.log('Star conversation:', conversation.id)}
            onDelete={() => console.log('Delete conversation:', conversation.id)}
          >
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10">
                    {getInitials('User')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm truncate">
                    Conversation {conversation.id.slice(0, 8)}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">1</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatMessageTime(conversation.last_message_at || conversation.updated_at)}
                    </span>
                  </div>
                </div>
                <p className="text-sm line-clamp-1 text-muted-foreground">
                  {conversation.last_message || 'No messages yet'}
                </p>
              </div>
            </div>
          </MessageSwipeCard>
        ))
      )}
    </div>
  );

  const chatView = (
    <div className="h-full flex flex-col">
      {/* Mock message list */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <div className="flex justify-start">
          <div className="max-w-[80%] bg-muted rounded-2xl rounded-bl-md p-3">
            <p className="text-sm">Hey! How's the project coming along?</p>
            <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-br-md p-3">
            <p className="text-sm">Going great! Almost ready for review.</p>
            <p className="text-xs text-primary-foreground/70 mt-1">10:32 AM</p>
          </div>
        </div>
      </div>

      {/* Message input */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="pr-10"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            size="icon" 
            disabled={!newMessage.trim()}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="p-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Conversations List */}
          {conversationsList}
        </div>
        
        <MobileBottomNavSpacer />
      </PullToRefresh>

      {/* Chat Drawer */}
      <MobileDrawer
        open={!!selectedConversation}
        onOpenChange={(open) => !open && setSelectedConversation(null)}
        title={selectedConversation ? 'Chat' : 'Chat'}
        side="bottom"
        fullHeight={true}
        showBackButton={true}
        onBack={() => setSelectedConversation(null)}
      >
        {chatView}
      </MobileDrawer>
    </div>
  );
};
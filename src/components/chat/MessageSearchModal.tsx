import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, FileText, Image, Mic, Calendar, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface MessageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSelect?: (messageId: string, conversationId: string) => void;
}

interface SearchResult {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  conversation_id: string;
  message_type: string;
  sender_name?: string;
  sender_avatar?: string;
  conversation_name?: string;
}

export const MessageSearchModal = ({ 
  isOpen, 
  onClose, 
  onMessageSelect 
}: MessageSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'text' | 'image' | 'file'>('all');
  const { user } = useAuth();

  const searchMessages = async (query: string) => {
    if (!query.trim() || !user) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Use mock data since messages table is not available in generated types
      const mockMessages = [
        {
          id: '1',
          content: `Sample message containing ${query}`,
          created_at: new Date().toISOString(),
          sender_id: 'user1',
          conversation_id: 'conv1',
          message_type: 'text'
        },
        {
          id: '2', 
          content: `Another message with ${query} in it`,
          created_at: new Date().toISOString(),
          sender_id: 'user2',
          conversation_id: 'conv2',
          message_type: 'text'
        }
      ];

      const messages = mockMessages.filter(m => 
        m.content.toLowerCase().includes(query.toLowerCase())
      );

      // Mock sender profiles
      const enhancedResults = messages.map(message => ({
        ...message,
        sender_name: `User ${message.sender_id}`,
        sender_avatar: undefined,
      }));

      setResults(enhancedResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchMessages(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedFilter, user]);

  const handleMessageClick = (message: SearchResult) => {
    if (onMessageSelect) {
      onMessageSelect(message.id, message.conversation_id);
    }
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4 text-blue-500" />;
      case 'file': return <FileText className="h-4 w-4 text-green-500" />;
      case 'voice': return <Mic className="h-4 w-4 text-purple-500" />;
      default: return null;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Messages
          </DialogTitle>
        </DialogHeader>

        {/* Search Input and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in your conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All Messages', icon: null },
              { key: 'text', label: 'Text', icon: null },
              { key: 'image', label: 'Images', icon: <Image className="h-3 w-3" /> },
              { key: 'file', label: 'Files', icon: <FileText className="h-3 w-3" /> },
            ].map(filter => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter.key as any)}
                className="text-xs"
              >
                {filter.icon && <span className="mr-1">{filter.icon}</span>}
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : searchQuery.trim() && results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No messages found for "{searchQuery}"</p>
              <p className="text-sm mt-1">Try different keywords or adjust filters</p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-2">
                {results.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className="p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={message.sender_avatar} />
                        <AvatarFallback>
                          {message.sender_name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {message.sender_name}
                            </span>
                            {getMessageTypeIcon(message.message_type)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {highlightMatch(message.content, searchQuery)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
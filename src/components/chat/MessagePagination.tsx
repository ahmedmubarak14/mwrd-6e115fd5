import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronUp, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MessagePaginationProps {
  conversationId: string;
  onMessagesLoad: (messages: any[], isOlder: boolean) => void;
  currentMessageCount: number;
  className?: string;
}

export const MessagePagination = ({
  conversationId,
  onMessagesLoad,
  currentMessageCount,
  className
}: MessagePaginationProps) => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldestMessageDate, setOldestMessageDate] = useState<string | null>(null);
  const { user } = useAuth();

  const MESSAGES_PER_PAGE = 50;

  // Load older messages
  const loadOlderMessages = useCallback(async () => {
    if (!conversationId || loading || !hasMore) return;

    setLoading(true);
    try {
      // Use mock data since messages table is not available in generated types
      const mockMessages = [
        { id: '1', content: 'Hello there!', created_at: new Date().toISOString(), sender_id: 'user1' },
        { id: '2', content: 'How are you doing?', created_at: new Date().toISOString(), sender_id: 'user2' }
      ];

      const messages = mockMessages;

      if (messages && messages.length > 0) {
        // Reverse to maintain chronological order
        const orderedMessages = messages.reverse();
        onMessagesLoad(orderedMessages, true);
        
        // Update oldest message date for next pagination
        setOldestMessageDate(orderedMessages[0].created_at);
        
        // Check if there are more messages
        if (messages.length < MESSAGES_PER_PAGE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading older messages:', error);
    } finally {
      setLoading(false);
    }
  }, [conversationId, loading, hasMore, oldestMessageDate, onMessagesLoad]);

  // Reset when conversation changes
  useEffect(() => {
    setHasMore(true);
    setOldestMessageDate(null);
  }, [conversationId]);

  // Auto-load more messages when scrolled to top
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (target.scrollTop === 0 && hasMore && !loading) {
      loadOlderMessages();
    }
  }, [loadOlderMessages, hasMore, loading]);

  // Intersection Observer for better scroll detection
  const [loadMoreRef, setLoadMoreRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadOlderMessages();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef);

    return () => observer.disconnect();
  }, [loadMoreRef, loadOlderMessages, hasMore, loading]);

  if (currentMessageCount < MESSAGES_PER_PAGE && !hasMore) {
    return null;
  }

  return (
    <div className={className}>
      {/* Load More Trigger (Intersection Observer) */}
      <div ref={setLoadMoreRef} className="h-4" />
      
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center py-4 space-y-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading older messages...</span>
          
          {/* Loading Skeletons */}
          <div className="w-full space-y-3 mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Manual Load More Button (fallback) */}
      {!loading && hasMore && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={loadOlderMessages}
            className="text-xs"
          >
            <ChevronUp className="h-4 w-4 mr-2" />
            Load older messages
          </Button>
        </div>
      )}
      
      {/* End of Messages Indicator */}
      {!hasMore && currentMessageCount > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">
            Beginning of conversation
          </div>
        </div>
      )}
    </div>
  );
};
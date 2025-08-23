import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

interface ChatOptimizationsConfig {
  enableMessageCaching?: boolean;
  enableImagePreloading?: boolean;
  enableTypingIndicator?: boolean;
  messageCacheTTL?: number; // Time to live in milliseconds
  maxCacheSize?: number;
}

const DEFAULT_CONFIG: Required<ChatOptimizationsConfig> = {
  enableMessageCaching: true,
  enableImagePreloading: true,
  enableTypingIndicator: true,
  messageCacheTTL: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 100
};

export const useChatOptimizations = (config: ChatOptimizationsConfig = {}) => {
  const { user } = useAuth();
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Message cache
  const [messageCache, setMessageCache] = useState<Map<string, CacheEntry>>(new Map());
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  // Message caching
  const getCachedMessages = useCallback((conversationId: string) => {
    if (!finalConfig.enableMessageCaching) return null;
    
    const cached = messageCache.get(conversationId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
    return null;
  }, [messageCache, finalConfig.enableMessageCaching]);

  const setCachedMessages = useCallback((conversationId: string, messages: any[]) => {
    if (!finalConfig.enableMessageCaching) return;
    
    setMessageCache(prev => {
      const newCache = new Map(prev);
      
      // Remove expired entries and limit cache size
      const now = Date.now();
      for (const [key, entry] of newCache) {
        if (entry.expiresAt < now) {
          newCache.delete(key);
        }
      }
      
      // If cache is still too large, remove oldest entries
      if (newCache.size >= finalConfig.maxCacheSize) {
        const entries = Array.from(newCache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp);
        const toRemove = entries.slice(0, newCache.size - finalConfig.maxCacheSize + 1);
        toRemove.forEach(([key]) => newCache.delete(key));
      }
      
      // Add new entry
      newCache.set(conversationId, {
        data: messages,
        timestamp: now,
        expiresAt: now + finalConfig.messageCacheTTL
      });
      
      return newCache;
    });
  }, [finalConfig.enableMessageCaching, finalConfig.maxCacheSize, finalConfig.messageCacheTTL]);

  // Image preloading
  const preloadImages = useCallback(async (imageUrls: string[]) => {
    if (!finalConfig.enableImagePreloading) return;
    
    const newUrls = imageUrls.filter(url => !preloadedImages.has(url));
    if (newUrls.length === 0) return;

    const preloadPromises = newUrls.map(url => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, url]));
          resolve();
        };
        img.onerror = () => resolve(); // Don't fail if image can't load
        img.src = url;
      });
    });

    await Promise.all(preloadPromises);
  }, [preloadedImages, finalConfig.enableImagePreloading]);

  // Message compression for storage
  const compressMessage = useCallback((message: any) => {
    // Remove unnecessary fields for storage
    const { 
      attachment_url, 
      file_metadata, 
      ...compressedMessage 
    } = message;
    
    return {
      ...compressedMessage,
      // Store only essential attachment info
      hasAttachment: !!attachment_url,
      attachmentType: message.message_type
    };
  }, []);

  // Optimized message fetching with caching
  const fetchMessagesOptimized = useCallback(async (conversationId: string, options: {
    useCache?: boolean;
    limit?: number;
    offset?: number;
  } = {}) => {
    const { useCache = true, limit = 50, offset = 0 } = options;
    
    // Check cache first
    if (useCache && offset === 0) {
      const cached = getCachedMessages(conversationId);
      if (cached) {
        return cached;
      }
    }

    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Cache the results (only for first page)
      if (offset === 0 && messages) {
        setCachedMessages(conversationId, messages);
        
        // Preload images in background
        const imageUrls = messages
          .filter(msg => msg.message_type === 'image' && msg.attachment_url)
          .map(msg => msg.attachment_url);
        
        if (imageUrls.length > 0) {
          preloadImages(imageUrls);
        }
      }

      return messages || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }, [getCachedMessages, setCachedMessages, preloadImages]);

  // Debounced typing indicator
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [typingTimeouts, setTypingTimeouts] = useState<Map<string, NodeJS.Timeout>>(new Map());

  const setUserTyping = useCallback((userId: string, isTyping: boolean) => {
    if (!finalConfig.enableTypingIndicator) return;

    setTypingUsers(prev => {
      const newSet = new Set(prev);
      if (isTyping) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });

    // Clear existing timeout
    const existingTimeout = typingTimeouts.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout to clear typing status
    if (isTyping) {
      const timeout = setTimeout(() => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        setTypingTimeouts(prev => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      }, 3000); // Clear after 3 seconds

      setTypingTimeouts(prev => new Map(prev.set(userId, timeout)));
    }
  }, [finalConfig.enableTypingIndicator, typingTimeouts]);

  // Performance metrics
  const [metrics, setMetrics] = useState({
    cacheHitRate: 0,
    averageLoadTime: 0,
    totalRequests: 0,
    cachedRequests: 0
  });

  const updateMetrics = useCallback((wasFromCache: boolean, loadTime?: number) => {
    setMetrics(prev => {
      const newTotalRequests = prev.totalRequests + 1;
      const newCachedRequests = wasFromCache ? prev.cachedRequests + 1 : prev.cachedRequests;
      
      return {
        totalRequests: newTotalRequests,
        cachedRequests: newCachedRequests,
        cacheHitRate: (newCachedRequests / newTotalRequests) * 100,
        averageLoadTime: loadTime ? 
          (prev.averageLoadTime * prev.totalRequests + loadTime) / newTotalRequests :
          prev.averageLoadTime
      };
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all typing timeouts
      typingTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [typingTimeouts]);

  return {
    // Message operations
    fetchMessagesOptimized,
    getCachedMessages,
    setCachedMessages,
    compressMessage,
    
    // Image operations
    preloadImages,
    preloadedImages,
    
    // Typing indicators
    typingUsers: Array.from(typingUsers),
    setUserTyping,
    
    // Performance
    metrics,
    updateMetrics,
    
    // Cache management
    clearCache: () => setMessageCache(new Map()),
    cacheSize: messageCache.size,
    
    // Config
    config: finalConfig
  };
};
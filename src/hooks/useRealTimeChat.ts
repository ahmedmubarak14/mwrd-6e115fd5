import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';
import { createLogger } from '@/utils/logger';

export interface Conversation {
  id: string;
  client_id: string;
  vendor_id: string;
  request_id?: string;
  offer_id?: string;
  status: string;
  conversation_type?: string;
  last_message?: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type?: string;
  attachment_url?: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export const useRealTimeChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const { user } = useAuth();
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);
  const logger = createLogger('useRealTimeChat');

  useEffect(() => {
    if (!user) return;

    logger.info('Setting up real-time subscriptions for user:', { userId: user.id });

    const setupRealtimeSubscriptions = async () => {
      try {
        const channel = supabase.channel('chat-updates');

        channel
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${user.id}`
          }, (payload) => {
            logger.debug('New message received via realtime:', { 
              conversationId: payload.new?.conversation_id,
              senderId: payload.new?.sender_id
            });
            const newMessage = payload.new as Message;
            setMessages(prev => ({
              ...prev,
              [newMessage.conversation_id]: [
                ...(prev[newMessage.conversation_id] || []),
                newMessage
              ]
            }));
          })
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations'
          }, (payload) => {
            logger.debug('Conversation updated via realtime:', { 
              conversationId: payload.new?.id,
              status: payload.new?.status
            });
            fetchConversations();
          })
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'conversations'
          }, (payload) => {
            logger.debug('New conversation created via realtime:', { 
              conversationId: payload.new?.id,
              clientId: payload.new?.client_id
            });
            fetchConversations();
          })
          .subscribe((status, error) => {
            if (error) {
              logger.error('Realtime subscription error:', { error });
              logger.info('Realtime disabled - app will work without live updates');
            } else {
              logger.debug('Realtime subscription status:', { status });
            }
          });

        setRealtimeChannel(channel);

        return () => {
          logger.debug('Cleaning up real-time subscriptions');
          try {
            supabase.removeChannel(channel);
          } catch (cleanupError) {
            logger.warn('Error cleaning up realtime channel:', { cleanupError });
          }
        };
      } catch (error) {
        logger.error('Failed to setup realtime subscriptions:', { error });
        logger.info('App will continue to work without realtime features');
        return () => {}; // Return empty cleanup function
      }
    };

    const cleanup = setupRealtimeSubscriptions();
    
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, [user]);

  const startConversation = useCallback(async (
    recipientUserIdOrProfileId: string,
    requestId?: string,
    offerId?: string,
    conversationType: string = 'business'
  ) => {
    if (!user) throw new Error('User not authenticated');

    logger.info('Starting conversation with recipient:', { recipientId: recipientUserIdOrProfileId, requestId, offerId });

    try {
      // First, get the current user's profile ID
      const { data: currentUserProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!currentUserProfile) {
        throw new Error('Current user profile not found');
      }

      logger.debug('Current user profile found:', { profileId: currentUserProfile.id });

      // Determine if recipientUserIdOrProfileId is a user_id or profile_id
      let recipientProfileId: string;

      // First try as user_id
      let { data: recipientProfile } = await supabase
        .from('user_profiles')
        .select('id, user_id')
        .eq('user_id', recipientUserIdOrProfileId)
        .maybeSingle();

      if (recipientProfile) {
        recipientProfileId = recipientProfile.id;
        logger.debug('Found recipient by user_id:', { recipientProfileId });
      } else {
        // Try as profile_id
        const { data: profileById } = await supabase
        .from('user_profiles')
        .select('id, user_id')
        .eq('id', recipientUserIdOrProfileId)
        .maybeSingle();

      if (profileById) {
        recipientProfileId = profileById.id;
        logger.debug('Found recipient by profile_id:', { recipientProfileId });
      } else {
        throw new Error('Recipient profile not found');
      }
      }

      logger.debug('Recipient profile resolved:', { recipientProfileId });

      // Determine which user is the client and which is the vendor
      const currentUserRole = user.user_metadata?.role;
      const isCurrentUserClient = currentUserRole === 'client';
      
      const clientId = isCurrentUserClient ? currentUserProfile.id : recipientProfileId;
      const vendorId = isCurrentUserClient ? recipientProfileId : currentUserProfile.id;

      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(client_id.eq.${clientId},vendor_id.eq.${vendorId}),and(client_id.eq.${vendorId},vendor_id.eq.${clientId})`)
        .eq('conversation_type', conversationType)
        .maybeSingle();

      if (existingConversation) {
        logger.debug('Found existing conversation:', { conversationId: existingConversation.id });
        return existingConversation;
      }

      // Create new conversation using profile IDs
      logger.debug('Creating new conversation between profiles:', { clientId, vendorId });
      const conversationData: any = {
        client_id: clientId,
        vendor_id: vendorId,
        status: 'active',
        conversation_type: conversationType
      };

      if (requestId) conversationData.request_id = requestId;
      if (offerId) conversationData.offer_id = offerId;

      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single();

      if (error) {
        logger.error('Error creating conversation:', { error, conversationData });
        throw error;
      }

      logger.info('Created new conversation:', { conversationId: newConversation.id });
      await fetchConversations();
      return newConversation;
    } catch (error: any) {
      logger.error('Error starting conversation:', { error, recipientId: recipientUserIdOrProfileId });
      throw error;
    }
  }, [user]);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    recipientId: string,
    messageType: 'text' | 'image' | 'file' | 'voice' = 'text',
    attachmentUrl?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    logger.debug('Sending message:', { conversationId, messageType, contentLength: content.length });

    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          message_type: messageType,
          attachment_url: attachmentUrl
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation last message with proper text for voice messages
      const lastMessageText = messageType === 'voice' ? '🎵 Voice message' : 
                            messageType === 'text' ? content : 
                            `Sent ${messageType}`;

      await supabase
        .from('conversations')
        .update({
          last_message: lastMessageText,
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      // Add to local state
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), message]
      }));

      logger.debug('Message sent successfully:', { messageId: message.id });
      return message;
    } catch (error: any) {
      logger.error('Error sending message:', { error, conversationId });
      throw error;
    }
  }, [user]);

  const markAsRead = useCallback(async (messageIds: string[]) => {
    if (!user || messageIds.length === 0) return;

    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', messageIds)
        .eq('recipient_id', user.id);
    } catch (error: any) {
      logger.error('Error marking messages as read:', { error, messageCount: messageIds.length });
    }
  }, [user]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    logger.debug('Fetching messages for conversation:', { conversationId });
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(prev => ({
        ...prev,
        [conversationId]: data || []
      }));

      logger.debug('Fetched messages:', { conversationId, messageCount: data?.length || 0 });
      return data;
    } catch (error: any) {
      logger.error('Error fetching messages:', { error, conversationId });
      return [];
    }
  }, []);

  const getUnreadCount = useCallback((conversationId: string) => {
    if (!user) return 0;
    
    const conversationMessages = messages[conversationId] || [];
    return conversationMessages.filter(
      msg => msg.recipient_id === user.id && !msg.read_at
    ).length;
  }, [messages, user]);

  const getOtherParticipant = useCallback(async (conversation: Conversation) => {
    if (!user) return null;

    try {
      // First get current user's profile ID
      const { data: currentUserProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!currentUserProfile) {
        logger.error('Current user profile not found when fetching participant');
        return null;
      }

      // Determine which profile ID is the "other" participant
      const otherParticipantId = conversation.client_id === currentUserProfile.id 
        ? conversation.vendor_id 
        : conversation.client_id;

      logger.debug('Looking for other participant:', { otherParticipantId });

      // Fetch the other participant's profile using their profile ID
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', otherParticipantId)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching other participant:', { error, otherParticipantId });
        return null;
      }

      if (!profile) {
        logger.error('Other participant profile not found:', { otherParticipantId });
        return null;
      }

      logger.debug('Found other participant:', { 
        participantId: otherParticipantId,
        name: profile.full_name || profile.company_name
      });
      return profile;
    } catch (error) {
      logger.error('Error fetching participant:', { error });
      return null;
    }
  }, [user]);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    logger.debug('Fetching conversations for user:', { userId: user.id });
    setLoading(true);
    setError(null);

    try {
      // First get the current user's profile ID
      const { data: currentUserProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!currentUserProfile) {
        throw new Error('Current user profile not found');
      }

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`client_id.eq.${currentUserProfile.id},vendor_id.eq.${currentUserProfile.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;

      logger.debug('Fetched conversations:', { userId: user.id, conversationCount: data?.length || 0 });
      setConversations(data || []);
    } catch (error: any) {
      logger.error('Error fetching conversations:', { error, userId: user.id });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    loading,
    error,
    activeConversation,
    setActiveConversation,
    startConversation,
    sendMessage,
    markAsRead,
    fetchMessages,
    getUnreadCount,
    getOtherParticipant,
    refetch: fetchConversations
  };
};

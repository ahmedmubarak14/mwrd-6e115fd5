import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type ConversationRow = Database['public']['Tables']['conversations']['Row'];
type MessageRow = Database['public']['Tables']['messages']['Row'];

export interface Conversation extends ConversationRow {}

export interface Message extends MessageRow {}

export const useRealTimeChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`client_id.eq.${user.id},supplier_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data as Conversation[] || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, [user]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setMessages(prev => ({
        ...prev,
        [conversationId]: (data as Message[]) || []
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [user]);

  // Start a new conversation
  const startConversation = useCallback(async (
    recipientId: string,
    requestId?: string,
    offerId?: string
  ) => {
    if (!user) return null;

    try {
      // Determine client and supplier roles based on user profile
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      const isClient = userProfile?.role === 'client';
      const clientId = isClient ? user.id : recipientId;
      const supplierId = isClient ? recipientId : user.id;

      const { data, error } = await supabase.rpc('start_conversation', {
        p_request_id: requestId || null,
        p_offer_id: offerId || null,
        p_client_id: clientId,
        p_supplier_id: supplierId
      });

      if (error) throw error;
      
      await fetchConversations();
      return data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      return null;
    }
  }, [user, fetchConversations]);

  // Send a message
  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    recipientId: string,
    messageType: 'text' | 'image' | 'file' = 'text',
    attachmentUrl?: string,
    attachmentType?: string,
    replyToId?: string
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          message_type: messageType,
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
          reply_to_id: replyToId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }, [user]);

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds: string[]) => {
    if (!user || messageIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          message_status: 'read',
          read_at: new Date().toISOString()
        })
        .in('id', messageIds)
        .eq('recipient_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    let conversationChannel: RealtimeChannel;
    let messageChannel: RealtimeChannel;

    const setupRealtimeSubscriptions = () => {
      // Subscribe to conversation changes
      conversationChannel = supabase
        .channel('conversations')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversations'
          },
          (payload) => {
            console.log('Conversation change:', payload);
            fetchConversations();
          }
        )
        .subscribe();

      // Subscribe to message changes
      messageChannel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            console.log('Message change:', payload);
            
            if (payload.eventType === 'INSERT') {
              const message = payload.new as Message;
              
              if (message.conversation_id && 
                  (message.sender_id === user.id || message.recipient_id === user.id)) {
                
                setMessages(prev => ({
                  ...prev,
                  [message.conversation_id!]: [
                    ...(prev[message.conversation_id!] || []),
                    message
                  ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                }));

                // Refresh conversations to update last_message_at
                fetchConversations();
              }
            }
          }
        )
        .subscribe();
    };

    setupRealtimeSubscriptions();

    return () => {
      if (conversationChannel) supabase.removeChannel(conversationChannel);
      if (messageChannel) supabase.removeChannel(messageChannel);
    };
  }, [user, fetchConversations]);

  // Initial data fetch
  useEffect(() => {
    const initializeChat = async () => {
      setLoading(true);
      await fetchConversations();
      setLoading(false);
    };

    if (user) {
      initializeChat();
    }
  }, [user, fetchConversations]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation, fetchMessages]);

  const getUnreadCount = useCallback((conversationId: string) => {
    const conversationMessages = messages[conversationId] || [];
    return conversationMessages.filter(
      msg => msg.recipient_id === user?.id && msg.message_status !== 'read'
    ).length;
  }, [messages, user]);

  const getOtherParticipant = useCallback((conversation: Conversation) => {
    if (!user) return null;
    return conversation.client_id === user.id 
      ? conversation.supplier_id 
      : conversation.client_id;
  }, [user]);

  return {
    conversations,
    messages,
    loading,
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
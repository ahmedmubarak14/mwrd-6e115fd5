import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Conversation {
  id: string;
  client_id: string;
  vendor_id: string;
  request_id?: string;
  offer_id?: string;
  status: string;
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

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('chat-updates');

    // Listen for new messages
    channel
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`
      }, (payload) => {
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
      }, () => {
        fetchConversations();
      })
      .subscribe();

    setRealtimeChannel(channel);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const startConversation = useCallback(async (
    recipientId: string,
    requestId?: string,
    offerId?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(client_id.eq.${user.id},vendor_id.eq.${recipientId}),and(client_id.eq.${recipientId},vendor_id.eq.${user.id})`)
        .eq('request_id', requestId || '')
        .eq('offer_id', offerId || '')
        .single();

      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          client_id: user.id,
          vendor_id: recipientId,
          request_id: requestId,
          offer_id: offerId,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      await fetchConversations();
      return newConversation;
    } catch (error: any) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }, [user]);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    recipientId: string,
    messageType: 'text' | 'image' | 'file' = 'text',
    attachmentUrl?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

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

      // Update conversation last message
      await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      // Add to local state
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), message]
      }));

      return message;
    } catch (error: any) {
      console.error('Error sending message:', error);
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
      console.error('Error marking messages as read:', error);
    }
  }, [user]);

  const fetchMessages = useCallback(async (conversationId: string) => {
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

      return data;
    } catch (error: any) {
      console.error('Error fetching messages:', error);
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

    const otherUserId = conversation.client_id === user.id 
      ? conversation.vendor_id 
      : conversation.client_id;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', otherUserId)
        .single();

      return profile;
    } catch (error) {
      console.error('Error fetching participant:', error);
      return null;
    }
  }, [user]);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`client_id.eq.${user.id},vendor_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      setConversations(data || []);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
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
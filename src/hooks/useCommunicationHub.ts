import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Conversation {
  id: string;
  client_id: string;
  vendor_id: string;
  request_id?: string;
  offer_id?: string;
  support_ticket_id?: string;
  conversation_type?: string;
  status: string;
  last_message?: string;
  last_message_at?: string;
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
  file_metadata?: any;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageData {
  conversation_id: string;
  recipient_id: string;
  content: string;
  message_type?: string;
  attachment_url?: string;
  file_metadata?: any;
}

export const useCommunicationHub = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`client_id.eq.${user.id},vendor_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch conversations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch messages',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (
    recipientId: string,
    requestId?: string,
    offerId?: string,
    conversationType: string = 'business'
  ): Promise<Conversation | null> => {
    if (!user) return null;

    try {
      const conversationData = {
        client_id: user.id,
        vendor_id: recipientId,
        request_id: requestId,
        offer_id: offerId,
        conversation_type: conversationType,
        status: 'active'
      };

      const { data, error } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single();

      if (error) throw error;

      await fetchConversations();
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create conversation',
        variant: 'destructive'
      });
      return null;
    }
  };

  const sendMessage = async (messageData: CreateMessageData): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          ...messageData,
          sender_id: user.id
        });

      if (error) throw error;

      // Update conversation last message
      await supabase
        .from('conversations')
        .update({
          last_message: messageData.content,
          last_message_at: new Date().toISOString()
        })
        .eq('id', messageData.conversation_id);

      await fetchMessages(messageData.conversation_id);
      await fetchConversations();

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
      return false;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('recipient_id', user?.id);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getUnreadCount = (conversationId: string): number => {
    return messages.filter(
      msg => msg.conversation_id === conversationId && 
      msg.recipient_id === user?.id && 
      !msg.read_at
    ).length;
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const conversationChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `client_id=eq.${user.id},vendor_id=eq.${user.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    const messageChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.recipient_id === user.id || newMessage.sender_id === user.id) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    createConversation,
    sendMessage,
    fetchMessages,
    markAsRead,
    getUnreadCount,
    refreshConversations: fetchConversations
  };
};
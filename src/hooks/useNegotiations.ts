import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface NegotiationMessage {
  id: string;
  type: 'offer' | 'counter_offer' | 'message' | 'acceptance' | 'rejection';
  sender: 'client' | 'vendor';
  senderInfo: {
    name: string;
    avatar?: string;
    title?: string;
  };
  content: string;
  price?: number;
  deliveryTime?: number;
  changes?: {
    priceChange: number;
    deliveryChange: number;
  };
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export interface NegotiationThread {
  id: string;
  offerId: string;
  originalOffer: {
    price: number;
    deliveryTime: number;
    title: string;
  };
  currentOffer: {
    price: number;
    deliveryTime: number;
  };
  status: 'active' | 'completed' | 'cancelled';
  messages: NegotiationMessage[];
  createdAt: string;
  lastActivity: string;
}

export const useNegotiations = (offerId?: string) => {
  const [negotiationThread, setNegotiationThread] = useState<NegotiationThread | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, userProfile } = useAuth();

  const fetchNegotiationThread = async () => {
    if (!offerId || !user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch the offer details
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .select(`
          *,
          request:requests(*),
          vendor:user_profiles!offers_vendor_id_fkey(*),
          messages:messages(
            *,
            sender:user_profiles!messages_sender_id_fkey(*)
          )
        `)
        .eq('id', offerId)
        .single();

      if (offerError) throw offerError;
      if (!offer) return;

      // Fetch conversation messages
      const { data: conversation } = await supabase
        .from('conversations')
        .select(`
          *,
          messages:messages(
            *,
            sender:user_profiles!messages_sender_id_fkey(*),
            recipient:user_profiles!messages_recipient_id_fkey(*)
          )
        `)
        .eq('offer_id', offerId)
        .maybeSingle();

      // Transform messages to negotiation format
      const messages: NegotiationMessage[] = [];
      
      // Add initial offer
      messages.push({
        id: offer.id,
        type: 'offer',
        sender: 'vendor',
        senderInfo: {
          name: offer.vendor?.full_name || offer.vendor?.company_name || 'Vendor',
          avatar: offer.vendor?.avatar_url,
          title: 'Service Provider'
        },
        content: offer.description || 'Initial offer',
        price: Number(offer.price) || 0,
        deliveryTime: offer.delivery_time || 7,
        timestamp: offer.created_at,
        status: offer.client_approval_status === 'approved' ? 'accepted' : 'pending'
      });

      // Add conversation messages if any
      if (conversation?.messages) {
        conversation.messages.forEach((msg: any) => {
          messages.push({
            id: msg.id,
            type: 'message',
            sender: msg.sender_id === offer.vendor_id ? 'vendor' : 'client',
            senderInfo: {
              name: msg.sender?.full_name || msg.sender?.company_name || 'User',
              avatar: msg.sender?.avatar_url
            },
            content: msg.content,
            timestamp: msg.created_at,
            status: 'pending'
          });
        });
      }

      const thread: NegotiationThread = {
        id: offerId,
        offerId,
        originalOffer: {
          price: Number(offer.price) || 0,
          deliveryTime: offer.delivery_time || 7,
          title: offer.title || offer.request?.title || 'Service'
        },
        currentOffer: {
          price: Number(offer.price) || 0,
          deliveryTime: offer.delivery_time || 7
        },
        status: offer.status === 'accepted' ? 'completed' : 'active',
        messages: messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
        createdAt: offer.created_at,
        lastActivity: conversation?.updated_at || offer.updated_at
      };

      setNegotiationThread(thread);
    } catch (error: any) {
      console.error('Error fetching negotiation thread:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, offerId: string) => {
    if (!user || !content.trim()) return;

    try {
      // Find or create conversation
      let { data: conversation } = await supabase
        .from('conversations')
        .select('*')
        .eq('offer_id', offerId)
        .maybeSingle();

      if (!conversation) {
        const { data: offer } = await supabase
          .from('offers')
          .select('vendor_id, request:requests(client_id)')
          .eq('id', offerId)
          .single();

        if (!offer) throw new Error('Offer not found');

        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            client_id: offer.request?.client_id,
            vendor_id: offer.vendor_id,
            offer_id: offerId,
            status: 'active'
          })
          .select()
          .single();

        if (conversationError) throw conversationError;
        conversation = newConversation;
      }

      // Send message
      const recipientId = userProfile?.role === 'vendor' 
        ? conversation.client_id 
        : conversation.vendor_id;

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim(),
          message_type: 'text'
        });

      if (messageError) throw messageError;

      // Refresh thread
      await fetchNegotiationThread();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  };

  const sendCounterOffer = async (price: number, deliveryTime: number, message: string) => {
    if (!user || !offerId) return;

    try {
      // Update the offer with new terms
      const { error: updateError } = await supabase
        .from('offers')
        .update({
          price,
          delivery_time: deliveryTime,
          description: message,
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (updateError) throw updateError;

      // Send a message about the counter offer
      await sendMessage(`Counter offer: ${price.toLocaleString()} SAR, ${deliveryTime} days. ${message}`, offerId);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error sending counter offer:', error);
      return { success: false, error: error.message };
    }
  };

  const acceptOffer = async () => {
    if (!user || !offerId) return;

    try {
      const { error } = await supabase
        .from('offers')
        .update({
          client_approval_status: 'approved',
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (error) throw error;

      await fetchNegotiationThread();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error accepting offer:', error);
      return { success: false, error: error.message };
    }
  };

  const rejectOffer = async (reason: string) => {
    if (!user || !offerId) return;

    try {
      const { error } = await supabase
        .from('offers')
        .update({
          client_approval_status: 'rejected',
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (error) throw error;

      // Send rejection message
      await sendMessage(`Offer rejected: ${reason}`, offerId);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error rejecting offer:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (offerId) {
      fetchNegotiationThread();
    }
  }, [offerId, user]);

  return {
    negotiationThread,
    loading,
    error,
    sendMessage: (message: string) => sendMessage(message, offerId!),
    sendCounterOffer,
    acceptOffer,
    rejectOffer,
    fetchNegotiationThread
  };
};
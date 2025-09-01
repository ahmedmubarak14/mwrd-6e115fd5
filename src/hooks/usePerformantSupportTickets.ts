import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SupportTicket {
  id: string;
  user_id: string | null;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  assigned_admin_id: string | null;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

export const usePerformantSupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  // Memoize the fetch function to prevent unnecessary re-creates
  const fetchTickets = useCallback(async () => {
    if (!user) {
      setTickets([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      // Only fetch user's own tickets if not admin
      if (userProfile?.role !== 'admin') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching support tickets:', error);
        toast({
          title: "Error loading tickets",
          description: "Unable to load support tickets. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Add mock profile data for display purposes
      const transformedTickets = (data || []).map(ticket => ({
        ...ticket,
        profiles: {
          full_name: userProfile?.full_name || null,
          email: userProfile?.email || null
        }
      }));

      setTickets(transformedTickets);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      toast({
        title: "Error loading tickets", 
        description: "Unable to load support tickets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, userProfile?.role, userProfile?.full_name, userProfile?.email, toast]);

  // Optimized create ticket function with immediate UI update
  const createTicket = useCallback(async (ticketData: {
    subject: string;
    category: string;
    priority: string;
    message: string;
  }) => {
    if (!user) {
      throw new Error('User must be authenticated to create tickets');
    }

    try {
      // Create the ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: ticketData.subject,
          category: ticketData.category,
          priority: ticketData.priority,
          status: 'open'
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Create conversation and initial message
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          client_id: user.id,
          vendor_id: user.id, // For support tickets, use same user
          support_ticket_id: ticket.id,
          conversation_type: 'support',
          status: 'active'
        })
        .select()
        .single();

      if (conversationError) throw conversationError;

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          recipient_id: user.id, // Admin will be assigned later
          content: ticketData.message,
          message_type: 'text'
        });

      if (messageError) throw messageError;

      // Optimistically update UI - add new ticket to the beginning
      const newTicket = {
        ...ticket,
        profiles: {
          full_name: userProfile?.full_name || null,
          email: userProfile?.email || null
        }
      };
      
      setTickets(prev => [newTicket, ...prev]);

      toast({
        title: "Support ticket created",
        description: "Your ticket has been submitted successfully.",
      });

      return ticket;
    } catch (error) {
      console.error('Error creating support ticket:', error);
      toast({
        title: "Error creating ticket",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, userProfile, toast]);

  // Memoize pending tickets count for performance
  const getPendingTicketsCount = useMemo(() => {
    return tickets.filter(ticket => ticket.status === 'open' || ticket.status === 'pending').length;
  }, [tickets]);

  // Enhanced ticket metrics with memoization
  const ticketMetrics = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const pending = tickets.filter(t => t.status === 'pending').length;
    const resolved = tickets.filter(t => t.status === 'closed' || t.status === 'resolved').length;
    
    return { total, open, pending, resolved };
  }, [tickets]);

  // Initial fetch on mount and when dependencies change
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Optimized real-time subscription with proper cleanup
  useEffect(() => {
    if (!user) return;

    let subscription: any = null;
    let retryTimeout: NodeJS.Timeout | null = null;

    const setupSubscription = () => {
      try {
        subscription = supabase
          .channel(`support_tickets_${user.id}`)
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'support_tickets',
              // Only listen to changes for current user (unless admin)
              filter: userProfile?.role === 'admin' ? undefined : `user_id=eq.${user.id}`
            },
            (payload) => {
              console.log('Support ticket changed:', payload);
              
              // Handle different events efficiently
              if (payload.eventType === 'INSERT') {
                const newTicket = payload.new as SupportTicket;
                setTickets(prev => {
                  // Avoid duplicates
                  if (prev.some(t => t.id === newTicket.id)) return prev;
                  return [{ ...newTicket, profiles: { full_name: userProfile?.full_name || null, email: userProfile?.email || null }}, ...prev];
                });
              } else if (payload.eventType === 'UPDATE') {
                const updatedTicket = payload.new as SupportTicket;
                setTickets(prev => prev.map(t => 
                  t.id === updatedTicket.id ? { ...t, ...updatedTicket } : t
                ));
              } else if (payload.eventType === 'DELETE') {
                const deletedId = payload.old.id;
                setTickets(prev => prev.filter(t => t.id !== deletedId));
              }
            }
          )
          .subscribe((status) => {
            console.log('Support tickets subscription status:', status);
            
            if (status === 'SUBSCRIBED') {
              // Clear any retry timeout on successful connection
              if (retryTimeout) {
                clearTimeout(retryTimeout);
                retryTimeout = null;
              }
            } else if (status === 'CHANNEL_ERROR') {
              // Retry subscription after 5 seconds
              retryTimeout = setTimeout(() => {
                console.log('Retrying support tickets subscription...');
                setupSubscription();
              }, 5000);
            }
          });
      } catch (error) {
        console.error('Failed to set up real-time subscription:', error);
      }
    };

    // Only set up subscription for admin users or limit to user's own tickets
    if (userProfile) {
      setupSubscription();
    }

    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from support tickets:', error);
        }
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [user, userProfile?.role, userProfile?.full_name, userProfile?.email]);

  return {
    tickets,
    loading,
    createTicket,
    fetchTickets,
    getPendingTicketsCount,
    ticketMetrics
  };
};
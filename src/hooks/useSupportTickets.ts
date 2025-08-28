
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';

export interface SupportTicket {
  id: string;
  user_id: string;
  assigned_admin_id?: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_profiles?: {
    full_name?: string;
    email: string;
    company_name?: string;
    avatar_url?: string;
  };
  assigned_admin?: {
    full_name?: string;
    email: string;
    avatar_url?: string;
  };
}

export const useSupportTickets = () => {
  const { user, userProfile } = useAuth();
  const { showSuccess, showError } = useToastFeedback();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First, get the basic ticket data
      let ticketsQuery = supabase.from('support_tickets').select('*');
      
      // If user is admin, get all tickets. Otherwise, get only user's tickets
      if (userProfile?.role !== 'admin') {
        ticketsQuery = ticketsQuery.eq('user_id', user.id);
      }

      const { data: ticketsData, error: ticketsError } = await ticketsQuery.order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      // Now enrich with user profile data
      const enrichedTickets = await Promise.all(
        (ticketsData || []).map(async (ticket) => {
          let userProfile = undefined;
          let assignedAdmin = undefined;

          // Fetch user profile data
          if (ticket.user_id) {
            const { data: userProfileData } = await supabase
              .from('user_profiles')
              .select('full_name, email, company_name, avatar_url')
              .eq('user_id', ticket.user_id)
              .single();
            
            if (userProfileData) {
              userProfile = userProfileData;
            }
          }

          // Fetch assigned admin data
          if (ticket.assigned_admin_id) {
            const { data: adminData } = await supabase
              .from('user_profiles')
              .select('full_name, email, avatar_url')
              .eq('user_id', ticket.assigned_admin_id)
              .single();
            
            if (adminData) {
              assignedAdmin = adminData;
            }
          }

          return {
            ...ticket,
            user_profiles: userProfile,
            assigned_admin: assignedAdmin
          };
        })
      );

      setTickets(enrichedTickets);
    } catch (error: any) {
      console.error('Error fetching support tickets:', error);
      showError('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: {
    subject: string;
    category: string;
    priority: string;
    message: string;
  }) => {
    if (!user) return null;

    try {
      // Create support ticket
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

      // Create conversation for the ticket
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          client_id: user.id,
          vendor_id: user.id, // Will be updated when admin responds
          support_ticket_id: ticket.id,
          conversation_type: 'support',
          status: 'active'
        })
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Send initial message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          recipient_id: user.id, // Will be updated when admin responds
          content: `Support Request: ${ticketData.subject}\n\n${ticketData.message}`,
          message_type: 'support_request'
        });

      if (messageError) throw messageError;

      showSuccess('Support ticket created successfully');
      fetchTickets(); // Refresh tickets
      return ticket;
    } catch (error: any) {
      console.error('Error creating support ticket:', error);
      showError('Failed to create support ticket');
      return null;
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      if (error) throw error;
      
      showSuccess('Ticket status updated');
      fetchTickets();
    } catch (error: any) {
      console.error('Error updating ticket:', error);
      showError('Failed to update ticket status');
    }
  };

  const assignTicket = async (ticketId: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ assigned_admin_id: adminId, updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      if (error) throw error;
      
      showSuccess('Ticket assigned successfully');
      fetchTickets();
    } catch (error: any) {
      console.error('Error assigning ticket:', error);
      showError('Failed to assign ticket');
    }
  };

  const getPendingTicketsCount = () => {
    return tickets.filter(ticket => ticket.status === 'open').length;
  };

  useEffect(() => {
    fetchTickets();
  }, [user, userProfile]);

  // Set up real-time subscription for admin users
  useEffect(() => {
    if (!user || userProfile?.role !== 'admin') return;

    const subscription = supabase
      .channel('support_tickets')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'support_tickets' },
        () => {
          fetchTickets(); // Refresh on any change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, userProfile]);

  return {
    tickets,
    loading,
    createTicket,
    updateTicketStatus,
    assignTicket,
    getPendingTicketsCount,
    fetchTickets
  };
};

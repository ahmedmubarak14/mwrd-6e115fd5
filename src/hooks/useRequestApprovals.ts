import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface RequestWithProfile {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  currency: string;
  location?: string;
  deadline?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  admin_approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  client_id: string;
  client_profile?: {
    full_name?: string;
    email: string;
    company_name?: string;
  };
}

export const useRequestApprovals = () => {
  const [requests, setRequests] = useState<RequestWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPendingRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          id,
          title,
          description,
          category,
          budget_min,
          budget_max,
          currency,
          location,
          deadline,
          urgency,
          admin_approval_status,
          created_at,
          client_id,
          client_profile:user_profiles!requests_client_id_fkey(
            full_name,
            email,
            company_name
          )
        `)
        .eq('admin_approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData: RequestWithProfile[] = (data || []).map(request => ({
        id: request.id,
        title: request.title,
        description: request.description,
        category: request.category,
        budget_min: request.budget_min,
        budget_max: request.budget_max,
        currency: request.currency || 'SAR',
        location: request.location,
        deadline: request.deadline,
        urgency: (request.urgency || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
        admin_approval_status: request.admin_approval_status as 'pending' | 'approved' | 'rejected',
        created_at: request.created_at,
        client_id: request.client_id,
        client_profile: request.client_profile
      }));
      
      setRequests(transformedData);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending requests',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId: string, notes?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('requests')
        .update({
          admin_approval_status: 'approved'
        })
        .eq('id', requestId);

      if (error) throw error;
      
      // Create notification for client
      const request = requests.find(r => r.id === requestId);
      if (request) {
        await supabase
          .from('notifications')
          .insert({
            user_id: request.client_id,
            type: 'request_approved',
            title: 'Request Approved',
            message: 'Your procurement request has been approved by admin.',
            category: 'requests',
            priority: 'high',
            data: { request_id: requestId, notes }
          });
      }

      await fetchPendingRequests();
      
      toast({
        title: 'Success',
        description: 'Request approved successfully'
      });
    } catch (error) {
      console.error('Error approving request:', error);
      throw error;
    }
  };

  const rejectRequest = async (requestId: string, notes?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('requests')
        .update({
          admin_approval_status: 'rejected'
        })
        .eq('id', requestId);

      if (error) throw error;
      
      // Create notification for client
      const request = requests.find(r => r.id === requestId);
      if (request) {
        await supabase
          .from('notifications')
          .insert({
            user_id: request.client_id,
            type: 'request_rejected',
            title: 'Request Rejected',
            message: 'Your procurement request has been rejected by admin.',
            category: 'requests',
            priority: 'high',
            data: { 
              request_id: requestId,
              rejection_notes: notes
            }
          });
      }

      await fetchPendingRequests();
      
      toast({
        title: 'Success',
        description: 'Request rejected successfully'
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    }
  };

  const bulkApproveRequests = async (requestIds: string[], notes?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('requests')
        .update({
          admin_approval_status: 'approved'
        })
        .in('id', requestIds);

      if (error) throw error;

      // Create notifications for clients
      const notifications = requestIds.map(requestId => {
        const request = requests.find(r => r.id === requestId);
        return {
          user_id: request?.client_id,
          type: 'request_approved',
          title: 'Request Approved',
          message: 'Your procurement request has been approved by admin.',
          category: 'requests',
          priority: 'high',
          data: { request_id: requestId, notes }
        };
      }).filter(n => n.user_id);

      if (notifications.length > 0) {
        await supabase.from('notifications').insert(notifications);
      }

      await fetchPendingRequests();
      
      toast({
        title: 'Success',
        description: `${requestIds.length} requests approved successfully`
      });
    } catch (error) {
      console.error('Error bulk approving requests:', error);
      throw error;
    }
  };

  const bulkRejectRequests = async (requestIds: string[], notes?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('requests')
        .update({
          admin_approval_status: 'rejected'
        })
        .in('id', requestIds);

      if (error) throw error;

      // Create notifications for clients
      const notifications = requestIds.map(requestId => {
        const request = requests.find(r => r.id === requestId);
        return {
          user_id: request?.client_id,
          type: 'request_rejected',
          title: 'Request Rejected',
          message: 'Your procurement request has been rejected by admin.',
          category: 'requests',
          priority: 'high',
          data: { 
            request_id: requestId,
            rejection_notes: notes
          }
        };
      }).filter(n => n.user_id);

      if (notifications.length > 0) {
        await supabase.from('notifications').insert(notifications);
      }

      await fetchPendingRequests();
      
      toast({
        title: 'Success',
        description: `${requestIds.length} requests rejected successfully`
      });
    } catch (error) {
      console.error('Error bulk rejecting requests:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, [user]);

  return {
    requests,
    loading,
    fetchPendingRequests,
    approveRequest,
    rejectRequest,
    bulkApproveRequests,
    bulkRejectRequests
  };
};
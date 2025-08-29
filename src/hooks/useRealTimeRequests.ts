import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/MinimalAuthContext';
import { useToast } from '@/hooks/use-toast';
export interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
  location?: string;
  deadline?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  client_id: string;
  user_id: string;
  admin_approval_status: string;
  offers?: any[];
}

export const useRealTimeRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const channelRef = useRef<any>(null);

  // Fetch initial requests
  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          offers (*)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedData = (data || []).map(request => ({
        ...request,
        user_id: request.client_id
      })) as Request[];
      
      setRequests(mappedData);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to load requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchRequests();

    // Set up real-time subscription
    channelRef.current = supabase
      .channel('requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'requests',
          filter: `client_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time request update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newRequest = {
              ...payload.new,
              user_id: payload.new.client_id,
              offers: []
            } as Request;
            
            setRequests(prev => [newRequest, ...prev]);
            
            toast({
              title: "New Request Created",
              description: `Request "${newRequest.title}" has been created`,
            });
            
          } else if (payload.eventType === 'UPDATE') {
            const updatedRequest = {
              ...payload.new,
              user_id: payload.new.client_id
            } as Request;
            
            setRequests(prev => 
              prev.map(req => 
                req.id === updatedRequest.id 
                  ? { ...req, ...updatedRequest }
                  : req
              )
            );
            
            toast({
              title: "Request Updated",
              description: `Request "${updatedRequest.title}" has been updated`,
            });
            
          } else if (payload.eventType === 'DELETE') {
            setRequests(prev => 
              prev.filter(req => req.id !== payload.old.id)
            );
            
            toast({
              title: "Request Deleted",
              description: "Request has been deleted",
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers'
        },
        (payload) => {
          console.log('Real-time offer update:', payload);
          
          // Update request with new offer data
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const offer = payload.new;
            
            setRequests(prev =>
              prev.map(req => {
                if (req.id === offer.request_id) {
                  // Refetch offers for this request
                  fetchRequestOffers(req.id);
                  
                  if (payload.eventType === 'INSERT') {
                    toast({
                      title: "New Offer Received",
                      description: `New offer received for "${req.title}"`,
                    });
                  }
                }
                return req;
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [user]);

  // Fetch offers for a specific request
  const fetchRequestOffers = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('request_id', requestId);

      if (error) throw error;

      setRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? { ...req, offers: data || [] }
            : req
        )
      );
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  // Create request with real-time update
  const createRequest = async (requestData: {
    title: string;
    description: string;
    category: string;
    budget_min?: number;
    budget_max?: number;
    location?: string;
    deadline?: string;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([{ 
          client_id: user.id,
          title: requestData.title,
          description: requestData.description,
          category: requestData.category,
          budget_min: requestData.budget_min,
          budget_max: requestData.budget_max,
          location: requestData.location,
          deadline: requestData.deadline,
          urgency: requestData.urgency,
        }])
        .select()
        .single();

      if (error) throw error;

      // Track activity
      await supabase
        .from('activity_feed')
        .insert({
          user_id: user.id,
          activity_type: 'request_created',
          description: `Created request: ${requestData.title}`,
          title: `New ${requestData.category} request`,
          metadata: { 
            category: requestData.category,
            budget_range: `${requestData.budget_min || 0} - ${requestData.budget_max || 0}`,
            urgency: requestData.urgency 
          }
        });

      return data;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  };

  // Update request with real-time update
  const updateRequest = async (id: string, requestData: {
    title?: string;
    description?: string;
    category?: string;
    budget_min?: number;
    budget_max?: number;
    location?: string;
    deadline?: string;
    urgency?: 'low' | 'medium' | 'high' | 'urgent';
    status?: 'new' | 'in_progress' | 'completed' | 'cancelled';
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('requests')
        .update(requestData)
        .eq('id', id)
        .eq('client_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Track activity
      await supabase
        .from('activity_feed')
        .insert({
          user_id: user.id,
          activity_type: 'request_updated',
          description: `Updated request: ${requestData.title || 'Request'}`,
          title: `Request updated`,
          metadata: { 
            request_id: id,
            updated_fields: Object.keys(requestData)
          }
        });

      return data;
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  };

  // Delete request with real-time update
  const deleteRequest = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id)
        .eq('client_id', user.id);

      if (error) throw error;

      // Track activity
      await supabase
        .from('activity_feed')
        .insert({
          user_id: user.id,
          activity_type: 'request_deleted',
          description: `Deleted request`,
          title: `Request deleted`,
          metadata: { request_id: id }
        });

    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  };

  const formatBudget = (request: Request) => {
    if (!request.budget_min && !request.budget_max) return 'Budget not specified';
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()}`;
    }
    if (request.budget_min) return `From ${request.budget_min.toLocaleString()}`;
    if (request.budget_max) return `Up to ${request.budget_max.toLocaleString()}`;
    return 'Budget not specified';
  };

  const getOffersCount = (request: Request) => {
    return request.offers?.length || 0;
  };

  return {
    requests,
    loading,
    refetch: fetchRequests,
    formatBudget,
    getOffersCount,
    createRequest,
    updateRequest,
    deleteRequest
  };
};
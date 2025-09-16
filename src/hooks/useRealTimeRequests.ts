import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createLogger } from '@/utils/logger';
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
  const logger = createLogger('RealTimeRequests');

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
      logger.error('Error fetching requests', { error, userId: user?.id });
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
          logger.debug('Real-time request update', { payload });
          
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
          logger.debug('Real-time offer update', { payload });
          
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
      logger.error('Error fetching offers', { error, requestId });
    }
  };

  const createRequest = async (requestData: {
    title: string;
    description: string;
    category: string;
    budget_min?: number;
    budget_max?: number;
    currency?: string;
    location?: string;
    deadline?: string;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
    requirements?: any;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      logger.debug('Creating request with data:', { requestData, userId: user.id });
      
      // Validate required fields
      if (!requestData.title || !requestData.description || !requestData.category) {
        throw new Error('Missing required fields: title, description, or category');
      }

      // Ensure location is either a valid string or null
      const processedLocation = requestData.location && requestData.location.trim() !== '' 
        ? requestData.location.trim() 
        : null;

      // Validate budget values
      const budgetMin = requestData.budget_min && !isNaN(requestData.budget_min) ? requestData.budget_min : null;
      const budgetMax = requestData.budget_max && !isNaN(requestData.budget_max) ? requestData.budget_max : null;

      const insertData = { 
        client_id: user.id,
        title: requestData.title.trim(),
        description: requestData.description.trim(),
        category: requestData.category,
        budget_min: budgetMin,
        budget_max: budgetMax,
        currency: requestData.currency || 'SAR',
        location: processedLocation,
        deadline: requestData.deadline || null,
        urgency: requestData.urgency,
        requirements: requestData.requirements || {}
      };

      logger.debug('Processed insert data:', insertData);

      const { data, error } = await supabase
        .from('requests')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        logger.error('Supabase error creating request:', { error, insertData });
        throw error;
      }

      logger.info('Request created successfully:', { requestId: data.id, title: data.title });

      // Track activity
      try {
        await supabase
          .from('activity_feed')
          .insert({
            user_id: user.id,
            activity_type: 'request_created',
            description: `Created request: ${requestData.title}`,
            title: `New ${requestData.category} request`,
            metadata: { 
              category: requestData.category,
              budget_range: `${budgetMin || 0} - ${budgetMax || 0}`,
              urgency: requestData.urgency 
            }
          });
      } catch (activityError) {
        // Don't fail the request creation if activity logging fails
        logger.warn('Failed to log activity:', activityError);
      }

      return data;
    } catch (error) {
      logger.error('Error creating request:', { error: error.message, stack: error.stack, requestData, userId: user?.id });
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
      logger.error('Error updating request', { error, requestId: id, requestData });
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
      logger.error('Error deleting request', { error, requestId: id });
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
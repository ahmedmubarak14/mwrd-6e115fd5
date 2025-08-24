
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  user_id: string; // Add this for compatibility
  admin_approval_status: string;
  offers?: any[];
}

export const useRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
      
      // Map client_id to user_id for compatibility
      const mappedData = (data || []).map(request => ({
        ...request,
        user_id: request.client_id
      })) as Request[];
      
      setRequests(mappedData);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

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

  const trackActivity = async (activityData: any) => {
    try {
      await supabase
        .from('activity_feed')
        .insert(activityData);
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

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
      await trackActivity({
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

      await fetchRequests();
      return data;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  };

  return {
    requests,
    loading,
    refetch: fetchRequests,
    formatBudget,
    getOffersCount,
    createRequest
  };
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityFeed } from './useActivityFeed';

export interface Request {
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
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  user_id: string;
  offers?: { count: number }[];
}

export const useRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { trackActivity } = useActivityFeed();

  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          offers (count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data || []) as Request[]);
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
    return request.offers?.[0]?.count || 0;
  };

  const createRequest = async (requestData: {
    title: string;
    description: string;
    category: string;
    budget_min?: number;
    budget_max?: number;
    currency: string;
    location?: string;
    deadline?: string;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
    status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([{ ...requestData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Track activity
      await trackActivity(
        'request_created',
        `Created request: ${requestData.title}`,
        `New ${requestData.category} request for ${requestData.location || 'unspecified location'}`,
        { 
          category: requestData.category,
          budget_range: `${requestData.budget_min || 0} - ${requestData.budget_max || 0}`,
          urgency: requestData.urgency 
        },
        'request',
        data.id
      );

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
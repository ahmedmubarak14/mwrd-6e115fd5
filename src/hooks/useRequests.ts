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

  return {
    requests,
    loading,
    refetch: fetchRequests,
    formatBudget,
    getOffersCount
  };
};
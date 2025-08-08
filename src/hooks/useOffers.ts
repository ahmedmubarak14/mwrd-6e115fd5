import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time_days: number;
  status: 'pending' | 'accepted' | 'rejected';
  client_approval_status: 'pending' | 'approved' | 'rejected';
  client_approval_notes?: string;
  client_approval_date?: string;
  created_at: string;
  updated_at: string;
  request_id: string;
  supplier_id: string;
  request?: {
    title: string;
    description: string;
    user_id: string;
    category: string;
    location?: string;
  };
}

export const useOffers = (requestId?: string) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOffers = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('offers')
        .select(`
          *,
          request:requests (
            title,
            description,
            user_id,
            category,
            location
          )
        `)
        .order('created_at', { ascending: false });

      // If requestId is provided, filter by it
      if (requestId) {
        query = query.eq('request_id', requestId);
      } else {
        // If no requestId, show offers based on user role
        query = query.eq('supplier_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching offers:', error);
        setError('Failed to load offers');
        return;
      }

      setOffers((data || []) as Offer[]);
    } catch (err) {
      console.error('Error in fetchOffers:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [user, requestId]);

  const updateOfferStatus = async (offerId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({
          client_approval_status: status,
          client_approval_notes: notes,
          client_approval_date: new Date().toISOString()
        })
        .eq('id', offerId);

      if (error) throw error;
      
      // Refresh offers after update
      await fetchOffers();
      return true;
    } catch (error) {
      console.error('Error updating offer status:', error);
      return false;
    }
  };

  const formatPrice = (offer: Offer) => {
    return `${offer.price.toLocaleString()} ${offer.currency}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers,
    updateOfferStatus,
    formatPrice,
    getStatusColor
  };
};
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  delivery_time: number;
  status: 'pending' | 'accepted' | 'rejected';
  client_approval_status: 'pending' | 'approved' | 'rejected';
  admin_approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  request_id: string;
  vendor_id: string;
  request?: {
    title: string;
    description: string;
    client_id: string;
    category: string;
    location?: string;
  };
}

export const useOffers = (requestId?: string) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

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
          requests (
            title,
            description,
            client_id,
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
        if (user?.role === 'vendor') {
          query = query.eq('vendor_id', user.id);
        } else {
          // For clients, show all offers for their requests
          const { data: userRequests } = await supabase
            .from('requests')
            .select('id')
            .eq('client_id', user.id);
          
          if (userRequests?.length) {
            query = query.in('request_id', userRequests.map(r => r.id));
          }
        }
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
        })
        .eq('id', offerId);

      if (error) {
        console.error('Supabase error updating offer status:', error);
        return false;
      }

      toast({ 
        title: "Success", 
        description: "Offer updated successfully" 
      });
      
      // Refresh offers after update
      await fetchOffers();
      return true;
    } catch (error) {
      console.error('Error updating offer status (unexpected):', error);
      return false;
    }
  };

  const createOffer = async (offerData: {
    title: string;
    description: string;
    price: number;
    delivery_time: number;
    request_id: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('offers')
        .insert([{
          vendor_id: user.id,
          title: offerData.title,
          description: offerData.description,
          price: offerData.price,
          delivery_time: offerData.delivery_time,
          request_id: offerData.request_id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({ 
        title: "Success", 
        description: "Offer created successfully" 
      });

      await fetchOffers();
      return data;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  };

  const formatPrice = (offer: Offer) => {
    return `${offer.price.toLocaleString()} SAR`;
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
    createOffer,
    formatPrice,
    getStatusColor
  };
};
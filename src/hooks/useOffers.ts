
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time: number;
  delivery_time_days: number;
  status: 'pending' | 'accepted' | 'rejected';
  client_approval_status: 'pending' | 'approved' | 'rejected';
  admin_approval_status: 'pending' | 'approved' | 'rejected';
  client_approval_notes?: string;
  client_approval_date?: string;
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
  vendor?: {
    full_name: string;
    company_name?: string;
    email: string;
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
          ),
          user_profiles:vendor_id (
            full_name,
            company_name,
            email
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

      const transformedOffers = (data || []).map(offer => ({
        ...offer,
        currency: offer.currency || 'SAR',
        delivery_time_days: offer.delivery_time_days || offer.delivery_time || 0,
        vendor: offer.user_profiles
      }));

      setOffers(transformedOffers as Offer[]);
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

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    console.log('Setting up offers realtime subscription');

    const setupRealtimeSubscription = async () => {
      try {
        const channel = supabase
          .channel('offers_changes')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'offers' },
            (payload) => {
              console.log('Offer updated:', payload);
              fetchOffers(); // Refresh offers when changes occur
            }
          )
          .subscribe((status, error) => {
            if (error) {
              console.error('Offers realtime subscription error:', error);
              console.log('Offers realtime disabled - app will work without live updates');
            } else {
              console.log('Offers realtime subscription status:', status);
            }
          });

        return () => {
          try {
            supabase.removeChannel(channel);
          } catch (cleanupError) {
            console.warn('Error cleaning up offers realtime channel:', cleanupError);
          }
        };
      } catch (error) {
        console.error('Failed to setup offers realtime subscription:', error);
        return () => {}; // Return empty cleanup function
      }
    };

    const cleanup = setupRealtimeSubscription();
    
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, [user]);

  const updateOfferStatus = async (offerId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({
          client_approval_status: status,
          client_approval_notes: notes,
          client_approval_date: new Date().toISOString(),
        })
        .eq('id', offerId);

      if (error) {
        console.error('Supabase error updating offer status:', error);
        return false;
      }

      toast({ 
        title: "Success", 
        description: `Offer ${status} successfully` 
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
    delivery_time_days: number;
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
          delivery_time_days: offerData.delivery_time_days,
          delivery_time: offerData.delivery_time_days, // For backward compatibility
          request_id: offerData.request_id,
          currency: 'SAR',
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

  const compareOffers = (offerIds: string[]) => {
    return offers.filter(offer => offerIds.includes(offer.id));
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
    createOffer,
    compareOffers,
    formatPrice,
    getStatusColor
  };
};

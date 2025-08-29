import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface OfferWithDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time_days: number;
  client_approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  vendor_id: string;
  request_id: string;
  request?: {
    title: string;
    client_id: string;
  };
}

export const useOfferApprovals = () => {
  const [offers, setOffers] = useState<OfferWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPendingOffers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          id,
          title,
          description,
          price,
          currency,
          delivery_time_days,
          client_approval_status,
          created_at,
          vendor_id,
          request_id,
          request:requests(
            title,
            client_id
          )
        `)
        .eq('client_approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData: OfferWithDetails[] = (data || []).map(offer => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        currency: offer.currency || 'SAR',
        delivery_time_days: offer.delivery_time_days || 0,
        client_approval_status: offer.client_approval_status as 'pending' | 'approved' | 'rejected',
        created_at: offer.created_at,
        vendor_id: offer.vendor_id,
        request_id: offer.request_id,
        request: offer.request
      }));
      
      setOffers(transformedData);
    } catch (error) {
      console.error('Error fetching pending offers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending offers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const approveOffer = async (offerId: string, notes?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('offers')
        .update({
          client_approval_status: 'approved'
        })
        .eq('id', offerId);

      if (error) throw error;
      
      // Create notification for vendor
      const offer = offers.find(o => o.id === offerId);
      if (offer) {
        await supabase
          .from('notifications')
          .insert({
            user_id: offer.vendor_id,
            type: 'offer_approved',
            title: 'Offer Approved',
            message: 'Your offer has been approved by the client.',
            category: 'offers',
            priority: 'high',
            data: { offer_id: offerId, notes }
          });
      }

      await fetchPendingOffers();
      
      toast({
        title: 'Success',
        description: 'Offer approved successfully'
      });
    } catch (error) {
      console.error('Error approving offer:', error);
      throw error;
    }
  };

  const rejectOffer = async (offerId: string, notes?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('offers')
        .update({
          client_approval_status: 'rejected'
        })
        .eq('id', offerId);

      if (error) throw error;
      
      // Create notification for vendor
      const offer = offers.find(o => o.id === offerId);
      if (offer) {
        await supabase
          .from('notifications')
          .insert({
            user_id: offer.vendor_id,
            type: 'offer_rejected',
            title: 'Offer Rejected',
            message: 'Your offer has been rejected by the client.',
            category: 'offers',
            priority: 'high',
            data: { 
              offer_id: offerId,
              rejection_notes: notes
            }
          });
      }

      await fetchPendingOffers();
      
      toast({
        title: 'Success',
        description: 'Offer rejected successfully'
      });
    } catch (error) {
      console.error('Error rejecting offer:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPendingOffers();
  }, [user]);

  return {
    offers,
    loading,
    fetchPendingOffers,
    approveOffer,
    rejectOffer
  };
};
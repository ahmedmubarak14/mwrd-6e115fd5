import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RecentItem {
  id: string | number;
  title: string;
  description?: string;
  value: string;
  status: string;
  currency?: boolean;
  created_at: string;
  amount?: number;
}

export const useRecentItems = () => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, userProfile } = useAuth();

  const fetchRecentItems = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userId = user.id;
      const isVendor = userProfile?.role === 'vendor';

      if (isVendor) {
        // Fetch recent offers for vendors
        const { data: offers, error: offersError } = await supabase
          .from('offers')
          .select(`
            id,
            title,
            price,
            status,
            created_at,
            request:requests(title, client:user_profiles!requests_client_id_fkey(full_name, company_name))
          `)
          .eq('vendor_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (offersError) throw offersError;

        const transformedOffers: RecentItem[] = (offers || []).map(offer => ({
          id: offer.id,
          title: offer.title || offer.request?.title || 'Offer',
          description: offer.request?.client?.company_name || offer.request?.client?.full_name || 'Unknown Client',
          value: offer.price?.toLocaleString() || '0',
          status: offer.status || 'pending',
          currency: true,
          created_at: offer.created_at,
          amount: Number(offer.price) || 0
        }));

        setRecentItems(transformedOffers);

      } else {
        // Fetch recent requests for clients
        const { data: requests, error: requestsError } = await supabase
          .from('requests')
          .select(`
            id,
            title,
            status,
            created_at,
            offers:offers(count)
          `)
          .eq('client_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (requestsError) throw requestsError;

        const transformedRequests: RecentItem[] = (requests || []).map(request => {
          const offersCount = Array.isArray(request.offers) ? request.offers.length : 0;
          
          return {
            id: request.id,
            title: request.title || 'Request',
            value: `${offersCount} offer${offersCount !== 1 ? 's' : ''}`,
            status: request.status || 'new',
            created_at: request.created_at
          };
        });

        setRecentItems(transformedRequests);
      }
    } catch (error: any) {
      console.error('Error fetching recent items:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentItems();
  }, [user, userProfile]);

  return {
    recentItems,
    loading,
    error,
    fetchRecentItems
  };
};
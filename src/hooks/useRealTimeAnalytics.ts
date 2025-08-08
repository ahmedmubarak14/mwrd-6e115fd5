import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from './useAnalytics';

export const useRealTimeAnalytics = (dateRange = 30) => {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useAnalytics(dateRange);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);

  useEffect(() => {
    if (!user) return;

    let requestsChannel: any;
    let offersChannel: any;
    let transactionsChannel: any;

    if (isRealTimeEnabled) {
      // Listen for requests changes
      requestsChannel = supabase
        .channel('requests-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'requests',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            refetch();
          }
        )
        .subscribe();

      // Listen for offers changes
      offersChannel = supabase
        .channel('offers-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'offers',
            filter: `supplier_id=eq.${user.id}`
          },
          () => {
            refetch();
          }
        )
        .subscribe();

      // Listen for transaction changes
      transactionsChannel = supabase
        .channel('transactions-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'financial_transactions',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            refetch();
          }
        )
        .subscribe();
    }

    return () => {
      if (requestsChannel) supabase.removeChannel(requestsChannel);
      if (offersChannel) supabase.removeChannel(offersChannel);
      if (transactionsChannel) supabase.removeChannel(transactionsChannel);
    };
  }, [user, isRealTimeEnabled, refetch]);

  return {
    data,
    loading,
    error,
    refetch,
    isRealTimeEnabled,
    toggleRealTime: () => setIsRealTimeEnabled(!isRealTimeEnabled)
  };
};
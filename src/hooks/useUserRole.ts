import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch user role from user_roles table (secure, server-side)
 * Prevents privilege escalation by not trusting client-side data
 */
export const useUserRole = (userId: string | undefined) => {
  const [role, setRole] = useState<'client' | 'vendor' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .order('role', { ascending: true }) // Admin first, then vendor, then client
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('client'); // Default to client on error
        } else {
          setRole(data?.role as 'client' | 'vendor' | 'admin' || 'client');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('client');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [userId]);

  return { role, loading };
};

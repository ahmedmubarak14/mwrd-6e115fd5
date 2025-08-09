
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from './useUserProfiles';

export interface Supplier extends UserProfile {
  rating?: number;
  reviews_count?: number;
  location?: string;
  description?: string;
  completed_projects?: number;
  response_time?: string;
  categories?: string[];
  availability?: boolean;
  languages?: string[];
  min_price?: number | null;
  max_price?: number | null;
  city?: string | null;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch approved suppliers with their supplier_details
      // We use supplier_details as the base to filter/sort easily and join user_profiles
      const { data, error } = await supabase
        .from('supplier_details')
        .select(`
          user_id,
          city,
          categories,
          min_price,
          max_price,
          rating,
          availability,
          languages,
          response_time,
          user_profiles:user_id (
            id,
            email,
            role,
            full_name,
            company_name,
            avatar_url,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching suppliers with details:', error);
        setError('Failed to load suppliers');
        return;
      }

      const normalized: Supplier[] = (data || [])
        // Safety: only include rows with a joined user profile
        .filter((row: any) => row.user_profiles && row.user_profiles.id)
        .map((row: any) => {
          const profile = row.user_profiles;
          const supplier: Supplier = {
            id: profile.id,
            email: profile.email,
            role: profile.role as 'supplier',
            full_name: profile.full_name || undefined,
            company_name: profile.company_name || undefined,
            avatar_url: profile.avatar_url || undefined,
            created_at: profile.created_at || undefined,
            // Map details
            rating: row.rating ?? undefined,
            response_time: row.response_time ?? undefined,
            categories: row.categories ?? undefined,
            availability: row.availability ?? undefined,
            languages: row.languages ?? undefined,
            min_price: row.min_price ?? null,
            max_price: row.max_price ?? null,
            city: row.city ?? null,
            // Friendly fields preserved for UI (description/location)
            location: row.city ?? undefined,
            description: profile.company_name
              ? `Professional ${profile.company_name} with proven track record.`
              : `Professional services with years of experience.`,
            // Optional demo numbers if UI expects them
            reviews_count: undefined,
            completed_projects: undefined,
          };
          return supplier;
        });

      console.log('[useSuppliers] fetched suppliers:', normalized.length);
      setSuppliers(normalized);
    } catch (err) {
      console.error('Error in fetchSuppliers:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const refetch = () => {
    fetchSuppliers();
  };

  return {
    suppliers,
    loading,
    error,
    refetch
  };
};

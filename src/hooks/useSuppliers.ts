
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

      // Fetch approved suppliers from user_profiles and left-join supplier_details
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          email,
          role,
          full_name,
          company_name,
          avatar_url,
          created_at,
          moderation_status,
          supplier_details: supplier_details (
            city,
            categories,
            min_price,
            max_price,
            rating,
            availability,
            languages,
            response_time
          )
        `)
        .eq('role', 'supplier')
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching suppliers from user_profiles:', error);
        setError('Failed to load suppliers');
        return;
      }

      const normalized: Supplier[] = (data || []).map((profile: any) => {
        const details = Array.isArray(profile.supplier_details) && profile.supplier_details.length > 0
          ? profile.supplier_details[0]
          : {};
        const supplier: Supplier = {
          id: profile.id,
          email: profile.email,
          role: profile.role as 'supplier',
          full_name: profile.full_name || undefined,
          company_name: profile.company_name || undefined,
          avatar_url: profile.avatar_url || undefined,
          created_at: profile.created_at || undefined,
          // Map details (optional)
          rating: details.rating ?? undefined,
          response_time: details.response_time ?? undefined,
          categories: details.categories ?? undefined,
          availability: details.availability ?? undefined,
          languages: details.languages ?? undefined,
          min_price: details.min_price ?? null,
          max_price: details.max_price ?? null,
          city: details.city ?? null,
          // Friendly fields preserved for UI
          location: details.city ?? undefined,
          description: profile.company_name
            ? `Professional ${profile.company_name} with proven track record.`
            : `Professional services with years of experience.`,
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

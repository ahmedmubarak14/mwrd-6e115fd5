
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Supplier {
  id: string;
  user_id?: string;
  email: string;
  role: 'vendor';
  status: 'pending' | 'approved' | 'blocked' | 'rejected';
  full_name?: string;
  company_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  bio?: string;
  portfolio_url?: string;
  verification_documents: any;
  categories: string[];
  subscription_plan: string;
  subscription_status: string;
  subscription_expires_at?: string;
  created_at?: string;
  updated_at?: string;
  rating?: number;
  reviews_count?: number;
  location?: string;
  description?: string;
  completed_projects?: number;
  response_time?: string;
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

      // Fetch approved vendors from user_profiles
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'vendor')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching suppliers from user_profiles:', error);
        setError('Failed to load vendors');
        return;
      }

      const normalized: Supplier[] = (data || []).map((profile: any) => {
        const supplier: Supplier = {
          id: profile.id,
          user_id: profile.user_id,
          email: profile.email,
          role: 'vendor' as const,
          status: profile.status || 'pending',
          full_name: profile.full_name || undefined,
          company_name: profile.company_name || undefined,
          avatar_url: profile.avatar_url || undefined,
          phone: profile.phone || undefined,
          address: profile.address || undefined,
          bio: profile.bio || undefined,
          portfolio_url: profile.portfolio_url || undefined,
          verification_documents: profile.verification_documents || [],
          categories: profile.categories || [],
          subscription_plan: profile.subscription_plan || 'free',
          subscription_status: profile.subscription_status || 'active',
          subscription_expires_at: profile.subscription_expires_at || undefined,
          created_at: profile.created_at || undefined,
          updated_at: profile.updated_at || undefined,
          // UI fields
          location: profile.city || profile.address || undefined,
          description: profile.company_name
            ? `Professional ${profile.company_name} with proven track record.`
            : `Professional services with years of experience.`,
          rating: undefined,
          reviews_count: undefined,
          completed_projects: undefined,
          response_time: undefined,
          availability: undefined,
          languages: undefined,
          min_price: null,
          max_price: null,
          city: null,
        };
        return supplier;
      });

      console.log('[useSuppliers] fetched vendors:', normalized.length);
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

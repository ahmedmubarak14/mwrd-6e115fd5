
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/database';

export interface VendorFilters {
  categories?: string[];
  location?: string;
  rating?: number;
  budgetMin?: number;
  budgetMax?: number;
  deliveryTime?: string;
  certifications?: string[];
  paymentTerms?: string;
  urgency?: string;
  search?: string;
}

export interface VendorWithCategories extends UserProfile {
  vendor_categories?: Array<{
    id: string;
    category_id: string;
    categories: {
      id: string;
      slug: string;
      name_en: string;
      name_ar: string;
      parent_id?: string;
    };
  }>;
  rating?: number;
  total_orders?: number;
  response_rate?: number;
  delivery_sla?: number;
  minimum_order?: number;
  coverage_locations?: string[];
  certifications?: string[];
  payment_terms?: string;
}

// Legacy interface for backward compatibility
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

export const useVendors = () => {
  const [vendors, setVendors] = useState<VendorWithCategories[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchVendors = async (
    filters: VendorFilters = {}, 
    page = 1, 
    limit = 20,
    sortBy = 'created_at',
    sortOrder: 'desc' | 'asc' = 'desc'
  ) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          vendor_categories(
            id,
            category_id,
            categories(id, slug, name_en, name_ar, parent_id)
          )
        `, { count: 'exact' })
        .eq('role', 'vendor')
        .eq('status', 'approved')
        .eq('verification_status', 'approved');

      // Apply filters
      if (filters.categories && filters.categories.length > 0) {
        // Filter by categories through the junction table
        const { data: vendorIds } = await supabase
          .from('vendor_categories')
          .select('vendor_id')
          .in('category_id', filters.categories);
        
        if (vendorIds && vendorIds.length > 0) {
          query = query.in('id', vendorIds.map(v => v.vendor_id));
        } else {
          // No vendors found with these categories
          setVendors([]);
          setTotalCount(0);
          setLoading(false);
          return;
        }
      }

      if (filters.location) {
        query = query.ilike('address', `%${filters.location}%`);
      }

      if (filters.search) {
        query = query.or(`
          full_name.ilike.%${filters.search}%,
          company_name.ilike.%${filters.search}%,
          bio.ilike.%${filters.search}%
        `);
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching vendors:', error);
        throw error;
      }

      // Cast data with proper error handling
      const vendorData = (data || []) as unknown as VendorWithCategories[];
      console.log('Fetched vendors:', vendorData);
      setVendors(vendorData);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getVendorById = async (id: string): Promise<VendorWithCategories | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          vendor_categories(
            id,
            category_id,
            categories(id, slug, name_en, name_ar, parent_id)
          )
        `)
        .eq('id', id)
        .eq('role', 'vendor')
        .eq('status', 'approved')
        .eq('verification_status', 'approved')
        .single();

      if (error) throw error;
      return data as unknown as VendorWithCategories;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      return null;
    }
  };

  const assignCategoryToVendor = async (vendorId: string, categoryId: string) => {
    try {
      const { error } = await supabase
        .from('vendor_categories')
        .insert([{ vendor_id: vendorId, category_id: categoryId }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category assigned to vendor successfully"
      });
    } catch (error) {
      console.error('Error assigning category:', error);
      toast({
        title: "Error",
        description: "Failed to assign category",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removeCategoryFromVendor = async (vendorId: string, categoryId: string) => {
    try {
      const { error } = await supabase
        .from('vendor_categories')
        .delete()
        .eq('vendor_id', vendorId)
        .eq('category_id', categoryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category removed from vendor successfully"
      });
    } catch (error) {
      console.error('Error removing category:', error);
      toast({
        title: "Error",
        description: "Failed to remove category",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getVendorsByCategory = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          vendor_categories!inner(category_id)
        `)
        .eq('role', 'vendor')
        .eq('status', 'approved')
        .eq('vendor_categories.category_id', categoryId);

      if (error) throw error;
      return (data || []) as unknown as VendorWithCategories[];
    } catch (error) {
      console.error('Error fetching vendors by category:', error);
      return [];
    }
  };

  return {
    vendors,
    loading,
    totalCount,
    fetchVendors,
    getVendorById,
    assignCategoryToVendor,
    removeCategoryFromVendor,
    getVendorsByCategory,
    refetch: () => fetchVendors()
  };
};

// Legacy hook for backward compatibility
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
        .eq('verification_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vendors from user_profiles:', error);
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

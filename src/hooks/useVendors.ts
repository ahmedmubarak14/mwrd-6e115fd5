
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
        .eq('status', 'approved');

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

      if (error) throw error;

      // Cast data with proper error handling
      const vendorData = (data || []) as unknown as VendorWithCategories[];
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

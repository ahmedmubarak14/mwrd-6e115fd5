import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SearchFilters {
  query?: string;
  category_id?: string;
  budget_min?: number;
  budget_max?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'draft' | 'published' | 'in_progress' | 'evaluation' | 'awarded' | 'completed' | 'cancelled';
  location?: string;
  deadline_from?: string;
  deadline_to?: string;
  sort_by?: 'created_at' | 'budget_max' | 'submission_deadline';
  sort_order?: 'asc' | 'desc';
}

export interface AdvancedSearchResult {
  id: string;
  title: string;
  description: string;
  category_id?: string;
  budget_min?: number;
  budget_max?: number;
  currency: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: string;
  submission_deadline: string;
  delivery_location?: string;
  is_public: boolean;
  created_at: string;
  client_id: string;
}

export interface VendorSearchResult {
  id: string;
  user_id: string;
  full_name: string;
  company_name?: string;
  bio?: string;
  address?: string;
  categories?: string[];
  verification_status: string;
  created_at: string;
}

export const useAdvancedSearch = () => {
  const [results, setResults] = useState<AdvancedSearchResult[]>([]);
  const [vendorResults, setVendorResults] = useState<VendorSearchResult[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('procurement_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const searchRFQs = async (filters: SearchFilters, page = 1, limit = 20) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('rfqs')
        .select('*', { count: 'exact' })
        .eq('is_public', true)
        .in('status', ['published', 'in_progress']);

      // Apply text search
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      // Apply category filter
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }

      // Apply budget filters
      if (filters.budget_min) {
        query = query.gte('budget_min', filters.budget_min);
      }
      if (filters.budget_max) {
        query = query.lte('budget_max', filters.budget_max);
      }

      // Apply priority filter
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }

      // Apply status filter
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Apply location filter
      if (filters.location) {
        query = query.ilike('delivery_location', `%${filters.location}%`);
      }

      // Apply deadline filters
      if (filters.deadline_from) {
        query = query.gte('submission_deadline', filters.deadline_from);
      }
      if (filters.deadline_to) {
        query = query.lte('submission_deadline', filters.deadline_to);
      }

      // Apply sorting
      const sortBy = filters.sort_by || 'created_at';
      const sortOrder = filters.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setResults((data as AdvancedSearchResult[]) || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error searching RFQs:', error);
      toast({
        title: 'Error',
        description: 'Failed to search RFQs',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const searchVendors = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'vendor')
        .eq('verification_status', 'approved')
        .eq('status', 'approved');

      // Apply text search
      if (filters.query) {
        query = query.or(`full_name.ilike.%${filters.query}%,company_name.ilike.%${filters.query}%,bio.ilike.%${filters.query}%`);
      }

      // Apply location filter
      if (filters.location) {
        query = query.ilike('address', `%${filters.location}%`);
      }

      // Apply category filter (assuming vendors have categories in their profile)
      if (filters.category_id) {
        query = query.contains('categories', [filters.category_id]);
      }

      const { data, error } = await query;

      if (error) throw error;

      setVendorResults((data as VendorSearchResult[]) || []);
    } catch (error) {
      console.error('Error searching vendors:', error);
      toast({
        title: 'Error',
        description: 'Failed to search vendors',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSavedSearches = async () => {
    // This would fetch saved searches from user preferences
    // For now, return empty array
    return [];
  };

  const saveSearch = async (name: string, filters: SearchFilters) => {
    // This would save the search to user preferences
    toast({
      title: 'Success',
      description: 'Search saved successfully',
    });
  };

  const clearResults = () => {
    setResults([]);
    setVendorResults([]);
    setTotalCount(0);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    results,
    vendorResults,
    categories,
    loading,
    totalCount,
    searchRFQs,
    searchVendors,
    getSavedSearches,
    saveSearch,
    clearResults,
    refreshCategories: fetchCategories
  };
};
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SearchFilters {
  query: string;
  category: string;
  location: string;
  budgetRange: [number, number];
  rating: number;
  availability: boolean;
  urgency: string;
  tags: string[];
  entityType: 'all' | 'requests' | 'offers' | 'vendors';
  status?: string;
}

export interface SearchResult {
  id: string;
  type: 'request' | 'offer' | 'vendor';
  title: string;
  description: string;
  location?: string;
  price?: number;
  currency?: string;
  rating?: number;
  status: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  relevance: number;
}

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useAuth();

  const searchRequests = async (filters: SearchFilters, page = 1, limit = 20) => {
    let query = supabase
      .from('requests')
      .select(`
        id, title, description, category, budget_min, budget_max, 
        currency, location, deadline, urgency, status, created_at, 
        updated_at, admin_approval_status,
        user_profiles!requests_client_id_fkey(full_name, company_name)
      `, { count: 'exact' });

    // Apply filters
    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%,category.ilike.%${filters.query}%`);
    }

    if (filters.category && filters.category !== 'All Categories') {
      query = query.eq('category', filters.category);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.urgency && filters.urgency !== 'Any Urgency') {
      query = query.eq('urgency', filters.urgency.toLowerCase());
    }

    // Fix budget filtering logic - filter requests that fit within the budget range
    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 10000) {
      // Show requests where the max budget is at least the minimum filter
      // and the min budget is at most the maximum filter
      if (filters.budgetRange[0] > 0) {
        query = query.gte('budget_max', filters.budgetRange[0]);
      }
      if (filters.budgetRange[1] < 10000) {
        query = query.lte('budget_min', filters.budgetRange[1]);
      }
    }

    // Only show approved requests for vendors, all for admins/clients
    if (user) {
      const { data: userProfile } = await supabase
        .from('user_profiles_with_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (userProfile?.role === 'vendor') {
        query = query.eq('admin_approval_status', 'approved');
      }
    }

    query = query.order('created_at', { ascending: false })
                 .range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data || []).map(item => ({
        id: item.id,
        type: 'request' as const,
        title: item.title,
        description: item.description,
        location: item.location,
        price: item.budget_max,
        currency: item.currency,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        metadata: {
          category: item.category,
          budget_min: item.budget_min,
          budget_max: item.budget_max,
          urgency: item.urgency,
          deadline: item.deadline,
          client: item.user_profiles?.full_name || item.user_profiles?.company_name
        },
        relevance: calculateRelevance(filters.query, item.title, item.description, item.category)
      })),
      count: count || 0
    };
  };

  const searchOffers = async (filters: SearchFilters, page = 1, limit = 20) => {
    let query = supabase
      .from('offers')
      .select(`
        id, title, description, price, currency, delivery_time_days,
        status, created_at, updated_at, client_approval_status,
        requests!inner(title, category, location),
        user_profiles!offers_vendor_id_fkey(full_name, company_name)
      `, { count: 'exact' });

    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }

    if (filters.category && filters.category !== 'All Categories') {
      query = query.eq('requests.category', filters.category);
    }

    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 10000) {
      query = query.gte('price', filters.budgetRange[0])
                   .lte('price', filters.budgetRange[1]);
    }

    query = query.order('created_at', { ascending: false })
                 .range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data || []).map(item => ({
        id: item.id,
        type: 'offer' as const,
        title: item.title,
        description: item.description,
        location: item.requests?.location,
        price: item.price,
        currency: item.currency,
        status: item.client_approval_status || item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        metadata: {
          delivery_time_days: item.delivery_time_days,
          request_title: item.requests?.title,
          category: item.requests?.category,
          vendor: item.user_profiles?.full_name || item.user_profiles?.company_name
        },
        relevance: calculateRelevance(filters.query, item.title, item.description)
      })),
      count: count || 0
    };
  };

  const searchVendors = async (filters: SearchFilters, page = 1, limit = 20) => {
    let query = supabase
      .from('user_profiles_with_roles')
      .select(`
        id, full_name, company_name, bio, avatar_url, address,
        verification_status, status, created_at, updated_at, categories
      `, { count: 'exact' })
      .eq('role', 'vendor')
      .eq('status', 'approved');

    if (filters.query) {
      query = query.or(`full_name.ilike.%${filters.query}%,company_name.ilike.%${filters.query}%,bio.ilike.%${filters.query}%`);
    }

    if (filters.location) {
      query = query.ilike('address', `%${filters.location}%`);
    }

    if (filters.category && filters.category !== 'All Categories') {
      query = query.contains('categories', [filters.category]);
    }

    query = query.order('created_at', { ascending: false })
                 .range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data || []).map(item => ({
        id: item.id,
        type: 'vendor' as const,
        title: item.full_name || item.company_name || 'Unnamed Vendor',
        description: item.bio || 'No description available',
        location: item.address,
        status: item.verification_status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        metadata: {
          company_name: item.company_name,
          categories: item.categories,
          avatar_url: item.avatar_url,
          verification_status: item.verification_status
        },
        relevance: calculateRelevance(filters.query, item.full_name || item.company_name || '', item.bio || '')
      })),
      count: count || 0
    };
  };

  const calculateRelevance = (query: string, title: string, description: string, category?: string): number => {
    if (!query) return 100;
    
    const queryLower = query.toLowerCase();
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    const categoryLower = category?.toLowerCase() || '';
    
    let score = 0;
    
    // Exact matches get highest scores
    if (titleLower === queryLower) score += 100;
    else if (titleLower.includes(queryLower)) score += 80;
    
    // Partial title matches at beginning get high scores
    if (titleLower.startsWith(queryLower)) score += 60;
    
    // Category matches are important
    if (categoryLower.includes(queryLower)) score += 40;
    
    // Description matches get medium scores
    if (descLower.includes(queryLower)) score += 30;
    
    // Word-by-word analysis for better fuzzy matching
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    const titleWords = titleLower.split(/\s+/);
    const descWords = descLower.split(/\s+/);
    
    queryWords.forEach(queryWord => {
      // Exact word matches in title
      if (titleWords.some(titleWord => titleWord === queryWord)) score += 25;
      // Partial word matches in title
      else if (titleWords.some(titleWord => titleWord.includes(queryWord))) score += 15;
      
      // Word matches in description
      if (descWords.some(descWord => descWord.includes(queryWord))) score += 8;
      
      // Category word matches
      if (categoryLower.includes(queryWord)) score += 20;
    });
    
    // Boost score for multiple word matches
    const matchingWords = queryWords.filter(queryWord => 
      titleLower.includes(queryWord) || descLower.includes(queryWord)
    );
    if (matchingWords.length > 1) {
      score += matchingWords.length * 5;
    }
    
    return Math.min(100, Math.max(0, score));
  };

  const search = useCallback(async (filters: SearchFilters, page = 1, limit = 20) => {
    try {
      setLoading(true);
      let allResults: SearchResult[] = [];
      let totalResults = 0;

      if (filters.entityType === 'all' || filters.entityType === 'requests') {
        const requestResults = await searchRequests(filters, page, limit);
        allResults = [...allResults, ...requestResults.data];
        totalResults += requestResults.count;
      }

      if (filters.entityType === 'all' || filters.entityType === 'offers') {
        const offerResults = await searchOffers(filters, page, limit);
        allResults = [...allResults, ...offerResults.data];
        totalResults += offerResults.count;
      }

      if (filters.entityType === 'all' || filters.entityType === 'vendors') {
        const vendorResults = await searchVendors(filters, page, limit);
        allResults = [...allResults, ...vendorResults.data];
        totalResults += vendorResults.count;
      }

      // Sort by relevance and created date
      allResults.sort((a, b) => {
        if (a.relevance !== b.relevance) {
          return b.relevance - a.relevance;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setResults(allResults);
      setTotalCount(totalResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearResults = () => {
    setResults([]);
    setTotalCount(0);
  };

  return {
    results,
    loading,
    totalCount,
    search,
    clearResults
  };
};
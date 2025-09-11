import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PerformanceOptimizer } from '@/utils/performanceUtils';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedSearchFilters {
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
  priority?: string;
  deadline_from?: string;
  deadline_to?: string;
  sort_by?: 'created_at' | 'budget_max' | 'submission_deadline' | 'relevance';
  sort_order?: 'asc' | 'desc';
}

export interface EnhancedSearchResult {
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
  highlighted?: {
    title?: string;
    description?: string;
  };
}

export interface SearchSuggestion {
  text: string;
  type: 'category' | 'location' | 'recent' | 'trending';
  count?: number;
}

export const useOptimizedSearch = () => {
  const [results, setResults] = useState<EnhancedSearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Cache key generator for search results
  const generateCacheKey = useCallback((filters: EnhancedSearchFilters, page: number) => {
    return `search_${JSON.stringify(filters)}_page_${page}_user_${user?.id || 'anonymous'}`;
  }, [user]);

  // Enhanced relevance calculation with fuzzy matching
  const calculateEnhancedRelevance = useCallback((
    query: string, 
    title: string, 
    description: string, 
    category?: string,
    tags?: string[]
  ): number => {
    if (!query) return 100;
    
    const queryLower = query.toLowerCase().trim();
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    const categoryLower = category?.toLowerCase() || '';
    const tagsLower = tags?.map(tag => tag.toLowerCase()) || [];
    
    let score = 0;
    
    // Exact matches (highest priority)
    if (titleLower === queryLower) score += 100;
    else if (titleLower.includes(queryLower)) score += 80;
    
    // Starting matches (high priority)
    if (titleLower.startsWith(queryLower)) score += 60;
    
    // Category and tags matching
    if (categoryLower.includes(queryLower)) score += 50;
    if (tagsLower.some(tag => tag.includes(queryLower))) score += 40;
    
    // Description matching
    if (descLower.includes(queryLower)) score += 30;
    
    // Multi-word analysis with fuzzy matching
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    const titleWords = titleLower.split(/\s+/);
    const descWords = descLower.split(/\s+/);
    
    let wordMatchScore = 0;
    queryWords.forEach(queryWord => {
      // Exact word matches
      if (titleWords.some(titleWord => titleWord === queryWord)) wordMatchScore += 25;
      // Fuzzy word matches (substring)
      else if (titleWords.some(titleWord => 
        titleWord.includes(queryWord) || queryWord.includes(titleWord)
      )) wordMatchScore += 15;
      
      // Description word matches
      if (descWords.some(descWord => descWord.includes(queryWord))) wordMatchScore += 8;
      
      // Category word matches
      if (categoryLower.split(/\s+/).some(catWord => catWord.includes(queryWord))) wordMatchScore += 12;
    });
    
    score += wordMatchScore;
    
    // Bonus for multiple matching words
    const matchingWordCount = queryWords.filter(queryWord => 
      titleLower.includes(queryWord) || descLower.includes(queryWord) || categoryLower.includes(queryWord)
    ).length;
    
    if (matchingWordCount > 1) {
      score += matchingWordCount * 8;
    }
    
    // Recency bonus (newer content gets slight boost)
    const daysSinceCreation = Math.max(0, 
      (Date.now() - new Date(title).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceCreation < 30) {
      score += Math.max(0, 10 - daysSinceCreation / 3);
    }
    
    return Math.min(100, Math.max(0, score));
  }, []);

  // Generate search suggestions based on query
  const generateSuggestions = useCallback(async (query: string): Promise<SearchSuggestion[]> => {
    if (!query || query.length < 2) return [];
    
    const cacheKey = `suggestions_${query.toLowerCase()}`;
    
    return PerformanceOptimizer.getCachedData(cacheKey, async () => {
      const suggestions: SearchSuggestion[] = [];
      
      try {
        // Get category suggestions
        const { data: categories } = await supabase
          .from('procurement_categories')
          .select('name')
          .ilike('name', `%${query}%`)
          .limit(3);
        
        categories?.forEach(cat => {
          suggestions.push({
            text: cat.name,
            type: 'category'
          });
        });
        
        // Get location suggestions from recent requests
        const { data: locations } = await supabase
          .from('requests')
          .select('location')
          .ilike('location', `%${query}%`)
          .not('location', 'is', null)
          .limit(3);
        
        const uniqueLocations = [...new Set(locations?.map(l => l.location))];
        uniqueLocations.forEach(location => {
          if (location) {
            suggestions.push({
              text: location,
              type: 'location'
            });
          }
        });
        
        // Add search history suggestions
        const historySuggestions = searchHistory
          .filter(term => term.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 2)
          .map(term => ({
            text: term,
            type: 'recent' as const
          }));
        
        suggestions.push(...historySuggestions);
        
      } catch (error) {
        console.error('Error generating suggestions:', error);
      }
      
      return suggestions.slice(0, 6); // Limit to 6 suggestions
    }, 5); // Cache for 5 minutes
  }, [searchHistory]);

  // Optimized search with caching and pagination
  const searchWithOptimizations = useCallback(async (
    filters: EnhancedSearchFilters, 
    page = 1, 
    limit = 20
  ) => {
    try {
      setLoading(true);
      
      const cacheKey = generateCacheKey(filters, page);
      
      const results = await PerformanceOptimizer.getCachedData(cacheKey, async () => {
        let allResults: EnhancedSearchResult[] = [];
        let totalResults = 0;
        
        // Batch queries for better performance
        const queries = [];
        
        if (filters.entityType === 'all' || filters.entityType === 'requests') {
          queries.push(() => searchRequests(filters, page, limit));
        }
        
        if (filters.entityType === 'all' || filters.entityType === 'offers') {
          queries.push(() => searchOffers(filters, page, limit));
        }
        
        if (filters.entityType === 'all' || filters.entityType === 'vendors') {
          queries.push(() => searchVendors(filters, page, limit));
        }
        
        const batchResults = await PerformanceOptimizer.batchQuery(queries);
        
        batchResults.forEach((result: any) => {
          if (result && result.data && result.count !== undefined) {
            allResults = [...allResults, ...result.data];
            totalResults += result.count;
          }
        });
        
        // Enhanced sorting with multiple criteria
        allResults.sort((a, b) => {
          if (filters.sort_by === 'relevance' || !filters.sort_by) {
            if (a.relevance !== b.relevance) {
              return b.relevance - a.relevance;
            }
          }
          
          if (filters.sort_by === 'created_at' || !filters.sort_by) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          
          if (filters.sort_by === 'budget_max' && a.price && b.price) {
            return filters.sort_order === 'asc' ? a.price - b.price : b.price - a.price;
          }
          
          return 0;
        });
        
        return { data: allResults, count: totalResults };
      }, 2); // Cache for 2 minutes
      
      setResults(results.data);
      setTotalCount(results.count);
      
      // Update search history
      if (filters.query && filters.query.trim()) {
        setSearchHistory(prev => {
          const updated = [filters.query, ...prev.filter(term => term !== filters.query)];
          return updated.slice(0, 10); // Keep last 10 searches
        });
      }
      
    } catch (error) {
      console.error('Optimized search error:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to perform search. Please try again.',
        variant: 'destructive'
      });
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [generateCacheKey, searchHistory, toast]);

  // Individual search functions (enhanced versions of existing)
  const searchRequests = useCallback(async (filters: EnhancedSearchFilters, page: number, limit: number) => {
    let query = supabase
      .from('requests')
      .select(`
        id, title, description, category, budget_min, budget_max, 
        currency, location, deadline, urgency, status, created_at, 
        updated_at, admin_approval_status,
        user_profiles!requests_client_id_fkey(full_name, company_name)
      `, { count: 'exact' });

    // Enhanced text search with PostgreSQL full-text search
    if (filters.query) {
      const searchQuery = filters.query.replace(/[^\w\s]/gi, ''); // Sanitize input
      query = query.or(
        `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
      );
    }

    // Apply all filters
    if (filters.category && filters.category !== 'All Categories') {
      query = query.eq('category', filters.category);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.urgency && filters.urgency !== 'Any Urgency') {
      query = query.eq('urgency', filters.urgency.toLowerCase());
    }

    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 10000) {
      if (filters.budgetRange[0] > 0) {
        query = query.gte('budget_max', filters.budgetRange[0]);
      }
      if (filters.budgetRange[1] < 10000) {
        query = query.lte('budget_min', filters.budgetRange[1]);
      }
    }

    if (filters.deadline_from) {
      query = query.gte('deadline', filters.deadline_from);
    }

    if (filters.deadline_to) {
      query = query.lte('deadline', filters.deadline_to);
    }

    // Apply user role-based filtering
    if (user) {
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (userProfile?.role === 'vendor') {
        query = query.eq('admin_approval_status', 'approved');
      }
    }

    // Apply sorting and pagination
    const sortBy = filters.sort_by === 'relevance' ? 'created_at' : (filters.sort_by || 'created_at');
    query = query.order(sortBy, { ascending: filters.sort_order === 'asc' })
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
        relevance: calculateEnhancedRelevance(
          filters.query, 
          item.title, 
          item.description, 
          item.category
        )
      })),
      count: count || 0
    };
  }, [user, calculateEnhancedRelevance]);

  const searchOffers = useCallback(async (filters: EnhancedSearchFilters, page: number, limit: number) => {
    let query = supabase
      .from('offers')
      .select(`
        id, title, description, price, currency, delivery_time_days,
        status, created_at, updated_at, client_approval_status,
        requests!inner(title, category, location),
        user_profiles!offers_vendor_id_fkey(full_name, company_name)
      `, { count: 'exact' });

    if (filters.query) {
      const searchQuery = filters.query.replace(/[^\w\s]/gi, '');
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    if (filters.category && filters.category !== 'All Categories') {
      query = query.eq('requests.category', filters.category);
    }

    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 10000) {
      if (filters.budgetRange[0] > 0) {
        query = query.gte('price', filters.budgetRange[0]);
      }
      if (filters.budgetRange[1] < 10000) {
        query = query.lte('price', filters.budgetRange[1]);
      }
    }

    const sortBy = filters.sort_by === 'relevance' ? 'created_at' : (filters.sort_by || 'created_at');
    query = query.order(sortBy, { ascending: filters.sort_order === 'asc' })
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
        relevance: calculateEnhancedRelevance(
          filters.query, 
          item.title, 
          item.description, 
          item.requests?.category
        )
      })),
      count: count || 0
    };
  }, [calculateEnhancedRelevance]);

  const searchVendors = useCallback(async (filters: EnhancedSearchFilters, page: number, limit: number) => {
    let query = supabase
      .from('user_profiles')
      .select(`
        id, full_name, company_name, bio, avatar_url, address,
        verification_status, status, created_at, updated_at, categories
      `, { count: 'exact' })
      .eq('role', 'vendor')
      .eq('status', 'approved');

    if (filters.query) {
      const searchQuery = filters.query.replace(/[^\w\s]/gi, '');
      query = query.or(
        `full_name.ilike.%${searchQuery}%,company_name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`
      );
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
        relevance: calculateEnhancedRelevance(
          filters.query, 
          item.full_name || item.company_name || '', 
          item.bio || '',
          item.categories?.join(' ')
        )
      })),
      count: count || 0
    };
  }, [calculateEnhancedRelevance]);

  // Debounced suggestion generator
  const debouncedGetSuggestions = useMemo(
    () => PerformanceOptimizer.debounce(generateSuggestions, 300),
    [generateSuggestions]
  );

  // Auto-generate suggestions when query changes
  useEffect(() => {
    // This effect is intentionally empty as suggestions are handled by the SearchWithSuggestions component
    // The debouncedGetSuggestions function is available for components to use
  }, [debouncedGetSuggestions]);

  const clearResults = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setSuggestions([]);
  }, []);

  const clearCache = useCallback((pattern?: string) => {
    PerformanceOptimizer.clearCache(pattern || 'search_');
  }, []);

  return {
    results,
    suggestions,
    loading,
    totalCount,
    searchHistory,
    search: searchWithOptimizations,
    getSuggestions: debouncedGetSuggestions,
    clearResults,
    clearCache
  };
};
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Debounce hook for search inputs and API calls
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for scroll events and high-frequency updates
export const useThrottle = <T>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

// Memoized formatters to prevent recreation on every render
export const useOptimizedFormatters = () => {
  const { language } = useLanguage();
  
  const formatters = useMemo(() => ({
    currency: new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }),
    
    number: new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US'),
    
    percentage: new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }),
    
    date: new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    
    dateTime: new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    
    shortDate: new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric'
    })
  }), [language]);

  // Memoized formatter functions
  const formatCurrency = useCallback((amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(num) ? '0' : formatters.currency.format(num);
  }, [formatters.currency]);

  const formatNumber = useCallback((value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0' : formatters.number.format(num);
  }, [formatters.number]);

  const formatPercentage = useCallback((value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0%' : formatters.percentage.format(num / 100);
  }, [formatters.percentage]);

  const formatDate = useCallback((date: string | Date) => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return formatters.date.format(d);
    } catch {
      return 'Invalid date';
    }
  }, [formatters.date]);

  const formatDateTime = useCallback((date: string | Date) => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return formatters.dateTime.format(d);
    } catch {
      return 'Invalid date';
    }
  }, [formatters.dateTime]);

  const formatRelativeTime = useCallback((date: string | Date) => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffInMs = now.getTime() - d.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInHours < 1) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return language === 'ar' ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
      } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return language === 'ar' ? `منذ ${hours} ساعة` : `${hours}h ago`;
      } else if (diffInDays < 7) {
        const days = Math.floor(diffInDays);
        return language === 'ar' ? `منذ ${days} يوم` : `${days}d ago`;
      } else {
        return formatters.shortDate.format(d);
      }
    } catch {
      return 'Invalid date';
    }
  }, [formatters.shortDate, language]);

  return {
    formatCurrency,
    formatNumber,
    formatPercentage,
    formatDate,
    formatDateTime,
    formatRelativeTime
  };
};

// Optimized user profile data with memoization
export const useOptimizedUserProfile = () => {
  const { userProfile, user } = useAuth();
  
  const profileData = useMemo(() => {
    if (!userProfile || !user) return null;
    
    return {
      id: userProfile.id,
      userId: user.id,
      email: userProfile.email,
      fullName: userProfile.full_name,
      companyName: userProfile.company_name,
      role: userProfile.role,
      status: userProfile.status,
      verificationStatus: userProfile.verification_status,
      isVerified: userProfile.verification_status === 'approved',
      isActive: userProfile.status === 'approved',
      avatarUrl: userProfile.avatar_url,
      categories: userProfile.categories || [],
      isVendor: userProfile.role === 'vendor',
      isClient: userProfile.role === 'client',
      isAdmin: userProfile.role === 'admin',
      completionPercentage: calculateProfileCompletion(userProfile)
    };
  }, [userProfile, user]);

  return profileData;
};

// Calculate profile completion percentage
const calculateProfileCompletion = (profile: any): number => {
  if (!profile) return 0;
  
  const fields = [
    profile.full_name,
    profile.email,
    profile.company_name,
    profile.phone,
    profile.address,
    profile.bio,
    profile.categories?.length > 0,
    profile.avatar_url,
    profile.verification_status === 'approved'
  ];
  
  const completedFields = fields.filter(Boolean).length;
  return Math.round((completedFields / fields.length) * 100);
};

// Optimized API call state management
export const useOptimizedApiState = <T>(
  initialData: T | null = null
) => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  
  const handleRequest = useCallback(async (
    apiCall: () => Promise<T>,
    options?: {
      skipLoading?: boolean;
      cacheTime?: number; // in minutes
    }
  ) => {
    // Check if we have cached data
    if (options?.cacheTime && lastFetch && data) {
      const cacheExpiry = new Date(lastFetch.getTime() + options.cacheTime * 60 * 1000);
      if (new Date() < cacheExpiry) {
        return data;
      }
    }
    
    try {
      if (!options?.skipLoading) {
        setLoading(true);
      }
      setError(null);
      
      const result = await apiCall();
      setData(result);
      setLastFetch(new Date());
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [data, lastFetch]);

  const clearError = useCallback(() => setError(null), []);
  const clearData = useCallback(() => {
    setData(null);
    setLastFetch(null);
  }, []);

  return {
    data,
    loading,
    error,
    lastFetch,
    handleRequest,
    clearError,
    clearData,
    hasData: data !== null,
    hasError: error !== null,
    isStale: lastFetch ? (new Date().getTime() - lastFetch.getTime()) > 5 * 60 * 1000 : true // 5 minutes
  };
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return {
    elementRef,
    isIntersecting,
    hasIntersected
  };
};

// Optimized search with debouncing and caching
export const useOptimizedSearch = <T>(
  searchFunction: (query: string) => Promise<T[]>,
  options?: {
    debounceMs?: number;
    minQueryLength?: number;
    cacheTime?: number; // in minutes
  }
) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const cache = useRef<Map<string, { data: T[]; timestamp: number }>>(new Map());
  const abortController = useRef<AbortController | null>(null);
  
  const debouncedQuery = useDebounce(query, options?.debounceMs || 300);
  
  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < (options?.minQueryLength || 2)) {
      setResults([]);
      return;
    }
    
    // Check cache
    const cacheKey = searchQuery.toLowerCase();
    const cached = cache.current.get(cacheKey);
    const cacheTime = (options?.cacheTime || 5) * 60 * 1000; // 5 minutes default
    
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setResults(cached.data);
      return;
    }
    
    // Abort previous request
    if (abortController.current) {
      abortController.current.abort();
    }
    
    abortController.current = new AbortController();
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchFunction(searchQuery);
      
      // Cache results
      cache.current.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      setResults(data);
    } catch (err) {
      if (!abortController.current?.signal.aborted) {
        setError(err instanceof Error ? err : new Error('Search failed'));
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, [searchFunction, options?.minQueryLength, options?.cacheTime]);
  
  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);
  
  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    cache.current.clear();
  }, []);
  
  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearResults,
    hasResults: results.length > 0
  };
};
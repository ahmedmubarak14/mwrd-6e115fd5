
import { supabase } from '@/integrations/supabase/client';

export const supabaseWithRetry = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<{ data: T | null; error: any }> => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await operation();
      if (!result.error) {
        return result;
      }
      lastError = result.error;
    } catch (error) {
      lastError = error;
    }
    
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  return { data: null, error: lastError };
};

export const optimizedQueries = {
  getUsersWithStats: async () => {
    return supabaseWithRetry(() =>
      supabase
        .from('user_profiles')
        .select(`
          *,
          requests:requests(count),
          offers:offers(count)
        `)
        .order('created_at', { ascending: false })
        .limit(100)
    );
  },
  
  getRequestsWithOffers: async () => {
    return supabaseWithRetry(() =>
      supabase
        .from('requests')
        .select(`
          *,
          user_profiles:client_id(full_name, email, company_name),
          offers(count)
        `)
        .order('created_at', { ascending: false })
        .limit(100)
    );
  },
  
  getFinancialSummary: async () => {
    return supabaseWithRetry(() =>
      supabase
        .from('financial_transactions')
        .select('amount, status, created_at, type')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
    );
  }
};

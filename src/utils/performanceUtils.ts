
import { supabaseWithRetry } from './supabaseUtils';

export class PerformanceOptimizer {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  static async getCachedData<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttlMinutes: number = 5
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < (cached.ttl * 60 * 1000)) {
      return cached.data;
    }
    
    const data = await fetcher();
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: ttlMinutes
    });
    
    return data;
  }
  
  static clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
  
  static async batchQuery<T>(queries: (() => Promise<T>)[]): Promise<T[]> {
    return Promise.all(queries.map(query => query()));
  }
  
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
}

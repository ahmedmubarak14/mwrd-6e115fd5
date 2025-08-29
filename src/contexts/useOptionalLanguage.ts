
import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (language: 'en' | 'ar') => void;
  t: (key: string) => string;
  isRTL: boolean;
  formatNumber: (num: number) => string;
  formatDate: (date: Date) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

// Safe optional language hook for components that might not be wrapped in LanguageProvider
export const useOptionalLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  // Return fallback object with all required properties if context is not available
  if (!context) {
    return {
      language: 'en' as const,
      setLanguage: () => {},
      t: (key: string) => key,
      isRTL: false,
      formatNumber: (num: number) => num.toLocaleString(),
      formatDate: (date: Date) => date.toLocaleDateString(),
      formatCurrency: (amount: number, currency = 'USD') => 
        new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: currency 
        }).format(amount)
    };
  }
  
  return context;
};

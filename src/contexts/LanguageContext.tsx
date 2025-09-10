import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '@/constants/translations';
import { createLogger } from '@/utils/logger';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  formatNumber: (num: number) => string;
  formatDate: (date: Date | string | null | undefined) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const logger = createLogger('LanguageProvider');

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  logger.debug('Starting initialization');
  
  const [language, setLanguage] = useState<Language>(() => {
    logger.debug('Initializing useState');
    try {
      const saved = localStorage.getItem('language');
      const result = (saved === 'ar' || saved === 'en') ? saved : 'en';
      logger.info('Initial language loaded', { language: result });
      return result;
    } catch (error) {
      logger.warn('Failed to access localStorage', { error });
      return 'en';
    }
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      logger.warn('Failed to save language to localStorage', { error });
    }
    
    // Update document attributes for RTL support
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Add language-specific class to body
    document.body.classList.remove('lang-en', 'lang-ar');
    document.body.classList.add(`lang-${language}`);
    
    // Update font family for Arabic
    if (isRTL) {
      document.body.style.fontFamily = "'Cairo', 'Noto Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    } else {
      document.body.style.fontFamily = "'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    }
  }, [language, isRTL]);

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  // Format numbers for Arabic (use Arabic-Indic numerals if needed)
  const formatNumber = (num: number): string => {
    if (language === 'ar') {
      return new Intl.NumberFormat('ar-SA').format(num);
    }
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Format dates according to language
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    if (language === 'ar') {
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj);
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'SAR'): string => {
    if (language === 'ar') {
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t, 
        isRTL,
        formatNumber,
        formatDate,
        formatCurrency
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
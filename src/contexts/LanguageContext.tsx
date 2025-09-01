import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '@/constants/translations';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  formatNumber: (num: number) => string;
  formatDate: (date: Date) => string;
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

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('LanguageProvider: Starting initialization');
  
  const [language, setLanguage] = useState<Language>(() => {
    console.log('LanguageProvider: Initializing useState');
    try {
      const saved = localStorage.getItem('language');
      const result = (saved === 'ar' || saved === 'en') ? saved : 'en';
      console.log('LanguageProvider: Initial language:', result);
      return result;
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
      return 'en';
    }
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.warn('Failed to save language to localStorage:', error);
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
  const formatDate = (date: Date): string => {
    if (language === 'ar') {
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
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
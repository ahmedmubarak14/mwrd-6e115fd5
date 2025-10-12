import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

/**
 * Optional language hook that doesn't throw errors if used outside LanguageProvider
 * Useful for shared components that may be used in contexts without language support
 */
export const useOptionalLanguage = () => {
  const context = useContext(LanguageContext);
  
  // Return null if used outside provider instead of throwing error
  if (!context) {
    return null;
  }
  
  return context;
};

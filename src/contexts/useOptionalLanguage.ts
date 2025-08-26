
import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

// Safe optional language hook for components that might not be wrapped in LanguageProvider
export const useOptionalLanguage = () => {
  const context = useContext(LanguageContext);
  // Return undefined if the context is not available (component not wrapped in LanguageProvider)
  return context;
};

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

// Safe optional auth hook for public pages/components
export const useOptionalAuth = () => {
  const context = useContext(AuthContext);
  // Return undefined if the context is not available (component not wrapped in AuthProvider)
  return context;
};

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

// Safe optional auth hook for public pages/components
export const useOptionalAuth = () => {
  try {
    const context = useContext(AuthContext);
    // Return context if available, undefined if not wrapped in AuthProvider
    return context;
  } catch {
    // Return undefined if the context is not available (component not wrapped in AuthProvider)
    return undefined;
  }
};
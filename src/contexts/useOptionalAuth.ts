import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

// Safe optional auth hook for public pages/components
export const useOptionalAuth = () => {
  try {
    return useContext(AuthContext);
  } catch {
    return undefined;
  }
};

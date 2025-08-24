
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Component that handles automatic redirects based on authentication state
 */
export const AuthRedirect = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while still loading auth state
    if (loading) return;

    // Only redirect from root path
    if (location.pathname !== '/') return;

    // If user is authenticated, redirect to dashboard
    if (user && userProfile) {
      // All users go to the same dashboard route - role-based rendering is handled in the Dashboard component
      navigate('/dashboard', { replace: true });
    }
  }, [user, userProfile, loading, navigate, location.pathname]);

  return null;
};

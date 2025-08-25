
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

    // If user is authenticated and we have their profile, redirect to dashboard
    if (user && userProfile) {
      console.log('AuthRedirect: User authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // Only redirect to landing from root path if not authenticated
    if (location.pathname === '/' && !user) {
      navigate('/landing', { replace: true });
    }
  }, [user, userProfile, loading, navigate, location.pathname]);

  return null;
};

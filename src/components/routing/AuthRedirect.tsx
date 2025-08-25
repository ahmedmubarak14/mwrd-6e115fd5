
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

    // Only redirect from login/register paths when user is already authenticated
    const authPaths = ['/login', '/register', '/auth'];
    const isOnAuthPath = authPaths.includes(location.pathname);
    
    // If user is authenticated and on an auth path, redirect to appropriate dashboard
    if (user && userProfile && isOnAuthPath) {
      const targetPath = location.state?.from?.pathname;
      
      // If there's a specific path they were trying to access, go there
      if (targetPath && !authPaths.includes(targetPath)) {
        navigate(targetPath, { replace: true });
        return;
      }

      // Otherwise redirect to role-appropriate dashboard
      switch (userProfile.role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'vendor':
          navigate('/vendor/dashboard', { replace: true });
          break;
        case 'client':
        default:
          navigate('/dashboard', { replace: true });
          break;
      }
    }
  }, [user, userProfile, loading, navigate, location.pathname, location.state]);

  return null;
};

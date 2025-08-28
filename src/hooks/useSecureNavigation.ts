import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { validateRedirectUrl, logSecurityEvent } from '@/utils/security';

interface UseSecureNavigationOptions {
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const useSecureNavigation = (options: UseSecureNavigationOptions = {}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { requireAuth = false, allowedRoles = [], redirectTo = '/auth' } = options;

  useEffect(() => {
    if (loading) return;

    // Check authentication requirement
    if (requireAuth && !user) {
      logSecurityEvent('unauthorized_access_attempt', {
        path: window.location.pathname,
        reason: 'not_authenticated'
      });
      navigate(redirectTo);
      return;
    }

    // Check role-based access
    if (user && allowedRoles.length > 0) {
      // This would need to be implemented based on your user role system
      // For now, we'll skip this check
    }
  }, [user, loading, requireAuth, allowedRoles, redirectTo, navigate]);

  const secureNavigate = (path: string, replace = false) => {
    // Validate the redirect URL to prevent open redirects
    if (!validateRedirectUrl(path)) {
      logSecurityEvent('invalid_redirect_attempt', {
        attempted_path: path,
        current_path: window.location.pathname
      });
      return;
    }

    navigate(path, { replace });
  };

  return {
    secureNavigate,
    isAuthenticated: !!user,
    isLoading: loading
  };
};

// Hook for protecting routes
export const useRouteProtection = (requiredRole?: string) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      logSecurityEvent('route_protection_triggered', {
        path: window.location.pathname,
        reason: 'not_authenticated',
        required_role: requiredRole
      });
      navigate('/auth');
    }
  }, [user, loading, navigate, requiredRole]);

  return {
    isProtected: !!user,
    isLoading: loading
  };
};
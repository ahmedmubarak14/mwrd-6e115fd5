import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { consoleCleanupGuide } from '@/utils/cleanupConsoleStats';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

/**
 * Component that handles automatic redirects based on authentication state
 */
export const AuthRedirect = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logger = consoleCleanupGuide.createLogger('AuthRedirect');

  useEffect(() => {
    // Don't redirect while still loading auth state
    if (loading) return;

    const handleRedirect = async () => {
      // If user is authenticated and we have their profile
      if (user && userProfile) {
        logger.debug('User authenticated, checking role and redirect');

        // Fetch role from user_roles table (secure)
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();

        const role = userRole?.role || userProfile.role;

        // Admin users - redirect to admin dashboard immediately
        if (role === 'admin') {
          logger.debug('Admin user, redirecting to admin dashboard');
          navigate('/admin/dashboard', { replace: true });
          return;
        }

        // Vendor users - check KYV status
        if (role === 'vendor') {
          const { data: kyvSubmission } = await supabase
            .from('kyv_submissions')
            .select('id, submission_status')
            .eq('user_id', user.id)
            .maybeSingle();

          // If no KYV submission exists, redirect to KYV flow
          if (!kyvSubmission) {
            logger.debug('No KYV submission found, redirecting to KYV Main Info');
            navigate('/kyv/main-info', { replace: true });
            return;
          }

          // If KYV is rejected, redirect to KYV form to resubmit
          if (kyvSubmission.submission_status === 'rejected') {
            logger.debug('KYV rejected, redirecting to KYV form');
            navigate('/kyv/form', { replace: true });
            return;
          }

          // Otherwise go to vendor dashboard
          navigate('/vendor-dashboard', { replace: true });
          return;
        }

        // Client users - check KYC status
        if (role === 'client') {
          const { data: kycSubmission } = await supabase
            .from('kyc_submissions')
            .select('id, submission_status')
            .eq('user_id', user.id)
            .maybeSingle();

          // If no KYC submission exists, redirect to KYC flow
          if (!kycSubmission) {
            logger.debug('No KYC submission found, redirecting to KYC Main Info');
            navigate('/kyc/main-info', { replace: true });
            return;
          }

          // If KYC is rejected, redirect to KYC form to resubmit
          if (kycSubmission.submission_status === 'rejected') {
            logger.debug('KYC rejected, redirecting to KYC form');
            navigate('/kyc/form', { replace: true });
            return;
          }

          // Otherwise go to client dashboard
          navigate('/dashboard', { replace: true });
          return;
        }

        // Default fallback
        navigate('/dashboard', { replace: true });
        return;
      }

      // Only redirect to landing from root path if not authenticated
      if (location.pathname === '/' && !user) {
        navigate('/landing', { replace: true });
      }
    };

    handleRedirect();
  }, [user, userProfile, loading, navigate, location.pathname, logger]);

  return null;
};

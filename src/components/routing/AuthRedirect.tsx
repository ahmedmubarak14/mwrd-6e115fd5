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
  const [checkingKYC, setCheckingKYC] = useState(true);

  useEffect(() => {
    // Don't redirect while still loading auth state
    if (loading) return;

    // Check if user needs KYC
    const checkKYCStatus = async () => {
      if (user && userProfile && userProfile.role === 'client') {
        // Check if user has completed KYC
        const { data, error } = await supabase
          .from('kyc_submissions')
          .select('id, submission_status')
          .eq('user_id', user.id)
          .maybeSingle();

        // If no KYC submission exists, redirect to KYC flow
        if (!data && !error) {
          logger.debug('No KYC submission found, redirecting to KYC');
          navigate('/kyc/main-info', { replace: true });
          setCheckingKYC(false);
          return;
        }

        // If KYC is rejected, redirect to KYC form to resubmit
        if (data && data.submission_status === 'rejected') {
          logger.debug('KYC rejected, redirecting to KYC form');
          navigate('/kyc/form', { replace: true });
          setCheckingKYC(false);
          return;
        }
      }
      setCheckingKYC(false);
    };

    if (user && userProfile && !checkingKYC) {
      checkKYCStatus();
      return;
    }

    // If user is authenticated and we have their profile, redirect based on role
    if (user && userProfile && !checkingKYC) {
      logger.debug('User authenticated, redirecting based on role');
      
      // Role-based redirection
      if (userProfile.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userProfile.role === 'vendor') {
        navigate('/vendor-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
      return;
    }

    // Only redirect to landing from root path if not authenticated
    if (location.pathname === '/' && !user) {
      navigate('/landing', { replace: true });
    }
  }, [user, userProfile, loading, navigate, location.pathname, checkingKYC]);

  return null;
};

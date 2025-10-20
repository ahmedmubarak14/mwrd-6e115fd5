
import { ReactNode, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { showInfo } = useToastFeedback();
  const { t } = useLanguage();
  const location = useLocation();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!loading && !user && !notifiedRef.current) {
      showInfo(t('common.auth.signInPrompt'));
      notifiedRef.current = true;
    }
  }, [loading, user, showInfo, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner text={t('common.loading.checkingAuth')} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

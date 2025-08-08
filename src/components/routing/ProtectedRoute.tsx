import { ReactNode, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { showInfo } = useToastFeedback();
  const location = useLocation();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!loading && !user && !notifiedRef.current) {
      showInfo('Please sign in to continue.');
      notifiedRef.current = true;
    }
  }, [loading, user, showInfo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner text="Checking authentication..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

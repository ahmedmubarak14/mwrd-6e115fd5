import { ReactNode, useEffect, useRef } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowed: Array<'client' | 'vendor' | 'admin'>;
}

export const RoleProtectedRoute = ({ children, allowed }: RoleProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();
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
        <LoadingSpinner text="Checking access..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  const role = userProfile?.role;

  if (!role || !allowed.includes(role)) {
    const homeByRole: Record<string, string> = {
      client: '/client-dashboard',
      vendor: '/supplier-dashboard',
      admin: '/admin',
    };

    const suggested = role ? homeByRole[role] : '/';
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>You don’t have permission to view this page.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button asChild>
              <Link to={suggested}>Go to your dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Return home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const Auth = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      console.log('No user authenticated, redirecting to /login');
      navigate('/login');
      return;
    }

    if (user && userProfile) {
      console.log('User authenticated, redirecting based on role:', userProfile.role);
      switch (userProfile.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'vendor':
          navigate('/vendor-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    }
  }, [user, userProfile, loading, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default Auth;

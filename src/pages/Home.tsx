import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dashboard } from "./Dashboard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Home = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && userProfile) {
      navigate('/dashboard');
    }
  }, [user, userProfile, navigate]);

  const handleAuthSuccess = (userData: { id: string; email: string; role: 'client' | 'supplier' }) => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && userProfile) {
    return <Dashboard />;
  }

  return <AuthForm onAuthSuccess={handleAuthSuccess} />;
};
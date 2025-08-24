
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// This component is now simplified - it only redirects to dashboard
const Index = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && userProfile) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, userProfile, loading, navigate]);

  return null;
};

export default Index;

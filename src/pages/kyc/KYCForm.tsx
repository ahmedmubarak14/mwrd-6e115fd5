import { EnhancedKYCForm } from '@/components/kyc/EnhancedKYCForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const KYCForm = () => {
  const navigate = useNavigate();
  const { userProfile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !userProfile) {
      navigate('/login');
    }
  }, [loading, userProfile, navigate]);

  const handleComplete = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <EnhancedKYCForm onComplete={handleComplete} />
    </div>
  );
};

export default KYCForm;

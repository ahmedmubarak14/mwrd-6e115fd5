import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useCompanyProfileSetup = () => {
  const { userProfile, session } = useAuth();
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    // Show modal if user just signed up and profile is incomplete
    if (session && userProfile) {
      const isNewUser = !userProfile.company_name && !userProfile.bio;
      const needsVerification = userProfile.verification_status === 'pending' && !userProfile.verification_documents;
      
      if (isNewUser || needsVerification) {
        // Delay to allow signup flow to complete
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [session, userProfile]);

  const handleComplete = () => {
    setShowModal(false);
  };

  const handleSkip = () => {
    setShowModal(false);
  };

  return {
    showModal,
    setShowModal,
    handleComplete,
    handleSkip
  };
};
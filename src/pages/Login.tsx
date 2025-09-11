
import { SecureAuthForm } from '@/components/auth/SecureAuthForm';
import { AuthRedirect } from '@/components/routing/AuthRedirect';
import { CompanyProfileSetupModal } from '@/components/onboarding/CompanyProfileSetupModal';
import { useCompanyProfileSetup } from '@/hooks/useCompanyProfileSetup';

const Login = () => {
  const { showModal, setShowModal, handleComplete } = useCompanyProfileSetup();

  return (
    <>
      <AuthRedirect />
      <SecureAuthForm mode="signin" />
      <CompanyProfileSetupModal 
        open={showModal}
        onOpenChange={setShowModal}
        onComplete={handleComplete}
      />
    </>
  );
};

export default Login;

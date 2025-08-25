
import { EnhancedSecureAuthForm } from '@/components/auth/EnhancedSecureAuthForm';
import { AuthRedirect } from '@/components/routing/AuthRedirect';

const EnhancedRegister = () => {
  return (
    <>
      <AuthRedirect />
      <EnhancedSecureAuthForm mode="signup" />
    </>
  );
};

export default EnhancedRegister;

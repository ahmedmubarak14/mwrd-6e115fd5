
import { EnhancedSecureAuthForm } from '@/components/auth/EnhancedSecureAuthForm';
import { AuthRedirect } from '@/components/routing/AuthRedirect';

const EnhancedLogin = () => {
  return (
    <>
      <AuthRedirect />
      <EnhancedSecureAuthForm mode="signin" />
    </>
  );
};

export default EnhancedLogin;

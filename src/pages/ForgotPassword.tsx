
import { SecureAuthForm } from '@/components/auth/SecureAuthForm';
import { AuthRedirect } from '@/components/routing/AuthRedirect';

const ForgotPassword = () => {
  return (
    <>
      <AuthRedirect />
      <SecureAuthForm mode="reset" />
    </>
  );
};

export default ForgotPassword;

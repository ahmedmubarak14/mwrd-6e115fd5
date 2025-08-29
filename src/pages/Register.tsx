
import { SecureAuthForm } from '@/components/auth/SecureAuthForm';
import { AuthRedirect } from '@/components/routing/AuthRedirect';

const Register = () => {
  return (
    <>
      <AuthRedirect />
      <SecureAuthForm mode="signup" />
    </>
  );
};

export default Register;

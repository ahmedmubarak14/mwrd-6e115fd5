
import { SecureAuthForm } from '@/components/auth/SecureAuthForm';
import { AuthRedirect } from '@/components/routing/AuthRedirect';

const Login = () => {
  return (
    <>
      <AuthRedirect />
      <SecureAuthForm mode="signin" />
    </>
  );
};

export default Login;

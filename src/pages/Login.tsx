
import { SecureAuthForm } from '@/components/auth/SecureAuthForm';
import { AuthRedirect } from '@/components/routing/AuthRedirect';

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <AuthRedirect />
      <SecureAuthForm mode="signin" />
    </div>
  );
};

export default Login;

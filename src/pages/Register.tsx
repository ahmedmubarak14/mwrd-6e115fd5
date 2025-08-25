
import { EnhancedAuthForm } from '@/components/auth/EnhancedAuthForm';
import { AuthRedirect } from '@/components/routing/AuthRedirect';

const Register = () => {
  return (
    <>
      <AuthRedirect />
      <EnhancedAuthForm />
    </>
  );
};

export default Register;

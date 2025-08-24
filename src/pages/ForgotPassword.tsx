
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Password reset form will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;

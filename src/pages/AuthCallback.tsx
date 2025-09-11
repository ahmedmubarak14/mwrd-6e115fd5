import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToastFeedback } from '@/hooks/useToastFeedback';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { showSuccess, showError } = useToastFeedback();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the tokens from URL parameters
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        if (type === 'signup' && access_token && refresh_token) {
          // Set the session with the tokens
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });

          if (error) {
            console.error('Session error:', error);
            setStatus('error');
            setMessage('Failed to confirm email. Please try again.');
            showError('Email confirmation failed. Please try logging in again.');
          } else {
            setStatus('success');
            setMessage('Email confirmed successfully! You can now access your account.');
            showSuccess('Email confirmed successfully!');
            
            // Redirect to login after a short delay
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 2000);
          }
        } else {
          // Check for error parameters
          const error = searchParams.get('error');
          const error_description = searchParams.get('error_description');
          
          if (error) {
            setStatus('error');
            setMessage(error_description || 'Email confirmation failed.');
            showError(error_description || 'Email confirmation failed.');
          } else {
            setStatus('error');
            setMessage('Invalid confirmation link or link has expired.');
            showError('Invalid confirmation link or link has expired.');
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during email confirmation.');
        showError('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, showSuccess, showError]);

  const handleReturnToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 border border-white/20 backdrop-blur-20">
          <CardHeader className="space-y-4 text-center">
            <img 
              src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
              alt="MWRD Logo" 
              className="h-16 w-auto mx-auto"
            />
            <CardTitle className="text-2xl font-bold text-white">
              Email Confirmation
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            {status === 'loading' && (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                <p className="text-white/80">Confirming your email...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
                <p className="text-white font-medium">{message}</p>
                <p className="text-white/60 text-sm">Redirecting you to login...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="h-12 w-12 text-red-400 mx-auto" />
                <p className="text-white font-medium">{message}</p>
                <Button 
                  onClick={handleReturnToLogin}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Return to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthCallback;
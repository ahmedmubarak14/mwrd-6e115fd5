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
        // Parse tokens from both URL hash and query params
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const getParam = (key: string) => searchParams.get(key) || hashParams.get(key);

        const access_token = getParam('access_token');
        const refresh_token = getParam('refresh_token');
        const type = getParam('type');
        const code = getParam('code');
        const errorParam = getParam('error');
        const error_description = getParam('error_description');

        const cleanupUrl = () => {
          try {
            const url = new URL(window.location.href);
            url.hash = '';
            ['access_token','refresh_token','type','code','error','error_description'].forEach(p => url.searchParams.delete(p));
            window.history.replaceState({}, document.title, url.toString());
          } catch {}
        };

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          cleanupUrl();
          if (error) {
            console.error('Exchange code error:', error);
            setStatus('error');
            if (error.message.includes('expired')) {
              setMessage('Email confirmation link has expired. Please request a new one.');
            } else if (error.message.includes('invalid')) {
              setMessage('Invalid confirmation link. Please check your email or request a new link.');
            } else {
              setMessage('Failed to confirm email. Please try again.');
            }
            showError('Email confirmation failed. Please try logging in again.');
          } else {
            setStatus('success');
            setMessage('Email confirmed successfully! Redirecting to complete your profile...');
            showSuccess('Email confirmed successfully!');
            
            // Check if user needs KYC
            const { data: session } = await supabase.auth.getSession();
            if (session?.session?.user) {
              const userId = session.session.user.id;
              
              // Check user role
              const { data: userRole } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .limit(1)
                .maybeSingle();

              // If client role, check KYC status
              if (userRole?.role === 'client') {
                const { data: kycSubmission } = await supabase
                  .from('kyc_submissions')
                  .select('id, submission_status')
                  .eq('user_id', userId)
                  .maybeSingle();

                // If no KYC or rejected, redirect to KYC Main Info
                if (!kycSubmission || kycSubmission.submission_status === 'rejected') {
                  setTimeout(() => {
                    navigate('/kyc/main-info', { replace: true });
                  }, 2000);
                  return;
                }
              }
            }

            // Otherwise, redirect to login
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 2000);
          }
          return;
        }

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          cleanupUrl();
          if (error) {
            console.error('Session error:', error);
            setStatus('error');
            if (error.message.includes('expired')) {
              setMessage('Email confirmation session has expired. Please request a new confirmation email.');
            } else if (error.message.includes('invalid')) {
              setMessage('Invalid email confirmation session. Please request a new confirmation email.');
            } else {
              setMessage('Failed to confirm email. Please try again.');
            }
            showError('Email confirmation failed. Please try logging in again.');
          } else {
            setStatus('success');
            setMessage('Email confirmed successfully! Redirecting to complete your profile...');
            showSuccess('Email confirmed successfully!');
            
            // Check if user needs KYC
            const { data: session } = await supabase.auth.getSession();
            if (session?.session?.user) {
              const userId = session.session.user.id;
              
              // Check user role
              const { data: userRole } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .limit(1)
                .maybeSingle();

              // If client role, check KYC status
              if (userRole?.role === 'client') {
                const { data: kycSubmission } = await supabase
                  .from('kyc_submissions')
                  .select('id, submission_status')
                  .eq('user_id', userId)
                  .maybeSingle();

                // If no KYC or rejected, redirect to KYC Main Info
                if (!kycSubmission || kycSubmission.submission_status === 'rejected') {
                  setTimeout(() => {
                    navigate('/kyc/main-info', { replace: true });
                  }, 2000);
                  return;
                }
              }
            }

            // Otherwise, redirect to login
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 2000);
          }
          return;
        }

        if (errorParam) {
          setStatus('error');
          if (error_description?.includes('expired')) {
            setMessage('Email confirmation link has expired. Please request a new one from the login page.');
          } else if (error_description?.includes('invalid')) {
            setMessage('Invalid confirmation link. Please request a new one from the login page.');
          } else {
            setMessage(error_description || 'Email confirmation failed. Please request a new confirmation email.');
          }
          showError(error_description || 'Email confirmation failed.');
          cleanupUrl();
          return;
        }

        setStatus('error');
        setMessage('Invalid confirmation link or link has expired. Please request a new confirmation email from the login page.');
        showError('Invalid confirmation link or link has expired.');
        cleanupUrl();
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
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] p-4">
        <h1 className="sr-only">Email Confirmation</h1>
        <div className="w-full max-w-md">
          <Card className="bg-white/5 border border-white/20 backdrop-blur-20">
            <CardHeader className="space-y-4 text-center">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD logo for email confirmation" 
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
                  <div className="space-y-2">
                    <Button 
                      onClick={handleReturnToLogin}
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                    >
                      Return to Login
                    </Button>
                    <p className="text-white/60 text-xs text-center">
                      Need help? Check your spam folder or request a new confirmation email from the login page.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
  );
};

export default AuthCallback;
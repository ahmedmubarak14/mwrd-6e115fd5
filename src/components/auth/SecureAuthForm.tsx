
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { Eye, EyeOff, Shield, Mail } from 'lucide-react';
import { sanitizeInput } from '@/utils/security';

interface SecureAuthFormProps {
  mode: 'signin' | 'signup' | 'reset';
}

export const SecureAuthForm = ({ mode }: SecureAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<'client' | 'vendor'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [resendingConfirmation, setResendingConfirmation] = useState(false);
  
  const { secureSignIn, securePasswordReset, secureSignUp, loading } = useSecureAuth();
  const { resendConfirmation } = useAuth();
  const { showError, showSuccess, showInfo } = useToastFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError('Please enter your email address.');
      return;
    }

    if (mode === 'signin') {
      if (!password) {
        showError('Please enter your password.');
        return;
      }

      const { error } = await secureSignIn(email, password);
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          showError('Please confirm your email address before signing in.');
        } else {
          showError(error.message);
        }
      } else {
        showSuccess('Welcome back!');
      }
    } else if (mode === 'signup') {
      if (!password || !fullName) {
        showError('Please fill in all required fields.');
        return;
      }

      const { error } = await secureSignUp(email, password, {
        full_name: fullName,
        company_name: companyName,
        role: role
      });
      
      if (error) {
        showError(error.message);
      } else {
        showSuccess('Account created successfully! Please check your email.');
      }
    } else if (mode === 'reset') {
      const { error } = await securePasswordReset(email);
      
      if (error) {
        showError(error.message);
      }
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      showError('Please enter your email address first.');
      return;
    }

    setResendingConfirmation(true);
    try {
      const { error } = await resendConfirmation(email);
      if (error) {
        showError(error.message);
      } else {
        showSuccess('Confirmation email sent! Please check your inbox.');
      }
    } catch (error) {
      showError('Failed to resend confirmation email. Please try again.');
    } finally {
      setResendingConfirmation(false);
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signin': return 'Sign in to your account';
      case 'signup': return 'Create your account';
      case 'reset': return 'Reset your password';
      default: return 'Sign in to your account';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 border border-white/20 backdrop-blur-20">
          <CardHeader className="space-y-6 text-center">
            <Link to="/landing" className="inline-block">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo" 
                className="h-16 w-auto mx-auto transition-transform duration-200 hover:scale-105 drop-shadow-lg cursor-pointer"
              />
            </Link>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Welcome to MWRD</h1>
              <p className="text-white/80">{getDescription()}</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div className="space-y-3">
                    <Label className="text-white">Account Type *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className={`p-3 rounded-lg border text-center transition-all ${
                          role === 'client' 
                            ? 'bg-primary/20 border-primary text-white' 
                            : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                        }`}
                        onClick={() => setRole('client')}
                      >
                        <div className="font-semibold">Client</div>
                        <div className="text-xs opacity-70">Request Services</div>
                      </button>
                      <button
                        type="button"
                        className={`p-3 rounded-lg border text-center transition-all ${
                          role === 'vendor' 
                            ? 'bg-primary/20 border-primary text-white' 
                            : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                        }`}
                        onClick={() => setRole('vendor')}
                      >
                        <div className="font-semibold">Vendor</div>
                        <div className="text-xs opacity-70">Provide Services</div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(sanitizeInput(e.target.value))}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white">Company Name</Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(sanitizeInput(e.target.value))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                  required
                  autoComplete="email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              {(mode === 'signin' || mode === 'signup') && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-white" /> : <Eye className="h-4 w-4 text-white" />}
                    </Button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                {loading ? 'Processing...' : 
                  mode === 'signin' ? 'Sign In' : 
                  mode === 'signup' ? 'Create Account' : 
                  'Send Reset Link'}
              </Button>
            </form>

            <div className="text-center space-y-3">
              {mode === 'signin' ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-white/70">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-primary hover:underline">
                        Sign up
                      </Link>
                    </p>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline block">
                      Forgot your password?
                    </Link>
                  </div>
                  
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-white/60 mb-2">Need to confirm your email?</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResendConfirmation}
                      disabled={resendingConfirmation}
                      className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      {resendingConfirmation ? (
                        <>
                          <Mail className="h-3 w-3 mr-2 animate-pulse" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-3 w-3 mr-2" />
                          Resend Confirmation Email
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : mode === 'signup' ? (
                <p className="text-sm text-white/70">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              ) : (
                <p className="text-sm text-white/70">
                  Remember your password?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              )}
            </div>

            <div className="text-xs text-white/60 text-center flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              Your data is protected with enterprise-grade security
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

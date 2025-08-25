import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';

interface SecureAuthFormProps {
  mode?: 'signin' | 'signup' | 'reset';
}

export const SecureAuthForm: React.FC<SecureAuthFormProps> = ({ 
  mode = 'signin' 
}) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    company_name: '',
    role: 'client' as 'client' | 'vendor'
  });
  const [error, setError] = useState<string | null>(null);

  const { secureSignUp, secureSignIn, securePasswordReset, loading } = useSecureAuth();
  const { userProfile } = useAuth();
  const { showSuccess, showError } = useToastFeedback();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (userProfile) {
      const from = (location.state as any)?.from?.pathname || getDefaultRoute(userProfile.role);
      navigate(from, { replace: true });
    }
  }, [userProfile, navigate, location]);

  const getDefaultRoute = (role: string) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'vendor':
        return '/vendor/dashboard';
      case 'client':
      default:
        return '/dashboard';
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const result = await secureSignIn(formData.email, formData.password);
      
      if (result.error) {
        setError(result.error.message);
        showError(result.error.message);
      } else {
        showSuccess('Sign in successful!');
        // Navigation will be handled by the useEffect above when userProfile updates
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password || !formData.full_name || !formData.company_name) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const result = await secureSignUp(formData.email, formData.password, {
        full_name: formData.full_name,
        company_name: formData.company_name,
        role: formData.role
      });

      if (result.error) {
        setError(result.error.message);
        showError(result.error.message);
      } else {
        showSuccess('Account created successfully! Please check your email to verify your account.');
        setCurrentMode('signin');
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    try {
      const result = await securePasswordReset(formData.email);
      
      if (result.error) {
        setError(result.error.message);
        showError(result.error.message);
      } else {
        showSuccess('Password reset email sent! Please check your inbox.');
        setCurrentMode('signin');
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const renderSignInForm = () => (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 mr-2" />
            Sign In
          </>
        )}
      </Button>
    </form>
  );

  const renderSignUpForm = () => (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full-name">Full Name</Label>
        <Input
          id="full-name"
          type="text"
          placeholder="Enter your full name"
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-name">Company Name</Label>
        <Input
          id="company-name"
          type="text"
          placeholder="Enter your company name"
          value={formData.company_name}
          onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
            minLength={8}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 mr-2" />
            Create Account
          </>
        )}
      </Button>
    </form>
  );

  const renderPasswordResetForm = () => (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending Reset Email...
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 mr-2" />
            Send Reset Email
          </>
        )}
      </Button>

      <Button 
        type="button" 
        variant="outline" 
        className="w-full" 
        onClick={() => setCurrentMode('signin')}
      >
        Back to Sign In
      </Button>
    </form>
  );

  if (currentMode === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderPasswordResetForm()}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to MWRD</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentMode} onValueChange={(value) => setCurrentMode(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-6">
              {renderSignInForm()}
              <div className="mt-4 text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => setCurrentMode('reset')}
                  className="text-sm"
                >
                  Forgot your password?
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              {renderSignUpForm()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

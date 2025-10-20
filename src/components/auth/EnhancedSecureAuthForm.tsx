
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useEnhancedSecureAuth } from '@/hooks/useEnhancedSecureAuth';
import { SecureForm } from '@/components/security/SecureForm';
import { SecureInput } from '@/components/security/SecureInput';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  csrfToken: z.string()
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
  confirmPassword: z.string(),
  full_name: z.string().min(1, 'Full name is required'),
  company_name: z.string().min(1, 'Company name is required'),
  role: z.enum(['client', 'vendor']),
  csrfToken: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const resetSchema = z.object({
  email: z.string().email('Invalid email format'),
  csrfToken: z.string()
});

interface EnhancedSecureAuthFormProps {
  mode?: 'signin' | 'signup' | 'reset';
}

export const EnhancedSecureAuthForm: React.FC<EnhancedSecureAuthFormProps> = ({ 
  mode = 'signin' 
}) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    company_name: '',
    role: 'client' as 'client' | 'vendor'
  });

  const { secureSignUp, secureSignIn, securePasswordReset, loading, validatePassword } = useEnhancedSecureAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignIn = async (data: FormData, csrfToken: string) => {
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    const result = await secureSignIn(email, password);
    if (!result.error && result.data?.user) {
      navigate('/dashboard');
    }
  };

  const handleSignUp = async (data: FormData, csrfToken: string) => {
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const full_name = data.get('full_name') as string;
    const company_name = data.get('company_name') as string;
    const role = data.get('role') as string;

    const result = await secureSignUp(email, password, {
      full_name,
      company_name,
      role
    });

    if (!result.error) {
      setCurrentMode('signin');
    }
  };

  const handlePasswordReset = async (data: FormData, csrfToken: string) => {
    const email = data.get('email') as string;
    await securePasswordReset(email);
  };

  const getPasswordStrength = (password: string) => {
    const errors = validatePassword(password);
    const strength = Math.max(0, 5 - errors.length);
    return { strength, errors };
  };

  const renderSignInForm = () => (
    <SecureForm 
      onSubmit={handleSignIn}
      schema={signInSchema}
      rateLimitKey="signin"
      maxAttempts={5}
      className="space-y-4"
    >
      <SecureInput
        type="email"
        name="email"
        placeholder={t('auth.placeholders.email')}
        value={formData.email}
        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
        required
        validationType="email"
      />

      <div className="relative">
        <SecureInput
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder={t('auth.placeholders.password')}
          value={formData.password}
          onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
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

      <Button type="submit" className="w-full" disabled={loading}>
        <Shield className="w-4 h-4 mr-2" />
        {loading ? t('auth.signingIn') : t('auth.signInSecurely')}
      </Button>
    </SecureForm>
  );

  const renderSignUpForm = () => {
    const { strength, errors } = getPasswordStrength(formData.password);
    
    return (
      <SecureForm 
        onSubmit={handleSignUp}
        schema={signUpSchema}
        rateLimitKey="signup"
        maxAttempts={3}
        className="space-y-4"
      >
        <SecureInput
          type="email"
          name="email"
          placeholder={t('auth.placeholders.email')}
          value={formData.email}
          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          required
          validationType="email"
        />

        <SecureInput
          type="text"
          name="full_name"
          placeholder={t('auth.placeholders.fullName')}
          value={formData.full_name}
          onChange={(value) => setFormData(prev => ({ ...prev, full_name: value }))}
          required
          validationType="name"
        />

        <SecureInput
          type="text"
          name="company_name"
          placeholder={t('auth.placeholders.companyName')}
          value={formData.company_name}
          onChange={(value) => setFormData(prev => ({ ...prev, company_name: value }))}
          required
          validationType="name"
        />

        <Select 
          name="role"
          value={formData.role} 
          onValueChange={(value: 'client' | 'vendor') => setFormData(prev => ({ ...prev, role: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('auth.selectRole')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">{t('auth.roleClient')}</SelectItem>
            <SelectItem value="vendor">{t('auth.roleVendor')}</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <div className="relative">
            <SecureInput
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder={t('auth.placeholders.password')}
              value={formData.password}
              onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
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
          
          {formData.password && (
            <div className="space-y-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded ${
                      level <= strength 
                        ? strength < 3 ? 'bg-destructive' 
                        : strength < 4 ? 'bg-warning' 
                        : 'bg-success'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              {errors.length > 0 && (
                <div className="text-xs space-y-1">
                  {errors.map((error, index) => (
                    <p key={index} className="text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <SecureInput
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder={t('auth.placeholders.confirmPassword')}
            value={formData.confirmPassword}
            onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          <Shield className="w-4 h-4 mr-2" />
          {loading ? t('auth.creatingAccount') : t('auth.createSecureAccount')}
        </Button>
      </SecureForm>
    );
  };

  const renderResetForm = () => (
    <SecureForm 
      onSubmit={handlePasswordReset}
      schema={resetSchema}
      rateLimitKey="reset"
      maxAttempts={3}
      className="space-y-4"
    >
      <SecureInput
        type="email"
        name="email"
        placeholder={t('auth.placeholders.email')}
        value={formData.email}
        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
        required
        validationType="email"
      />

      <Button type="submit" className="w-full" disabled={loading}>
        <Shield className="w-4 h-4 mr-2" />
        {loading ? t('auth.sendingResetLink') : t('auth.sendResetLink')}
      </Button>
    </SecureForm>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>{t('auth.secureAuth')}</CardTitle>
          </div>
          <CardDescription>
            {t('auth.protectedBy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {t('auth.securityNotice')}
            </AlertDescription>
          </Alert>

          <Tabs value={currentMode} onValueChange={(value) => setCurrentMode(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">{t('auth.signIn')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
              <TabsTrigger value="reset">{t('auth.reset')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-6">
              {renderSignInForm()}
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              {renderSignUpForm()}
            </TabsContent>
            
            <TabsContent value="reset" className="mt-6">
              {renderResetForm()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

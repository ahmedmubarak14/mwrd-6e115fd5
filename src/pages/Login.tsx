import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const Login: React.FC = () => {
  const { login, userProfile, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: t('login.success'),
        description: t('login.redirecting'),
      })
      // Redirect based on user role after successful login
      if (userProfile) {
        console.log('User authenticated, redirecting based on role:', userProfile.role);
        switch (userProfile.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'vendor':
            navigate('/vendor-dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error.message);
      toast({
        variant: "destructive",
        title: t('login.error'),
        description: t('login.incorrectCredentials'),
      })
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">{t('login.title')}</CardTitle>
          <CardDescription className="text-gray-600">{t('login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700">{t('login.email')}</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                placeholder={t('login.emailPlaceholder')}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700">{t('login.password')}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                  placeholder={t('login.passwordPlaceholder')}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary text-white rounded-md py-3 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1">
              {t('login.button')}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {t('login.noAccount')} <Link to="/register" className="text-primary hover:underline">{t('login.registerLink')}</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

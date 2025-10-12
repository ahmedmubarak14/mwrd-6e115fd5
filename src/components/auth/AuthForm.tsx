
import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/types/database";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { consoleCleanupGuide } from "@/utils/cleanupConsoleStats";

interface AuthFormProps {
  onAuthSuccess?: (user: UserProfile) => void;
}

export const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const navigate = useNavigate();
  const logger = consoleCleanupGuide.createLogger('AuthForm');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    company_name: '',
    role: 'client' as 'client' | 'vendor' | 'admin'
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showInfo } = useToastFeedback();
  const { user, userProfile } = useAuth();

  // Handle successful authentication - redirect to dashboard
  useEffect(() => {
    if (user && userProfile) {
      logger.debug('User authenticated, redirecting to dashboard');
      // Call onAuthSuccess if provided
      if (onAuthSuccess) {
        onAuthSuccess(userProfile);
      } else {
        // Default redirect behavior
        navigate('/dashboard');
      }
    }
  }, [user, userProfile, onAuthSuccess, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.full_name) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            full_name: formData.full_name,
            company_name: formData.company_name,
            role: formData.role
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        showSuccess('Account created successfully! Redirecting to KYC verification...');
        // Redirect to KYC form for all new users
        setTimeout(() => {
          navigate('/kyc/form');
        }, 1500);
      }
    } catch (error: any) {
      logger.error('Sign up error:', error);
      showError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/landing');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <Card className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-3xl shadow-2xl">
          <CardContent className="p-8">
            {/* Logo Section - Inside Card */}
            <div className="text-center mb-6">
              <div 
                onClick={handleLogoClick}
                className="inline-block cursor-pointer"
              >
                <img 
                  src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                  alt="MWRD Logo" 
                  className="h-16 w-auto mx-auto transition-transform duration-200 hover:scale-105 drop-shadow-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Welcome Text - Inside Card */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to MWRD</h1>
              <p className="text-white/70">Sign in to your account or create a new one</p>
            </div>

            {/* Tab Selection */}
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'signin' | 'signup')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-white/20 rounded-2xl p-1 h-12">
                <TabsTrigger 
                  value="signin" 
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-800 rounded-xl font-medium transition-all duration-200"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-800 rounded-xl font-medium transition-all duration-200"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <Auth
                  supabaseClient={supabase}
                  view="sign_in"
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: 'hsl(324 96% 20%)',
                          brandAccent: 'hsl(324 96% 15%)',
                          inputBackground: 'rgba(255, 255, 255, 0.1)',
                          inputBorder: 'rgba(255, 255, 255, 0.2)',
                          inputText: 'white',
                          inputPlaceholder: 'rgba(255, 255, 255, 0.6)',
                        }
                      }
                    },
                    className: {
                      container: 'auth-container',
                      button: 'w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200',
                      input: 'w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 rounded-2xl px-4 py-3 focus:border-white/40 focus:ring-1 focus:ring-white/20',
                      label: 'text-white font-medium mb-2 block',
                    }
                  }}
                  providers={[]}
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: 'Email',
                        password_label: 'Password',
                        button_label: 'Sign In',
                        loading_button_label: 'Signing in...',
                        link_text: "Forgot your password?"
                      }
                    }
                  }}
                  redirectTo={`${window.location.origin}/dashboard`}
                />
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-2xl px-4 py-3 h-12 focus:border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      placeholder="Enter your password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-2xl px-4 py-3 h-12 focus:border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-white font-medium">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      required
                      placeholder="Enter your full name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-2xl px-4 py-3 h-12 focus:border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name" className="text-white font-medium">Company Name</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                      placeholder="Enter your company name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-2xl px-4 py-3 h-12 focus:border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white font-medium">Account Type</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as any }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-2xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/20 rounded-xl">
                        <SelectItem value="client">Client (Request Services)</SelectItem>
                        <SelectItem value="vendor">Vendor (Provide Services)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Alert className="bg-white/10 border-white/20 rounded-xl">
                    <Info className="h-4 w-4 text-white" />
                    <AlertDescription className="text-white/90">
                      After registration, you'll complete a KYC (Know Your Customer) verification to access all platform features.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 h-12" 
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Create Admin User Button (Temporary) */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <Button 
                variant="outline" 
                className="w-full bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded-2xl h-12"
                onClick={() => {
                  // Temporary admin creation functionality
                  logger.debug('Create admin user clicked');
                }}
              >
                Create Admin User (Temporary)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

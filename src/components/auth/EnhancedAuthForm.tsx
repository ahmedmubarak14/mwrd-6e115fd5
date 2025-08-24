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
import { VendorOnboarding } from "@/components/vendor/VendorOnboarding";
import { CRDocumentUpload } from "@/components/verification/CRDocumentUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Info, User, Building } from "lucide-react";

interface EnhancedAuthFormProps {
  onAuthSuccess?: (user: UserProfile) => void;
}

export const EnhancedAuthForm = ({ onAuthSuccess }: EnhancedAuthFormProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [registrationStep, setRegistrationStep] = useState<'details' | 'verification' | 'onboarding'>('details');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    company_name: '',
    role: 'client' as 'client' | 'vendor' | 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const [crUploaded, setCrUploaded] = useState(false);
  const { showSuccess, showError, showInfo } = useToastFeedback();
  const { userProfile } = useAuth();

  // Handle successful authentication
  useEffect(() => {
    if (userProfile) {
      // Check if vendor needs onboarding
      if (userProfile.role === 'vendor' && (!userProfile.categories || userProfile.categories.length === 0)) {
        setRegistrationStep('onboarding');
        return;
      }
      onAuthSuccess?.(userProfile);
    }
  }, [userProfile, onAuthSuccess]);

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
          data: {
            full_name: formData.full_name,
            company_name: formData.company_name,
            role: formData.role
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        setRegisteredUserId(data.user.id);
        
        if (formData.role === 'vendor') {
          showInfo('Account created! Complete the onboarding process to start receiving opportunities.');
          setRegistrationStep('onboarding');
        } else if (formData.role === 'client') {
          showInfo('Account created! Please upload your Commercial Registration to complete verification.');
          setRegistrationStep('verification');
        } else {
          showSuccess('Account created successfully! Please check your email for verification.');
          onAuthSuccess?.({
            id: data.user.id,
            user_id: data.user.id,
            email: formData.email,
            full_name: formData.full_name,
            company_name: formData.company_name,
            role: formData.role,
            status: 'approved',
            verification_status: 'approved',
            avatar_url: null,
            phone: null,
            address: null,
            bio: null,
            portfolio_url: null,
            verification_documents: [],
            categories: [],
            subscription_plan: 'free',
            subscription_status: 'active',
            subscription_expires_at: null,
            verified_at: null,
            verified_by: null,
            verification_notes: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      showError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleCRUploadSuccess = () => {
    setCrUploaded(true);
    showSuccess('Commercial Registration uploaded successfully! Your account will be reviewed within 24-48 hours.');
  };

  const handleOnboardingComplete = () => {
    showSuccess('Onboarding completed successfully! Welcome to MWRD.');
    if (userProfile) {
      onAuthSuccess?.(userProfile);
    }
  };

  const completeRegistration = () => {
    showInfo('Registration complete! You can now sign in. Your account will be activated after document verification.');
    setMode('signin');
    setRegistrationStep('details');
    setCrUploaded(false);
    setRegisteredUserId(null);
  };

  // Vendor Onboarding Flow
  if (mode === 'signup' && registrationStep === 'onboarding' && formData.role === 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] p-4">
        <VendorOnboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // Client CR Upload Flow
  if (mode === 'signup' && registrationStep === 'verification' && formData.role === 'client') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <img 
              src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
              alt="MWRD Logo" 
              className="h-16 w-auto mx-auto transition-transform duration-200 hover:scale-105 drop-shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Complete Your Registration</h1>
              <p className="text-white/80">Upload your Commercial Registration to activate your account</p>
            </div>
          </div>
          <Card className="bg-white/5 border border-white/20 backdrop-blur-20">
            <CardContent className="space-y-6 pt-6">
              <Alert className="bg-white/10 border-white/20">
                <Info className="h-4 w-4 text-white" />
                <AlertDescription className="text-white/90">
                  Your account has been created for <strong>{formData.email}</strong>.
                  Please upload your Commercial Registration to complete the verification process.
                </AlertDescription>
              </Alert>

              <CRDocumentUpload
                onUploadSuccess={handleCRUploadSuccess}
                isRequired={true}
              />

              {crUploaded && (
                <Alert className="bg-green-500/20 border-green-400/30">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-white/90">
                    Document uploaded successfully! Your account will be reviewed within 24-48 hours.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setRegistrationStep('details')}
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Back
                </Button>
                <Button
                  onClick={completeRegistration}
                  disabled={!crUploaded}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  Complete Registration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <img 
            src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
            alt="MWRD Logo" 
            className="h-16 w-auto mx-auto transition-transform duration-200 hover:scale-105 drop-shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome to MWRD</h1>
            <p className="text-white/80">
              {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>
        </div>

        <Tabs value={mode} onValueChange={(value) => setMode(value as 'signin' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
            <TabsTrigger value="signin" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="bg-white/5 border border-white/20 backdrop-blur-20">
              <CardHeader>
                <CardTitle className="text-white">Sign In</CardTitle>
                <CardDescription className="text-white/80">Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Auth
                  supabaseClient={supabase}
                  view="sign_in"
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: 'hsl(324 96% 20%)',
                          brandAccent: 'hsl(324 96% 20%)',
                        }
                      }
                    }
                  }}
                  providers={[]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="bg-white/5 border border-white/20 backdrop-blur-20">
              <CardHeader>
                <CardTitle className="text-white">Create Account</CardTitle>
                <CardDescription className="text-white/80">Choose your account type and fill in your details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Account Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-white">Account Type *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Card 
                        className={`cursor-pointer transition-all ${formData.role === 'client' ? 'ring-2 ring-primary bg-primary/20 border-primary/30' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}
                        onClick={() => setFormData(prev => ({ ...prev, role: 'client' }))}
                      >
                        <CardContent className="p-4 text-center">
                          <User className="h-8 w-8 mx-auto mb-2 text-white" />
                          <div className="font-semibold text-white">Client</div>
                          <div className="text-xs text-white/60">Request Services</div>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer transition-all ${formData.role === 'vendor' ? 'ring-2 ring-primary bg-primary/20 border-primary/30' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}
                        onClick={() => setFormData(prev => ({ ...prev, role: 'vendor' }))}
                      >
                        <CardContent className="p-4 text-center">
                          <Building className="h-8 w-8 mx-auto mb-2 text-white" />
                          <div className="font-semibold text-white">Vendor</div>
                          <div className="text-xs text-white/60">Provide Services</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-white">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name" className="text-white">Company Name</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                      placeholder={formData.role === 'vendor' ? 'Your business name' : 'Your company name'}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>

                  {formData.role === 'client' && (
                    <Alert className="bg-white/10 border-white/20">
                      <Info className="h-4 w-4 text-white" />
                      <AlertDescription className="text-white/90">
                        As a client, you'll need to upload your Commercial Registration for account verification after registration.
                      </AlertDescription>
                    </Alert>
                  )}

                  {formData.role === 'vendor' && (
                    <Alert className="bg-white/10 border-white/20">
                      <Building className="h-4 w-4 text-white" />
                      <AlertDescription className="text-white/90">
                        As a vendor, you'll complete a detailed onboarding process to set up your business profile and service categories.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

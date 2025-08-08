import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, EyeOff, User, Building2, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AuthFormProps {
  onAuthSuccess: (userData: { id: string; email: string; role: 'client' | 'supplier' | 'admin' }) => void;
}

export const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<'client' | 'supplier'>('client');
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Get or create user profile
        const { data: profileMaybe, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        let effectiveRole: 'client' | 'supplier' | 'admin' =
          (data.user.user_metadata?.role as 'client' | 'supplier' | 'admin') ?? 'client';

        if (profileError) {
          console.error('Error fetching profile during login:', profileError);
        }

        let profile = profileMaybe as any;

        if (!profile) {
          const { data: created, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              role: effectiveRole,
              full_name: data.user.user_metadata?.full_name ?? null,
              company_name: data.user.user_metadata?.company_name ?? null,
            })
            .select('*')
            .single();

          if (insertError) {
            throw insertError;
          } else {
            profile = created;
            toast({
              title: language === 'ar' ? 'تم إنشاء الملف الشخصي' : 'Profile created',
              description: language === 'ar'
                ? 'تم إعداد ملفك الشخصي لأول مرة.'
                : 'We set up your profile for the first time.',
            });
          }
        } else {
          effectiveRole = (profile.role as any) ?? effectiveRole;
        }

        onAuthSuccess({
          id: data.user.id,
          email: data.user.email!,
          role: effectiveRole,
        });

        toast({
          title: language === 'ar' ? "تم تسجيل الدخول بنجاح" : "Login successful",
          description: language === 'ar' ? "مرحباً بك مرة أخرى!" : "Welcome back!",
        });
      } else {
        // Registration logic
        if (password !== confirmPassword) {
          throw new Error(language === 'ar' ? "كلمات المرور غير متطابقة" : "Passwords don't match");
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`,
            data: {
              role,
              full_name: fullName,
              company_name: role === 'supplier' ? companyName : null,
            }
          }
        });

        if (error) throw error;

        if (data.user && !data.session) {
          // User needs to confirm email
          toast({
            title: language === 'ar' ? "تأكيد البريد الإلكتروني مطلوب" : "Email confirmation required",
            description: language === 'ar' ? 
              "يرجى فتح بريدك الإلكتروني والنقر على رابط التأكيد لإكمال إنشاء الحساب" : 
              "Please check your email and click the confirmation link to complete account creation",
          });
          return;
        }

        // If user is immediately authenticated (email confirmation disabled)
        if (data.user && data.session) {
          onAuthSuccess({
            id: data.user.id,
            email: data.user.email!,
            role
          });

          toast({
            title: language === 'ar' ? "تم إنشاء الحساب بنجاح" : "Account created successfully",
            description: language === 'ar' ? "مرحباً بك في سبلفاي!" : "Welcome to Supplify!",
          });
        }
      }
    } catch (error: any) {
      // Handle specific error cases
      let errorMessage = error.message;
      let errorTitle = language === 'ar' ? "خطأ في المصادقة" : "Authentication error";
      
      if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
        if (isLogin) {
          errorMessage = language === 'ar' 
            ? 'بريد إلكتروني أو كلمة مرور غير صحيحة. حاول مرة أخرى أو اعد تعيين كلمة المرور.'
            : 'Invalid email or password. Please try again or reset your password.';
        } else {
          errorMessage = language === 'ar'
            ? 'يوجد حساب بهذا البريد الإلكتروني بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.'
            : 'An account with this email already exists. Please try logging in instead.';
          errorTitle = language === 'ar' ? "البريد الإلكتروني مستخدم" : "Email already exists";
        }
      }
      
      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail((resetEmail || email), { redirectTo });
      if (error) throw error;
      toast({
        title: language === 'ar' ? 'تم إرسال رابط إعادة التعيين' : 'Password reset email sent',
        description: language === 'ar' ? 'تحقق من بريدك الإلكتروني واتبع التعليمات.' : 'Check your email and follow the instructions.',
      });
      setResetOpen(false);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: language === 'ar' ? 'فشل إعادة التعيين' : 'Reset failed',
        description: err.message,
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="inline-block">
            <img 
              src="/lovable-uploads/842b99cc-446d-41b5-8de7-b9c12faa1ed9.png" 
              alt="Supplify Logo"
              className="h-16 w-auto mx-auto mb-4 hover:scale-105 transition-transform"
            />
          </Link>
          <CardTitle className="text-2xl">
            {language === 'ar' ? 'مرحباً بك في سبلفاي' : 'Welcome to Supplify'}
          </CardTitle>
          <CardDescription>
            {language === 'ar' ? 'سجل دخولك أو أنشئ حساباً جديداً' : 'Sign in to your account or create a new one'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(value) => setIsLogin(value === 'login')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </TabsTrigger>
              <TabsTrigger value="register">
                {language === 'ar' ? 'إنشاء حساب' : 'Register'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                      placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10"
                      placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-accent hover-scale"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    language === 'ar' ? 'تسجيل الدخول' : 'Sign In'
                  )}
                </Button>
                <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                  <DialogTrigger asChild>
                    <button type="button" className="mx-auto block text-sm text-primary hover:underline">
                      {language === 'ar' ? 'هل نسيت كلمة المرور؟' : 'Forgot your password?'}
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset your password'}</DialogTitle>
                      <DialogDescription>
                        {language === 'ar' ? 'سنرسل رابط إعادة التعيين إلى بريدك الإلكتروني.' : 'We will email you a reset link.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resetEmail">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                        <Input
                          id="resetEmail"
                          type="email"
                          value={resetEmail || email}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={resetLoading} className="bg-gradient-to-r from-primary to-accent">
                          {resetLoading ? <LoadingSpinner size="sm" /> : (language === 'ar' ? 'إرسال رابط' : 'Send reset link')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    {language === 'ar' ? 'نوع الحساب' : 'Account Type'}
                  </Label>
                  <RadioGroup value={role} onValueChange={(value: 'client' | 'supplier') => setRole(value)}>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="client" id="client" />
                      <Label htmlFor="client" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {language === 'ar' ? 'عميل (منظم فعاليات)' : 'Client (Event Organizer)'}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="supplier" id="supplier" />
                      <Label htmlFor="supplier" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {language === 'ar' ? 'مقدم خدمة' : 'Service Provider'}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  />
                </div>

                {role === 'supplier' && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      {language === 'ar' ? 'اسم الشركة' : 'Company Name'}
                    </Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder={language === 'ar' ? 'أدخل اسم الشركة' : 'Enter company name'}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="registerEmail">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="registerEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                      placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerPassword">
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="registerPassword"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10"
                      placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-accent hover-scale"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    language === 'ar' ? 'إنشاء حساب' : 'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
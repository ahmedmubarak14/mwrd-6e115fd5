import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { noHooksToast } from '@/utils/noHooksToast';
import { UserProfile } from '@/types/database';
import { validateEmailDomain, rateLimiter, logSecurityEvent } from '@/utils/security';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      // Log security events
      if (event === 'SIGNED_IN' && nextSession?.user) {
        logSecurityEvent('user_login_success', {
          user_id: nextSession.user.id,
          email: nextSession.user.email,
          login_method: 'password'
        });
      } else if (event === 'SIGNED_OUT') {
        logSecurityEvent('user_logout', {
          user_id: user?.id
        });
      } else if (event === 'TOKEN_REFRESHED') {
        logSecurityEvent('token_refresh', {
          user_id: nextSession?.user?.id
        });
      }

      // Handle user profile
      if (nextSession?.user) {
        setTimeout(() => {
          fetchUserProfile(nextSession.user!.id);
        }, 0);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error('Session retrieval error:', error);
        logSecurityEvent('session_retrieval_error', { error: error.message });
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        logSecurityEvent('profile_fetch_error', { 
          user_id: userId, 
          error: error.message 
        });
      }

      if (data) {
        setUserProfile(data as UserProfile);
        return;
      }

      // No profile found: create one from auth metadata
      const { data: userRes } = await supabase.auth.getUser();
      const authUser = userRes.user;
      const email = authUser?.email ?? '';
      const role = (authUser?.user_metadata?.role as 'client' | 'vendor' | 'admin') ?? 'client';

      const { data: created, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email,
          role: role,
          full_name: authUser?.user_metadata?.full_name ?? null,
          company_name: authUser?.user_metadata?.company_name ?? null,
        })
        .select('*')
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        logSecurityEvent('profile_creation_error', { 
          user_id: userId, 
          error: insertError.message 
        });
      } else if (created) {
        setUserProfile(created as UserProfile);
        logSecurityEvent('profile_created', { user_id: userId });
        noHooksToast.showInfo('Your profile was created successfully.');
      }
    } catch (error) {
      console.error('Error fetching/creating user profile:', error);
      logSecurityEvent('profile_operation_exception', { 
        user_id: userId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    // Rate limiting
    const rateLimitKey = `signin_${email}`;
    if (!rateLimiter.isAllowed(rateLimitKey, 5, 900000)) {
      const error = new Error('Too many login attempts. Please try again later.') as AuthError;
      logSecurityEvent('login_rate_limit_exceeded', { email, attempts: 5 });
      noHooksToast.showError('Too many login attempts. Please try again later.');
      return { error };
    }

    // Email domain validation
    if (!validateEmailDomain(email)) {
      const error = new Error('Invalid email domain') as AuthError;
      logSecurityEvent('invalid_email_domain', { email });
      noHooksToast.showError('Invalid email domain');
      return { error };
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        logSecurityEvent('login_failed', { 
          email, 
          error: error.message,
          error_code: error.status 
        });
        noHooksToast.showError(error.message);
      } else {
        rateLimiter.reset(rateLimitKey);
        noHooksToast.showInfo('Successfully signed in!');
      }

      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      logSecurityEvent('login_exception', { 
        email, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      noHooksToast.showError('An unexpected error occurred during sign in');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any): Promise<{ error: AuthError | null }> => {
    // Rate limiting for signup
    const rateLimitKey = `signup_${email}`;
    if (!rateLimiter.isAllowed(rateLimitKey, 3, 1800000)) {
      const error = new Error('Too many signup attempts. Please try again later.') as AuthError;
      logSecurityEvent('signup_rate_limit_exceeded', { email });
      noHooksToast.showError('Too many signup attempts. Please try again later.');
      return { error };
    }

    // Email domain validation
    if (!validateEmailDomain(email)) {
      const error = new Error('Invalid email domain') as AuthError;
      logSecurityEvent('invalid_email_domain_signup', { email });
      noHooksToast.showError('Invalid email domain');
      return { error };
    }

    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) {
        logSecurityEvent('signup_failed', { 
          email, 
          error: error.message,
          error_code: error.status 
        });
        noHooksToast.showError(error.message);
      } else {
        logSecurityEvent('signup_success', { email });
        rateLimiter.reset(rateLimitKey);
        noHooksToast.showInfo('Account created successfully! Please check your email to verify your account.');
      }

      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      logSecurityEvent('signup_exception', { 
        email, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      noHooksToast.showError('An unexpected error occurred during sign up');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    // Rate limiting for password reset
    const rateLimitKey = `reset_${email}`;
    if (!rateLimiter.isAllowed(rateLimitKey, 3, 1800000)) {
      const error = new Error('Too many password reset attempts. Please try again later.') as AuthError;
      logSecurityEvent('password_reset_rate_limit_exceeded', { email });
      noHooksToast.showError('Too many password reset attempts. Please try again later.');
      return { error };
    }

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        logSecurityEvent('password_reset_failed', { 
          email, 
          error: error.message 
        });
        noHooksToast.showError(error.message);
      } else {
        logSecurityEvent('password_reset_requested', { email });
        noHooksToast.showInfo('Password reset email sent! Please check your inbox.');
      }

      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      logSecurityEvent('password_reset_exception', { 
        email, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      noHooksToast.showError('An unexpected error occurred during password reset');
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user || !userProfile) return false;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates as any)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setUserProfile({ ...userProfile, ...updates });

      logSecurityEvent('profile_updated', { 
        user_id: user.id, 
        updated_fields: Object.keys(updates) 
      });
      noHooksToast.showInfo('Profile updated successfully.');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      logSecurityEvent('profile_update_failed', { 
        user_id: user.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      noHooksToast.showError('Failed to update profile');
      return false;
    }
  };

  const signOut = async () => {
    try {
      const currentUser = user;
      
      // Clear user state immediately to prevent timing issues
      setUserProfile(null);
      setUser(null);
      setSession(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        logSecurityEvent('logout_failed', { 
          user_id: currentUser?.id,
          error: error.message 
        });
        throw error;
      }
      
      noHooksToast.showInfo('You have been signed out successfully.');
    } catch (error) {
      console.error('Error signing out:', error);
      noHooksToast.showError('Error signing out');
    }
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const MinimalAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Simple console-only feedback - no hooks
  const showInfo = (message: string) => console.log("ℹ️", message);
  const showError = (message: string) => console.error("❌", message);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error('Session retrieval error:', error);
      }
      
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      // Fetch user profile if user exists
      if (initialSession?.user) {
        const profile = await fetchUserProfile(initialSession.user.id);
        setUserProfile(profile);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      
      // Fetch user profile when user signs in
      if (nextSession?.user) {
        const profile = await fetchUserProfile(nextSession.user.id);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        showError(error.message);
      } else {
        showInfo('Successfully signed in!');
      }

      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      showError('An unexpected error occurred during sign in');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any): Promise<{ error: AuthError | null }> => {
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
        showError(error.message);
      } else {
        showInfo('Account created successfully! Please check your email to verify your account.');
      }

      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      showError('An unexpected error occurred during sign up');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        showError(error.message);
      } else {
        showInfo('Password reset email sent! Please check your inbox.');
      }

      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      showError('An unexpected error occurred during password reset');
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: any): Promise<boolean> => {
    if (!user) return false;
    showInfo('Profile update functionality will be implemented');
    return true;
  };

  const signOut = async () => {
    try {
      setUserProfile(null);
      setUser(null);
      setSession(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      showInfo('You have been signed out successfully.');
    } catch (error) {
      console.error('Error signing out:', error);
      showError('Error signing out');
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
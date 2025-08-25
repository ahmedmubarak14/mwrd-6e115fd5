
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { UserProfile } from '@/types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { showInfo, showError } = useToastFeedback();

useEffect(() => {
  // Listen for auth changes FIRST to avoid missing events
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, nextSession) => {
    console.log('Auth state change:', _event, nextSession?.user?.id);
    setSession(nextSession);
    setUser(nextSession?.user ?? null);

    // Defer any Supabase calls to avoid deadlocks
    if (nextSession?.user) {
      setTimeout(() => {
        fetchUserProfile(nextSession.user!.id);
      }, 0);
    } else {
      setUserProfile(null);
      setLoading(false);
    }
  });

  // THEN get initial session
  supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
    console.log('Initial session:', initialSession?.user?.id);
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
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        showError('Failed to load user profile. Please try refreshing the page.');
        setLoading(false);
        return;
      }

      if (data) {
        console.log('Profile found:', data);
        setUserProfile(data as UserProfile);
        setLoading(false);
        return;
      }

      // No profile found: create one from auth metadata
      console.log('No profile found, creating new profile');
      const { data: userRes } = await supabase.auth.getUser();
      const authUser = userRes.user;
      
      if (!authUser) {
        console.error('No auth user found when creating profile');
        setLoading(false);
        return;
      }

      const email = authUser.email ?? '';
      const role = (authUser.user_metadata?.role as 'client' | 'vendor' | 'admin') ?? 'client';

      const { data: created, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email,
          role: role,
          full_name: authUser.user_metadata?.full_name ?? null,
          company_name: authUser.user_metadata?.company_name ?? null,
        })
        .select('*')
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        showError('Failed to create user profile. Please contact support.');
      } else if (created) {
        console.log('Profile created:', created);
        setUserProfile(created as UserProfile);
        showInfo('Your profile was created successfully.');
      }
    } catch (error) {
      console.error('Error fetching/creating user profile:', error);
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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

      showInfo('Profile updated successfully.');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile. Please try again.');
      return false;
    }
  };

  const signOut = async () => {
    try {
      // Clear user state immediately to prevent timing issues
      setUserProfile(null);
      setUser(null);
      setSession(null);
      
      await supabase.auth.signOut();
      showInfo('You have been signed out successfully.');
      
      // Redirect to home page after logout
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error('Error signing out:', error);
      showError('Error signing out. Please try again.');
    }
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signOut,
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

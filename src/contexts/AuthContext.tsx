import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from '@/hooks/useToastFeedback';

interface UserProfile {
  id: string;
  email: string;
  role: 'client' | 'supplier' | 'admin';
  full_name?: string;
  company_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { showInfo } = useToastFeedback();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
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
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
      }

      if (data) {
        setUserProfile(data as UserProfile);
        return;
      }

      // No profile found: create one from auth metadata
      const { data: userRes } = await supabase.auth.getUser();
      const authUser = userRes.user;
      const email = authUser?.email ?? '';
      const role = (authUser?.user_metadata?.role as 'client' | 'supplier' | 'admin') ?? 'client';

      const { data: created, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email,
          role,
          full_name: authUser?.user_metadata?.full_name ?? null,
          company_name: authUser?.user_metadata?.company_name ?? null,
        })
        .select('*')
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
      } else if (created) {
        setUserProfile(created as UserProfile);
        showInfo('Your profile was created successfully.');
      }
    } catch (error) {
      console.error('Error fetching/creating user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Redirect to auth page after logout
    window.location.assign('/auth');
  };

  const value = {
    user,
    userProfile,
    loading,
    signOut,
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
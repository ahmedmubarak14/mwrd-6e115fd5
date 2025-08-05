import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  role: 'client' | 'supplier' | 'admin';
  full_name?: string;
  company_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const useUserProfiles = () => {
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (profiles[userId]) {
      return profiles[userId];
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (data) {
        const profile: UserProfile = {
          id: data.id,
          email: data.email,
          role: data.role as 'client' | 'supplier' | 'admin',
          full_name: data.full_name || undefined,
          company_name: data.company_name || undefined,
          avatar_url: data.avatar_url || undefined,
          created_at: data.created_at || undefined,
          updated_at: data.updated_at || undefined,
        };

        setProfiles(prev => ({ ...prev, [userId]: profile }));
        return profile;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }

    return null;
  };

  const fetchMultipleProfiles = async (userIds: string[]) => {
    const missingIds = userIds.filter(id => !profiles[id]);
    
    if (missingIds.length === 0) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', missingIds);

      if (error) {
        console.error('Error fetching user profiles:', error);
        return;
      }

      if (data) {
        const newProfiles: Record<string, UserProfile> = {};
        data.forEach(profile => {
          newProfiles[profile.id] = {
            id: profile.id,
            email: profile.email,
            role: profile.role as 'client' | 'supplier' | 'admin',
            full_name: profile.full_name || undefined,
            company_name: profile.company_name || undefined,
            avatar_url: profile.avatar_url || undefined,
            created_at: profile.created_at || undefined,
            updated_at: profile.updated_at || undefined,
          };
        });

        setProfiles(prev => ({ ...prev, ...newProfiles }));
      }
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = (userId: string): UserProfile | null => {
    return profiles[userId] || null;
  };

  const clearProfiles = () => {
    setProfiles({});
  };

  return {
    profiles,
    loading,
    fetchUserProfile,
    fetchMultipleProfiles,
    getProfile,
    clearProfiles
  };
};
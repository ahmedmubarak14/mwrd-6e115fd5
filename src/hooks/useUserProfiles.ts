import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/database';

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
          user_id: data.user_id,
          email: data.email,
          role: data.role,
          full_name: data.full_name || undefined,
          company_name: data.company_name || undefined,
          avatar_url: data.avatar_url || undefined,
          status: data.status,
          phone: data.phone || undefined,
          address: data.address || undefined,
          bio: data.bio || undefined,
          portfolio_url: data.portfolio_url || undefined,
          verification_documents: data.verification_documents,
          categories: data.categories,
          subscription_plan: data.subscription_plan,
          subscription_status: data.subscription_status,
          subscription_expires_at: data.subscription_expires_at || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at,
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
            user_id: profile.user_id,
            email: profile.email,
            role: profile.role,
            full_name: profile.full_name || undefined,
            company_name: profile.company_name || undefined,
            avatar_url: profile.avatar_url || undefined,
            status: profile.status,
            phone: profile.phone || undefined,
            address: profile.address || undefined,
            bio: profile.bio || undefined,
            portfolio_url: profile.portfolio_url || undefined,
            verification_documents: profile.verification_documents,
            categories: profile.categories,
            subscription_plan: profile.subscription_plan,
            subscription_status: profile.subscription_status,
            subscription_expires_at: profile.subscription_expires_at || undefined,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
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
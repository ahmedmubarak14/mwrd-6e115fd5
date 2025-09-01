import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface VendorProject {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  priority?: string;
  location?: string;
  budget_total?: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const useVendorProjects = () => {
  const { userProfile } = useAuth();
  const [projects, setProjects] = useState<VendorProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!userProfile?.user_id) return;

    setLoading(true);
    setError(null);

    try {
      // Use existing projects table for now until vendor_projects is properly created
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', userProfile.user_id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<VendorProject, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => {
    if (!userProfile?.user_id) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      const { data, error: createError } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          client_id: userProfile.user_id
        })
        .select()
        .single();

      if (createError) throw createError;
      
      setProjects(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId: string, updates: Partial<VendorProject>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .eq('client_id', userProfile?.user_id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setProjects(prev => prev.map(p => p.id === projectId ? data : p));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('client_id', userProfile?.user_id);

      if (deleteError) throw deleteError;
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.user_id) {
      fetchProjects();
    }
  }, [userProfile?.user_id]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };
};
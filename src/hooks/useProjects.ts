import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityFeed } from './useActivityFeed';

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled' | 'on_hold';
  budget_total?: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  location?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { trackActivity } = useActivityFeed();

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects((data || []) as Project[]);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const createProject = async (projectData: {
    title: string;
    description?: string;
    category?: string;
    budget_total?: number;
    start_date?: string;
    end_date?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    location?: string;
    tags?: string[];
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ 
          client_id: user.id,
          ...projectData,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      // Track activity
      await trackActivity({
        user_id: user.id,
        activity_type: 'project_created',
        description: `Created project: ${projectData.title}`,
        title: `New project in ${projectData.category || 'General'}`,
        metadata: { 
          category: projectData.category,
          budget: projectData.budget_total,
          priority: projectData.priority 
        }
      });

      await fetchProjects();
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .eq('client_id', user.id)
        .select()
        .single();

      if (error) throw error;

      await fetchProjects();
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('client_id', user.id);

      if (error) throw error;

      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'active': return 'bg-primary text-primary-foreground';
      case 'completed': return 'bg-emerald-500 text-white';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      case 'on_hold': return 'bg-yellow-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'urgent': return 'bg-red-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatBudget = (project: Project) => {
    if (!project.budget_total) return 'Budget not specified';
    return `${project.budget_total.toLocaleString()} ${project.currency || 'SAR'}`;
  };

  return {
    projects,
    loading,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getStatusColor,
    getPriorityColor,
    formatBudget
  };
};
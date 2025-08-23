import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface BOQItem {
  id: string;
  project_id: string;
  item_code?: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  unit_price?: number;
  total_price?: number;
  specifications?: any;
  notes?: string;
  status: 'pending' | 'quoted' | 'approved' | 'ordered';
  vendor_id?: string;
  created_at: string;
  updated_at: string;
}

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
  metadata?: any;
  created_at: string;
  updated_at: string;
  boq_items?: BOQItem[];
  requests?: any[];
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          boq_items (*),
          requests (*)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects((data || []) as Project[]);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: {
    title: string;
    description?: string;
    category?: string;
    budget_total?: number;
    location?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    start_date?: string;
    end_date?: string;
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

      await fetchProjects();
      toast({
        title: "Success",
        description: "Project created successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchProjects();
      toast({
        title: "Success",
        description: "Project updated successfully"
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchProjects();
      toast({
        title: "Success",
        description: "Project deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'active': return 'bg-primary text-primary-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      case 'on_hold': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-muted-foreground';
      case 'medium': return 'text-warning-foreground';
      case 'high': return 'text-destructive-foreground';
      case 'urgent': return 'text-destructive-foreground font-bold';
      default: return 'text-muted-foreground';
    }
  };

  return {
    projects,
    loading,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getStatusColor,
    getPriorityColor
  };
};
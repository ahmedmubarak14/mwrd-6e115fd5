import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  trigger_conditions: Json;
  actions: Json;
  status: 'active' | 'inactive' | 'draft';
  priority: number;
  delay_minutes: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_executed_at?: string;
  execution_count: number;
}

export interface WorkflowExecution {
  id: string;
  workflow_rule_id: string;
  trigger_data: Json;
  executed_actions: Json;
  status: string;
  error_message?: string;
  execution_time_ms?: number;
  created_at: string;
  completed_at?: string;
  workflow_rules?: Partial<WorkflowRule>;
}

export interface AutomatedTask {
  id: string;
  workflow_execution_id?: string;
  assigned_to: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  reference_type?: string;
  reference_id?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;

  // Helper properties for type-safe usage
  priorityLevel?: 'low' | 'medium' | 'high' | 'urgent';
  statusType?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export const useWorkflowAutomation = () => {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWorkflows = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workflow_rules')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;
      setWorkflows((data as WorkflowRule[]) || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  };

  const fetchExecutions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workflow_executions')
        .select(`
          *,
          workflow_rules (
            name,
            trigger_type
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setExecutions((data as WorkflowExecution[]) || []);
    } catch (error) {
      console.error('Error fetching workflow executions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async (workflowData: {
    name: string;
    description?: string;
    trigger_type: string;
    trigger_conditions?: Json;
    actions?: Json;
    status?: 'active' | 'inactive' | 'draft';
    priority?: number;
    delay_minutes?: number;
  }) => {
    if (!user) return null;

    try {
      const insertData = {
        name: workflowData.name,
        description: workflowData.description,
        trigger_type: workflowData.trigger_type as any,
        trigger_conditions: workflowData.trigger_conditions || {},
        actions: workflowData.actions || [],
        status: workflowData.status || 'draft' as any,
        priority: workflowData.priority || 1,
        delay_minutes: workflowData.delay_minutes || 0,
        created_by: user.id,
      };

      const { data, error } = await supabase
        .from('workflow_rules')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      await fetchWorkflows();
      return data as WorkflowRule;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  };

  const updateWorkflow = async (id: string, updates: {
    name?: string;
    description?: string;
    trigger_conditions?: Json;
    actions?: Json;
    status?: 'active' | 'inactive' | 'draft';
    priority?: number;
    delay_minutes?: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('workflow_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchWorkflows();
      return data as WorkflowRule;
    } catch (error) {
      console.error('Error updating workflow:', error);
      throw error;
    }
  };

  const deleteWorkflow = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workflow_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchWorkflows();
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw error;
    }
  };

  const toggleWorkflowStatus = async (id: string, status: 'active' | 'inactive') => {
    return updateWorkflow(id, { status });
  };

  const triggerWorkflow = async (triggerType: string, triggerData: Json) => {
    try {
      // This would typically be called by database triggers
      // but can also be manually triggered
      const { data, error } = await supabase.rpc('execute_workflow_rules', {
        trigger_type_param: triggerType as any,
        trigger_data_param: triggerData
      });

      if (error) throw error;
      
      await fetchExecutions();
      return data;
    } catch (error) {
      console.error('Error triggering workflow:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorkflows();
      fetchExecutions();
    }
  }, [user]);

  // Set up real-time subscription for workflow executions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('workflow_executions')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'workflow_executions'
      }, () => {
        fetchExecutions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    workflows,
    executions,
    loading,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleWorkflowStatus,
    triggerWorkflow,
    refetch: () => {
      fetchWorkflows();
      fetchExecutions();
    }
  };
};

export const useAutomatedTasks = () => {
  const [tasks, setTasks] = useState<AutomatedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('automated_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks((data as AutomatedTask[]) || []);
    } catch (error) {
      console.error('Error fetching automated tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (id: string, status: string) => {
    try {
      const updates: any = { status };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('automated_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchTasks();
      return data as AutomatedTask;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('automated_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      task.status !== 'completed' && 
      task.due_date && 
      new Date(task.due_date) < now
    );
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('automated_tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'automated_tasks'
      }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    tasks,
    loading,
    updateTaskStatus,
    deleteTask,
    getTasksByStatus,
    getOverdueTasks,
    refetch: fetchTasks
  };
};
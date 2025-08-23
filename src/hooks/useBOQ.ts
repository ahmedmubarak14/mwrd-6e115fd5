import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BOQItem } from './useProjects';

export const useBOQ = (projectId?: string) => {
  const [boqItems, setBOQItems] = useState<BOQItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBOQItems = async (project_id?: string) => {
    if (!user || !project_id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('boq_items')
        .select('*')
        .eq('project_id', project_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBOQItems((data || []) as BOQItem[]);
    } catch (error) {
      console.error('Error fetching BOQ items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch BOQ items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createBOQItem = async (itemData: {
    project_id: string;
    description: string;
    category: string;
    unit: string;
    quantity: number;
    unit_price?: number;
    item_code?: string;
    specifications?: any;
    notes?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('boq_items')
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;

      await fetchBOQItems(itemData.project_id);
      toast({
        title: "Success",
        description: "BOQ item added successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating BOQ item:', error);
      toast({
        title: "Error",
        description: "Failed to create BOQ item",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateBOQItem = async (id: string, updates: Partial<BOQItem>) => {
    try {
      const { error } = await supabase
        .from('boq_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchBOQItems(projectId);
      toast({
        title: "Success",
        description: "BOQ item updated successfully"
      });
    } catch (error) {
      console.error('Error updating BOQ item:', error);
      toast({
        title: "Error",
        description: "Failed to update BOQ item",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteBOQItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('boq_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchBOQItems(projectId);
      toast({
        title: "Success",
        description: "BOQ item deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting BOQ item:', error);
      toast({
        title: "Error",
        description: "Failed to delete BOQ item",
        variant: "destructive"
      });
      throw error;
    }
  };

  const bulkCreateBOQItems = async (items: Array<{
    project_id: string;
    description: string;
    category: string;
    unit: string;
    quantity: number;
    unit_price?: number;
    item_code?: string;
    specifications?: any;
    notes?: string;
  }>) => {
    try {
      const { data, error } = await supabase
        .from('boq_items')
        .insert(items)
        .select();

      if (error) throw error;

      if (items.length > 0) {
        await fetchBOQItems(items[0].project_id);
      }
      
      toast({
        title: "Success",
        description: `${items.length} BOQ items added successfully`
      });
      
      return data;
    } catch (error) {
      console.error('Error bulk creating BOQ items:', error);
      toast({
        title: "Error",
        description: "Failed to create BOQ items",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchBOQItems(projectId);
    }
  }, [projectId, user]);

  const getTotalValue = () => {
    return boqItems.reduce((total, item) => {
      return total + (item.total_price || 0);
    }, 0);
  };

  const getItemsByCategory = () => {
    const grouped: Record<string, BOQItem[]> = {};
    boqItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-muted text-muted-foreground';
      case 'quoted': return 'bg-warning text-warning-foreground';
      case 'approved': return 'bg-success text-success-foreground';
      case 'ordered': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return {
    boqItems,
    loading,
    refetch: () => fetchBOQItems(projectId),
    createBOQItem,
    updateBOQItem,
    deleteBOQItem,
    bulkCreateBOQItems,
    getTotalValue,
    getItemsByCategory,
    getStatusColor
  };
};
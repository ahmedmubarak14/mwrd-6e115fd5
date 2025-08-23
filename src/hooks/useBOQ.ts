import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  specifications?: Record<string, any>;
  notes?: string;
  status: 'pending' | 'quoted' | 'approved' | 'ordered';
  vendor_id?: string;
  created_at: string;
  updated_at: string;
}

export const useBOQ = (projectId?: string) => {
  const [boqItems, setBOQItems] = useState<BOQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBOQItems = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('boq_items')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBOQItems((data || []) as BOQItem[]);
    } catch (error) {
      console.error('Error fetching BOQ items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBOQItems();
  }, [projectId]);

  const createBOQItem = async (itemData: {
    description: string;
    category: string;
    unit: string;
    quantity: number;
    unit_price?: number;
    item_code?: string;
    specifications?: Record<string, any>;
    notes?: string;
  }) => {
    if (!user || !projectId) throw new Error('User not authenticated or project not specified');

    try {
      const { data, error } = await supabase
        .from('boq_items')
        .insert([{ 
          project_id: projectId,
          ...itemData
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchBOQItems();
      return data;
    } catch (error) {
      console.error('Error creating BOQ item:', error);
      throw error;
    }
  };

  const updateBOQItem = async (itemId: string, updates: Partial<BOQItem>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('boq_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      await fetchBOQItems();
      return data;
    } catch (error) {
      console.error('Error updating BOQ item:', error);
      throw error;
    }
  };

  const deleteBOQItem = async (itemId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('boq_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await fetchBOQItems();
    } catch (error) {
      console.error('Error deleting BOQ item:', error);
      throw error;
    }
  };

  const bulkCreateBOQItems = async (items: Array<{
    description: string;
    category: string;
    unit: string;
    quantity: number;
    unit_price?: number;
    item_code?: string;
    specifications?: Record<string, any>;
    notes?: string;
  }>) => {
    if (!user || !projectId) throw new Error('User not authenticated or project not specified');

    try {
      const itemsWithProjectId = items.map(item => ({
        project_id: projectId,
        ...item
      }));

      const { data, error } = await supabase
        .from('boq_items')
        .insert(itemsWithProjectId)
        .select();

      if (error) throw error;

      await fetchBOQItems();
      return data;
    } catch (error) {
      console.error('Error creating bulk BOQ items:', error);
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-muted text-muted-foreground';
      case 'quoted': return 'bg-blue-500 text-white';
      case 'approved': return 'bg-emerald-500 text-white';
      case 'ordered': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTotalValue = () => {
    return boqItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
  };

  const getItemsByCategory = () => {
    const grouped = boqItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, BOQItem[]>);

    return grouped;
  };

  return {
    boqItems,
    loading,
    refetch: fetchBOQItems,
    createBOQItem,
    updateBOQItem,
    deleteBOQItem,
    bulkCreateBOQItems,
    getStatusColor,
    getTotalValue,
    getItemsByCategory
  };
};
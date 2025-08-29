import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface RFQ {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category_id?: string;
  subcategory_id?: string;
  budget_min?: number;
  budget_max?: number;
  currency: string;
  delivery_location?: string;
  submission_deadline: string;
  project_start_date?: string;
  project_end_date?: string;
  status: 'draft' | 'published' | 'in_progress' | 'evaluation' | 'awarded' | 'cancelled' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_public: boolean;
  invited_vendors?: string[];
  requirements: any;
  evaluation_criteria: any;
  terms_and_conditions?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRFQData {
  title: string;
  description: string;
  category_id?: string;
  subcategory_id?: string;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
  delivery_location?: string;
  submission_deadline: string;
  project_start_date?: string;
  project_end_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  is_public?: boolean;
  invited_vendors?: string[];
  requirements?: any;
  evaluation_criteria?: any;
  terms_and_conditions?: string;
}

export const useRFQs = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRFQs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('rfqs')
        .select(`
          *,
          procurement_categories!category_id(name, name_ar),
          procurement_categories!subcategory_id(name, name_ar)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching RFQs:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch RFQs',
          variant: 'destructive'
        });
        return;
      }

      setRfqs((data as RFQ[]) || []);
    } catch (error) {
      console.error('Error in fetchRFQs:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createRFQ = async (rfqData: CreateRFQData): Promise<RFQ | null> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create an RFQ',
        variant: 'destructive'
      });
      return null;
    }

    try {
      const { data, error } = await (supabase as any)
        .from('rfqs')
        .insert([{
          client_id: user.id,
          title: rfqData.title,
          description: rfqData.description,
          category_id: rfqData.category_id,
          subcategory_id: rfqData.subcategory_id,
          budget_min: rfqData.budget_min,
          budget_max: rfqData.budget_max,
          currency: rfqData.currency || 'SAR',
          delivery_location: rfqData.delivery_location,
          submission_deadline: rfqData.submission_deadline,
          project_start_date: rfqData.project_start_date,
          project_end_date: rfqData.project_end_date,
          priority: rfqData.priority || 'medium',
          is_public: rfqData.is_public ?? true,
          invited_vendors: rfqData.invited_vendors || [],
          requirements: rfqData.requirements || {},
          evaluation_criteria: rfqData.evaluation_criteria || {},
          terms_and_conditions: rfqData.terms_and_conditions,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating RFQ:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to create RFQ',
          variant: 'destructive'
        });
        return null;
      }

      toast({
        title: 'Success',
        description: 'RFQ created successfully',
      });

      // Refresh the RFQs list
      fetchRFQs();
      
      return data as RFQ;
    } catch (error) {
      console.error('Error in createRFQ:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while creating the RFQ',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateRFQ = async (id: string, updates: Partial<CreateRFQData>): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('rfqs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating RFQ:', error);
        toast({
          title: 'Error',
          description: 'Failed to update RFQ',
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Success',
        description: 'RFQ updated successfully',
      });

      // Refresh the RFQs list
      fetchRFQs();
      return true;
    } catch (error) {
      console.error('Error in updateRFQ:', error);
      return false;
    }
  };

  const deleteRFQ = async (id: string): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('rfqs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting RFQ:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete RFQ',
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Success',
        description: 'RFQ deleted successfully',
      });

      // Refresh the RFQs list
      fetchRFQs();
      return true;
    } catch (error) {
      console.error('Error in deleteRFQ:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, [user]);

  return {
    rfqs,
    loading,
    createRFQ,
    updateRFQ,
    deleteRFQ,
    refreshRFQs: fetchRFQs
  };
};
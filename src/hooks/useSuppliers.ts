import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from './useUserProfiles';

export interface Supplier extends UserProfile {
  rating?: number;
  reviews_count?: number;
  location?: string;
  description?: string;
  completed_projects?: number;
  response_time?: string;
  categories?: string[];
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'supplier')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching suppliers:', error);
        setError('Failed to load suppliers');
        return;
      }

      // Transform the data to include mock additional fields for now
      // In a real app, these would come from additional tables
      const suppliersWithExtendedData: Supplier[] = (data || []).map((supplier, index) => ({
        ...supplier,
        role: supplier.role as 'supplier',
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        reviews_count: Math.floor(Math.random() * 50) + 10, // Random reviews 10-59
        location: supplier.company_name?.includes('Riyadh') ? 'Riyadh, Saudi Arabia' : 
                  supplier.company_name?.includes('Jeddah') ? 'Jeddah, Saudi Arabia' :
                  supplier.company_name?.includes('Dammam') ? 'Dammam, Saudi Arabia' :
                  'Saudi Arabia',
        description: `Professional ${supplier.company_name || 'services'} with years of experience in the industry.`,
        completed_projects: Math.floor(Math.random() * 200) + 50,
        response_time: ['30 minutes', '1 hour', '2 hours', '3 hours'][index % 4],
        categories: ['AVL Equipment', 'Booth Design', 'Printing', 'Furniture', 'Equipment'][index % 5] ? 
                   [['AVL Equipment', 'Booth Design', 'Printing', 'Furniture', 'Equipment'][index % 5]] : 
                   ['General Services']
      }));

      setSuppliers(suppliersWithExtendedData);
    } catch (err) {
      console.error('Error in fetchSuppliers:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const refetch = () => {
    fetchSuppliers();
  };

  return {
    suppliers,
    loading,
    error,
    refetch
  };
};
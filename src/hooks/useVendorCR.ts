import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface VendorCRData {
  business_size?: string;
  established_year?: number;
  employee_count?: string;
  team_size?: string;
  experience_years?: number;
  coverage_locations?: string[];
  equipment?: string[];
  certifications?: string[];
  cr_document_url?: string;
  verification_status?: string;
}

export const useVendorCR = () => {
  const { userProfile } = useAuth();
  const [crData, setCRData] = useState<VendorCRData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCRData = async () => {
    if (!userProfile?.user_id) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch from existing vendor_profiles_extended table
      const { data: existingData, error: fetchError } = await supabase
        .from('vendor_profiles_extended')
        .select('*')
        .eq('vendor_id', userProfile.user_id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingData) {
        setCRData({
          business_size: existingData.business_size,
          established_year: existingData.established_year,
          employee_count: existingData.employee_count,
          team_size: existingData.team_size,
          experience_years: existingData.experience_years,
          coverage_locations: existingData.coverage_locations || [],
          equipment: existingData.equipment || [],
          certifications: existingData.certifications || []
        });
      } else {
        // Create a new record if it doesn't exist
        const { data: newData, error: createError } = await supabase
          .from('vendor_profiles_extended')
          .insert({
            vendor_id: userProfile.user_id
          })
          .select()
          .single();

        if (createError) throw createError;

        setCRData({
          coverage_locations: [],
          equipment: [],
          certifications: []
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendor data');
    } finally {
      setLoading(false);
    }
  };

  const updateCRData = async (updates: Partial<VendorCRData>) => {
    if (!userProfile?.user_id) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('vendor_profiles_extended')
        .update(updates)
        .eq('vendor_id', userProfile.user_id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setCRData(prev => prev ? { ...prev, ...updates } : null);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update vendor data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadCRDocument = async (file: File): Promise<string> => {
    if (!userProfile?.user_id) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `cr-${userProfile.user_id}-${Date.now()}.${fileExt}`;
    const filePath = `vendor-documents/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('rfq-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('rfq-attachments')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to upload document');
    }
  };

  useEffect(() => {
    if (userProfile?.user_id && userProfile.role === 'vendor') {
      fetchCRData();
    }
  }, [userProfile?.user_id, userProfile?.role]);

  return {
    crData,
    loading,
    error,
    fetchCRData,
    updateCRData,
    uploadCRDocument
  };
};
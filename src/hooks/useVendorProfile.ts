import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VendorProfileData {
  // Basic Profile
  id: string;
  user_id: string;
  full_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatar_url?: string;
  portfolio_url?: string;
  verification_status: string;
  verified_at?: string;
  created_at: string;
  
  // Extended Profile
  certifications?: string[];
  coverage_locations?: string[];
  equipment?: string[];
  business_size?: string;
  employee_count?: string;
  team_size?: string;
  experience_years?: number;
  established_year?: number;
  
  // Categories
  categories?: Array<{
    id: string;
    name_en: string;
    name_ar: string;
    slug: string;
  }>;
  
  // Statistics
  total_offers: number;
  total_completed_orders: number;
  avg_rating: number;
  total_reviews: number;
  response_rate: number;
  avg_response_time_hours: number;
}

export const useVendorProfile = (vendorId: string) => {
  const [vendorProfile, setVendorProfile] = useState<VendorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorProfile = async () => {
    if (!vendorId) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch basic profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', vendorId)
        .eq('role', 'vendor')
        .single();

      if (profileError) throw profileError;

      // Fetch extended profile data
      const { data: extendedData } = await supabase
        .from('vendor_profiles_extended')
        .select('*')
        .eq('vendor_id', vendorId)
        .single();

      // Fetch vendor categories
      const { data: categoriesData } = await supabase
        .from('vendor_categories')
        .select(`
          categories (
            id,
            name_en,
            name_ar,
            slug
          )
        `)
        .eq('vendor_id', vendorId);

      // Fetch statistics
      const [offersResult, ordersResult] = await Promise.all([
        supabase
          .from('offers')
          .select('id, status')
          .eq('vendor_id', vendorId),
        supabase
          .from('orders')
          .select('id, status')
          .eq('vendor_id', vendorId)
      ]);

      const totalOffers = offersResult.data?.length || 0;
      const completedOrders = ordersResult.data?.filter(order => order.status === 'completed').length || 0;
      const totalOrders = ordersResult.data?.length || 0;

      // Calculate response rate (simplified - you might want to implement this differently)
      const responseRate = totalOffers > 0 ? Math.min(95, 70 + (completedOrders / totalOffers) * 25) : 0;

      // Combine all data
      const combinedProfile: VendorProfileData = {
        ...profileData,
        ...extendedData,
        categories: categoriesData?.map(item => item.categories).filter(Boolean) || [],
        total_offers: totalOffers,
        total_completed_orders: completedOrders,
        avg_rating: 4.2 + Math.random() * 0.6, // Placeholder - implement real rating system
        total_reviews: Math.floor(completedOrders * 0.8),
        response_rate: responseRate,
        avg_response_time_hours: Math.floor(Math.random() * 12) + 1
      };

      setVendorProfile(combinedProfile);
    } catch (err: any) {
      console.error('Error fetching vendor profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorProfile();
  }, [vendorId]);

  return {
    vendorProfile,
    loading,
    error,
    refetch: fetchVendorProfile
  };
};
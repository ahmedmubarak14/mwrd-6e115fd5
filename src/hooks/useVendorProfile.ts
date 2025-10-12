import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createLogger } from '@/utils/logger';

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
  const logger = createLogger('VendorProfile');

  const fetchVendorProfile = async () => {
    if (!vendorId) return;
    
    try {
      setLoading(true);
      setError(null);

      logger.debug('Fetching vendor profile', { vendorId });

      // Fetch basic profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles_with_roles')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (profileError) throw profileError;
      logger.debug('Profile data fetched', { profileData });

      // Fetch extended profile data
      const { data: extendedData } = await supabase
        .from('vendor_profiles_extended')
        .select('*')
        .eq('vendor_id', vendorId)
        .single();

      logger.debug('Extended data fetched', { extendedData });

      // Fetch vendor categories - try both new and legacy approaches
      const { data: categoriesData, error: categoriesError } = await supabase
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

      logger.debug('Categories data from vendor_categories table', { 
        categoriesData, 
        categoriesError 
      });

      // Also check legacy categories from user_profiles
      const legacyCategories = profileData?.categories || [];
      logger.debug('Legacy categories from user_profiles', { legacyCategories });

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

      // Process categories - use both new and legacy data
      let processedCategories = [];
      
      // First, try to use the new vendor_categories data
      if (categoriesData && categoriesData.length > 0) {
        processedCategories = categoriesData.map(item => item.categories).filter(Boolean);
      }
      
      // If no data from vendor_categories, use legacy categories from user_profiles
      if (processedCategories.length === 0 && legacyCategories.length > 0) {
        // Convert legacy category strings to category objects
        processedCategories = legacyCategories.map(categoryName => ({
          id: `legacy-${categoryName}`,
          name_en: categoryName,
          name_ar: categoryName, // You might want to add proper Arabic translations
          slug: categoryName.toLowerCase().replace(/\s+/g, '-')
        }));
      }

      logger.debug('Final processed categories', { processedCategories });

      // Combine all data
      const combinedProfile: VendorProfileData = {
        ...profileData,
        ...extendedData,
        categories: processedCategories,
        total_offers: totalOffers,
        total_completed_orders: completedOrders,
        avg_rating: 4.2 + Math.random() * 0.6, // Placeholder - implement real rating system
        total_reviews: Math.floor(completedOrders * 0.8),
        response_rate: responseRate,
        avg_response_time_hours: Math.floor(Math.random() * 12) + 1
      };

      logger.debug('Final combined profile', { combinedProfile });
      setVendorProfile(combinedProfile);
    } catch (err: any) {
      logger.error('Error fetching vendor profile', { error: err, vendorId });
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
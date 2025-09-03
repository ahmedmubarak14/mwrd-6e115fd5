import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createLogger } from '@/utils/logger';

export interface Category {
  id: string;
  parent_id?: string;
  slug: string;
  name_en: string;
  name_ar: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface VendorCategory {
  id: string;
  vendor_id: string;
  category_id: string;
  created_at: string;
  categories?: Category;
}

export interface RequestCategory {
  id: string;
  request_id: string;
  category_id: string;
  created_at: string;
  categories?: Category;
}

const logger = createLogger('useCategories');

// Helper function to sanitize data for database operations
const sanitizeDataForDB = (data: any) => {
  const sanitized = { ...data };
  
  // Convert empty strings to null for UUID fields
  if (sanitized.parent_id === '') {
    sanitized.parent_id = null;
  }
  
  return sanitized;
};

export const useCategories = (includeInactive: boolean = false) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Build the query based on whether to include inactive categories
      let query = supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      // Only filter by is_active if we don't want to include inactive categories
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Build hierarchical structure
      const categoryMap = new Map<string, Category>();
      const rootCategories: Category[] = [];

      // First pass: create all categories
      (data || []).forEach(cat => {
        const category: Category = { ...cat, children: [] };
        categoryMap.set(cat.id, category);
        if (!cat.parent_id) {
          rootCategories.push(category);
        }
      });

      // Second pass: build hierarchy
      (data || []).forEach(cat => {
        if (cat.parent_id) {
          const parent = categoryMap.get(cat.parent_id);
          const child = categoryMap.get(cat.id);
          if (parent && child) {
            parent.children!.push(child);
          }
        }
      });

      setCategories(rootCategories);
    } catch (error) {
      logger.error('Error fetching categories', { error });
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: {
    parent_id?: string;
    slug: string;
    name_en: string;
    name_ar: string;
    is_active?: boolean;
    sort_order?: number;
  }) => {
    try {
      logger.debug('Creating category', { categoryData });
      
      // Sanitize data before sending to database
      const sanitizedData = sanitizeDataForDB(categoryData);
      logger.debug('Sanitized data', { sanitizedData });
      
      const { data, error } = await supabase
        .from('categories')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) {
        logger.error('Create category error', { error });
        throw error;
      }

      logger.info('Category created successfully', { data });
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category created successfully"
      });
      
      return data;
    } catch (error) {
      logger.error('Error creating category', { error });
      
      // Enhanced error handling
      const errorMessage = error?.message || 'Failed to create category';
      if (errorMessage.includes('permission denied') || errorMessage.includes('policy')) {
        toast({
          title: "Permission Error",
          description: "You don't have permission to create categories. Please ensure you have admin privileges.",
          variant: "destructive"
        });
      } else if (errorMessage.includes('violates row-level security')) {
        toast({
          title: "Access Denied",
          description: "Row-level security policy prevents this action. Please check your admin role assignment.",
          variant: "destructive"
        });
      } else if (errorMessage.includes('invalid input syntax for type uuid')) {
        toast({
          title: "Data Error",
          description: "Invalid data format. Please check the category information and try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      logger.debug('Updating category', { id, updates });
      
      // Get current user info for debugging
      const { data: user } = await supabase.auth.getUser();
      logger.debug('Current user', { userId: user?.user?.id });
      
      // Get user profile for role verification
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role, id')
        .eq('user_id', user?.user?.id)
        .single();
      
      if (profileError) {
        logger.error('Error fetching user profile', { profileError });
      } else {
        logger.debug('User profile', { profile });
      }

      // Sanitize data before sending to database
      const sanitizedUpdates = sanitizeDataForDB(updates);
      logger.debug('Sanitized updates', { sanitizedUpdates });

      const { error } = await supabase
        .from('categories')
        .update(sanitizedUpdates)
        .eq('id', id);

      if (error) {
        logger.error('Update category error', { error });
        throw error;
      }

      logger.info('Category updated successfully');
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category updated successfully"
      });
    } catch (error) {
      logger.error('Error updating category', { error });
      
      // Enhanced error handling with specific messages
      const errorMessage = error?.message || 'Failed to update category';
      if (errorMessage.includes('permission denied') || errorMessage.includes('policy')) {
        toast({
          title: "Permission Error",
          description: "You don't have permission to update categories. Please ensure you have admin privileges.",
          variant: "destructive"
        });
      } else if (errorMessage.includes('violates row-level security')) {
        toast({
          title: "Access Denied",
          description: "Row-level security policy prevents this update. Please check your admin role assignment.",
          variant: "destructive"
        });
      } else if (errorMessage.includes('invalid input syntax for type uuid')) {
        toast({
          title: "Data Error",
          description: "Invalid data format. Please check the category information and try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      logger.debug('Deleting category', { id });
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Delete category error', { error });
        throw error;
      }

      logger.info('Category deleted successfully');
      await fetchCategories();
      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
    } catch (error) {
      logger.error('Error deleting category', { error });
      
      // Enhanced error handling
      const errorMessage = error?.message || 'Failed to delete category';
      if (errorMessage.includes('permission denied') || errorMessage.includes('policy')) {
        toast({
          title: "Permission Error",
          description: "You don't have permission to delete categories. Please ensure you have admin privileges.",
          variant: "destructive"
        });
      } else if (errorMessage.includes('violates row-level security')) {
        toast({
          title: "Access Denied",
          description: "Row-level security policy prevents this action. Please check your admin role assignment.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  const getAllCategories = (): Category[] => {
    const flatCategories: Category[] = [];
    
    const flatten = (cats: Category[]) => {
      cats.forEach(cat => {
        flatCategories.push(cat);
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children);
        }
      });
    };
    
    flatten(categories);
    return flatCategories;
  };

  const getCategoryBySlug = (slug: string): Category | undefined => {
    return getAllCategories().find(cat => cat.slug === slug);
  };

  const getCategoryPath = (categoryId: string): Category[] => {
    const allCategories = getAllCategories();
    const path: Category[] = [];
    
    const findPath = (catId: string): boolean => {
      const category = allCategories.find(c => c.id === catId);
      if (!category) return false;
      
      path.unshift(category);
      if (category.parent_id) {
        return findPath(category.parent_id);
      }
      return true;
    };
    
    findPath(categoryId);
    return path;
  };

  useEffect(() => {
    fetchCategories();
  }, [includeInactive]);

  return {
    categories,
    loading,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategoryBySlug,
    getCategoryPath
  };
};

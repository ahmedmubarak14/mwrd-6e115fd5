
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

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
      console.error('Error fetching categories:', error);
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
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      await fetchCategories();
      toast({
        title: "Success",
        description: "Category created successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchCategories();
      toast({
        title: "Success",
        description: "Category updated successfully"
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCategories();
      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
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
  }, []);

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

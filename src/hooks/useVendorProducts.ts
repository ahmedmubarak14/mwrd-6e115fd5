import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface VendorProduct {
  id: string;
  vendor_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  subcategory?: string;
  sku?: string;
  stock_quantity: number;
  min_order_quantity: number;
  images: string[];
  specifications: any;
  features: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
  currency: string;
  unit: string;
  weight_kg?: number;
  dimensions_cm?: string;
  warranty_months?: number;
  delivery_time_days: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name_en: string;
  name_ar: string;
  parent_id?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useVendorProducts = () => {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async () => {
    if (!user || !userProfile) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendor_products')
        .select('*')
        .eq('vendor_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts((data || []) as VendorProduct[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories((data || []) as ProductCategory[]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const createProduct = async (productData: Omit<VendorProduct, 'id' | 'vendor_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !userProfile) throw new Error('User not authenticated');

    try {
      setSubmitting(true);
      const { data, error } = await supabase
        .from('vendor_products')
        .insert([{ 
          vendor_id: userProfile.id,
          ...productData
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Success",
        description: "Product created successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<VendorProduct>) => {
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('vendor_products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Success",
        description: "Product updated successfully"
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('vendor_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const uploadProductImage = async (file: File, productId?: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId || 'temp'}-${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user && userProfile) {
      fetchProducts();
      fetchCategories();
    }
  }, [user, userProfile]);

  return {
    products,
    categories,
    loading,
    submitting,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
  };
};